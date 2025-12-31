import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Item, ItemType, ItemStatus } from "../entities/Item";
import { AuthRequest } from "../middleware/auth.middleware";
import { notifyResident } from "../services/socket.service";

const itemRepository = AppDataSource.getRepository(Item);

// Helper to create item with specific type
// function to handle logic for both visitors and parcels to avoid code duplication
const createItemInternal = async (req: AuthRequest, res: Response, type: ItemType) => {
    const { residentId, name, purpose, media, vehicleDetails, phone, courierName, trackingId } = req.body;
    const securityGuardId = req.user!.userId;

    // validating user input based on item type
    if (!residentId) {
        return res.status(400).json({ message: "Missing required field: residentId" });
    }

    if (type === ItemType.VISITOR) {
        if (!name) return res.status(400).json({ message: "Visitor Name is required" });
        if (!phone) return res.status(400).json({ message: "Visitor Phone is required" }); // required for contact
        if (!purpose) return res.status(400).json({ message: "Purpose (description) is required" });
    } else if (type === ItemType.PARCEL) {
        if (!courierName) return res.status(400).json({ message: "Courier Name is required" });
    }

    const item = new Item();
    item.resident_id = residentId;
    item.security_guard_id = securityGuardId;
    item.type = type;
    item.name = name || courierName; // if parcel, use courier name as main display name
    item.purpose = purpose;
    item.media = media;
    item.vehicle_details = vehicleDetails;

    // storing extra details
    item.phone = phone;
    item.courier_name = courierName;
    item.tracking_id = trackingId;

    // set default status for new entries
    if (type === ItemType.VISITOR) {
        item.status = ItemStatus.WAITING;
    } else if (type === ItemType.PARCEL) {
        item.status = ItemStatus.RECEIVED;
    }

    await itemRepository.save(item);

    // alert the resident immediately
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

    // logic to ensure status flows in correct order
    const current = item.status;
    let allowed = false;

    if (item.type === ItemType.VISITOR) {
        // flow: waiting -> approved/rejected -> entered -> exited
        if (current === ItemStatus.WAITING && (status === ItemStatus.APPROVED || status === ItemStatus.REJECTED)) allowed = true;
        else if (current === ItemStatus.APPROVED && status === ItemStatus.ENTERED) allowed = true;
        else if (current === ItemStatus.ENTERED && status === ItemStatus.EXITED) allowed = true;
    } else if (item.type === ItemType.PARCEL) {
        // flow: received -> acknowledged -> collected
        if (current === ItemStatus.RECEIVED && status === ItemStatus.ACKNOWLEDGED) allowed = true;
        else if (current === ItemStatus.ACKNOWLEDGED && status === ItemStatus.COLLECTED) allowed = true;
        else if (current === ItemStatus.RECEIVED && status === ItemStatus.COLLECTED) allowed = true;
    }

    // admin override for fixing mistakes
    if (req.user!.role === 'Admin') allowed = true;

    if (!allowed) {
        return res.status(400).json({ message: `Invalid status transition from ${current} to ${status}` });
    }

    item.status = status;
    await itemRepository.save(item);

    // notify resident about status change
    notifyResident(item.resident_id, "STATUS_UPDATE", `Item ${item.id} status: ${status}`, item);

    return res.json(item);
};

export const getItems = async (req: AuthRequest, res: Response) => {
    const { residentId } = req.query;
    const userId = req.user!.userId;
    const role = req.user!.role;

    // security check: residents can't see others data
    if (role === 'Resident' && Number(residentId) !== userId && residentId) {
        return res.status(403).json({ message: "Cannot view other residents' items" });
    }

    // preparing query to fetch items with relations
    const repo = itemRepository; // alias for brevity
    const query = repo.createQueryBuilder("item")
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
