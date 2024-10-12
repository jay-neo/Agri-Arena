import { geminiModel } from "~/app/server/models/gemini";
import { GenerateContentStreamResult } from "@google/generative-ai";

const model = geminiModel();

export const prompting = async (data: Model_Response_V1): Promise<string[]> => {
  try {
    const query = [
      {
        heading: "Solution",
        prompt: `give me solution of diseases of ${data.result.toString()} in 600 words`,
      },
      {
        heading: "Links",
        prompt: `give me product links for diseases of ${data.result.toString()} in 600 words`,
      },
    ];

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: data.toString(),
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "Here will be another details of detecting disease before promping",
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    let response: string[] = [];

    for (const t of query) {
      let aiResponse: string = "";
      const result: GenerateContentStreamResult = await chat.sendMessageStream(
        t.prompt
      );

      for await (const chunk of result.stream) {
        const chunkText: string = chunk.text();
        aiResponse += chunkText;
      }

      response.push(t.heading);
      response.push(aiResponse);
    }

    return response as string[];
  } catch (error) {
    throw error;
  }
};
