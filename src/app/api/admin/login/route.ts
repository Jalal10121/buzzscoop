import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, AUTH_COOKIE } from "@/lib/auth";
import { rateLimit, getClientIP } from "@/lib/security/rate-limiter";
import { checkBruteForce, recordFailedAttempt, recordSuccess } from "@/lib/security/brute-force";
import { logAudit } from "@/lib/security/audit-log";
import { isBlacklisted } from "@/lib/security/ip-blacklist";
import { sanitizeInput } from "@/lib/security/sanitize";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIP(req.headers);

  // 1. Check IP blacklist
  if (isBlacklisted(ip)) {
    return NextResponse.json(
      { error: "Access denied" },
      { status: 403 }
    );
  }

  // 2. Rate limit (10 attempts per 15 min per IP)
  const rl = rateLimit(`login:${ip}`, { max: 10, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) {
    logAudit({ action: "login.rate_limited", ip, success: false });
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const username = sanitizeInput(body.username || "");
  const password = String(body.password || "");

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password required" },
      { status: 400 }
    );
  }

  // 3. Check brute force
  const bf = checkBruteForce(`user:${username}`);
  if (bf.locked) {
    logAudit({ action: "login.brute_force_locked", user: username, ip, success: false });
    return NextResponse.json(
      { error: `Account locked. Try again in ${bf.unlockIn}s.` },
      { status: 429 }
    );
  }

  const user = db.users.all().find((u) => u.username === username);
  if (!user) {
    recordFailedAttempt(`user:${username}`);
    logAudit({ action: "login.failed_user_not_found", user: username, ip, success: false });
    return NextResponse.json(
      { error: "Invalid credentials", attemptsLeft: bf.attemptsLeft - 1 },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    recordFailedAttempt(`user:${username}`);
    logAudit({ action: "login.failed_wrong_password", user: username, ip, success: false });
    return NextResponse.json(
      { error: "Invalid credentials", attemptsLeft: bf.attemptsLeft - 1 },
      { status: 401 }
    );
  }

  // Success
  recordSuccess(`user:${username}`);
  const token = signToken({ userId: user.id, username: user.username, role: user.role });

  logAudit({ action: "login.success", user: username, ip, success: true });

  const res = NextResponse.json({ success: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // ← stronger than "lax"
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return res;
}