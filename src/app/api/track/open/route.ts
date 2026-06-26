import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PIXEL = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

export async function GET(request: NextRequest) {
  const cid = request.nextUrl.searchParams.get("cid");
  const uid = request.nextUrl.searchParams.get("uid");

  if (cid && uid) {
    try {
      const supabase = createAdminClient();

      await supabase.from("interactions").insert({
        contact_id: uid,
        type: "email_opened",
        campaign_id: cid,
        metadata: { user_agent: request.headers.get("user-agent") || "" },
      });

      const { data: campaign } = await supabase
        .from("campaigns")
        .select("stats")
        .eq("id", cid)
        .single();

      if (campaign) {
        const stats = (campaign.stats as Record<string, number>) || {};
        await supabase.from("campaigns").update({
          stats: { ...stats, opened: (stats.opened || 0) + 1 },
        }).eq("id", cid);
      }

      // Update per-contact status
      await supabase.from("campaign_contact_status").update({
        status: "opened",
        opened_at: new Date().toISOString(),
      }).eq("campaign_id", cid).eq("contact_id", uid);
    } catch {
      // Don't fail the pixel
    }
  }

  return new NextResponse(PIXEL, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
