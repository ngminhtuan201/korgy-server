import joi from "joi";

export type ManualLoginDto = {
  email: string;
  password: string;
};

export const manualLoginSchema = joi.object<ManualLoginDto>({
  email: joi.string().email().required().trim().lowercase(),
  password: joi.string().required(),
});
