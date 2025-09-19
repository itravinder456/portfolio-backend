import { Request, Response } from "express";
import Achievement from "../models/Achievement";

export const getAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
