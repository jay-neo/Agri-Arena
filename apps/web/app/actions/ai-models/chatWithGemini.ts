"use server";

import { Content, GenerateContentStreamResult } from "@google/generative-ai";
import { geminiModel } from "~/server/ai-models/gemini";

export const chatWithGemini = async (prompt: string): Promise<string> => {
  try {
    const model = geminiModel();
    let userHistory: Content[] = [];

    const chat = model.startChat({
      history: userHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });
    const result = await chat.sendMessageStream(prompt);

    let aiResponse = "";
    for await (const chunk of result.stream) {
      aiResponse += chunk.text();
    }
    userHistory = [
      ...userHistory,
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: aiResponse }] },
    ];

    return aiResponse;
  } catch (error) {
    return null;
  }
};
