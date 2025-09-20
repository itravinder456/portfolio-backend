import { Request, Response } from "express";
import Profile from "../models/Profile";
import Achievement from "../models/Achievement";
import Experience from "../models/Experience";
import Education from "../models/Education";
import Project from "../models/Project";
import Skill from "../models/Skill";
import PDFDocument from "pdfkit";

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

// New: generateResume — builds a simple PDF resume from profile + related collections and streams it
export const generateResume = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findOne().lean();
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const [achievements, experiences, education, projects, skills] =
      await Promise.all([
        Achievement.find().sort({ date: -1 }).lean(),
        Experience.find()
          .sort({ startDate: -1 })
          .lean()
          .catch(() => []),
        Education.find()
          .sort({ endDate: -1 })
          .lean()
          .catch(() => []),
        Project.find()
          .sort({ duration: -1 })
          .lean()
          .catch(() => []),
        Skill.find()
          .lean()
          .catch(() => []),
      ]);

    // set response headers for PDF
    res.setHeader("Content-Type", "application/pdf");
    const filename = `${(
      profile.fullName ||
      profile.firstName ||
      "resume"
    ).replace(/\s+/g, "_")}_resume.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ size: "A4", margin: 48 });
    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(profile.fullName || `${profile.firstName} ${profile.lastName}`, {
        continued: false,
      });
    if (profile.title) {
      doc
        .moveDown(0.2)
        .fontSize(12)
        .font("Helvetica")
        .fillColor("gray")
        .text(profile.title);
    }
    doc.moveDown(0.5);

    // Contact row
    const contactParts: string[] = [];
    if (profile.email) contactParts.push(`Email: ${profile.email}`);
    if (profile.phone) contactParts.push(`Phone: ${profile.phone}`);
    if (profile.location) contactParts.push(`Location: ${profile.location}`);
    if (profile.linkedinUrl)
      contactParts.push(`LinkedIn: ${profile.linkedinUrl}`);
    else if (profile.linkedin)
      contactParts.push(
        `LinkedIn: https://www.linkedin.com/in/${profile.linkedin}`
      );
    if (profile.githubUrl) contactParts.push(`GitHub: ${profile.githubUrl}`);
    else if (profile.github)
      contactParts.push(`GitHub: https://github.com/${profile.github}`);
    if (contactParts.length) {
      doc.fontSize(10).fillColor("black").text(contactParts.join("  •  "));
      doc.moveDown(0.6);
    }

    // Summary
    if (profile.summary) {
      doc.fontSize(12).font("Helvetica-Bold").text("Summary");
      doc.moveDown(0.2);
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("black")
        .text(profile.summary, { align: "left" });
      doc.moveDown(0.6);
    }

    // Skills (compact)
    if (skills && skills.length) {
      doc.fontSize(12).font("Helvetica-Bold").text("Skills");
      doc.moveDown(0.2);
      const top = skills
        .slice(0, 40)
        .map((s: any) => s.name + (s.level ? ` (${s.level})` : ""));
      doc.fontSize(10).font("Helvetica").text(top.join(", "), { lineGap: 2 });
      doc.moveDown(0.6);
    }

    // Experience
    if (experiences && experiences.length) {
      doc.fontSize(12).font("Helvetica-Bold").text("Experience");
      doc.moveDown(0.2);
      experiences.slice(0, 8).forEach((exp: any) => {
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(`${exp.roles?.[0]?.role || exp.title} — ${exp.company || ""}`, {
            continued: false,
          });
        const dur = [
          exp.startDate ? new Date(exp.startDate).getFullYear() : null,
          exp.endDate ? new Date(exp.endDate).getFullYear() : "Present",
        ]
          .filter(Boolean)
          .join(" - ");
        doc
          .fontSize(9)
          .font("Helvetica-Oblique")
          .fillColor("gray")
          .text(dur, { continued: false });
        if (exp.description) {
          doc
            .moveDown(0.1)
            .fontSize(10)
            .fillColor("black")
            .text(exp.description, { indent: 8 });
        }
        doc.moveDown(0.3);
      });
      doc.moveDown(0.3);
    }

    // Projects (brief)
    if (projects && projects.length) {
      doc.fontSize(12).font("Helvetica-Bold").text("Selected Projects");
      doc.moveDown(0.2);
      projects.slice(0, 6).forEach((p: any) => {
        doc.fontSize(10).font("Helvetica-Bold").text(p.title);
        if (p.techStack)
          doc
            .fontSize(9)
            .font("Helvetica-Oblique")
            .fillColor("gray")
            .text(
              `Tech: ${
                Array.isArray(p.techStack)
                  ? p.techStack.join(", ")
                  : p.techStack
              }`
            );
        if (p.description)
          doc
            .moveDown(0.05)
            .fontSize(10)
            .fillColor("black")
            .text(p.description, { indent: 8 });
        doc.moveDown(0.2);
      });
      doc.moveDown(0.3);
    }

    // Education
    if (education && education.length) {
      doc.fontSize(12).font("Helvetica-Bold").text("Education");
      doc.moveDown(0.2);
      education.slice(0, 6).forEach((e: any) => {
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(e.institution || e.school || e.degree || e.title);
        if (e.fieldOfStudy)
          doc
            .fontSize(9)
            .font("Helvetica-Oblique")
            .fillColor("gray")
            .text(e.fieldOfStudy);
        if (e.startDate || e.endDate) {
          const s = e.startDate ? new Date(e.startDate).getFullYear() : "";
          const en = e.endDate ? new Date(e.endDate).getFullYear() : "";
          doc.fontSize(9).fillColor("gray").text(`${s} - ${en}`);
        }
        doc.moveDown(0.2);
      });
      doc.moveDown(0.3);
    }

    // Achievements / Awards
    if (achievements && achievements.length) {
      doc.fontSize(12).font("Helvetica-Bold").text("Achievements & Awards");
      doc.moveDown(0.2);
      achievements.slice(0, 10).forEach((a: any) => {
        const when = a.date ? new Date(a.date).getFullYear() : "";
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .text(`${a.title} ${when ? `— ${when}` : ""}`);
        if (a.company)
          doc
            .fontSize(9)
            .font("Helvetica-Oblique")
            .fillColor("gray")
            .text(a.company);
        if (a.description)
          doc
            .moveDown(0.05)
            .fontSize(10)
            .fillColor("black")
            .text(a.description, { indent: 8 });
        doc.moveDown(0.2);
      });
      doc.moveDown(0.3);
    }

    // Footer / metadata
    doc
      .fontSize(9)
      .fillColor("gray")
      .text(`Generated: ${new Date().toLocaleString()}`, { align: "right" });

    doc.end();
  } catch (err) {
    console.error("generateResume error:", err);
    res.status(500).json({ error: "Failed to generate resume" });
  }
};
