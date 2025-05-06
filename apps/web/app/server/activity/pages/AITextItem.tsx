"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getImagesDataById } from "../../ip/imagesData";

const AITextItem = ({ initialItem }) => {
  const [item, setItem] = useState(initialItem);
  const [currentPart, setCurrentPart] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  // Polling for status updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollItem = async () => {
      try {
        const updatedItem = await getImagesDataById(item.id);
        if (
          updatedItem &&
          updatedItem.processingStatus !== item.processingStatus
        ) {
          setItem(updatedItem);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    if (item.processingStatus === "processing") {
      intervalId = setInterval(pollItem, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [item.processingStatus, item.id]);

  // Text streaming effect
  useEffect(() => {
    if (item.processingStatus === "processed" && item.text) {
      const textToStream = item.text.join("\n");
      let index = 0;

      const intervalId = setInterval(() => {
        if (index < textToStream.length) {
          setDisplayedText(textToStream.slice(0, index + 1));
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 20);

      return () => clearInterval(intervalId);
    }
  }, [item.processingStatus, item.text]);

  if (item.processingStatus === "processing") {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-6 bg-gray-300 rounded w-1/4" />
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-2/3" />
      </div>
    );
  }

  if (item.processingStatus === "error") {
    return <div className="text-red-500">Error processing response</div>;
  }

  return (
    <div>
      {item.text.map((t: string, i: number) =>
        i % 2 === 0 ? (
          <div
            className="font-semibold text-3xl text-rose-500 dark:text-rose-400 mt-5 mb-1"
            key={i}
          >
            {t}
          </div>
        ) : (
          <ReactMarkdown key={i} className="prose dark:prose-invert max-w-none">
            {i === 1 ? displayedText : t}
          </ReactMarkdown>
        )
      )}
    </div>
  );
};

export default AITextItem;
