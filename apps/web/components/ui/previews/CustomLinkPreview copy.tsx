"use client";

import { useState, useEffect } from "react";

export const CustomLinkPreview = ({ link }: { link: string }) => {
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(link);
        const data = await response.text();

        const isYouTubeVideo = isYouTubeURL(link);
        if (isYouTubeVideo) {
          const videoId = extractYouTubeVideoId(link);
          const videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

          setPreviewData({
            videoId,
            videoThumbnail,
          });
          setLoading(false);
        } else {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, "text/html");
          const title = doc.querySelector("title")?.textContent || "";
          const description =
            doc
              .querySelector('meta[name="description"]')
              ?.getAttribute("content") || "";
          const image =
            doc
              .querySelector('meta[property="og:image"]')
              ?.getAttribute("content") || "";

          setPreviewData({
            title,
            description,
            image,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [link]);

  const isYouTubeURL = (link) => {
    return link.includes("youtube.com") || link.includes("youtu.be");
  };

  const extractYouTubeVideoId = (link) => {
    const videoIdRegex =
      /(?:\/embed\/|\/watch\?v=|\/(?:embed\/|v\/|watch\?.*v=|youtu\.be\/|embed\/|v=))([^&?#]+)/;
    const match = link.match(videoIdRegex);
    return match ? match[1] : "";
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!previewData) {
    return <p>Failed to fetch link preview.</p>;
  }

  const handleClick = () => {
    window.open(link, "_blank");
  };

  if (previewData.videoId) {
    return (
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        <img src={previewData.videoThumbnail} alt="Video Thumbnail" />
      </div>
    );
  }

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <h3>{previewData.title}</h3>
      <p>{previewData.description}</p>
      {previewData.image && <img src={previewData.image} alt="Link Preview" />}
    </div>
  );
};
