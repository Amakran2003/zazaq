import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const { type, data } = payload;

  if (!type || !data) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const email = data.to?.[0] || data.email;
  if (!email) return NextResponse.json({ ok: true });

  const { data: contact } = await supabase
    .from("contacts")
    .select("id")
    .eq("email", email)
    .single();

  if (!contact) return NextResponse.json({ ok: true });

  const eventMap: Record<string, string> = {
    "email.delivered": "email_delivered",
    "email.opened": "email_opened",
    "email.clicked": "link_clicked",
    "email.bounced": "email_bounced",
  };

  const interactionType = eventMap[type];
  if (interactionType) {
    await supabase.from("interactions").insert({
      contact_id: contact.id,
      type: interactionType,
      metadata: { resend_event: type, ...data },
    });
  }

  return NextResponse.json({ ok: true });
}
