import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

  const results: Record<string, unknown> = {};

  try {
    const creds = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_B64!, "base64").toString()
    );
    const jwt = new google.auth.JWT(
      creds.client_email,
      undefined,
      creds.private_key,
      ["https://www.googleapis.com/auth/indexing"]
    );
    const auth = await jwt.authorize();
    const res = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`,
        },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
      }
    );
    results.google = await res.json();
  } catch (e) {
    results.google = { error: (e as Error).message };
  }

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "buzzscoop.news",
        key: process.env.INDEXNOW_KEY,
        keyLocation: `https://buzzscoop.news/${process.env.INDEXNOW_KEY}.txt`,
        urlList: [url],
      }),
    });
    results.indexnow = { status: res.status };
  } catch (e) {
    results.indexnow = { error: (e as Error).message };
  }

  return NextResponse.json(results);
}