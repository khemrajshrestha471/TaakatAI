import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";

const intl = createIntlMiddleware(routing);

/** Signed-in portals are NOT locale-prefixed; their language comes from the saved preference. */
const PORTAL_PREFIXES = ["/app", "/coach", "/guardian", "/super-admin"] as const;

function isPortalPath(pathname: string) {
  return PORTAL_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function proxy(request: NextRequest) {
  if (isPortalPath(request.nextUrl.pathname)) {
    // Phase 2: session + role checks and redirects happen here.
    return NextResponse.next();
  }
  // Public pages: locale detection, /en|/ne prefixing and the locale cookie.
  return intl(request);
}

export const config = {
  // Skip API routes, Next internals and files with an extension (images, icons, manifest…).
  matcher: ["/((?!api|_next|_vercel|.*\..*).*)"],
};
