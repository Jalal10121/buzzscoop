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

// Simple HTML escape
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// GET — fetch approved comments for a slug
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const all = searchParams.get("all");

  const comments = readComments();

  if (all === "true") {
    return NextResponse.json(comments);
  }

  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const filtered = comments
    .filter((c) => c.slug === slug && c.status === "approved")
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return NextResponse.json(filtered);
}

// POST — submit new comment
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, name, email, content } = body;

  // Validation
  if (!slug || !name || !content) {
    return NextResponse.json({ error: "Name and content required" }, { status: 400 });
  }

  if (name.length < 2 || name.length > 50) {
    return NextResponse.json({ error: "Name must be 2-50 characters" }, { status: 400 });
  }

  if (content.length < 5 || content.length > 2000) {
    return NextResponse.json({ error: "Comment must be 5-2000 characters" }, { status: 400 });
  }

  // Get IP for rate limit
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const comments = readComments();

  // Rate limit: max 3 comments per IP in 5 min
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const recentFromIP = comments.filter(
    (c) => c.ip === ip && new Date(c.createdAt).getTime() > fiveMinAgo
  );

  if (recentFromIP.length >= 3) {
    return NextResponse.json({ error: "Too many comments. Wait a few minutes." }, { status: 429 });
  }

  const newComment: Comment = {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
    slug,
    name: escapeHTML(name.trim()),
    email: escapeHTML((email || "").trim()),
    content: escapeHTML(content.trim()),
    status: "pending",
    createdAt: new Date().toISOString(),
    ip,
  };

  comments.push(newComment);
  writeComments(comments);

  return NextResponse.json({
    success: true,
    message: "Comment submitted! It will appear after moderation.",
  });
}

// PUT — approve/reject (admin only, requires auth)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  const comments = readComments();
  const comment = comments.find((c) => c.id === id);
  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  comment.status = status;
  writeComments(comments);

  return NextResponse.json({ success: true });
}

// DELETE — remove comment (admin only)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const comments = readComments();
  const filtered = comments.filter((c) => c.id !== id);
  writeComments(filtered);

  return NextResponse.json({ success: true });
}