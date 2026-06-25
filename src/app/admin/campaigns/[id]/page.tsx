import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SendCampaignButton } from "@/components/admin/campaigns/SendCampaignButton";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (!campaign) notFound();

  const stats = (campaign.stats as { sent?: number; opened?: number; clicked?: number; bounced?: number }) || {};
  const openRate = stats.sent ? Math.round(((stats.opened || 0) / stats.sent) * 100) : 0;
  const clickRate = stats.sent ? Math.round(((stats.clicked || 0) / stats.sent) * 100) : 0;

  // Get interactions for this campaign
  const { data: interactions } = await supabase
    .from("interactions")
    .select("*, contacts(email, first_name, last_name)")
    .eq("campaign_id", id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/campaigns" className="text-xs text-slate-400 hover:text-slate-600 mb-2 inline-block">← Campagnes</Link>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">{campaign.name}</h1>
          <p className="text-sm text-slate-500 mt-1">Sujet : {campaign.subject}</p>
        </div>
        {campaign.status === "draft" && <SendCampaignButton campaignId={id} />}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium mb-1">Envoyés</p>
          <p className="text-2xl font-bold text-slate-900">{stats.sent || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium mb-1">Ouverts</p>
          <p className="text-2xl font-bold text-accent-cyan">{openRate}%</p>
          <p className="text-xs text-slate-400">{stats.opened || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium mb-1">Cliqués</p>
          <p className="text-2xl font-bold text-accent-violet">{clickRate}%</p>
          <p className="text-xs text-slate-400">{stats.clicked || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium mb-1">Rebonds</p>
          <p className="text-2xl font-bold text-red-500">{stats.bounced || 0}</p>
        </div>
      </div>

      {/* Recipients activity */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Activité des destinataires</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Contact</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Événement</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {interactions && interactions.length > 0 ? interactions.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">
                  {i.contacts ? `${i.contacts.first_name} ${i.contacts.last_name}` : "—"}
                  <span className="block text-xs text-slate-400">{i.contacts?.email}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${i.type === "email_opened" ? "bg-cyan-50 text-cyan-700" : i.type === "link_clicked" ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"}`}>
                    {i.type.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{new Date(i.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
              </tr>
            )) : (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-400">Aucune activité enregistrée.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
