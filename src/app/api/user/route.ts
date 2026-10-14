import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = "readers.json";
const SECRET = process.env.JWT_SECRET || "buzzscoop-secret-change-me";

interface Reader {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

function readUsers(): Reader[] {
  try {
    const p = path.join(DATA_DIR, USERS_FILE);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return []; }
}

function writeUsers(data: Reader[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, USERS_FILE), JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  if (action === "signup") {
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const users = readUsers();
    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: Reader = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    const token = jwt.sign({ userId: newUser.id, email, name }, SECRET, { expiresIn: "30d" });
    const res = NextResponse.json({ success: true, user: { id: newUser.id, name, email } });
    res.cookies.set("buzzscoop-reader", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  }

  if (action === "signin") {
    const { email, password } = body;
    const users = readUsers();
    const user = users.find((u) => u.email === email);
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ userId: user.id, email, name: user.name }, SECRET, { expiresIn: "30d" });
    const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email } });
    res.cookies.set("buzzscoop-reader", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  }

  if (action === "logout") {
    const res = NextResponse.json({ success: true });
    res.cookies.set("buzzscoop-reader", "", { maxAge: 0, path: "/" });
    return res;
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}