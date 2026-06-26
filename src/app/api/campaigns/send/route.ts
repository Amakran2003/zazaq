import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { renderTemplate, type TemplateId, TEMPLATES } from "@/lib/email-templates";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const { campaignId } = await request.json();
  if (!campaignId) return NextResponse.json({ error: "Missing campaignId" }, { status: 400 });

  const supabase = createAdminClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

  // Get first step of the sequence
  const { data: steps } = await supabase
    .from("campaign_steps")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("step_order");

  const firstStep = steps?.[0];
  if (!firstStep) return NextResponse.json({ error: "No steps in campaign" }, { status: 400 });

  // Get contacts from the campaign's list
  let contacts: { id: string; email: string; first_name: string; last_name: string; company: string }[] = [];

  if (campaign.list_id) {
    const { data: members } = await supabase
      .from("contact_list_members")
      .select("contacts(id, email, first_name, last_name, company)")
      .eq("list_id", campaign.list_id);

    contacts = (members || []).map((m) => m.contacts as unknown as typeof contacts[0]).filter(Boolean);
  } else {
    const { data } = await supabase.from("contacts").select("id, email, first_name, last_name, company");
    contacts = data || [];
  }

  if (contacts.length === 0) {
    return NextResponse.json({ error: "No contacts in list" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zazaq.vercel.app";
  let sent = 0, errors = 0;

  for (const contact of contacts) {
    try {
      // Auto-generate unique tracking link
      const slug = `c${campaignId.slice(0, 6)}-${contact.id.slice(0, 6)}-${randomUUID().slice(0, 6)}`;

      await supabase.from("tracking_links").insert({
        slug,
        name: `${campaign.name} — ${contact.email}`,
        campaign_id: campaignId,
        target_url: "/reserver",
      });

      const pixelUrl = `${baseUrl}/api/track/open?cid=${campaignId}&uid=${contact.id}`;
      const trackingLink = `${baseUrl}/r/${slug}`;

      const templateId = firstStep.template_id as TemplateId;
      let subject: string, html: string;

      if (templateId && TEMPLATES[templateId]) {
        const rendered = renderTemplate(templateId, {
          prenom: contact.first_name || "",
          nom: contact.last_name || "",
          entreprise: contact.company || "",
          lien_tracking: trackingLink,
          pixel_url: pixelUrl,
        });
        subject = rendered.subject;
        html = rendered.html;
      } else {
        subject = firstStep.subject || campaign.name;
        html = (firstStep.html_content || "")
          .replaceAll("{{prenom}}", contact.first_name || "")
          .replaceAll("{{entreprise}}", contact.company || "")
          .replaceAll("{{lien_tracking}}", trackingLink)
          .replaceAll("{{pixel_url}}", pixelUrl);
      }

      await sendEmail({ to: contact.email, subject, html });

      // Track per-contact status
      await supabase.from("campaign_contact_status").upsert({
        campaign_id: campaignId,
        contact_id: contact.id,
        current_step: 0,
        status: "sent",
      }, { onConflict: "campaign_id,contact_id" });

      await supabase.from("interactions").insert({
        contact_id: contact.id,
        type: "email_sent",
        campaign_id: campaignId,
        metadata: { subject, step: 0, tracking_slug: slug },
      });

      sent++;
    } catch {
      errors++;
    }
  }

  await supabase.from("campaigns").update({
    status: "sent",
    sent_at: new Date().toISOString(),
    stats: { sent, opened: 0, clicked: 0, bounced: errors },
  }).eq("id", campaignId);

  return NextResponse.json({ sent, errors });
}
