"use client";

import ReactMarkdown from "react-markdown";
import { useState, useEffect, useRef } from "react";
import { chatWithGemini } from "~/app/server/models/gemini";

export default () => {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    let aiResponse = "";

    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    try {
      const result = await chatWithGemini(prompt);
      setPrompt("");
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        aiResponse += chunkText;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <div className="max-w-[800px] mx-auto flex flex-col p-2 mb-24">
        {[...messages].map((message, i) => (
          <div key={i} className="mb-4">
            <div
              key={i}
              className={`mb-4 flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`border-2 p-2 rounded-3xl whitespace-pre-wrap md:max-w-[28rem] max-w-80 w-[${message.content.length}] ${message.role === "user" ? "border-purple-500" : "border-rose-500"}`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="fixed bottom-0 w-screen md:max-w-[800px] lg:ml-[12rem] md:mr-[4rem] mb-20 md:mb-0 px-1 py-3 md:pb-24 dark:bg-[#212146] bg-[#f7ecfa]">
        <div className="max-w-[800px] w-full">
          <form onSubmit={handleSubmit} className="flex w-full">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt((e.target as any).value)}
              placeholder={"Chat with Arena-AI"}
              className="flex-grow rounded-l-full h-10 text-lg text-wrap px-2 border-none focus:outline-none placeholder:text-sm md:placeholder:text-base focus:ring-0 bg-rose-400/10 dark:bg-blue-700/10"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt}
              className={`px-5 items-start py-2 h-10 text-sm md:text-pretty text-white rounded-r-full ${isLoading || !prompt ? "bg-rose-400/10 dark:bg-blue-700/10 text-gray-400 " : "bg-purple-600/80 hover:bg-purple-600/90"}`}
            >
              {!isLoading && prompt && <>Send</>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
