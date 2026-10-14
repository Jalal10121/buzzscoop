import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const LOG_FILE = "audit-log.json";

interface AuditEntry {
  timestamp: string;
  action: string;
  user?: string;
  ip?: string;
  details?: Record<string, unknown>;
  success: boolean;
}

export function logAudit(entry: Omit<AuditEntry, "timestamp">): void {
  try {
    const p = path.join(DATA_DIR, LOG_FILE);
    const logs: AuditEntry[] = fs.existsSync(p)
      ? JSON.parse(fs.readFileSync(p, "utf-8"))
      : [];

    logs.unshift({
      ...entry,
      timestamp: new Date().toISOString(),
    });

    // Keep last 5000 entries
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(p, JSON.stringify(logs.slice(0, 5000), null, 2));
  } catch (err) {
    console.error("Audit log error:", err);
  }
}

export function getAuditLogs(limit = 100): AuditEntry[] {
  try {
    const p = path.join(DATA_DIR, LOG_FILE);
    if (!fs.existsSync(p)) return [];
    const logs: AuditEntry[] = JSON.parse(fs.readFileSync(p, "utf-8"));
    return logs.slice(0, limit);
  } catch { return []; }
}