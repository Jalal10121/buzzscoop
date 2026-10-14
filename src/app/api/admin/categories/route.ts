import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { backend } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await backend.readCategories());
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { categories } = await req.json();
  if (!Array.isArray(categories)) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  await backend.writeCategories(categories, "Update categories");
  return NextResponse.json({ success: true });
}