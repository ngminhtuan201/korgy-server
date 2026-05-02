import joi from "joi";

export type JoinClassDto = {
  code: string;
};

export const joinClass = joi.object<JoinClassDto>({
  code: joi.string().required(),
});
