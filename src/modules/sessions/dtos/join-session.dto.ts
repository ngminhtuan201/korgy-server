import joi from "joi";

export type JoinSessionDto = {
  nickname: string;
};

export const joinSessionSchema = joi.object<JoinSessionDto>().keys({
  nickname: joi.string().min(1).max(30).required(),
});
