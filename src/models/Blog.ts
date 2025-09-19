import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  summary?: string;
  publishedDate?: Date;
  url?: string;
  tags?: string[];
  // combined field: category replaces the previous "type"
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String },
    publishedDate: { type: Date },
    url: { type: String },
    tags: { type: [String], default: [] },
    // allow free-form category (e.g. "Tech", "Personal", "Career", "React", "APIs")
    // you can set a default if desired: default: "Tech"
    category: { type: String },
  },
  { timestamps: true }
);

export default (mongoose.models &&
  (mongoose.models.Blog as mongoose.Model<IBlog>)) ||
  mongoose.model<IBlog>("Blog", BlogSchema);
