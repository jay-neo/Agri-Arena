import { geminiModel } from "~/app/server/models/gemini";
import { GenerateContentStreamResult } from "@google/generative-ai";

const model = geminiModel();

export const prompting = async (data: Model_Response_V1): Promise<string[]> => {
  try {
    const query = [
      {
        heading: "Guidance",
        prompt: `give me a guidance to cultivate crops in our filed, each crop each paragraph, in total 600 words`,
      },
      {
        heading: "Links",
        prompt: `give me 8 valid links of related ${data.result.toString()} like crop grains shop link etc specific to Indian zone and relavant valid available YouTube video links. Written format is each line have one link, only give links not write anything others text`,
      },
    ];

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `${data.result.toString()} and ${data.accuracy.toString()} is the ML predictions result to cultivate crops in our fields.`,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: "Give me my answers in precise paragraph wise, not to much use bullet points. Each paragraph have 100 to 120 words. Try write as possible as text file not md file.",
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
