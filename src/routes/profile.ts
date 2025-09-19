import { Router } from "express";
import { getProfile } from "../controllers/profileController";

const router = Router();
router.get("/", getProfile);

export default router;
