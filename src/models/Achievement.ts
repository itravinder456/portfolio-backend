import mongoose, { Schema, Document } from "mongoose";

export type AchievementType = "Achievement" | "Award";

export interface IAchievement extends Document {
  title: string;
  description?: string;
  date?: Date;
  company?: string;
  type?: AchievementType;
  createdAt?: Date;
  updatedAt?: Date;
}

const AchievementSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: Date,
    company: String,
    type: {
      type: String,
      enum: ["Achievement", "Award"],
      default: "Achievement",
    },
  },
  { timestamps: true }
);

export default (mongoose.models &&
  (mongoose.models.Achievement as mongoose.Model<IAchievement>)) ||
  mongoose.model<IAchievement>("Achievement", AchievementSchema);
