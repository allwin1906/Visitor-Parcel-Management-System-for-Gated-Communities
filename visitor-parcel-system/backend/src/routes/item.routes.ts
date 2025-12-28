import { Router } from "express";
import { createVisitor, createParcel, updateStatus, getItems } from "../controllers/item.controller";
import { authenticateToken, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../entities/User";

const router = Router();

router.use(authenticateToken);

// Security creates visitors
router.post("/visitor", requireRole([UserRole.SECURITY, UserRole.ADMIN]), createVisitor);

// Security creates parcels
router.post("/parcel", requireRole([UserRole.SECURITY, UserRole.ADMIN]), createParcel);

// View items
router.get("/items", getItems);

// Update status
router.patch("/item/:id/status", updateStatus);

export default router;
