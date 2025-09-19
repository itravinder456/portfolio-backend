import { Router } from "express";
import { getAllBlogs, getBlogBySlug } from "../controllers/blogController";

const router = Router();

router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

export default router;
