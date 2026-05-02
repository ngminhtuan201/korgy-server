import joi from "joi";
import { Question } from "../../../models";
import { CreateSetDto } from "./create-set.dto";

export type UpdateSetDto = Partial<CreateSetDto> & {
  questions?: Question[];
};

export const updateSetSchema = joi.object<UpdateSetDto>().keys({
  name: joi.string(),
  description: joi.string(),
  isPublic: joi.boolean(),
  thumbnailUrl: joi.string(),
  questions: joi.array().items(joi.object().required()),
});
