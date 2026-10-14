import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const p = path.join(DATA_DIR, "subscribers.json");
    if (!fs.existsSync(p)) return NextResponse.json([]);
    return NextResponse.json(JSON.parse(fs.readFileSync(p, "utf-8")));
  } catch { return NextResponse.json([]); }
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const p = path.join(DATA_DIR, "subscribers.json");
  const subs: Subscriber[] = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : [];

  if (subs.find((s) => s.email === email)) {
    return NextResponse.json({ success: true, message: "Already subscribed" });
  }

  subs.push({
    id: Date.now().toString(),
    email,
    subscribedAt: new Date().toISOString(),
  });

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(subs, null, 2));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const p = path.join(DATA_DIR, "subscribers.json");
  const subs = (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : [])
    .filter((s: Subscriber) => s.id !== id);
  fs.writeFileSync(p, JSON.stringify(subs, null, 2));
  return NextResponse.json({ success: true });
}