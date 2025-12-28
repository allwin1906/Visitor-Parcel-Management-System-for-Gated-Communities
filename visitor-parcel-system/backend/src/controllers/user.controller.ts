import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { AuthRequest } from "../middleware/auth.middleware";

const userRepository = AppDataSource.getRepository(User);

export const getUsers = async (req: AuthRequest, res: Response) => {
    const { role } = req.query;

    const query = userRepository.createQueryBuilder("user");

    if (role) {
        query.where("user.role = :role", { role });
    }

    const users = await query.select(["user.id", "user.name", "user.email", "user.role", "user.contact_info", "user.created_at"]).getMany();

    return res.json(users);
};
