import { Request, Response } from "express";
import Achievement from "../models/Achievement";

export const getAchievements = async (req: Request, res: Response) => {
  try {
    const { type, limit = "50", page = "1" } = req.query;
    const filter: any = {};
    if (type && (type === "Achievement" || type === "Award")) {
      filter.type = String(type);
    }

    const lim = Math.min(Number(limit) || 50, 200);
    const pg = Math.max(Number(page) || 1, 1);
    const skip = (pg - 1) * lim;

    const [items, total] = await Promise.all([
      Achievement.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(lim),
      Achievement.countDocuments(filter),
    ]);

    res.json({
      data: items,
      meta: { total, page: pg, limit: lim, pages: Math.ceil(total / lim) || 1 },
    });
  } catch (err) {
    console.error("getAchievements error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getAchievementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Achievement.findById(id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("getAchievementById error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
