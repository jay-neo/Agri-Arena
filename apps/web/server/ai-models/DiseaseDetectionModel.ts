import "server-only";

import { geminiModel } from "./gemini";
import { GenerateContentStreamResult } from "@google/generative-ai";

class DiseaseDetectionModel {
    constructor() { }
    private chatModel = geminiModel();
    private modelEndpoint = `${process.env.DD_MODEL_ENDPOINT}/image_predict`;

    public async processing(
        data: DiseaseDetectionModelRequest
    ): Promise<DiseaseDetectionModelResponse | null> {
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
                number_of_disease: parseFloat(result?.number_of_disease) as number,
                result: result?.result as string[],
                possibility: result?.possibility as number[],
            } as DiseaseDetectionModelResponse;
        } catch (error) {
            throw error;
        }
    }

    public async prompting(
        crop: string,
        data: DiseaseDetectionModelResponse,
        arena?: any
    ): Promise<string[]> {
        try {
            // const query =
            //     data?.number_of_disease == 0
            //         ? [
            //             {
            //                 heading: "Preview",
            //                 prompt: `Give me some healthy suggestions ${crop} for in 600 words`,
            //             },
            //             {
            //                 heading: "Products",
            //                 prompt: `give me product links for ${crop} cases of ${data.result.toString()} in 600 words`,
            //             },
            //         ]
            //         : [
            //             {
            //                 heading: "Disease Solution",
            //                 prompt: `Provide a full solution for ${crop} affected by ${data.result.toString()} (${data.possibility.toString()}% confidence), including severity, treatments (organic and chemical), product names, usage, and prevention tips.`,
            //             },
            //             {
            //                 heading: "Treatment Guide",
            //                 prompt: `Give a step-by-step treatment plan for ${crop} with ${data.result.toString()}, covering immediate actions, safe solutions, dosages, and recovery support.`,
            //             },
            //             {
            //                 heading: "Expert Farming Advice",
            //                 prompt:
            //                     `Act as a farming expert and suggest practical, budget-friendly treatments and products for ${data.result.toString()} in ${crop} (${data.possibility.toString()}%, with do's and don'ts.`,
            //             },
            //             {
            //                 heading: "Recovery and Protection Plan",
            //                 prompt: `Guide on how to stop disease spread in ${crop} with ${data.result.toString()}, including environment control, crop rotation, and steps to restore plant health.`,
            //             },
            //             {
            //                 heading: "Farmer Action Plan",
            //                 prompt: `Give an urgent action plan for ${crop} infected by ${data.result.toString()} (${data.possibility.toString()}% sure), covering severity, treatment, monitoring, and future prevention.`,
            //             },
            //         ];

            const query =
                data?.number_of_disease == 0
                    ? [
                        {
                            heading: `🌱 How to Keep  ${crop}  Healthy`,
                            prompt: `You're an expert agricultural advisor. Write a friendly, clear and structured guide for keeping ${crop} crops healthy. Break it into sections like: "Ideal Growing Conditions", "Watering Tips", "Fertilizer Use", "Pest Prevention" and "Seasonal Care" etc. Use emojis 🌾✅, bullet points, and short paragraphs. Make it easy to read on a website. Limit to 600 words.`,
                        },
                        {
                            heading: "🛒 Best Products to Boost Crop Health",
                            prompt: `List effective products to support healthy ${crop} growth. For each product, give a short description, its purpose and how to use it. Use a table or bullet format. Include mock buying links if real ones aren't available. Keep formatting web-friendly and use emojis where helpful.`,
                        },
                    ]
                    : [
                        {
                            heading: `🦠 Diagnose & Treat: ${data.result.toString()} in ${crop}`,
                            prompt: `Write a full guide to understanding and treating ${data.result.toString()} in ${crop}, with ${data.possibility.toString()}% confidence. Include these sections: "🔍 About the Disease", "📉 Severity Level", "🧪 Treatment Options (Organic & Chemical)", "💊 How to Use Products Safely", and "🛡️ Prevention Tips". Use bullet points, tables, and emojis for readability. Keep it web-optimized and under 700 words.`,
                        },
                        {
                            heading: "📋 Step-by-Step Treatment Plan",
                            prompt: `Give a detailed treatment plan for ${crop} affected by ${data.result.toString()}. Structure with clear steps: "Immediate Action", "Apply Treatment", "Monitor Progress", "Support Recovery". Use numbered steps, bullet points and bold for emphasis. Make sure it’s easy to follow for any farmer.`,
                        },
                        {
                            heading: "👨‍🌾 Budget-Friendly Advice from a Farming Expert",
                            prompt: `Act like an experienced farming consultant. Suggest practical, low-cost treatment options for ${data.result.toString()} in ${crop}. Break it into: "Do’s ✅", "Don’ts ❌", "Best Budget Products 💰" and "Safety Tips". Use simple language, visual formatting and emojis. Ideal for mobile viewing.`,
                        },
                        {
                            heading: "🛡️ Recovery Plan & Crop Protection",
                            prompt: `Write a guide on how to help ${crop} recover from ${data.result.toString()} and prevent future outbreaks. Include tips for "Improving Soil Health", "Changing Irrigation", "Environmental Control 🌡️" and "Crop Rotation 🌾". Use bullet points, sections and simple visuals.`,
                        },
                        {
                            heading: "🚨 Emergency Action Plan for Farmers",
                            prompt: `Create an urgent response plan for ${crop} infected by ${data.result.toString()} (${data.possibility.toString()}% sure). Use structured sections: "⚠️ Problem Summary", "✅ What to Do Immediately", "🧪 Treatment", "🔁 Monitoring" and "🛑 Future Prevention". Keep it concise, direct and very clear. Ideal for quick reading on the field.`,
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
                const result: GenerateContentStreamResult =
                    await chat.sendMessageStream(t.prompt);

                for await (const chunk of result.stream) {
                    const chunkText: string = chunk.text();
                    aiResponse += chunkText;
                }

                response.push(t.heading);
                response.push(aiResponse);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }
}

export const diseaseDetectionModel = new DiseaseDetectionModel();
