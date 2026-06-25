import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Tracking: detect ?ref= parameter and store in cookie
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref) {
    const response = await updateSession(request);
    response.cookies.set("zazaq_ref", ref, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    // Fire tracking event via API (non-blocking)
    const trackingUrl = new URL("/api/tracking", request.url);
    trackingUrl.searchParams.set("slug", ref);
    trackingUrl.searchParams.set("event", "click");
    fetch(trackingUrl.toString()).catch(() => {});

    return response;
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|og-image.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
