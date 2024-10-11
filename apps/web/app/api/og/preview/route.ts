import { NextResponse } from "next/server";
import { getLinkPreview } from "link-preview-js";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const previewData = await getLinkPreview(url);
    return NextResponse.json(previewData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch link preview" },
      { status: 500 }
    );
  }
}
