import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "netflix";
  const perPage = parseInt(searchParams.get("per_page") || "12");

  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    return NextResponse.json({
      error: "PEXELS_API_KEY not set in .env.local",
      setup: "Add PEXELS_API_KEY=your_key to .env.local and restart server",
    }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: { Authorization: key },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        return NextResponse.json({ error: "Invalid Pexels API Key" }, { status: 401 });
      }
      if (res.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded (200/hour)" }, { status: 429 });
      }
      return NextResponse.json({ error: "Pexels error: " + res.status }, { status: res.status });
    }

    const data = await res.json();

    const images = (data.photos || []).map((img: any) => ({
      id: img.id,
      url: img.src.large,
      thumb: img.src.small,
      full: img.src.original,
      width: img.width,
      height: img.height,
      alt: img.alt || "Image",
      description: img.alt || "",
      photographer: img.photographer || "Unknown",
      photographerUrl: img.photographer_url || "",
      sourceUrl: img.url,
      color: img.avg_color,
      provider: "Pexels",
    }));

    return NextResponse.json({ images, total: data.total_results, query });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}