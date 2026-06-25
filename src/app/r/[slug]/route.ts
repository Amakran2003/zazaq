import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: link } = await supabase
    .from("tracking_links")
    .select("id, target_url")
    .eq("slug", slug)
    .single();

  if (!link) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Record click
  await supabase.from("link_events").insert({
    tracking_link_id: link.id,
    event_type: "click",
    user_agent: request.headers.get("user-agent") || "",
    metadata: {},
  });

  await supabase.rpc("increment_link_clicks", { link_id: link.id });

  // Redirect with ref cookie
  const targetUrl = new URL(link.target_url || "/", request.url);
  targetUrl.searchParams.set("ref", slug);
  const response = NextResponse.redirect(targetUrl);
  response.cookies.set("zazaq_ref", slug, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
