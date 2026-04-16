"use client";

import { useState } from "react";

export const FAQs = ({
  data,
}: {
  data: { question: string; answer: string }[];
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const dataLength = data.length;

  return (
    <div>
      {data &&
        data.map((faq, index) => (
          <div
            key={index}
            className={`bg-lime-400/20 dark:bg-gray-600/40 shadow-md w-full max-w-xl ${index === 0 && "rounded-t-lg"} ${index + 1 === dataLength && "rounded-b-lg"} `}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left p-4 flex justify-between items-center font-bold text-gray-800 dark:text-gray-100"
            >
              {faq.question}
              <svg
                className={`w-6 h-6 transition-transform ${openIndex === index ? "transform rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="p-4 text-base">{faq.answer}</div>
            )}
          </div>
        ))}
    </div>
  );
};
