import joi from "joi";
import {
  SessionEndCondition,
  SessionGame,
  SessionPlayMode,
} from "../../../enums";

export type CreateSessionDto = {
  setId: string;
  game: SessionGame;
  shuffleQuestions?: boolean;
  endCondition?: SessionEndCondition;
  duration?: number;
  loginRequired: boolean;
  allowLateJoining: boolean;
  playMode: SessionPlayMode;
};

export const createSessionSchema = joi.object<CreateSessionDto>().keys({
  setId: joi.string().required(),
  game: joi.string().allow(...Object.values(SessionGame)),
  shuffleQuestions: joi.boolean(),
  endCondition: joi.string().valid(...Object.values(SessionEndCondition)),
  duration: joi.number().min(0),
  loginRequired: joi.boolean().required(),
});
