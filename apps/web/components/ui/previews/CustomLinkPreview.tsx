"use client";

import { useState, useEffect } from "react";

export const CustomLinkPreview = ({ link }: { link: string }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async (url: string) => {
      try {
        const response = await fetch(
          `/api/og/preview2?url=${encodeURIComponent(url)}`
        );
        const data = await response.json();
        setPreview(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })(link);
  }, [link]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!preview) {
    return <p>Failed to fetch link preview.</p>;
  }

  const handleClick = () => {
    window.open(link, "_blank");
  };

  if (preview.type === "video") {
    return (
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        <img src={preview.videoThumbnail} alt="Video Thumbnail" />
      </div>
    );
  }

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <h3>{preview.title}</h3>
      <p>{preview.description}</p>
      {preview.image && <img src={preview.image} alt="Link Preview" />}
    </div>
  );
};
