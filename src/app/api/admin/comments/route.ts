import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const COMMENTS_FILE = path.join(DATA_DIR, "comments.json");

interface Comment {
  id: string;
  slug: string;
  name: string;
  email: string;
  content: string;
  status: "pending" | "approved" | "spam";
  createdAt: string;
  ip?: string;
}

function readComments(): Comment[] {
  try {
    if (!fs.existsSync(COMMENTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(COMMENTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeComments(data: Comment[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(data, null, 2));
}

// GET — all comments (for admin)
export async function GET() {
  const comments = readComments();
  return NextResponse.json(comments);
}

// PUT — update status (approve/reject/spam)
export async function PUT(req: NextRequest) {
  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  const comments = readComments();
  const comment = comments.find((c) => c.id === id);
  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  comment.status = status;
  writeComments(comments);

  return NextResponse.json({ success: true, comment });
}

// DELETE — remove comment
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const comments = readComments();
  const filtered = comments.filter((c) => c.id !== id);
  writeComments(filtered);

  return NextResponse.json({ success: true });
}