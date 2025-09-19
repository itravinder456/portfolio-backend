import { Router } from "express";
import { getContactMessages } from "../controllers/contactMessageController";

const router = Router();
router.get("/", getContactMessages);

export default router;
