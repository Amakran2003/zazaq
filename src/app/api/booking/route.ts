import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { name, email, date, slot } = await request.json();

  if (!name || !email || !date || !slot) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Get tracking source from cookie
  const refCookie = request.cookies.get("zazaq_ref")?.value;

  // Upsert contact
  const { data: contact } = await supabase
    .from("contacts")
    .upsert(
      { email, first_name: name.split(" ")[0], last_name: name.split(" ").slice(1).join(" "), source: refCookie ? "tracking_link" : "direct" },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  // Record interaction
  if (contact) {
    await supabase.from("interactions").insert({
      contact_id: contact.id,
      type: "booking",
      metadata: { date, slot, ref: refCookie },
    });
  }

  // Send confirmation email
  try {
    await resend.emails.send({
      from: "Zazaq <noreply@zazaq.fr>",
      to: email,
      subject: "Votre diagnostic Zazaq est confirmé",
      html: `
        <h2>Bonjour ${name},</h2>
        <p>Votre diagnostic gratuit est confirmé pour le <strong>${new Date(date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</strong> à <strong>${slot}</strong>.</p>
        <p>Vous recevrez un lien visio peu avant le rendez-vous.</p>
        <p>À bientôt,<br/>L'équipe Zazaq</p>
      `,
    });
  } catch {
    // Don't fail the booking if email fails
  }

  return NextResponse.json({ ok: true, contactId: contact?.id });
}
