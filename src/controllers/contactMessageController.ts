import { Request, Response } from "express";
import ContactMessage from "../models/ContactMessage";

export const getContactMessages = async (req: Request, res: Response) => {
  try {
    const messages = await ContactMessage.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
