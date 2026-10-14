/**
 * GitHub API Backend Client
 * Uses GitHub as the database — free, fast, auto-deploy
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

interface GitHubFileResponse {
  content: string;
  sha: string;
}

const API_BASE = "https://api.github.com";

async function ghFetch(path: string, options: RequestInit = {}) {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "BuzzScoop-CMS",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  return res;
}

export async function readFile(filePath: string): Promise<{ content: string; sha: string } | null> {
  const res = await ghFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);

  const data: GitHubFileResponse = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

export async function writeFile(
  filePath: string,
  content: string,
  message: string
): Promise<void> {
  const existing = await readFile(filePath);

  const body: Record<string, unknown> = {
    message: message || `Update ${filePath}`,
    content: Buffer.from(content).toString("base64"),
    branch: GITHUB_BRANCH,
  };

  if (existing) body.sha = existing.sha;

  const res = await ghFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed: ${res.status} — ${err}`);
  }
}

export async function readJSON<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const file = await readFile(filePath);
    if (!file) return fallback;
    return JSON.parse(file.content);
  } catch (err) {
    console.error(`readJSON error (${filePath}):`, err);
    return fallback;
  }
}

export async function writeJSON(filePath: string, data: unknown, message?: string): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2), message || `Update ${filePath}`);
}

export function isGitHubConfigured(): boolean {
  return !!(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);
}