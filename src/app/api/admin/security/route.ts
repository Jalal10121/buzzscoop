import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAuditLogs } from "@/lib/security/audit-log";
import { getAllBlacklisted } from "@/lib/security/ip-blacklist";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = getAuditLogs(100);
  const blacklist = getAllBlacklisted();

  const stats = {
    totalEvents: logs.length,
    failedLogins: logs.filter((l) => l.action.includes("failed")).length,
    rateLimited: logs.filter((l) => l.action.includes("rate_limited")).length,
    successfulLogins: logs.filter((l) => l.action === "login.success").length,
    blacklistedIPs: blacklist.length,
  };

  return NextResponse.json({ stats, logs, blacklist });
}