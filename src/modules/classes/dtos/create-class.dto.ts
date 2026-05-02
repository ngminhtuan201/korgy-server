import joi from "joi";

export type CreateClassDto = {
  name: string;
  description?: string;
  subject?: string;
  isPublic?: boolean;
  thumbnailUrl?: string;
};

export const createClass = joi.object<CreateClassDto>({
  name: joi.string().required(),
  description: joi.string().allow("").optional(),
  subject: joi.string().allow("").optional(),
  isPublic: joi.boolean().optional(),
  thumbnailUrl: joi.string().allow("").optional(),
});
