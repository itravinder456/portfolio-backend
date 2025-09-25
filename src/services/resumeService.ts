import fs from "fs";
import path from "path";
import ejs from "ejs";
import { Response } from "express";
import { generatePdfFromHtml } from "./htmlPdfService";

function safeSkillsList(skills: any[]) {
  return (skills || []).map((s: any) => s.name).filter(Boolean);
}

function buildAchievementsSummary(achievements: any[]) {
  const totalAchievements = (achievements || []).filter(
    (a: any) => !a.type || a.type === "Achievement"
  ).length;
  const totalAwards = (achievements || []).filter(
    (a: any) => a.type === "Award"
  ).length;

  return {
    line1: `Recognized contributions: ${totalAchievements} achievement${
      totalAchievements !== 1 ? "s" : ""
    } • ${totalAwards} award${totalAwards !== 1 ? "s" : ""}`,
    line2: `Highlights: Delivered production features, improved UI/UX, led demos that converted into projects.`,
  };
}

function prepareExperienceEntries(experiences: any[]) {
  const byCompany: Record<string, any> = {};
  (experiences || []).forEach((exp: any) => {
    const company = exp.company || "Independent / Contract";
    byCompany[company] = byCompany[company] || { items: [] };
    byCompany[company].items.push(exp);
  });

  return Object.keys(byCompany)
    .slice(0, 8)
    .map((company) => {
      const group = byCompany[company];
      const yearsSet = new Set<number>();
      const roles = new Set<string>();
      const techs = new Set<string>();

      group.items.forEach((it: any) => {
        if (it.startDate) yearsSet.add(new Date(it.startDate).getFullYear());
        if (it.endDate) yearsSet.add(new Date(it.endDate).getFullYear());
        if (it.role) roles.add(it.role);
        if (it.techStack) {
          const stackArr = Array.isArray(it.techStack)
            ? it.techStack
            : it.techStack.toString().split(/[,\|]/);
          stackArr.forEach((t: string) => techs.add(t.trim()));
        }
      });

      const yearsArr = Array.from(yearsSet).sort();
      const years = yearsArr.length
        ? `${yearsArr[0]} - ${yearsArr[yearsArr.length - 1]}`
        : "";

      return {
        company,
        years,
        rolesLine: `Roles: ${Array.from(roles).slice(0, 4).join(", ")}`,
        techsLine: `Tech: ${Array.from(techs).slice(0, 6).join(", ")}`,
      };
    });
}

/**
 * generateAndStreamResumeFromData
 * - data: { profile, achievements, experiences, education, projects, skills }
 * - res: express Response to stream PDF
 */
export async function generateAndStreamResumeFromData(
  data: {
    profile: any;
    achievements?: any[];
    experiences?: any[];
    education?: any[];
    projects?: any[];
    skills?: any[];
  },
  res: Response
) {
  try {
    const {
      profile,
      achievements = [],
      experiences = [],
      education = [],
      projects = [],
      skills = [],
    } = data;

    const skillsList = safeSkillsList(skills);
    const { line1: achievementsLine1, line2: achievementsLine2 } =
      buildAchievementsSummary(achievements);
    const experiencesProcessed = prepareExperienceEntries(experiences);

    const certifications = (achievements || [])
      .filter((a: any) =>
        /udemy|certificate|linkedin|certification|certified|online/i.test(
          `${a.title} ${a.company || ""}`
        )
      )
      .slice(0, 12);

    const tplPath = path.join(__dirname, "..", "templates", "resume.ejs");
    const tpl = fs.readFileSync(tplPath, "utf-8");

    const html = ejs.render(tpl, {
      profile,
      skills: skillsList,
      experiencesProcessed,
      projects,
      certifications,
      achievementsLine1,
      achievementsLine2,
      education,
      generatedAt: new Date().toLocaleString(),
    });

    const filename = `${(profile.fullName || "resume").replace(
      /\s+/g,
      "_"
    )}.pdf`;

    await generatePdfFromHtml(html, res, filename);
  } catch (err) {
    console.error("resumeService.generateAndStreamResumeFromData error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate resume" });
    }
  }
}
