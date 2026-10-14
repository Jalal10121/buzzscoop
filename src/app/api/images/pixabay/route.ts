import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "netflix";
  const perPage = parseInt(searchParams.get("per_page") || "12");

  const key = process.env.PIXABAY_API_KEY;
  if (!key) return NextResponse.json({ error: "PIXABAY_API_KEY not set" }, { status: 500 });

  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=${perPage}&safesearch=true`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Pixabay error: " + res.status }, { status: res.status });
    }

    const data = await res.json();

    const images = (data.hits || []).map((img: any) => ({
      id: img.id,
      url: img.webformatURL,
      thumb: img.previewURL,
      full: img.largeImageURL,
      width: img.imageWidth,
      height: img.imageHeight,
      alt: img.tags || "",
      description: img.tags || "",
      photographer: img.user || "Unknown",
      photographerUrl: "https://pixabay.com/users/" + (img.user || "") + "-" + img.user_id,
      sourceUrl: img.pageURL,
      provider: "Pixabay",
    }));

    return NextResponse.json({ images, total: data.totalHits, query, provider: "Pixabay" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}