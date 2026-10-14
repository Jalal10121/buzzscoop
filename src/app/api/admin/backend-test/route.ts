import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const articles = await backend.readArticles();

  return NextResponse.json({
    backendType: backend.getBackendType(),
    isGitHub: backend.isUsingGitHub(),
    articleCount: articles.length,
    environment: process.env.NODE_ENV,
    githubConfigured: !!(process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO),
  });
}