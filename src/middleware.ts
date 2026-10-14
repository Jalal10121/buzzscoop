import { NextRequest, NextResponse } from "next/server";

const BLOCKED_UAS = [
  "sqlmap", "nikto", "nmap", "masscan", "acunetix", "nessus",
  "havij", "fimap", "w3af", "dirbuster", "gobuster", "wfuzz",
  "hydra", "zgrab", "python-requests", "curl/", "wget/", "scrapy",
];

const BLOCKED_PATHS = [
  "/wp-admin", "/wp-login.php", "/xmlrpc.php", "/.env", "/.git",
  "/phpMyAdmin", "/adminer", "/.aws/credentials", "/.ssh",
  "/wp-content", "/wp-includes", "/config.php", "/.htaccess",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ua = req.headers.get("user-agent")?.toLowerCase() || "";

  if (BLOCKED_UAS.some((blocked) => ua.includes(blocked))) {
    return new NextResponse("Blocked", { status: 403 });
  }

  if (BLOCKED_PATHS.some((p) => pathname.toLowerCase().startsWith(p))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (pathname === "/admin") {
    return new NextResponse(
      `<!DOCTYPE html><html><head><title>404</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h1>404</h1><p>This page could not be found.</p></body></html>`,
      { status: 404, headers: { "Content-Type": "text/html" } }
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-Request-ID", crypto.randomUUID());
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2)$).*)",
  ],
};