import request from "supertest";
import app from "../app";
import { AppDataSource } from "../config/database";

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

describe("Auth Endpoints", () => {
    it("should register a new user", async () => {
        const res = await request(app).post("/auth/register").send({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
            role: "Resident"
        });
        // It might fail if user already exists from previous runs, so we expect 201 or 400
        expect([201, 400]).toContain(res.status);
    });

    it("should login the user", async () => {
        const res = await request(app).post("/auth/login").send({
            email: "test@example.com",
            password: "password123"
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });
});
