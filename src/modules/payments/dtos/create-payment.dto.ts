import joi from "joi";
import { Currency } from "../../../enums";

export type CreatePaymentDto = {
  amount: number;
  currency: Currency;
};

export const createPaymentSchema = joi.object<CreatePaymentDto>({
  amount: joi.number().min(0).required(),
  currency: joi
    .string()
    .valid(...Object.values(Currency))
    .required(),
});
