import { Router } from "express";
import { createItem, updateStatus, getItems } from "../controllers/item.controller";
import { authenticateToken, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../entities/User";

const router = Router();

router.use(authenticateToken);

// Security creates visitors/parcels
router.post("/", requireRole([UserRole.SECURITY, UserRole.ADMIN]), createItem);

// View items
router.get("/", getItems);

// Update status (e.g., resident approves, security marks entry)
router.patch("/:id/status", updateStatus);

export default router;
