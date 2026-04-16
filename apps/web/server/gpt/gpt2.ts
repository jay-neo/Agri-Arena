import OpenAI from "openai";

import { openaiApiKey } from "~/lib/myenv";

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

export default async function () {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "",
      },
    ],
  });
}
