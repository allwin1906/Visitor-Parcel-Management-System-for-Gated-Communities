import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Item } from "../entities/Item";
import dotenv from "dotenv";

dotenv.config();

const isSqlite = process.env.DB_TYPE === 'sqlite';

export const AppDataSource = new DataSource({
    type: isSqlite ? "sqlite" : "mysql",
    database: isSqlite ? "database.sqlite" : (process.env.DB_NAME || "visitor_system"),
    host: isSqlite ? undefined : (process.env.DB_HOST || "mysql"),
    port: isSqlite ? undefined : (Number(process.env.DB_PORT) || 3306),
    username: isSqlite ? undefined : (process.env.DB_USER || "root"),
    password: isSqlite ? undefined : (process.env.DB_PASSWORD || "password"),
    synchronize: true, // Auto-create tables for dev
    logging: false,
    entities: [User, Item],
    subscribers: [],
    migrations: [],
});
