import { Request, Response } from "express";
import Skill from "../models/Skill";

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
