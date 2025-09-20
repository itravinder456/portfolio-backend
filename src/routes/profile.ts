import express from "express";
import rateLimit from "express-rate-limit";
import { getProfile, generateResume } from "../controllers/profileController";

const router = express.Router();

// limiter: max 5 requests per hour per IP for resume generation
const resumeLimiter = rateLimit({
  windowMs:
    Number(process.env.GENERATE_RESUME_RATE_WINDOW_MINUTES ?? 1) * 60 * 1000, // default 1 minutes
  max: Number(process.env.GENERATE_RESUME_RATE_MAX ?? 5),
  message: {
    error: "Too many resume requests, please try again after an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", getProfile);
// new resume endpoint with limiter
router.post("/generate-resume", resumeLimiter, generateResume);

export default router;
