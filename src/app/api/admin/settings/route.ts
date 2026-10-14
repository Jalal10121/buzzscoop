import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { backend } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await backend.readSettings({}));
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const current = await backend.readSettings<Record<string, unknown>>({});
  const updated = { ...current, ...body };
  await backend.writeSettings(updated, "Update settings");
  return NextResponse.json(updated);
}