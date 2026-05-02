import mongoose from "mongoose";
import {
  SessionEndCondition,
  SessionGame,
  SessionPlayMode,
  SessionStatus,
} from "../enums";
import { BaseModel } from "./base";
import { Set } from "./set.model";

export type SetSnapshot = Pick<
  Set,
  "id" | "name" | "thumbnailUrl" | "questions"
>;

export interface Session extends BaseModel {
  userId: string;
  set: SetSnapshot;
  game: SessionGame;
  joinCode: string;
  status: SessionStatus;
  shuffleQuestions: boolean;
  endCondition: SessionEndCondition;
  duration: number;
  loginRequired: boolean;
  allowLateJoining: boolean;
  playMode: SessionPlayMode;
  startedAt?: Date;
  endedAt?: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    game: {
      type: String,
      enum: SessionGame,
      default: SessionGame.QUIZ,
      required: true,
    },
    set: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    joinCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.WAITING,
    },
    currentQuestionIndex: {
      type: Number,
      default: -1,
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    endCondition: {
      type: String,
      enum: SessionEndCondition,
      default: SessionEndCondition.GOAL,
    },
    duration: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

sessionSchema.index({ userId: 1 });
sessionSchema.index({ joinCode: 1 }, { unique: true });
sessionSchema.index({ status: 1 });
sessionSchema.index({ setId: 1 });

export const SessionModel = mongoose.model<Session>("Session", sessionSchema);
