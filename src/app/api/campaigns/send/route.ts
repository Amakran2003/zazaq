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

  // Determine segment filter
  let query = supabase.from("contacts").select("*");
  if (campaign.segment && campaign.segment !== "all") {
    if (campaign.segment === "leads") query = query.eq("status", "lead");
    else if (campaign.segment === "prospects") query = query.eq("status", "prospect");
    else if (campaign.segment === "clients") query = query.eq("status", "client");
  }

  const { data: contacts } = await query;
  if (!contacts || contacts.length === 0) {
    return NextResponse.json({ error: "No contacts in segment" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zazaq.vercel.app";
  let sent = 0, errors = 0;

  // Detect which template is used
  const templateId = Object.keys(TEMPLATES).find(
    (k) => TEMPLATES[k as TemplateId].html === campaign.html_content
  ) as TemplateId | undefined;

  for (const contact of contacts) {
    try {
      // Generate unique tracking link for this contact+campaign
      const slug = `c-${campaignId.slice(0, 8)}-${contact.id.slice(0, 8)}-${randomUUID().slice(0, 6)}`;

      await supabase.from("tracking_links").insert({
        slug,
        name: `${campaign.name} — ${contact.email}`,
        campaign_id: campaignId,
        target_url: "/",
      });

      const pixelUrl = `${baseUrl}/api/track/open?cid=${campaignId}&uid=${contact.id}`;
      const trackingLink = `${baseUrl}/r/${slug}`;

      let subject: string, html: string;
      if (templateId) {
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
        subject = campaign.subject || campaign.name;
        html = (campaign.html_content || "")
          .replaceAll("{{prenom}}", contact.first_name || "")
          .replaceAll("{{nom}}", contact.last_name || "")
          .replaceAll("{{entreprise}}", contact.company || "")
          .replaceAll("{{lien_tracking}}", trackingLink)
          .replaceAll("{{pixel_url}}", pixelUrl);
      }

      await sendEmail({ to: contact.email, subject, html });

      await supabase.from("interactions").insert({
        contact_id: contact.id,
        type: "email_sent",
        campaign_id: campaignId,
        metadata: { subject, tracking_slug: slug },
      });

      sent++;
    } catch {
      errors++;
    }
  }

  // Update campaign stats
  await supabase.from("campaigns").update({
    status: "sent",
    sent_at: new Date().toISOString(),
    stats: { sent, opened: 0, clicked: 0, bounced: errors },
  }).eq("id", campaignId);

  return NextResponse.json({ sent, errors });
}
