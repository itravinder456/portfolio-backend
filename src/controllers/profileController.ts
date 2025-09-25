import { Request, Response } from "express";
import Profile from "../models/Profile";
import Achievement from "../models/Achievement";
import Experience from "../models/Experience";
import Education from "../models/Education";
import Project from "../models/Project";
import Skill from "../models/Skill";
import { generateAndStreamResumeFromData } from "../services/resumeService";

export const generateResume = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findOne().lean();
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const [achievements, experiences, education, projects, skills] =
      await Promise.all([
        Achievement.find().sort({ date: -1 }).lean(),
        Experience.find()
          .sort({ startDate: -1 })
          .lean()
          .catch(() => []),
        Education.find()
          .sort({ endDate: -1 })
          .lean()
          .catch(() => []),
        Project.find()
          .sort({ duration: -1 })
          .lean()
          .catch(() => []),
        Skill.find()
          .lean()
          .catch(() => []),
      ]);

    // Pass raw data to service — service will handle processing/templating/streaming
    await generateAndStreamResumeFromData(
      { profile, achievements, experiences, education, projects, skills },
      res
    );
  } catch (err) {
    console.error("generateResume error:", err);
    if (!res.headersSent)
      res.status(500).json({ error: "Failed to generate resume" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findOne();
    const achievements = await Achievement.find();

    res.json({
      ...profile?.toObject(),
      achievements,
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
