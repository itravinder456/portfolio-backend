import { Request, Response } from "express";
import Profile from "../models/Profile";
import Achievement from "../models/Achievement";

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
