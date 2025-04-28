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
                    modelId: data?.modelId,
                    imageUrl: data?.imageUrl,
                }),
            });

            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            console.log("Result ==>", result);

            return {
                number_of_disease: (parseFloat(result?.number_of_disease) as number),
                result: (result?.result as string[]),
                possibility: (result?.possibility as number[]),
            } as DiseaseDetectionModelResponse;
        }
        catch (error) {
            throw error;
        }
    };

    public async prompting(crop: string, data: DiseaseDetectionModelResponse, arena?: any): Promise<string[]> {
        try {
            const query = data?.number_of_disease == 0 ? [
                {
                    heading: "Preview",
                    prompt: `Give me some healthy suggestions ${crop} for in 600 words`,
                },
                {
                    heading: "Products",
                    prompt: `give me product links for ${crop} cases of ${data.result.toString()} in 600 words`,
                },
            ] : [
                {
                    heading: "Solution",
                    prompt: `give me solution of diseases  ${crop} of ${data.result.toString()} in 600 words`,
                },
                {
                    heading: "Links",
                    prompt: `give me product links for diseases  ${crop} of ${data.result.toString()} in 600 words`,
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