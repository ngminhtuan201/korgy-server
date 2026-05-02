import { customAlphabet } from "nanoid";

const CLASS_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CLASS_CODE_LENGTH = 6;

export const generateClassCode = (): string => {
  return customAlphabet(CLASS_CODE_ALPHABET, CLASS_CODE_LENGTH)();
};
