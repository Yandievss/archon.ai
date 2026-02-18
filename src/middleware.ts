import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const e2e = process.env.NEXT_PUBLIC_E2E === "true" || process.env.E2E === "true";
  const { pathname } = req.nextUrl;

  if (!e2e) return NextResponse.next();

  // Provide simple stub responses for API routes during E2E runs to avoid 503s.
  if (pathname.startsWith("/api")) {
    if (req.method === "GET") {
      return NextResponse.json({ e2e: true, path: pathname, data: [] });
    }
    if (req.method === "POST") {
      return NextResponse.json({ e2e: true, path: pathname, ok: true });
    }
    return NextResponse.json({ e2e: true, path: pathname });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
