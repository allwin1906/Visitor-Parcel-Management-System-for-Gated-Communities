import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role, contact_info } = req.body;

    // Basic validation
    if (!email || !password || !name) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await userRepository.findOneBy({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.role = role || UserRole.RESIDENT;
    user.contact_info = contact_info;

    await userRepository.save(user);
    return res.status(201).json({ message: "User created" });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await userRepository.findOneBy({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "1h" }
    );

    return res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
};
