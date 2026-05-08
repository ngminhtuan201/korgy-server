import mongoose from "mongoose";
import { BaseModel } from "./base";

export class Class extends BaseModel {
  userId: string;
  name: string;
  description?: string;
  subject?: string;
  code: string;
  setIds: string[];
  memberIds: string[];
  thumbnailUrl?: string;
}

const classSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    subject: {
      type: String,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    memberIds: {
      type: [String],
      default: [],
    },
    setIds: {
      type: [String],
      default: [],
    },
    thumbnailUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

classSchema.index({ userId: 1 });
classSchema.index({ code: 1 });

export const ClassModel = mongoose.model<Class>("Class", classSchema);
