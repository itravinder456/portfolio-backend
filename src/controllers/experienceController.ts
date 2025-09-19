import { Request, Response } from "express";
import Experience from "../models/Experience";
import Education from "../models/Education";

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find();
    const education = await Education.find();
    res.json({ experiences, education });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
