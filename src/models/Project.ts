import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description?: string;
  imageUrl?: string;
  liveLink?: string;
  repoLink?: string;
  techStack?: string[];
  role?: string;
  duration?: string;
  type?: "Professional" | "Personal";
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    imageUrl: String,
    liveLink: String,
    repoLink: String,
    techStack: [String],
    role: String,
    duration: String,
    type: { type: String, enum: ["Professional", "Personal", "Outsourced"] },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
