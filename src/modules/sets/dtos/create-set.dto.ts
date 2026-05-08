import joi from "joi";

export type CreateSetDto = {
  name: string;
  description?: string;
  isPublic?: boolean;
  thumbnailUrl?: string;
};

export const createSetSchema = joi.object<CreateSetDto>().keys({
  name: joi.string().required(),
  description: joi.string().allow(""),
  isPublic: joi.boolean(),
  thumbnailUrl: joi.string(),
});
