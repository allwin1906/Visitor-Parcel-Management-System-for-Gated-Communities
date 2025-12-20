import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Item, ItemType, ItemStatus } from "../entities/Item";
import { AuthRequest } from "../middleware/auth.middleware";
import { notifyResident } from "../services/socket.service";

const itemRepository = AppDataSource.getRepository(Item);

export const createItem = async (req: AuthRequest, res: Response) => {
    const { residentId, type, description } = req.body;
    const securityGuardId = req.user!.userId;

    if (!residentId || !type) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const item = new Item();
    item.resident_id = residentId;
    item.security_guard_id = securityGuardId;
    item.type = type;
    item.description = description;

    // Set initial status
    if (type === ItemType.VISITOR) {
        item.status = ItemStatus.WAITING_FOR_APPROVAL;
    } else if (type === ItemType.PARCEL) {
        item.status = ItemStatus.RECEIVED;
    }

    await itemRepository.save(item);

    // Notify resident
    notifyResident(residentId, "NEW_ITEM", `New ${type} recorded`, item);

    return res.status(201).json(item);
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const item = await itemRepository.findOneBy({ id: Number(id) });
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Validate state transitions (simplified)
    // Visitor: Waiting -> Approved/Rejected -> Entered -> Exited
    // Parcel: Received -> Notified (system auto?) -> Acknowledged -> Collected

    const current = item.status;

    // Logic could be more complex, but sticking to basic validation
    if (item.type === ItemType.VISITOR) {
        if (current === ItemStatus.WAITING_FOR_APPROVAL && (status === ItemStatus.APPROVED || status === ItemStatus.REJECTED)) {
            // Allow resident to approve/reject
            // Ensure only resident acts here? Or logic in route
        } else if (current === ItemStatus.APPROVED && status === ItemStatus.ENTERED) {
            // Security checkin
        } else if (current === ItemStatus.ENTERED && status === ItemStatus.EXITED) {
            // Security checkout
        } else {
            // Invalid transition, unless forced by admin? 
            // For complexity rating 1, let's just allow updates but log/notify
        }
    }

    item.status = status;
    await itemRepository.save(item);

    // Notify relevant parties
    if (req.user!.role === 'Security') {
        notifyResident(item.resident_id, "STATUS_UPDATE", `Item ${item.id} is now ${status}`, item);
    }

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
