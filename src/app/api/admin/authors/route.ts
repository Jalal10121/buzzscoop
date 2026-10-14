import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { backend } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await backend.readAuthors());
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { authors } = await req.json();
  if (!Array.isArray(authors)) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  await backend.writeAuthors(authors, "Update authors");
  return NextResponse.json({ success: true });
}