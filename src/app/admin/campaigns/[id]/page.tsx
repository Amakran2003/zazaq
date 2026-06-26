import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SendCampaignButton } from "@/components/admin/campaigns/SendCampaignButton";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*, contact_lists(name)")
    .eq("id", id)
    .single();

  if (!campaign) notFound();

  const { data: steps } = await supabase
    .from("campaign_steps")
    .select("*")
    .eq("campaign_id", id)
    .order("step_order");

  const { data: contactStatuses } = await supabase
    .from("campaign_contact_status")
    .select("*, contacts(email, first_name, last_name)")
    .eq("campaign_id", id)
    .order("created_at", { ascending: false });

  const stats = (campaign.stats as { sent?: number; opened?: number; clicked?: number; bounced?: number }) || {};
  const openRate = stats.sent ? Math.round(((stats.opened || 0) / stats.sent) * 100) : 0;
  const clickRate = stats.sent ? Math.round(((stats.clicked || 0) / stats.sent) * 100) : 0;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/campaigns" className="text-xs text-slate-400 hover:text-slate-600 mb-2 inline-block">← Campagnes</Link>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">{campaign.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${campaign.status === "sent" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{campaign.status}</span>
            {campaign.contact_lists && <span className="text-xs text-slate-500">Liste : {(campaign.contact_lists as { name: string }).name}</span>}
          </div>
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
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium mb-1">Cliqués</p>
          <p className="text-2xl font-bold text-accent-violet">{clickRate}%</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
          <p className="text-xs text-slate-500 uppercase font-medium mb-1">Rebonds</p>
          <p className="text-2xl font-bold text-red-500">{stats.bounced || 0}</p>
        </div>
      </div>

      {/* Sequence overview */}
      {steps && steps.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Séquence ({steps.length} email{steps.length > 1 ? "s" : ""})</h2>
          <div className="flex items-center gap-2 overflow-x-auto">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                {i > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-md">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    <span className="text-[10px] text-amber-700 font-medium">{step.delay_days}j</span>
                  </div>
                )}
                <div className="flex-none px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs font-medium text-blue-800">Email {i + 1}</p>
                  <p className="text-[10px] text-blue-600 truncate max-w-[140px]">{step.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-contact status */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Statut par contact</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Contact</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Étape</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Ouvert</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Cliqué</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contactStatuses && contactStatuses.length > 0 ? contactStatuses.map((cs) => (
              <tr key={cs.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{(cs.contacts as { first_name: string; last_name: string })?.first_name} {(cs.contacts as { first_name: string; last_name: string })?.last_name}</p>
                  <p className="text-xs text-slate-400">{(cs.contacts as { email: string })?.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">Email {(cs.current_step || 0) + 1}/{steps?.length || 1}</td>
                <td className="px-4 py-3">
                  {cs.opened_at ? (
                    <span className="inline-flex items-center gap-1 text-xs text-cyan-700"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />Oui</span>
                  ) : <span className="text-xs text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  {cs.clicked_at ? (
                    <span className="inline-flex items-center gap-1 text-xs text-violet-700"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" />Oui</span>
                  ) : <span className="text-xs text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${cs.status === "sent" ? "bg-blue-50 text-blue-700" : cs.status === "opened" ? "bg-cyan-50 text-cyan-700" : cs.status === "clicked" ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"}`}>{cs.status}</span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">La campagne n&apos;a pas encore été envoyée.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
