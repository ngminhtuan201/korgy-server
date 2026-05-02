import joi from "joi";

export type GenerateSetDto = {
  topic: string;
  level: string;
  language: string;
  questionCount: number;
};

export const generateSetSchema = joi.object<GenerateSetDto>().keys({
  topic: joi.string().required(),
  level: joi.string().required(),
  language: joi.string().required(),
  questionCount: joi.number().integer().required(),
});
