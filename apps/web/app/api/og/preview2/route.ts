import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    console.log(url);
    const isYouTubeVideo = isYouTubeURL(url);
    if (isYouTubeVideo) {
      const videoId = extractYouTubeVideoId(url);
      const videoThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const response = {
        type: "video",
        videoId: videoId,
        videoThumbnail: videoThumbnail,
      };
      return NextResponse.json(response);
    } else {
      const data = await (await fetch(url)).text();
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

      const response = {
        type: "webpage",
        title: title,
        description: description,
        image: image,
      };
      return NextResponse.json(response);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch link preview" },
      { status: 500 }
    );
  }
}

const isYouTubeURL = (link: string) => {
  return link.includes("youtube.com") || link.includes("youtu.be");
};

const extractYouTubeVideoId = (link: string) => {
  const videoIdRegex =
    /(?:\/embed\/|\/watch\?v=|\/(?:embed\/|v\/|watch\?.*v=|youtu\.be\/|embed\/|v=))([^&?#]+)/;
  const match = link.match(videoIdRegex);
  return match ? match[1] : "";
};
