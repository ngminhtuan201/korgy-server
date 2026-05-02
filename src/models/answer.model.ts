import mongoose from "mongoose";
import { BaseModel } from "./base";

export interface Answer extends BaseModel {
  playerId: string;
  sessionId: string;
  questionId: string;
  answerData: unknown;
  isCorrect: boolean;
  points: number;
  timeSpent: number;
  answeredAt: Date;
}

const answerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    playerId: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    answerData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    timeSpent: {
      type: Number,
      required: true,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

answerSchema.index({ sessionId: 1 });
answerSchema.index({ playerId: 1 });
answerSchema.index({ sessionId: 1, questionId: 1 });
answerSchema.index(
  { sessionId: 1, playerId: 1, questionId: 1 },
  { unique: true },
);

export const AnswerModel = mongoose.model<Answer>("Answer", answerSchema);
