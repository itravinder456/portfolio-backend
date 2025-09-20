import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category?: string;
  proficiency?: string;
  level?: string;
  iconUrl?: string;
  isTopSkill?: boolean;
}

const SkillSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: String,
    proficiency: String,
    level: String,
    iconUrl: String,
    description: String,
    isTopSkill: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ISkill>("Skill", SkillSchema);
