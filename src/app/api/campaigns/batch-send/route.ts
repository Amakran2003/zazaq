import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/send";
import { renderTemplate, type TemplateId, TEMPLATES } from "@/lib/email-templates";
import { randomUUID } from "crypto";

export async function POST() {
  const supabase = createAdminClient();

  // Find campaigns with active batch config
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .not("batch_config", "is", null);

  if (!campaigns) return NextResponse.json({ processed: 0 });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zazaq.vercel.app";
  let totalSent = 0;

  for (const campaign of campaigns) {
    const bc = campaign.batch_config as { size?: number; frequency_hours?: number; status?: string };
    if (bc.status !== "active") continue;

    const batchSize = bc.size || 100;

    // Get first step
    const { data: steps } = await supabase
      .from("campaign_steps")
      .select("*")
      .eq("campaign_id", campaign.id)
      .order("step_order")
      .limit(1);

    const firstStep = steps?.[0];
    if (!firstStep) continue;

    // Get contacts from list not yet in campaign_contact_status
    let contacts: { id: string; email: string; first_name: string; last_name: string; company: string }[] = [];

    if (campaign.list_id) {
      const { data: alreadySent } = await supabase
        .from("campaign_contact_status")
        .select("contact_id")
        .eq("campaign_id", campaign.id);

      const sentIds = new Set((alreadySent || []).map((s) => s.contact_id));

      const { data: members } = await supabase
        .from("contact_list_members")
        .select("contacts(id, email, first_name, last_name, company)")
        .eq("list_id", campaign.list_id);

      contacts = (members || [])
        .map((m) => m.contacts as unknown as typeof contacts[0])
        .filter((c) => c && !sentIds.has(c.id))
        .slice(0, batchSize);
    }

    if (contacts.length === 0) {
      // All contacts sent — mark campaign as done
      await supabase.from("campaigns").update({ batch_config: { ...bc, status: "completed" } }).eq("id", campaign.id);
      continue;
    }

    let sent = 0;
    for (const contact of contacts) {
      try {
        const slug = `c${campaign.id.slice(0, 6)}-${contact.id.slice(0, 6)}-${randomUUID().slice(0, 6)}`;
        await supabase.from("tracking_links").insert({ slug, name: `${campaign.name} — ${contact.email}`, campaign_id: campaign.id, target_url: "/reserver" });

        const pixelUrl = `${baseUrl}/api/track/open?cid=${campaign.id}&uid=${contact.id}`;
        const trackingLink = `${baseUrl}/r/${slug}`;

        const templateId = firstStep.template_id as TemplateId;
        let subject: string, html: string;

        if (templateId && TEMPLATES[templateId]) {
          const rendered = renderTemplate(templateId, { prenom: contact.first_name || "", nom: contact.last_name || "", entreprise: contact.company || "", lien_tracking: trackingLink, pixel_url: pixelUrl });
          subject = rendered.subject;
          html = rendered.html;
        } else {
          subject = firstStep.subject || campaign.name;
          html = (firstStep.html_content || "").replaceAll("{{prenom}}", contact.first_name || "").replaceAll("{{entreprise}}", contact.company || "").replaceAll("{{lien_tracking}}", trackingLink).replaceAll("{{pixel_url}}", pixelUrl);
        }

        await sendEmail({ to: contact.email, subject, html });

        await supabase.from("campaign_contact_status").upsert({ campaign_id: campaign.id, contact_id: contact.id, current_step: 0, status: "sent" }, { onConflict: "campaign_id,contact_id" });
        await supabase.from("interactions").insert({ contact_id: contact.id, type: "email_sent", campaign_id: campaign.id, metadata: { subject, step: 0, tracking_slug: slug } });

        sent++;
      } catch {
        // Continue with next contact
      }
    }

    // Update campaign stats
    const existingStats = (campaign.stats as Record<string, number>) || {};
    await supabase.from("campaigns").update({
      status: "active",
      stats: { ...existingStats, sent: (existingStats.sent || 0) + sent },
    }).eq("id", campaign.id);

    totalSent += sent;
  }

  return NextResponse.json({ processed: totalSent });
}
