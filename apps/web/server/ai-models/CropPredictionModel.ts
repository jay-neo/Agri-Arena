import "server-only";

import { geminiModel } from "./gemini";
import { GenerateContentStreamResult } from "@google/generative-ai";

class CropPredictionModel {
    constructor() { }
    private chatModel = geminiModel();
    private modelEndpoint = `${process.env.CP_MODEL_ENDPOINT}/predict`;

    public async predict(
        data: CropPredictionModelRequest
    ): Promise<CropPredictionModelResponse | null> {
        try {
            const modifiedData = data.experimentsData.map((experiment) => ({
                ph: experiment.ph,
                N: experiment.nitrogen,
                K: experiment.potassium,
                P: experiment.phosphorus,
                humidity: experiment.humidity,
                moisture: experiment.moisture,
                temperature: experiment.temperature,
            }));

            console.log({
                data: modifiedData,
            });

            const response = await fetch(this.modelEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: modifiedData,
                }),
            });
            console.log("Response ==>", response);

            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            console.log("Result ==>", result);

            return {
                number_of_crops: 1,
                prediction: result?.prediction as string[],
                confidence: result?.confidence as number[],
            } as CropPredictionModelResponse;
        } catch (error) {
            console.error("Error in CropPredictionModel:", error);
            throw error;
        }
    }

    public async prompting(data: CropPredictionModelResponse): Promise<string[]> {
        try {
            // const query = [
            //     {
            //         heading: "Guidance",
            //         prompt: `give me a guidance to cultivate crops in our filed, each crop each paragraph, in total 600 words`,
            //     },
            //     {
            //         heading: "Links",
            //         prompt: `give me 8 valid links of related ${data.prediction.toString()} like crop grains shop link etc specific to Indian zone and relavant valid available YouTube video links. Written format is each line have one link, only give links not write anything others text`,
            //     },
            // ];
            const query = [
                {
                    heading: "Crop Cultivation Guide",
                    prompt: `
                You are an expert agriculture assistant.
                
                Give a detailed farming guide for the crop: ${data.prediction.toString()}.
                
                Follow these rules strictly:
                - Use very simple language: short words and short sentences only.
                - Use headings with emojis (e.g., for section titles like Climate & Soil, Water Needs, etc.).
                - Use different emoji bullets in each section.
                - Highlight important words (like Urea, Malathion, 35°C) using **bold**.
                - Write in short steps or bullet points.
                - Do not write any introduction or conclusion.
                - Do not use any long paragraphs.
                - Do not mention pot or terrace gardening. Only field-based farming.
                - Use this exact guide structure:
                
                1. Ideal Climate & Soil
                   - Best temperature and rainfall
                   - Best region for cultivation
                   - Best soil type and pH range
                
                2. How to Plant
                   - Best time to plant (month-wise)
                   - How to plant: seed/sapling, depth, spacing, quantity
                   - Seed/sapling treatment: method, material, and reason
                
                3. Field Planting
                   - Area requirement (per acre or square meter)
                   - Spacing between rows/plants
                   - Soil preparation tips
                
                4. Water & Fertilizer Needs
                   - Watering schedule: when to water, how much, method (drip, flood, etc.)
                   - Fertilizer details:
                     - Names (e.g., Urea, DAP, FYM, etc.)
                     - Quantity per plant/acre
                     - When to apply
                     - Method of application
                
                5. Pest & Disease Control
                   - For each pest:
                     - Name of the pest
                     - Pesticide name and composition
                     - Quantity and how to use
                     - Alternative if it doesn't work
                   - For each disease:
                     - Name of the disease
                     - Organic or chemical treatment
                     - Medicine name and composition
                     - When and how to apply
                
                6. Harvesting Tips
                   - Signs the crop is ready
                   - How to harvest safely
                   - How to store and transport
                
                7. Extra Tips
                   - Best practices to increase yield
                   - Useful government apps, helplines, or schemes for farmers
                `,
                },
                {
                    heading: "Links",
                    prompt: `For the crop "${data.prediction.toString()}", give exactly 8 active and relevant links specific to India. Include a mix of:
1. Online seed or farming product shops related to this crop (e.g., seeds, pesticides, fertilizers).
2. YouTube videos showing how to grow, harvest, or care for this crop.
3. Government schemes, updates, or subsidies related to this crop (from Indian govt sources).
4. Agricultural articles or guides specific to this crop in the Indian region.
Important:
- Give only valid and working links (no placeholders).
- Only links should be given, one per line.
- Do not include any explanations or additional text.`,
                },
            ];

            const chat = this.chatModel.startChat({
                history: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `${data.prediction.toString()} and ${data.confidence.toString()} is the ML predictions result to cultivate crops in our fields.`,
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
                const result: GenerateContentStreamResult =
                    await chat.sendMessageStream(t.prompt);

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
    }
}

export const cropPredictionModel = new CropPredictionModel();
