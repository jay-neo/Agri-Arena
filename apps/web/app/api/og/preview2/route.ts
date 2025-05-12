import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url || typeof url !== "string") {
    return Response.json({ error: "URL is required" });
  }

  try {
    const apiKey = process.env.LINKPREVIEW_API_KEY;
    const apiUrl = `https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(url)}`;

    const response = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`,
    );
    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching link preview:", error);
    return Response.json({ error: "Failed to fetch link preview" });
  }
}
