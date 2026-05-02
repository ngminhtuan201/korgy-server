import { GoogleGenAI } from "@google/genai";
import { GenerateSetDto } from "./dtos";

const googleGenAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const generateSet = async (dto: GenerateSetDto) => {
  const SYSTEM_PROMPT = ``;
  const result = await googleGenAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: JSON.stringify(dto),
  });

  return result.response.text();
};
