import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "editor" | "writer";
  name: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = "users.json";

function readUsers(): User[] {
  try {
    const p = path.join(DATA_DIR, USERS_FILE);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return []; }
}

function writeUsers(data: User[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, USERS_FILE), JSON.stringify(data, null, 2));
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = readUsers().map(({ password, ...u }) => u);
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, password, role, name } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const users = readUsers();
  if (users.find((u) => u.username === username)) {
    return NextResponse.json({ error: "Username already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    role: role || "writer",
    name: name || username,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  const { password: _, ...safeUser } = newUser;
  return NextResponse.json(safeUser);
}

export async function DELETE(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const users = readUsers().filter((u) => u.id !== id);
  writeUsers(users);
  return NextResponse.json({ success: true });
}