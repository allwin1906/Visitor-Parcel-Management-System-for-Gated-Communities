import { Response } from "express";
import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";
import { Item, ItemType, ItemStatus } from "../entities/Item";
import { AuthRequest } from "../middleware/auth.middleware";

const userRepository = AppDataSource.getRepository(User);
const itemRepository = AppDataSource.getRepository(Item);

export const getStats = async (req: AuthRequest, res: Response) => {
    // gathering user counts
    const totalResidents = await userRepository.countBy({ role: UserRole.RESIDENT });
    const totalSecurity = await userRepository.countBy({ role: UserRole.SECURITY });

    // Visitors today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitorsToday = await itemRepository
        .createQueryBuilder("item")
        .where("item.type = :type", { type: ItemType.VISITOR })
        .andWhere("item.created_at >= :date", { date: today })
        .getCount();

    // counting pending actions
    const pendingApprovals = await itemRepository.countBy({
        type: ItemType.VISITOR,
        status: ItemStatus.NEW
    });

    // showing uncollected parcels
    const parcelsReceived = await itemRepository.countBy({
        type: ItemType.PARCEL,
        status: ItemStatus.RECEIVED
    });

    res.json({
        totalResidents,
        totalSecurity,
        visitorsToday,
        pendingApprovals,
        parcelsReceived
    });
};
