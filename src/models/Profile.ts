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
  linkedin?: string;
  github?: string;
  summary?: string;
  yearsOfExperience?: number;
  completedProjects?: number;
  happyClients?: number;
  awardsWon?: number;
}

const ProfileSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: String,
    title: String,
    nationality: String,
    freelance: String,
    phone: String,
    email: String,
    address: String,
    languages: [String],
    location: String,
    linkedin: String,
    github: String,
    summary: String,
    yearsOfExperience: Number,
    completedProjects: Number,
    happyClients: Number,
    awardsWon: Number,
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>("Profile", ProfileSchema);
