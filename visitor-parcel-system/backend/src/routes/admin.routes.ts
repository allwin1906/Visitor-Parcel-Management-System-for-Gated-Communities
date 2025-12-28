import { Router } from "express";
import { getStats } from "../controllers/admin.controller";
import { authenticateToken, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../entities/User";

const router = Router();

router.use(authenticateToken);

// Admin stats
router.get("/stats", requireRole([UserRole.ADMIN]), getStats);

export default router;
