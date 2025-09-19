import { Request, Response } from "express";

// Dummy data for now
const blogs = [
  {
    slug: "react-performance",
    title: "Mastering React Performance",
    excerpt: "Tips for optimizing rendering in React apps.",
    content: "Full blog content here...",
  },
  {
    slug: "node-api-best-practices",
    title: "Best Practices for Node.js APIs",
    excerpt: "How to design scalable Express APIs.",
    content: "Full blog content here...",
  },
];

export const getAllBlogs = (req: Request, res: Response) => {
  res.json(blogs);
};

export const getBlogBySlug = (req: Request, res: Response) => {
  const blog = blogs.find((b) => b.slug === req.params.slug);
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  res.json(blog);
};
