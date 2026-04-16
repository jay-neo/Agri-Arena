"use client";

import { useState, useEffect } from "react";

interface LinkPreview {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  videoThumbnail?: string;
  type?: "website" | "video";
}

export const CustomLinkPreview = ({ link }: { link: string }) => {
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if it's a YouTube link
        const youtubeRegex =
          /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
        const isYoutube = youtubeRegex.test(link);

        if (isYoutube) {
          // Handle YouTube specifically
          const videoId = getYouTubeId(link);
          if (videoId) {
            const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            setPreview({
              title: "YouTube Video",
              description: "Click to watch on YouTube",
              videoThumbnail: thumbnail,
              type: "video",
              url: link,
            });
          } else {
            setPreview({
              title: "YouTube",
              description: "Watch videos on YouTube",
              image:
                "https://www.youtube.com/yts/img/favicon_144-vfliLAfaB.png",
              type: "website",
              url: link,
            });
          }
        } else {
          // Use a link preview API for other websites
          const response = await fetch(
            `/api/og/preview2?url=${encodeURIComponent(link)}`,
          );
          if (!response.ok) throw new Error("Failed to fetch preview");

          const data = await response.json();
          setPreview({
            title: data.title,
            description: data.description,
            image: data.image,
            url: data.url,
            type: "website",
          });
        }
      } catch (err) {
        console.error("Error fetching link preview:", err);
        setError("Failed to load preview");
        // Fallback to basic preview
        setPreview({
          title: new URL(link).hostname,
          url: link,
          type: "website",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [link]);

  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(link, "_blank");
  };

  if (loading) {
    return <div className="link-preview loading">Loading preview...</div>;
  }

  if (error) {
    return (
      <div className="link-preview error">
        <p>{error}</p>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {link}
        </a>
      </div>
    );
  }

  if (!preview) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {link}
      </a>
    );
  }

  return (
    <div
      className="link-preview"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {preview.type === "video" ? (
        <div className="video-preview">
          {preview.videoThumbnail && (
            <img
              src={preview.videoThumbnail}
              alt="Video Thumbnail"
              className="thumbnail"
              onError={(e) => {
                // Fallback to lower quality thumbnail if maxresdefault doesn't exist
                const videoId = getYouTubeId(link);
                if (videoId) {
                  (e.target as HTMLImageElement).src =
                    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }
              }}
            />
          )}
          <div className="play-button">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" fill="white" />
            </svg>
          </div>
          <div className="video-info">
            <h3>{preview.title || "YouTube Video"}</h3>
            <p>{preview.description || "Click to watch"}</p>
          </div>
        </div>
      ) : (
        <div className="website-preview">
          {preview.image && (
            <img
              src={preview.image}
              alt="Link Preview"
              className="preview-image"
            />
          )}
          <div className="preview-content">
            <h3>{preview.title || new URL(link).hostname}</h3>
            <p>{preview.description || link}</p>
            <span className="url">{preview.url || link}</span>
          </div>
        </div>
      )}
    </div>
  );
};
