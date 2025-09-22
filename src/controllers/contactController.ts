import { Request, Response } from "express";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Message from "../models/Message";

// helper to determine client IP (handles proxies / x-forwarded-for)
function getClientIp(req: Request): string {
  const xff = req.headers["x-forwarded-for"];
  let ip = "";

  if (typeof xff === "string" && xff.length) {
    ip = xff.split(",")[0].trim();
  }

  if (!ip && (req.ip || (req as any).ips?.length)) {
    // req.ip provided by Express (may be the last entry in XFF if trust proxy set)
    ip = req.ip || (req as any).ips?.[0];
  }

  if (!ip && req.socket && req.socket.remoteAddress) {
    ip = req.socket.remoteAddress;
  }

  // normalize IPv4 mapped addresses like ::ffff:1.2.3.4
  if (ip?.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

  return ip || "";
}

function buildEmailTemplate({
  name,
  email,
  message,
  receivedAt,
}: {
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}) {
  const preheader = `New message from ${name} (${email})`;
  const safeMessage = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  return {
    subject: `Portfolio Contact: ${name}`,
    text: `New message from ${name} (${email})\n\nReceived: ${receivedAt}\n\n${message}\n\nReply: ${email}`,
    html: `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:#f4f6f8; margin:0; padding:0;}
            .container { max-width:600px; margin:28px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.08); }
            .header { background:linear-gradient(90deg,#4f46e5,#06b6d4); color:#fff; padding:18px 24px; }
            .header h1 { margin:0; font-size:18px; font-weight:600; }
            .body { padding:20px 24px; color:#111827; line-height:1.5; }
            .meta { font-size:13px; color:#6b7280; margin-bottom:12px; }
            .message { background:#f8fafc; border:1px solid #e6eef6; padding:12px; border-radius:6px; white-space:pre-wrap; color:#111827; }
            .footer { padding:16px 24px; font-size:13px; color:#6b7280; background:#fbfdff; text-align:center; }
            .cta { display:inline-block; margin-top:12px; padding:8px 14px; background:#111827; color:#fff; text-decoration:none; border-radius:6px; font-size:14px; }
            @media (max-width:420px){ .container{margin:12px} .body{padding:16px} }
          </style>
        </head>
        <body>
          <span style="display:none;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
          <div class="container">
            <div class="header">
              <h1>New message from your portfolio</h1>
            </div>
            <div class="body">
              <div class="meta"><strong>${name}</strong> &middot; <a href="mailto:${email}" style="color:inherit; text-decoration:underline;">${email}</a></div>
              <div class="meta">Received: ${receivedAt}</div>
              <div class="message">${safeMessage}</div>
              <a class="cta" href="mailto:${email}?subject=Re: Portfolio Contact - ${encodeURIComponent(
      name
    )}">Reply to ${name}</a>
            </div>
            <div class="footer">
              This message was sent from your portfolio contact form.
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export const sendContactMessage = async (req: Request, res: Response) => {
  const { name, email, message, cc } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // ensure mongoose is connected (safe to call if already connected)
    if (mongoose.connection.readyState !== 1) {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        return res.status(500).json({ error: "MONGODB_URI not configured" });
      }
      await mongoose.connect(uri, {} as any);
    }

    const clientIp = getClientIp(req);

    // store message in MongoDB before sending email (so messages persist even if email fails)
    const saved = await Message.create({
      name,
      email,
      message,
      ip: clientIp,
      receivedAt: new Date(),
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
      secure: (process.env.SMTP_SECURE ?? "true") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // use Google App Password
      },
    });

    // optional: verify connection/config before sending
    await transporter.verify();

    const receivedAt = new Date().toLocaleString();
    const template = buildEmailTemplate({ name, email, message, receivedAt });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      cc: cc ? email : "",
      subject: template.subject,
      text: template.text,
      html: template.html,
      replyTo: email,
    });

    res.json({
      success: true,
      message: "Message sent successfully!",
      id: saved._id,
      ip: clientIp,
    });
  } catch (error) {
    console.error("Failed to send contact message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
