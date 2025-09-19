import { Request, Response } from "express";
import Education from "../models/Education";

export const getEducation = async (req: Request, res: Response) => {
  try {
    const education = await Education.find();
    res.json(education);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
