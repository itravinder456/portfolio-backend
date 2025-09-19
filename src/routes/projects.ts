import { Router } from "express";
import { getAllProjects } from "../controllers/projectController";

const router = Router();
router.get("/", getAllProjects);

export default router;
