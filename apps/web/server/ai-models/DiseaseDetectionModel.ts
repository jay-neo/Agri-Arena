import "server-only";

import { geminiModel } from "./gemini";
import { GenerateContentStreamResult } from "@google/generative-ai";

class DiseaseDetectionModel {
    constructor() { }
    private chatModel = geminiModel();
    private modelEndpoint = `${process.env.DD_MODEL_ENDPOINT}/image_predict`;

    public async processing(data: DiseaseDetectionModelRequest): Promise<DiseaseDetectionModelResponse | null> {
        try {
            const response = await fetch(this.modelEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: data?.imageUrl,
                    id: data?.modelId,
                }),
            });
            console.log("Response from model:", response);

            if (!response.ok) {
                return null;
            }

            const result = await response.json();

            // return {
            //     name: "agriarena.model.dd1v1",
            //     number: (result?.number as number),
            //     result: (result?.result as string[]),
            //     accuracy: (result?.accuracy as string[]),
            // } as DiseaseDetectionModelResponse;
            console.log("Result ==>", result);

            return {
                name: "agriarena.model.dd1v1",
                number: 3,
                result: ["Fungal", "Chestnut blight ", "Black knot"],
                accuracy: ["70", "20.2", "12"],
            } as DiseaseDetectionModelResponse;
        }
        catch (error) {
            throw error;
        }
    };

    public async prompting(data: DiseaseDetectionModelResponse): Promise<string[]> {
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

            const chat = this.chatModel.startChat({
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

}

export const diseaseDetectionModel = new DiseaseDetectionModel();