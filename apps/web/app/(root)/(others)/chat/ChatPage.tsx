"use client";

import ReactMarkdown from "react-markdown";
import { useState, useEffect, useRef } from "react";
import { chatWithGemini } from "~/app/actions/ai-models/chatWithGemini";

type Message = {
  role: string;
  content: string;
};

export default () => {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim() || isLoading) return;

    // Hide welcome message on first input
    if (showWelcome) setShowWelcome(false);

    setError(null);
    setIsLoading(true);
    let aiResponse = "";

    const userMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");

    try {
      const result = await chatWithGemini(prompt);
      aiResponse += result;
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.role === "model") {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, content: aiResponse },
          ];
        }
        return [...prev, { role: "model", content: aiResponse }];
      });
    } catch (error) {
      console.error("Chat error:", error);
      setError("Sorry, something went wrong. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Sorry, I encountered an error. Please try your request again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh_-_11rem)]">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {showWelcome && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center p-8 max-w-2xl">
              <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                Welcome to Arena-AI
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                How can I assist you today?
              </p>
            </div>
          </div>
        )}

        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 backdrop-blur-lg ${
                message.role === "user"
                  ? "bg-white/70 dark:bg-purple-900/70 shadow-md"
                  : "bg-white/70 dark:bg-blue-900/70 shadow-md"
              }`}
            >
              <ReactMarkdown className="prose dark:prose-invert">
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/70 dark:bg-blue-900/70 backdrop-blur-lg rounded-2xl p-4 max-w-[80%] shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky input area */}
      <div className="fixed bottom-1 p-4 max-w-4xl w-full mx-auto bg-transparent backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full px-4 py-3 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Send"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
