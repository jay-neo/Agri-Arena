"use client";

import React, { useEffect, useState } from "react";
import { getLinkPreview } from "link-preview-js";

interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image: string;
}

export const LinkPreview: React.FC<{ link: string }> = ({ link }) => {
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPreview(url: string) {
      try {
        const response = await fetch(
          `/api/og/preview?url=${encodeURIComponent(url)}`
        );
        const data = await response.json();
        setPreview(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching link preview:", error);
        setLoading(false);
      }
    }

    if (link) {
      fetchPreview(link);
    }
  }, [link]);

  //   useEffect(() => {
  //     getLinkPreview(link)
  //       .then((data: any) => {
  //         console.log(data);
  //         setPreview({
  //           url: data.url,
  //           title: data.title,
  //           description: data.description,
  //           image: data.images[0],
  //         });
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching link preview:", error);
  //         setLoading(false);
  //       });
  //   }, [link]);

  const isYouTubeURL = (link: string) => {
    return link.includes("youtube.com") || link.includes("youtu.be");
  };

  const extractYouTubeVideoId = (link: string) => {
    const videoIdRegex =
      /(?:\/embed\/|\/watch\?v=|\/(?:embed\/|v\/|watch\?.*v=|youtu\.be\/|embed\/|v=))([^&?#]+)/;
    const match = link.match(videoIdRegex);
    return match ? match[1] : "";
  };

  if (loading) return <p>Loading preview...</p>;
  if (!preview) return <p>Failed to preview</p>;

  return (
    <a href={preview.url} target="_blank" rel="noopener noreferrer">
      <div className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition">
        <img
          src={preview.image}
          alt={preview.title}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="text-lg font-bold mt-2">{preview.title}</h2>
        <p>{preview.description}</p>
      </div>
    </a>
  );
};
