import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const cid = request.nextUrl.searchParams.get("cid");
  const uid = request.nextUrl.searchParams.get("uid");
  const url = request.nextUrl.searchParams.get("url") || "/";

  if (cid && uid) {
    try {
      const supabase = createAdminClient();

      await supabase.from("interactions").insert({
        contact_id: uid,
        type: "link_clicked",
        campaign_id: cid,
        metadata: { url, user_agent: request.headers.get("user-agent") || "" },
      });

      // Update campaign stats
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("stats")
        .eq("id", cid)
        .single();

      if (campaign) {
        const stats = (campaign.stats as Record<string, number>) || {};
        await supabase.from("campaigns").update({
          stats: { ...stats, clicked: (stats.clicked || 0) + 1 },
        }).eq("id", cid);
      }
    } catch {
      // Don't fail the redirect
    }
  }

  return NextResponse.redirect(new URL(url, request.url));
}
