import "server-only";

import { geminiApiKey } from "~/lib/myenv";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

export const geminiModel = (
  modelName: string = "gemini-1.5-flash",
): GenerativeModel => {
  const gemini = new GoogleGenerativeAI(geminiApiKey);
  const model = gemini.getGenerativeModel({ model: modelName });
  return model;
};
