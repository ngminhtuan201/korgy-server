import joi from "joi";
import { CreateClassDto } from "./create-class.dto";

export type UpdateClassDto = Partial<CreateClassDto>;

export const updateClass = joi.object<UpdateClassDto>({
  name: joi.string().optional(),
  description: joi.string().allow("").optional(),
  subject: joi.string().allow("").optional(),
  isPublic: joi.boolean().optional(),
  thumbnailUrl: joi.string().allow("").optional(),
});
