import joi from "joi";

export type AnswerQuestionDto = {
  questionId: string;
  answerData: unknown;
};

export const answerQuestionSchema = joi.object<AnswerQuestionDto>().keys({
  questionId: joi.string().required(),
  answerData: joi.required(),
});
