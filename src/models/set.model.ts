import mongoose from "mongoose";
import { QuestionType } from "../enums";
import { BaseModel } from "./base";

export interface Explanation {
  text?: string;
  duration?: number;
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

export interface MultipleChoiceOption {
  id: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  isCorrect: boolean;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  options: MultipleChoiceOption[];
}

export interface MultipleResponseQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_RESPONSE;
  options: MultipleChoiceOption[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: QuestionType.TRUE_FALSE;
  trueOption: {
    title?: string;
    imageUrl?: string;
    audioUrl?: string;
  };
  falseOption: {
    title?: string;
    imageUrl?: string;
    audioUrl?: string;
  };
}

export interface MatchingItem {
  id: string;
  text?: string;
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

export interface HotspotsQuestion extends BaseQuestion {
  type: QuestionType.HOTSPOTS;
  imageUrl: string;
  hotspots: {
    x: number;
    y: number;
  }[];
}

export interface CategorizeItem {
  id: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface CategorizeCategory {
  id: string;
  title: string;
  imageUrl?: string;
  audioUrl?: string;
  items: CategorizeItem[];
}

export interface CategorizeQuestion extends BaseQuestion {
  type: QuestionType.CATEGORIZE;
  categories: CategorizeCategory[];
}

export interface TextInputQuestion extends BaseQuestion {
  type: QuestionType.TEXT_INPUT;
}

export interface FillBlanksQuestion extends BaseQuestion {
  type: QuestionType.FILL_BLANKS;
}

export type Question =
  | MultipleChoiceQuestion
  | MultipleResponseQuestion
  | TrueFalseQuestion
  | MatchingQuestion
  | OrderingQuestion
  | HotspotsQuestion
  | CategorizeQuestion
  | TextInputQuestion
  | FillBlanksQuestion;

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
