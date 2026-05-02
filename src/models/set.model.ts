import mongoose from "mongoose";
import { QuestionType } from "../enums";
import { BaseModel } from "./base";

export interface Explanation {
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface BaseQuestion extends BaseModel {
  type: QuestionType;
  title: string;
  /**
   * Time limit in seconds.
   * If not set, it will be unlimited.
   */
  timeLimit?: number;
  points: number;
  explanation?: Explanation;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
}

export interface MultipleResponseQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_RESPONSE;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: QuestionType.TRUE_FALSE;
}

export interface MatchingItem {
  text: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: QuestionType.MATCHING;
  pairs: { left: MatchingItem; right: MatchingItem }[];
}

export interface OrderingItem {
  text: string;
  imageUrl?: string;
}

export interface OrderingQuestion extends BaseQuestion {
  type: QuestionType.ORDERING;
  items: OrderingItem[];
}

export interface HotspotQuestion extends BaseQuestion {
  type: QuestionType.HOTSPOT;
  imageUrl: string;
  hotspots: {
    x: number;
    y: number;
  }[];
}

export type Question =
  | MultipleChoiceQuestion
  | MultipleResponseQuestion
  | TrueFalseQuestion
  | MatchingQuestion
  | OrderingQuestion
  | HotspotQuestion;

export class Set extends BaseModel {
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  isFavorite: boolean;
  folderId?: string;
  thumbnailUrl?: string;
  questions: Question[];
}

const setSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    folderId: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    questions: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true },
);

export const SetModel = mongoose.model<Set>("Set", setSchema);
