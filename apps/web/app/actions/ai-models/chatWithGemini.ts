"use server";

import { Content, GenerateContentStreamResult } from "@google/generative-ai";
import { geminiModel } from "~/server/ai-models/gemini";

const model = geminiModel();
let userHistory: Content[] = [];

export const chatWithGemini = async (
    prompt: string
): Promise<GenerateContentStreamResult> => {
    try {
        const chat = model.startChat({
            history: userHistory,
            generationConfig: {
                maxOutputTokens: 500,
            },
        });
        const result = await chat.sendMessageStream(prompt);

        let aiResponse = "";
        // for await (const chunk of result.stream) {
        //   aiResponse += chunk.text();
        // }
        userHistory = [
            ...userHistory,
            { role: "user", parts: [{ text: prompt }] },
            { role: "model", parts: [{ text: aiResponse }] },
        ];

        return result;
    } catch (error) {
        return null;
    }
};
