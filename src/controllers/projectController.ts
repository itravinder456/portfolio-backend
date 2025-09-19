import { Request, Response } from "express";
import Project from "../models/Project";

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
