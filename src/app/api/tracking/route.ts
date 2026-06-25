import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const event = request.nextUrl.searchParams.get("event") || "click";

  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const supabase = createAdminClient();

  const { data: link } = await supabase
    .from("tracking_links")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });

  await supabase.from("link_events").insert({
    tracking_link_id: link.id,
    event_type: event,
    user_agent: request.headers.get("user-agent") || "",
    metadata: {},
  });

  await supabase.rpc("increment_link_clicks", { link_id: link.id });

  return NextResponse.json({ ok: true });
}
