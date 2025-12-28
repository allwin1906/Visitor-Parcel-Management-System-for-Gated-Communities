import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Item, ItemType, ItemStatus } from "../entities/Item";
import { AuthRequest } from "../middleware/auth.middleware";
import { notifyResident } from "../services/socket.service";

const itemRepository = AppDataSource.getRepository(Item);

// Helper to create item with specific type
// Helper to create item with specific type
const createItemInternal = async (req: AuthRequest, res: Response, type: ItemType) => {
    const { residentId, name, description, media, vehicleDetails, phone, courierName, trackingId } = req.body;
    const securityGuardId = req.user!.userId;

    // Validate required fields based on type
    if (!residentId) {
        return res.status(400).json({ message: "Missing required field: residentId" });
    }

    if (type === ItemType.VISITOR) {
        if (!name) return res.status(400).json({ message: "Visitor Name is required" });
        if (!phone) return res.status(400).json({ message: "Visitor Phone is required" }); // New validation
        if (!description) return res.status(400).json({ message: "Purpose (description) is required" });
    } else if (type === ItemType.PARCEL) {
        // For Parcels, "name" was overloaded, but usually we say "Courier" + "Tracking"
        // If frontend sends courierName, we map it.
        // Frontend sends: courierName, trackingId.
        // Does frontend send 'name' for parcel? logic in parcel-log.component.ts might send something.
        // Let's check parcel-log.ts or just handle what we have.
        // The entity has 'name'. We can map courierName to name if name is missing, or use courierName column.

        if (!courierName) return res.status(400).json({ message: "Courier Name is required" });
    }

    const item = new Item();
    item.resident_id = residentId;
    item.security_guard_id = securityGuardId;
    item.type = type;
    item.name = name || courierName; // Fallback for Parcel if name not sent
    item.description = description; // Purpose
    item.media = media;
    item.vehicle_details = vehicleDetails;

    // New fields
    item.phone = phone;
    item.courier_name = courierName;
    item.tracking_id = trackingId;

    // Set initial status
    if (type === ItemType.VISITOR) {
        item.status = ItemStatus.NEW;
    } else if (type === ItemType.PARCEL) {
        item.status = ItemStatus.RECEIVED;
    }

    await itemRepository.save(item);

    // Notify resident
    notifyResident(residentId, "NEW_ITEM", `New ${type} recorded: ${name}`, item);

    return res.status(201).json(item);
};

export const createVisitor = async (req: AuthRequest, res: Response) => {
    return createItemInternal(req, res, ItemType.VISITOR);
};

export const createParcel = async (req: AuthRequest, res: Response) => {
    return createItemInternal(req, res, ItemType.PARCEL);
};

export const createItem = async (req: AuthRequest, res: Response) => {
    const { type } = req.body;
    if (!type || (type !== ItemType.VISITOR && type !== ItemType.PARCEL)) {
        return res.status(400).json({ message: "Invalid or missing item type" });
    }
    return createItemInternal(req, res, type);
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const item = await itemRepository.findOneBy({ id: Number(id) });
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Validate state transitions
    const current = item.status;
    let allowed = false;

    if (item.type === ItemType.VISITOR) {
        // Visitor: New -> Approved/Rejected -> Entered -> Exited
        if (current === ItemStatus.NEW && (status === ItemStatus.APPROVED || status === ItemStatus.REJECTED)) allowed = true;
        else if (current === ItemStatus.APPROVED && status === ItemStatus.ENTERED) allowed = true;
        else if (current === ItemStatus.ENTERED && status === ItemStatus.EXITED) allowed = true;
    } else if (item.type === ItemType.PARCEL) {
        // Parcel: Received -> Acknowledged -> Collected
        if (current === ItemStatus.RECEIVED && status === ItemStatus.ACKNOWLEDGED) allowed = true;
        else if (current === ItemStatus.ACKNOWLEDGED && status === ItemStatus.COLLECTED) allowed = true;
        // Also allow Received -> Collected directly if security hands it over immediately?
        else if (current === ItemStatus.RECEIVED && status === ItemStatus.COLLECTED) allowed = true;
    }

    // Admin can force any status
    if (req.user!.role === 'Admin') allowed = true;

    if (!allowed) {
        return res.status(400).json({ message: `Invalid status transition from ${current} to ${status}` });
    }

    item.status = status;
    await itemRepository.save(item);

    // Notify relevant parties
    // If Security updates, notify resident. 
    // If Resident updates (Acknowledged, Approved/Rejected), notify Security (optional, or just log)?
    // For now notify resident on updates except if they did it themselves (not handled here, socket service usually handles "don't send to sender" or we just send to specific user)
    // Actually we just notify resident always for simplicity, frontend ignores if needed.
    notifyResident(item.resident_id, "STATUS_UPDATE", `Item ${item.id} status: ${status}`, item);

    return res.json(item);
};

export const getItems = async (req: AuthRequest, res: Response) => {
    const { residentId } = req.query;
    const userId = req.user!.userId;
    const role = req.user!.role;

    // Residents can only see their own
    if (role === 'Resident' && Number(residentId) !== userId && residentId) {
        return res.status(403).json({ message: "Cannot view other residents' items" }); // Or just ignore param and use userId
    }

    // If resident, filter by their ID
    const query = itemRepository.createQueryBuilder("item")
        .leftJoinAndSelect("item.resident", "resident")
        .leftJoinAndSelect("item.security_guard", "security");

    if (role === 'Resident') {
        query.where("item.resident_id = :id", { id: userId });
    } else if (residentId) {
        query.where("item.resident_id = :id", { id: residentId });
    }

    const items = await query.orderBy("item.created_at", "DESC").getMany();
    return res.json(items);
};
