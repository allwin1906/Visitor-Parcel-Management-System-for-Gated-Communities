import { AppDataSource } from "./config/database";
import { User, UserRole } from "./entities/User";
import bcrypt from "bcrypt";

const seed = async () => {
    try {
        await AppDataSource.initialize();
        const repo = AppDataSource.getRepository(User);

        // Security
        const secExists = await repo.findOneBy({ email: "security@example.com" });
        if (!secExists) {
            const sec = new User();
            sec.name = "Security Guard";
            sec.email = "security@example.com";
            sec.password_hash = await bcrypt.hash("password", 10);
            sec.role = UserRole.SECURITY;
            await repo.save(sec);
            console.log("Security user created");
        }

        // Resident
        const resExists = await repo.findOneBy({ email: "john@example.com" });
        if (!resExists) {
            const res = new User();
            res.name = "John Resident";
            res.email = "john@example.com";
            res.password_hash = await bcrypt.hash("password", 10);
            res.role = UserRole.RESIDENT;
            await repo.save(res);
            console.log("Resident user created");
        }

        // Admin
        const adminExists = await repo.findOneBy({ email: "admin@example.com" });
        if (!adminExists) {
            const admin = new User();
            admin.name = "System Admin";
            admin.email = "admin@example.com";
            admin.password_hash = await bcrypt.hash("password", 10);
            admin.role = UserRole.ADMIN;
            await repo.save(admin);
            console.log("Admin user created");
        }

        console.log("Seeding complete");
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

seed();
