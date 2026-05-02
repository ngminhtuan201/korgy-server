import joi from "joi";

export type ManualRegisterDto = {
  fullName: string;
  email: string;
  password: string;
};

export const manualRegisterSchema = joi.object<ManualRegisterDto>({
  fullName: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
});
