import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const ContactMessageSchema: Schema = new Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model<IContactMessage>(
  "ContactMessage",
  ContactMessageSchema
);
