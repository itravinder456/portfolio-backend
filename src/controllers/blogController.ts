import { Request, Response } from "express";
import Blog from "../models/Blog";

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const { category, tag, limit = "20", page = "1", q } = req.query;

    const filter: any = {};

    if (category) filter.category = String(category);
    if (tag) filter.tags = { $in: [String(tag)] };
    if (q) {
      const qStr = String(q);
      filter.$or = [
        { title: { $regex: qStr, $options: "i" } },
        { summary: { $regex: qStr, $options: "i" } },
        { tags: { $in: [qStr] } },
        { category: { $regex: qStr, $options: "i" } },
      ];
    }

    const lim = Math.min(Number(limit) || 20, 100);
    const pg = Math.max(Number(page) || 1, 1);
    const skip = (pg - 1) * lim;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort({ publishedDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(lim),
      Blog.countDocuments(filter),
    ]);

    res.json({
      data: blogs,
      meta: { total, page: pg, limit: lim, pages: Math.ceil(total / lim) || 1 },
    });
  } catch (err) {
    console.error("getAllBlogs error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ error: "Missing slug" });

    // Try common lookups:
    // 1) slug field (if present)
    // 2) url contains slug (seed uses url)
    // 3) title match
    let blog = await Blog.findOne({ slug: String(slug) });

    if (!blog) {
      blog = await Blog.findOne({
        url: { $regex: String(slug), $options: "i" },
      });
    }

    if (!blog) {
      blog = await Blog.findOne({
        title: {
          $regex: `^${String(slug).replace(/[-_]/g, " ")}`,
          $options: "i",
        },
      });
    }

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json(blog);
  } catch (err) {
    console.error("getBlogBySlug error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
