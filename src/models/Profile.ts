import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  firstName: string;
  lastName: string;
  fullName?: string;
  title?: string;
  nationality?: string;
  freelance?: string;
  phone?: string;
  email?: string;
  address?: string;
  languages?: string[];
  location?: string;
  linkedin?: string; // username / handle
  github?: string; // username / handle
  linkedinUrl?: string; // full URL (optional)
  githubUrl?: string; // full URL (optional)
  summary?: string;
  yearsOfExperience?: number;
  completedProjects?: number;
  happyClients?: number;
  awardsWon?: number;
}

const urlRegex = /^https?:\/\/.+/i;

const ProfileSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: String,
    title: String,
    homePageSkills: [String],
    nationality: String,
    freelance: String,
    phone: String,
    email: String,
    address: String,
    languages: [String],
    location: String,
    // keep username/handle fields
    linkedin: String,
    github: String,
    contactPageSummary: String,
    aboutPageSummary: String,
    homePageSummary: String,
    subtitle: String,
    // add URL fields with simple validation
    linkedinUrl: {
      type: String,
      trim: true,
      match: [urlRegex, "Invalid URL for linkedinUrl"],
    },
    githubUrl: {
      type: String,
      trim: true,
      match: [urlRegex, "Invalid URL for githubUrl"],
    },
    summary: String,
    yearsOfExperience: Number,
    completedProjects: Number,
    happyClients: Number,
    awardsWon: Number,
  },
  { timestamps: true }
);

// auto-fill fullName if not provided
ProfileSchema.pre("save", function (next) {
  const doc = this as any;
  if (!doc.fullName && doc.firstName) {
    doc.fullName = `${doc.firstName}${doc.lastName ? " " + doc.lastName : ""}`;
  }
  next();
});

export default mongoose.model<IProfile>("Profile", ProfileSchema);
