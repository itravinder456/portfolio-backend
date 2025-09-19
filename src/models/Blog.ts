import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  summary?: string;
  publishedDate?: Date;
  url?: string;
  tags?: string[];
  type?: "Tech" | "Personal" | "Career";
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    summary: String,
    publishedDate: Date,
    url: String,
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", BlogSchema);
