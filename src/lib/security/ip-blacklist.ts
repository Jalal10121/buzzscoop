import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const BLACKLIST_FILE = "ip-blacklist.json";

interface BlacklistEntry {
  ip: string;
  reason: string;
  addedAt: string;
  expiresAt?: string;
}

function readBlacklist(): BlacklistEntry[] {
  try {
    const p = path.join(DATA_DIR, BLACKLIST_FILE);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return []; }
}

function writeBlacklist(data: BlacklistEntry[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, BLACKLIST_FILE), JSON.stringify(data, null, 2));
}

export function isBlacklisted(ip: string): boolean {
  const list = readBlacklist();
  const now = Date.now();

  const entry = list.find((e) => e.ip === ip);
  if (!entry) return false;

  if (entry.expiresAt && new Date(entry.expiresAt).getTime() < now) {
    const filtered = list.filter((e) => e.ip !== ip);
    writeBlacklist(filtered);
    return false;
  }

  return true;
}

export function addToBlacklist(ip: string, reason: string, durationMs?: number): void {
  const list = readBlacklist().filter((e) => e.ip !== ip);
  list.push({
    ip,
    reason,
    addedAt: new Date().toISOString(),
    expiresAt: durationMs ? new Date(Date.now() + durationMs).toISOString() : undefined,
  });
  writeBlacklist(list);
}

export function removeFromBlacklist(ip: string): void {
  const list = readBlacklist().filter((e) => e.ip !== ip);
  writeBlacklist(list);
}

export function getAllBlacklisted(): BlacklistEntry[] {
  return readBlacklist();
}