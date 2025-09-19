import mongoose, { Schema, Document } from "mongoose";

export interface IExperienceRole {
  role: string;
  period: string;
  description: string;
}

export interface IExperience extends Document {
  company: string;
  location?: string;
  roles: IExperienceRole[];
  technologies?: string[];
}

const ExperienceRoleSchema: Schema = new Schema({
  role: { type: String, required: true },
  period: { type: String, required: true },
  description: { type: String, required: true },
});

const ExperienceSchema: Schema = new Schema(
  {
    company: { type: String, required: true },
    location: String,
    roles: { type: [ExperienceRoleSchema], required: true },
    technologies: [String],
  },
  { timestamps: true }
);

export default mongoose.model<IExperience>("Experience", ExperienceSchema);
