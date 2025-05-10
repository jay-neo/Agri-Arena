import "server-only";

import { geminiModel } from "./gemini";
import { GenerateContentStreamResult } from "@google/generative-ai";

class CropPredictionModel {
  constructor() {}
  private chatModel = geminiModel();
  private modelEndpoint = `${process.env.CP_MODEL_ENDPOINT}/predict`;

  public async predict(
    data: CropPredictionModelRequest,
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

      // console.log({
      //   data: modifiedData,
      // });

      const response = await fetch(this.modelEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: modifiedData,
        }),
      });
      // console.log("Response ==>", response);

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
      //             const query = [
      //                 {
      //                     heading: "Crop Cultivation Guide",
      //                     prompt: `
      //                 You are an expert agriculture assistant.

      //                 Give a detailed farming guide for the crop: ${data.prediction.toString()}.

      //                 Follow these rules strictly:
      //                 - Use very simple language: short words and short sentences only.
      //                 - Use headings with emojis (e.g., for section titles like Climate & Soil, Water Needs, etc.).
      //                 - Use different emoji bullets in each section.
      //                 - Highlight important words (like Urea, Malathion, 35°C) using **bold**.
      //                 - Write in short steps or bullet points.
      //                 - Do not write any introduction or conclusion.
      //                 - Do not use any long paragraphs.
      //                 - Do not mention pot or terrace gardening. Only field-based farming.
      //                 - Use this exact guide structure:

      //                 1. Ideal Climate & Soil
      //                    - Best temperature and rainfall
      //                    - Best region for cultivation
      //                    - Best soil type and pH range

      //                 2. How to Plant
      //                    - Best time to plant (month-wise)
      //                    - How to plant: seed/sapling, depth, spacing, quantity
      //                    - Seed/sapling treatment: method, material, and reason

      //                 3. Field Planting
      //                    - Area requirement (per acre or square meter)
      //                    - Spacing between rows/plants
      //                    - Soil preparation tips

      //                 4. Water & Fertilizer Needs
      //                    - Watering schedule: when to water, how much, method (drip, flood, etc.)
      //                    - Fertilizer details:
      //                      - Names (e.g., Urea, DAP, FYM, etc.)
      //                      - Quantity per plant/acre
      //                      - When to apply
      //                      - Method of application

      //                 5. Pest & Disease Control
      //                    - For each pest:
      //                      - Name of the pest
      //                      - Pesticide name and composition
      //                      - Quantity and how to use
      //                      - Alternative if it doesn't work
      //                    - For each disease:
      //                      - Name of the disease
      //                      - Organic or chemical treatment
      //                      - Medicine name and composition
      //                      - When and how to apply

      //                 6. Harvesting Tips
      //                    - Signs the crop is ready
      //                    - How to harvest safely
      //                    - How to store and transport

      //                 7. Extra Tips
      //                    - Best practices to increase yield
      //                    - Useful government apps, helplines, or schemes for farmers
      //                 `,
      //                 },
      //                 {
      //                     heading: "Links",
      //                     prompt: `For the crop "${data.prediction.toString()}", give exactly 8 active and relevant links specific to India. Include a mix of:
      // 1. Online seed or farming product shops related to this crop (e.g., seeds, pesticides, fertilizers).
      // 2. YouTube videos showing how to grow, harvest, or care for this crop.
      // 3. Government schemes, updates, or subsidies related to this crop (from Indian govt sources).
      // 4. Agricultural articles or guides specific to this crop in the Indian region.
      // Important:
      // - Give only valid and working links (no placeholders).
      // - Only links should be given, one per line.
      // - Do not include any explanations or additional text.`,
      //                 },
      //             ];
      const query = [
        {
          heading: "Crop Cultivation Guide",
          prompt: `
You are an agricultural expert helping beginner Indian farmers.
Your task: Given a crop name, create a simple, friendly, and visually engaging step-by-step guide to grow and care for that crop, with slightly more detail in each point for better understanding.

📝 Formatting Instructions:
Use very simple words and short sentences.
Use headings with emojis to make the guide fun and easy to read.
Use different emoji bullets in each section (like 🌿, 🌞, 🛑, 📦, etc.).
Highlight important words with bold text (e.g., Urea, 35°C, Malathion).
Write in short steps or bullet points, elaborating slightly on each. Do not use long paragraphs.
Do not include any introduction or conclusion — only the guide.
📘 Use this Guide Structure:

🌱 Ideal Climate & Soil
🌞 Best temperature and rainfall: Explain the ideal temperature range and the amount/pattern of rainfall needed.
🧭 Best region for cultivation in India: Mention specific states or regions where this crop grows well.
🌍 Best soil type and pH range: Describe the preferred soil texture and the ideal pH level for good growth.
🌾 How to Plant
📅 Best time to plant for this crop in India (month-wise): Specify the best planting months for the main growing seasons.
🌿 How to plant: seed/sapling, depth, spacing, quantity: Explain whether to use seeds or saplings, the recommended planting depth and spacing between plants, and the approximate seed quantity per area.
🧼 Seed/sapling treatment: method, material, and why it's needed: Describe if any treatment is usually done (like soaking seeds), the material used (e.g., fungicide), and the benefit of this treatment.
💧 Water & Fertilizer Needs
🚿 Watering schedule: when to water, how much, method (drip, flooding, etc.): Give a general idea of the watering frequency at different growth stages and the recommended watering method.
🧪 Fertilizer details:
Names (e.g., Urea, DAP, FYM, etc.): List common fertilizers used.
Quantity per plant/acre: Provide approximate amounts of each fertilizer.
When to apply (before planting, at flowering, etc.): Specify the growth stages for fertilizer application.
Method (mix in soil, spray, etc.): Explain how to apply each fertilizer.
🐛 Pest & Disease Control
🐜 For each common pest in India:
Name of the pest
Name of pesticide + composition
Quantity (per litre or per acre)
When and how to use
What to do if it does not work (e.g., alternative pesticide or manual method)
🦠 For each disease common in India:
Name of the disease
Treatment (organic/home or chemical)
Medicine name + composition
How and when to use it
🧺 Harvesting Tips
⏰ Clear signs the crop is ready to harvest: Describe visual or other indicators that show the crop is mature.
✂️ How to harvest safely (tools, method, time of day): Explain the tools needed and the best way to harvest to avoid damage, possibly including the time of day.
📦 How to store and transport without damage: Give basic advice on post-harvest handling.
🌟 Extra Tips
📈 Best practices to increase yield (crop rotation, pruning, etc.): Suggest a few techniques to improve the harvest.
📱 Useful government apps, helplines, schemes for this crop relevant to India (like Kisan Suvidha, PM-Kisan, etc.): Mention relevant resources for farmers.
Crop: "${data.prediction.toString()}"
`,
        },
        // {
        //   heading: "Relevant Links",

        //   prompt: `You are an agricultural assistant helping Indian farmers.
        //   Your task: For the crop "${data.prediction.toString()}", give exactly 8 working and valid links relevant to India.

        //   Include a mix of the following types:
        //   1. 🌱 Websites selling seeds, fertilizers, or pesticides for this crop (India only)
        //   2. 📺 YouTube videos showing how to grow, care for, or harvest this crop
        //   3. 🏛️ Government schemes, subsidies, or guidelines for this crop (Indian govt sites)
        //   4. 📘 Indian articles, blogs, or guides about cultivating this crop

        //   ✅ Format:
        //   - Each link must start with a short heading or title (4-10 words) that clearly says what the link is.
        //   - Then give the URL on the next line.
        //   - Put a blank line between each link block.

        //   ⚠️ Strict Rules:
        //   - Links must be real, active, and India-specific
        //   - Do not give placeholder or broken links
        //   - Do not add any extra explanation or notes

        //   Example format:
        //   Seeds and Fertilizers - AgroStar India
        //   https://www.agrostar.in/

        //   YouTube Guide - Tomato Farming Steps
        //   https://www.youtube.com/watch?v=abc123

        //   Now follow the same format for: "${data.prediction.toString()}"
        //   `,
        // },
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
          maxOutputTokens: 2000,
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
