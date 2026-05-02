import mongoose from "mongoose";
import { BaseModel } from "./base";

export interface Player extends BaseModel {
  sessionId: string;
  nickname: string;
  userId?: string;
  score: number;
  correctCount: number;
  totalAnswered: number;
  joinedAt: Date;
  isActive: boolean;
  clientId: string;
}

const playerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: false,
    },
    score: {
      type: Number,
      default: 0,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    totalAnswered: {
      type: Number,
      default: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    clientId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true },
);

playerSchema.index({ sessionId: 1 });
playerSchema.index({ userId: 1 });

export const PlayerModel = mongoose.model<Player>("Player", playerSchema);
