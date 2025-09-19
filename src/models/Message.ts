import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  ip?: string;
  receivedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    ip: { type: String }, // client IP address
    receivedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const Message =
  (mongoose.models && (mongoose.models.Message as mongoose.Model<IMessage>)) ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
