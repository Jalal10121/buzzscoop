import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) return NextResponse.json([]);

  const files = fs.readdirSync(uploadDir).map((name) => {
    const stat = fs.statSync(path.join(uploadDir, name));
    return {
      name,
      url: `/uploads/${name}`,
      size: stat.size,
      uploadedAt: stat.mtime.toISOString(),
    };
  }).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  return NextResponse.json(files);
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const filePath = path.join(process.cwd(), "public", "uploads", name);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  return NextResponse.json({ success: true });
}