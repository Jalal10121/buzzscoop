import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "netflix";
  const perPage = parseInt(searchParams.get("per_page") || "12");

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return NextResponse.json({ error: "UNSPLASH_ACCESS_KEY not set" }, { status: 500 });

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${key}`,
          "Accept-Version": "v1",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "Unsplash error: " + res.status, detail: err }, { status: res.status });
    }

    const data = await res.json();

    const images = (data.results || []).map((img: any) => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.small,
      full: img.urls.full,
      width: img.width,
      height: img.height,
      alt: img.alt_description || "",
      description: img.description || "",
      photographer: img.user?.name || "Unknown",
      photographerUrl: img.user?.links?.html ? img.user.links.html + "?utm_source=buzzscoop&utm_medium=referral" : "",
      sourceUrl: img.links?.html ? img.links.html + "?utm_source=buzzscoop&utm_medium=referral" : "",
      downloadLocation: img.links?.download_location,
      color: img.color,
      provider: "Unsplash",
    }));

    return NextResponse.json({ images, total: data.total, query, provider: "Unsplash" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}