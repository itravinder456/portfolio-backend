import mongoose, { Schema, Document } from "mongoose";

export interface IEducation extends Document {
  degree: string;
  field: string;
  institution: string;
  location?: string;
  startYear: number;
  endYear: number;
  percentage?: string;
  description?: string;
}

const EducationSchema: Schema = new Schema(
  {
    degree: { type: String, required: true },
    field: { type: String, required: true },
    institution: { type: String, required: true },
    location: String,
    startYear: { type: Number, required: true },
    endYear: { type: Number, required: true },
    percentage: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model<IEducation>("Education", EducationSchema);
