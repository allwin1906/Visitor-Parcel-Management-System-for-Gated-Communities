import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getUsers);

export default router;
