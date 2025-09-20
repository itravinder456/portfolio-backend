import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// routes
import blogRoutes from "./routes/blogs";
import projectRoutes from "./routes/projects";
import contactRoutes from "./routes/contact";
import connectDB from "./config/db";
// import { seed } from "./seed";
import skillRoutes from "./routes/skills";
import experienceRoutes from "./routes/experiences";
import educationRoutes from "./routes/education";
import profileRoutes from "./routes/profile";
import achievementRoutes from "./routes/achievements";
import contactMessagesRoutes from "./routes/contactMessages";

dotenv.config();
connectDB();
const app = express();

// trust proxy when behind a reverse proxy/load balancer (set TRUST_PROXY=true in env)
app.set(
  "trust proxy",
  process.env.TRUST_PROXY
    ? process.env.TRUST_PROXY === "true"
    : process.env.NODE_ENV === "production"
);

// Basic global rate limiter
const GLOBAL_WINDOW_MS =
  Number(process.env.GLOBAL_RATE_WINDOW_MINUTES) * 60 * 1000;
const GLOBAL_MAX = Number(process.env.GLOBAL_RATE_MAX);

const globalLimiter = rateLimit({
  windowMs: GLOBAL_WINDOW_MS,
  max: GLOBAL_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

// Strict contact limiter (prevents rapid repeated contact submissions)
const CONTACT_WINDOW_MINUTES =
  Number(process.env.CONTACT_RATE_LIMIT_MINUTES) * 60 * 1000; // minutes
const CONTACT_MAX = Number(process.env.CONTACT_RATE_LIMIT_COUNT); // max submissions per window per IP

const contactLimiter = rateLimit({
  windowMs: CONTACT_WINDOW_MINUTES,
  max: CONTACT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: `Too many contact attempts. Please wait ${CONTACT_WINDOW_MINUTES} minutes before trying again.`,
  },
  keyGenerator: (req) => {
    // Prefer per-email limiting for contact form submissions when present (case-insensitive)
    try {
      const email =
        req.method === "POST" && (req.body as any)?.email
          ? String((req.body as any).email).toLowerCase()
          : null;
      if (email) return email;
    } catch (e) {
      /* ignore body parse errors and fallback to IP */
    }
    // Always return a string (fallback to IP if email is not present)
    return ipKeyGenerator(req.ip || "");
  },
});

// middleware
app.use(cors());
app.use(express.json());

// apply global limiter
app.use(globalLimiter);

// routes
app.use("/blogs", blogRoutes);
app.use("/projects", projectRoutes);
// apply stricter limiter to contact endpoint
app.use("/contact", contactLimiter, contactRoutes);
app.use("/skills", skillRoutes);
app.use("/experiences", experienceRoutes);
app.use("/education", educationRoutes);
app.use("/profile", profileRoutes);
app.use("/achievements", achievementRoutes);
app.use("/contactMessages", contactMessagesRoutes);

app.use("/", (req, res) => {
  res.send("API is running...");
});

// error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send({ message: err.message });
  }
);

export default app;
