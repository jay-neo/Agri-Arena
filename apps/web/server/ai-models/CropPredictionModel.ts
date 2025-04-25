import "server-only";

import { geminiModel } from "./gemini";
import { GenerateContentStreamResult } from "@google/generative-ai";

class CropPredictionModel {
    constructor() { }
    private chatModel = geminiModel();
    private modelEndpoint = `${process.env.DD_MODEL_ENDPOINT}/predict`;

    public async predict(data?: CropPredictionModelRequest): Promise<CropPredictionModelResponse | null> {
        try {
            // const response = await fetch(this.modelEndpoint, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         data: {
            //             url: data?.imageUrl,
            //             id: data?.modelId,
            //         },
            //     }),
            // });
            // console.log("Response from model:", response);

            // if (!response.ok) {
            //     return null;
            // }

            // const result = await response.json();

            // return {
            //     name: "agriarena.model.dd1v1",
            //     number: (result?.number as number),
            //     result: (result?.result as string[]),
            //     accuracy: (result?.accuracy as string[]),
            // } as CropPredictionModelResponse;

            return {
                name: "agriarena.model.dd1v1",
                number: 3,
                result: ["Fungal", "Chestnut blight ", "Black knot"],
                accuracy: ["70", "20.2", "12"],
            } as CropPredictionModelResponse;
        }
        catch (error) {
            throw error;
        }
    };

    public async prompting(data: CropPredictionModelResponse): Promise<string[]> {
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

            const chat = this.chatModel.startChat({
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

}

export const cropPredictionModel = new CropPredictionModel();