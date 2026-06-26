"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TEMPLATES, type TemplateId } from "@/lib/email-templates";

type Campaign = { id: string; name: string; status: string; list_id: string; stats: Record<string, number>; sent_at: string | null };
type Step = { id: string; step_order: number; template_id: string; subject: string; delay_days: number };
type ContactStatus = {
  id: string;
  contact_id: string;
  current_step: number;
  status: string;
  opened_at: string | null;
  clicked_at: string | null;
  contacts: { email: string; first_name: string; last_name: string; company: string };
};
type OtherCampaign = { id: string; name: string };

const TABS = ["Contacts", "Emails", "Stats"] as const;
type Tab = typeof TABS[number];

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [contactStatuses, setContactStatuses] = useState<ContactStatus[]>([]);
  const [otherCampaigns, setOtherCampaigns] = useState<OtherCampaign[]>([]);
  const [tab, setTab] = useState<Tab>("Contacts");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [transferTarget, setTransferTarget] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<"all" | "sent" | "opened" | "clicked" | "no_open">("all");

  const load = async () => {
    const { data: c } = await supabase.from("campaigns").select("*").eq("id", id).single();
    if (c) setCampaign(c as Campaign);

    const { data: s } = await supabase.from("campaign_steps").select("*").eq("campaign_id", id).order("step_order");
    if (s) setSteps(s as Step[]);

    const { data: cs } = await supabase
      .from("campaign_contact_status")
      .select("*, contacts(email, first_name, last_name, company)")
      .eq("campaign_id", id)
      .order("created_at", { ascending: false });
    if (cs) setContactStatuses(cs as unknown as ContactStatus[]);

    const { data: others } = await supabase.from("campaigns").select("id, name").neq("id", id).order("created_at", { ascending: false });
    if (others) setOtherCampaigns(others);
  };

  useEffect(() => { load(); }, [id]);

  const handleSend = async () => {
    if (!confirm("Envoyer le premier email de la séquence à tous les contacts de la liste ?")) return;
    setSending(true);
    await fetch("/api/campaigns/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId: id }),
    });
    setSending(false);
    load();
  };

  const handleTransfer = async () => {
    if (!transferTarget || selected.size === 0) return;
    const contactIds = Array.from(selected);

    for (const contactId of contactIds) {
      await supabase.from("campaign_contact_status").upsert({
        campaign_id: transferTarget,
        contact_id: contactId,
        current_step: 0,
        status: "pending",
      }, { onConflict: "campaign_id,contact_id" });

      // Also add to target campaign's list
      const { data: targetCampaign } = await supabase.from("campaigns").select("list_id").eq("id", transferTarget).single();
      if (targetCampaign?.list_id) {
        await supabase.from("contact_list_members").upsert(
          { list_id: targetCampaign.list_id, contact_id: contactId },
          { onConflict: "list_id,contact_id" }
        );
      }
    }

    setSelected(new Set());
    setTransferTarget("");
    alert(`${contactIds.length} contact(s) transféré(s)`);
  };

  const toggleSelect = (contactId: string) => {
    const next = new Set(selected);
    next.has(contactId) ? next.delete(contactId) : next.add(contactId);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === filteredContacts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredContacts.map((c) => c.contact_id)));
    }
  };

  const filteredContacts = contactStatuses.filter((cs) => {
    if (filter === "all") return true;
    if (filter === "no_open") return !cs.opened_at;
    return cs.status === filter;
  });

  const stats = campaign?.stats || {};

  if (!campaign) return <div className="p-8 text-center text-slate-400">Chargement...</div>;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.push("/admin/campaigns")} className="text-xs text-slate-400 hover:text-slate-600 mb-1 inline-block">← Campagnes</button>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">{campaign.name}</h1>
          <span className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${campaign.status === "sent" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{campaign.status}</span>
        </div>
        {campaign.status === "draft" && (
          <button onClick={handleSend} disabled={sending} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{t}</button>
        ))}
      </div>

      {/* Tab: Contacts */}
      {tab === "Contacts" && (
        <div className="space-y-4">
          {/* Filters + actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1 bg-white rounded-lg border border-slate-200 p-1 text-xs">
              {([["all", "Tous"], ["sent", "Envoyé"], ["opened", "Ouvert"], ["clicked", "Cliqué"], ["no_open", "Pas ouvert"]] as const).map(([key, label]) => (
                <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filter === key ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}>{label}</button>
              ))}
            </div>
            <span className="text-xs text-slate-400">{filteredContacts.length} contact(s)</span>

            {selected.size > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600">{selected.size} sélectionné(s)</span>
                <select value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)} className="text-xs px-2 py-1.5 border border-slate-200 rounded-lg">
                  <option value="">Transférer vers...</option>
                  {otherCampaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button onClick={handleTransfer} disabled={!transferTarget} className="px-3 py-1.5 text-xs font-medium bg-accent-cyan text-white rounded-lg disabled:opacity-50">Transférer</button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-10"><input type="checkbox" checked={selected.size === filteredContacts.length && filteredContacts.length > 0} onChange={selectAll} className="rounded" /></th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Contact</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Entreprise</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Étape</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Ouvert</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Cliqué</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.length > 0 ? filteredContacts.map((cs) => (
                  <tr key={cs.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.has(cs.contact_id)} onChange={() => toggleSelect(cs.contact_id)} className="rounded" /></td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{cs.contacts?.first_name} {cs.contacts?.last_name}</p>
                      <p className="text-xs text-slate-400">{cs.contacts?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{cs.contacts?.company || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">Email {(cs.current_step || 0) + 1}/{steps.length || 1}</td>
                    <td className="px-4 py-3">
                      {cs.opened_at ? <span className="inline-flex items-center gap-1 text-xs text-cyan-700"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />Oui</span> : <span className="text-xs text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {cs.clicked_at ? <span className="inline-flex items-center gap-1 text-xs text-violet-700"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" />Oui</span> : <span className="text-xs text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${cs.status === "clicked" ? "bg-violet-50 text-violet-700" : cs.status === "opened" ? "bg-cyan-50 text-cyan-700" : cs.status === "sent" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{cs.status}</span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">{campaign.status === "draft" ? "Envoyez la campagne pour voir les contacts ici." : "Aucun contact trouvé avec ce filtre."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Emails */}
      {tab === "Emails" && (
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={step.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-0.5 text-xs font-bold text-slate-400 bg-slate-50 rounded">Email {i + 1}</span>
                {i > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-amber-700 bg-amber-50 rounded-md">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    +{step.delay_days}j après
                  </span>
                )}
                <span className="text-xs text-slate-500">{TEMPLATES[step.template_id as TemplateId]?.name || step.template_id}</span>
              </div>
              <p className="text-sm font-medium text-slate-900 mb-2">Sujet : {step.subject}</p>
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={TEMPLATES[step.template_id as TemplateId]?.html
                    .replaceAll("{{prenom}}", "Jean")
                    .replaceAll("{{nom}}", "Dupont")
                    .replaceAll("{{entreprise}}", "Cabinet XYZ")
                    .replaceAll("{{lien_tracking}}", "#")
                    .replaceAll("{{contenu}}", "")
                    .replaceAll("{{pixel_url}}", "") || ""}
                  className="w-full h-[300px] border-0"
                  title={`Email ${i + 1}`}
                />
              </div>
            </div>
          ))}
          {steps.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
              <p className="text-slate-400">Aucun email configuré dans cette campagne.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Stats */}
      {tab === "Stats" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-xs text-slate-500 uppercase font-medium mb-1">Envoyés</p>
              <p className="text-3xl font-bold text-slate-900">{stats.sent || 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-xs text-slate-500 uppercase font-medium mb-1">Ouverts</p>
              <p className="text-3xl font-bold text-accent-cyan">{stats.sent ? Math.round(((stats.opened || 0) / stats.sent) * 100) : 0}%</p>
              <p className="text-xs text-slate-400 mt-1">{stats.opened || 0} / {stats.sent || 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-xs text-slate-500 uppercase font-medium mb-1">Cliqués</p>
              <p className="text-3xl font-bold text-accent-violet">{stats.sent ? Math.round(((stats.clicked || 0) / stats.sent) * 100) : 0}%</p>
              <p className="text-xs text-slate-400 mt-1">{stats.clicked || 0} / {stats.sent || 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-xs text-slate-500 uppercase font-medium mb-1">Rebonds</p>
              <p className="text-3xl font-bold text-red-500">{stats.bounced || 0}</p>
            </div>
          </div>

          {/* Funnel visualization */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Entonnoir de conversion</h3>
            <div className="space-y-3">
              {[
                { label: "Envoyés", value: stats.sent || 0, color: "bg-slate-200" },
                { label: "Ouverts", value: stats.opened || 0, color: "bg-cyan-400" },
                { label: "Cliqués", value: stats.clicked || 0, color: "bg-violet-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-slate-500 text-right">{item.label}</span>
                  <div className="flex-1 bg-slate-50 rounded-full h-6 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${stats.sent ? (item.value / stats.sent) * 100 : 0}%` }} />
                  </div>
                  <span className="w-10 text-xs font-medium text-slate-700 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
