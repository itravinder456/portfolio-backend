import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// routes
import blogRoutes from "./routes/blogs";
import projectRoutes from "./routes/projects";
import contactRoutes from "./routes/contact";
import connectDB from "./config/db";
import { seed } from "./seed";
import skillRoutes from "./routes/skills";
import experienceRoutes from "./routes/experiences";
import educationRoutes from "./routes/education";
import profileRoutes from "./routes/profile";
import achievementRoutes from "./routes/achievements";
import contactMessagesRoutes from "./routes/contactMessages";

dotenv.config();
connectDB();
const app = express();

// seed(); // Be careful with this in production!

// middleware
app.use(cors());
app.use(express.json());

// routes

app.use("/blogs", blogRoutes);
app.use("/projects", projectRoutes);
app.use("/contact", contactRoutes);
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
