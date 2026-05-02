import joi from "joi";

export type UpdateProfileDto = {
  fullName?: string;
};

export const updateProfileSchema = joi.object<UpdateProfileDto>({
  fullName: joi.string().optional(),
});
