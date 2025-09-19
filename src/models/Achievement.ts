import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
  title: string;
  description?: string;
  date?: Date;
  company?: string;
}

const AchievementSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: Date,
    company: String,
  },
  { timestamps: true }
);

export default mongoose.model<IAchievement>("Achievement", AchievementSchema);
