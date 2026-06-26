"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TEMPLATES, type TemplateId } from "@/lib/email-templates";
import type { Node } from "@xyflow/react";

type Campaign = { id: string; name: string; status: string; list_id: string; stats: Record<string, number>; workflow_json: unknown; batch_config: Record<string, unknown> };
type ContactStatus = {
  id: string; contact_id: string; current_step: number; status: string;
  opened_at: string | null; clicked_at: string | null;
  contacts: { email: string; first_name: string; last_name: string; company: string };
};
type ListContact = {
  id: string; email: string; first_name: string; last_name: string; company: string; phone: string;
  campaign_status?: string; opened_at?: string | null; clicked_at?: string | null; current_step?: number;
};
type ContactList = { id: string; name: string };
type Step = { id: string; step_order: number; template_id: string; subject: string; delay_days: number };

const STATUS_OPTIONS = [
  { key: "all", label: "Tous" },
  { key: "en_attente", label: "En attente" },
  { key: "contacte", label: "Contacté" },
  { key: "ouvert", label: "Ouvert" },
  { key: "clique", label: "Cliqué" },
  { key: "repondu", label: "Répondu" },
  { key: "relance", label: "Relancé" },
  { key: "refuse", label: "Refusé" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  en_attente: "bg-slate-100 text-slate-600",
  contacte: "bg-blue-50 text-blue-700",
  ouvert: "bg-cyan-50 text-cyan-700",
  clique: "bg-violet-50 text-violet-700",
  repondu: "bg-emerald-50 text-emerald-700",
  relance: "bg-amber-50 text-amber-700",
  refuse: "bg-red-50 text-red-700",
};

const TABS = ["Pipeline", "Emails", "Contacts", "Stats"] as const;
type Tab = typeof TABS[number];

type PipelineStep = {
  id: string;
  type: "email" | "attente" | "condition" | "action";
  label: string;
  config: Record<string, string | number>;
};

const STEP_TYPES = [
  { type: "email", label: "Email", icon: "✉️", defaultLabel: "Envoyer email", defaultConfig: { template: "premier_contact" } },
  { type: "attente", label: "Attente", icon: "⏳", defaultLabel: "Attendre 3 jours", defaultConfig: { days: 3 } },
  { type: "condition", label: "Condition", icon: "🔀", defaultLabel: "Si ouvert", defaultConfig: { condition: "opened" } },
  { type: "action", label: "Action", icon: "⚡", defaultLabel: "Transférer", defaultConfig: { action: "transfer" } },
] as const;

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [tab, setTab] = useState<Tab>("Pipeline");
  const [contactStatuses, setContactStatuses] = useState<ContactStatus[]>([]);
  const [listContacts, setListContacts] = useState<ListContact[]>([]);
  const [availableLists, setAvailableLists] = useState<ContactList[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [otherCampaigns, setOtherCampaigns] = useState<{ id: string; name: string }[]>([]);

  // Pipeline state
  const [pipeline, setPipeline] = useState<PipelineStep[]>([]);
  const [saving, setSaving] = useState(false);

  // Contacts state
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [transferTarget, setTransferTarget] = useState("");

  // Batch config
  const [batchSize, setBatchSize] = useState(100);
  const [batchFrequency, setBatchFrequency] = useState(24);
  const [batchStatus, setBatchStatus] = useState("paused");
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Email editor
  const [editingStep, setEditingStep] = useState<number | null>(null);

  const load = async () => {
    const { data: c } = await supabase.from("campaigns").select("*").eq("id", id).single();
    if (c) {
      setCampaign(c as unknown as Campaign);
      const wf = c.workflow_json;
      if (Array.isArray(wf) && wf.length > 0 && wf[0]?.type) {
        setPipeline(wf as PipelineStep[]);
      } else if (wf && typeof wf === "object" && "nodes" in (wf as object)) {
        const old = wf as { nodes?: Node[] };
        if (old.nodes) {
          setPipeline(old.nodes.map((n) => ({ id: n.id, type: (n.type === "wait" ? "attente" : n.type || "email") as PipelineStep["type"], label: (n.data as { label?: string })?.label || "", config: {} })));
        }
      }
      const bc = c.batch_config as Record<string, unknown>;
      if (bc) {
        setBatchSize((bc.size as number) || 100);
        setBatchFrequency((bc.frequency_hours as number) || 24);
        setBatchStatus((bc.status as string) || "paused");
      }

      // Load contacts from linked list
      if (c.list_id) {
        const { data: members } = await supabase
          .from("contact_list_members")
          .select("contacts(id, email, first_name, last_name, company, phone)")
          .eq("list_id", c.list_id);
        
        const { data: statuses } = await supabase
          .from("campaign_contact_status")
          .select("*")
          .eq("campaign_id", id);

        const statusMap = new Map<string, ContactStatus>();
        if (statuses) statuses.forEach((s) => statusMap.set(s.contact_id, s as unknown as ContactStatus));

        if (members) {
          const contacts: ListContact[] = members
            .map((m) => m.contacts as unknown as ListContact)
            .filter(Boolean)
            .map((contact) => {
              const st = statusMap.get(contact.id);
              return {
                ...contact,
                campaign_status: st?.status || "en_attente",
                opened_at: st?.opened_at || null,
                clicked_at: st?.clicked_at || null,
                current_step: st?.current_step || 0,
              };
            });
          setListContacts(contacts);
        }
      }
    }

    const { data: s } = await supabase.from("campaign_steps").select("*").eq("campaign_id", id).order("step_order");
    if (s) setSteps(s as Step[]);

    const { data: cs } = await supabase
      .from("campaign_contact_status")
      .select("*, contacts(email, first_name, last_name, company)")
      .eq("campaign_id", id)
      .order("created_at", { ascending: false });
    if (cs) setContactStatuses(cs as unknown as ContactStatus[]);

    const { data: others } = await supabase.from("campaigns").select("id, name").neq("id", id);
    if (others) setOtherCampaigns(others);

    const { data: allLists } = await supabase.from("contact_lists").select("id, name").order("name");
    if (allLists) setAvailableLists(allLists);
  };

  useEffect(() => { load(); }, [id]);

  // --- Pipeline ---
  const addPipelineStep = (type: PipelineStep["type"]) => {
    const def = STEP_TYPES.find((s) => s.type === type)!;
    setPipeline([...pipeline, { id: `${type}-${Date.now()}`, type, label: def.defaultLabel, config: { ...def.defaultConfig } }]);
  };

  const updatePipelineStep = (idx: number, field: string, value: string | number) => {
    setPipeline(pipeline.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const updatePipelineConfig = (idx: number, key: string, value: string | number) => {
    setPipeline(pipeline.map((s, i) => i === idx ? { ...s, config: { ...s.config, [key]: value } } : s));
  };

  const removePipelineStep = (idx: number) => {
    setPipeline(pipeline.filter((_, i) => i !== idx));
  };

  const movePipelineStep = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= pipeline.length) return;
    const arr = [...pipeline];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setPipeline(arr);
  };

  const savePipeline = async () => {
    setSaving(true);
    await supabase.from("campaigns").update({ workflow_json: pipeline }).eq("id", id);
    setSaving(false);
  };

  // --- Emails ---
  const addStep = () => {
    const newStep: Step = { id: `new-${Date.now()}`, step_order: steps.length, template_id: "relance", subject: TEMPLATES.relance.subject, delay_days: 3 };
    setSteps([...steps, newStep]);
  };

  const updateStep = (idx: number, field: keyof Step, value: string | number) => {
    setSteps(steps.map((s, i) => {
      if (i !== idx) return s;
      const updated = { ...s, [field]: value };
      if (field === "template_id") updated.subject = TEMPLATES[value as TemplateId]?.subject || updated.subject;
      return updated;
    }));
  };

  const removeStep = (idx: number) => { if (steps.length > 1) setSteps(steps.filter((_, i) => i !== idx)); };

  const saveSteps = async () => {
    setSaving(true);
    await supabase.from("campaign_steps").delete().eq("campaign_id", id);
    const data = steps.map((s, i) => ({
      campaign_id: id, step_order: i, template_id: s.template_id,
      subject: s.subject, html_content: TEMPLATES[s.template_id as TemplateId]?.html || "", delay_days: s.delay_days,
    }));
    await supabase.from("campaign_steps").insert(data);
    setSaving(false);
    load();
  };

  // --- Contacts ---
  const filteredContacts = listContacts.filter((c) => {
    if (filter === "all") return true;
    return c.campaign_status === filter;
  });

  const toggleSelect = (cid: string) => {
    const next = new Set(selected);
    next.has(cid) ? next.delete(cid) : next.add(cid);
    setSelected(next);
  };

  const selectAll = () => {
    selected.size === filteredContacts.length ? setSelected(new Set()) : setSelected(new Set(filteredContacts.map((c) => c.id)));
  };

  const handleTransfer = async () => {
    if (!transferTarget || selected.size === 0) return;
    for (const cid of Array.from(selected)) {
      await supabase.from("campaign_contact_status").upsert({ campaign_id: transferTarget, contact_id: cid, current_step: 0, status: "en_attente" }, { onConflict: "campaign_id,contact_id" });
    }
    setSelected(new Set());
    setTransferTarget("");
    alert(`${selected.size} contact(s) transféré(s)`);
  };

  const handleChangeList = async (listId: string) => {
    await supabase.from("campaigns").update({ list_id: listId }).eq("id", id);
    load();
  };

  // --- Batch ---
  const saveBatchConfig = async () => {
    await supabase.from("campaigns").update({ batch_config: { size: batchSize, frequency_hours: batchFrequency, status: batchStatus } }).eq("id", id);
    setShowBatchModal(false);
    load();
  };

  const handleSend = async () => {
    if (!confirm("Envoyer le premier email au prochain batch de contacts ?")) return;
    setSaving(true);
    await fetch("/api/campaigns/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ campaignId: id }) });
    setSaving(false);
    load();
  };

  const stats = campaign?.stats || {};
  if (!campaign) return <div className="p-8 text-center text-slate-400">Chargement...</div>;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.push("/admin/campaigns")} className="text-xs text-slate-400 hover:text-slate-600 mb-1 inline-block">← Campagnes</button>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">{campaign.name}</h1>
          <span className={`mt-1 inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${campaign.status === "sent" ? "bg-emerald-50 text-emerald-700" : campaign.status === "active" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{campaign.status}</span>
        </div>
        <button onClick={handleSend} disabled={saving} className="px-5 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50">
          {saving ? "..." : "Envoyer batch"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{t}</button>
        ))}
      </div>

      {/* ===== PIPELINE TAB ===== */}
      {tab === "Pipeline" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            {STEP_TYPES.map((st) => (
              <button key={st.type} onClick={() => addPipelineStep(st.type)} className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
                <span>{st.icon}</span> {st.label}
              </button>
            ))}
            <button onClick={savePipeline} disabled={saving} className="ml-auto px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg disabled:opacity-50">{saving ? "..." : "Sauvegarder"}</button>
          </div>

          {pipeline.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
              <p className="text-slate-400 mb-3">Aucune étape dans la pipeline.</p>
              <p className="text-xs text-slate-300">Ajoutez des étapes ci-dessus pour construire votre séquence.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {pipeline.map((step, idx) => (
                <div key={step.id}>
                  {/* Connector line */}
                  {idx > 0 && <div className="flex justify-center"><div className="w-px h-6 bg-slate-300" /></div>}

                  <div className={`bg-white rounded-xl border p-4 transition-colors ${step.type === "email" ? "border-blue-200" : step.type === "attente" ? "border-amber-200" : step.type === "condition" ? "border-purple-200" : "border-red-200"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{STEP_TYPES.find((s) => s.type === step.type)?.icon}</span>
                      <div className="flex-1">
                        <input
                          value={step.label}
                          onChange={(e) => updatePipelineStep(idx, "label", e.target.value)}
                          className="w-full text-sm font-medium text-slate-900 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                          placeholder="Nom de l'étape"
                        />
                        {/* Config fields based on type */}
                        <div className="flex items-center gap-2 mt-2">
                          {step.type === "email" && (
                            <select value={step.config.template as string || "premier_contact"} onChange={(e) => updatePipelineConfig(idx, "template", e.target.value)} className="text-xs px-2 py-1 border border-slate-200 rounded">
                              {Object.entries(TEMPLATES).map(([tid, t]) => <option key={tid} value={tid}>{t.name}</option>)}
                            </select>
                          )}
                          {step.type === "attente" && (
                            <div className="flex items-center gap-1">
                              <input type="number" min={1} max={30} value={step.config.days as number || 3} onChange={(e) => updatePipelineConfig(idx, "days", Number(e.target.value))} className="w-14 text-xs px-2 py-1 border border-slate-200 rounded text-center" />
                              <span className="text-xs text-slate-500">jours</span>
                            </div>
                          )}
                          {step.type === "condition" && (
                            <select value={step.config.condition as string || "opened"} onChange={(e) => updatePipelineConfig(idx, "condition", e.target.value)} className="text-xs px-2 py-1 border border-slate-200 rounded">
                              <option value="opened">A ouvert</option>
                              <option value="clicked">A cliqué</option>
                              <option value="not_opened">N&apos;a pas ouvert</option>
                              <option value="replied">A répondu</option>
                            </select>
                          )}
                          {step.type === "action" && (
                            <select value={step.config.action as string || "transfer"} onChange={(e) => updatePipelineConfig(idx, "action", e.target.value)} className="text-xs px-2 py-1 border border-slate-200 rounded">
                              <option value="transfer">Transférer vers campagne</option>
                              <option value="tag">Ajouter tag</option>
                              <option value="status">Changer statut</option>
                              <option value="stop">Arrêter séquence</option>
                            </select>
                          )}
                        </div>
                      </div>
                      {/* Controls */}
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => movePipelineStep(idx, -1)} disabled={idx === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-30 text-xs">▲</button>
                        <button onClick={() => movePipelineStep(idx, 1)} disabled={idx === pipeline.length - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-30 text-xs">▼</button>
                      </div>
                      <button onClick={() => removePipelineStep(idx)} className="text-xs text-red-400 hover:text-red-600 p-1">✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== EMAILS TAB ===== */}
      {tab === "Emails" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Séquence ({steps.length} email{steps.length > 1 ? "s" : ""})</h2>
            <div className="flex gap-2">
              <button onClick={addStep} className="text-xs font-medium text-accent-cyan hover:underline">+ Ajouter</button>
              <button onClick={saveSteps} disabled={saving} className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg disabled:opacity-50">{saving ? "..." : "Sauvegarder"}</button>
            </div>
          </div>
          {steps.map((step, idx) => (
            <div key={step.id} className="bg-white rounded-xl border border-slate-200 p-5">
              {idx > 0 && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                  <span className="text-xs text-slate-500">Attendre</span>
                  <input type="number" min={0} max={30} value={step.delay_days} onChange={(e) => updateStep(idx, "delay_days", Number(e.target.value))} className="w-14 px-2 py-1 text-xs border border-slate-200 rounded text-center" />
                  <span className="text-xs text-slate-500">jours</span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-blue-500 text-white text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                <select value={step.template_id} onChange={(e) => updateStep(idx, "template_id", e.target.value)} className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg">
                  {Object.entries(TEMPLATES).map(([tid, t]) => <option key={tid} value={tid}>{t.name}</option>)}
                </select>
                {steps.length > 1 && <button onClick={() => removeStep(idx)} className="text-xs text-red-400 hover:text-red-600">Supprimer</button>}
              </div>
              <input value={step.subject} onChange={(e) => updateStep(idx, "subject", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg mb-3" placeholder="Sujet" />
              {editingStep === idx ? (
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={TEMPLATES[step.template_id as TemplateId]?.html.replaceAll("{{prenom}}", "Jean").replaceAll("{{entreprise}}", "Cabinet XYZ").replaceAll("{{lien_tracking}}", "#").replaceAll("{{nom}}", "Dupont").replaceAll("{{contenu}}", "").replaceAll("{{pixel_url}}", "") || ""}
                    className="w-full h-[350px] border-0"
                    title={`Preview ${idx}`}
                  />
                  <button onClick={() => setEditingStep(null)} className="w-full px-3 py-2 text-xs text-slate-500 border-t border-slate-100 hover:bg-slate-50">Fermer aperçu</button>
                </div>
              ) : (
                <button onClick={() => setEditingStep(idx)} className="text-xs text-slate-400 hover:text-slate-600">Aperçu email ▾</button>
              )}
            </div>
          ))}
          {steps.length === 0 && (
            <div className="bg-white rounded-xl border-dashed border-2 border-slate-200 p-12 text-center">
              <p className="text-slate-400 mb-3">Aucun email.</p>
              <button onClick={addStep} className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg">Ajouter un email</button>
            </div>
          )}
        </div>
      )}

      {/* ===== CONTACTS TAB ===== */}
      {tab === "Contacts" && (
        <div className="space-y-4">
          {/* List selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Liste liée :</span>
            <select value={campaign.list_id || ""} onChange={(e) => handleChangeList(e.target.value)} className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan/30">
              <option value="">Aucune liste sélectionnée</option>
              {availableLists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <span className="text-xs text-slate-400">{listContacts.length} contact(s)</span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1 bg-white rounded-lg border border-slate-200 p-1 text-xs overflow-x-auto">
              {STATUS_OPTIONS.map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${filter === key ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}>{label}</button>
              ))}
            </div>
            <span className="text-xs text-slate-400">{filteredContacts.length} contact(s)</span>
            <button onClick={() => setShowBatchModal(true)} className="ml-auto px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50">
              Batch: {batchSize}/{batchFrequency}h ({batchStatus})
            </button>
          </div>

          {/* Transfer bar */}
          {selected.size > 0 && (
            <div className="flex items-center gap-2 bg-accent-cyan/5 border border-accent-cyan/20 rounded-lg px-4 py-2">
              <span className="text-xs font-medium text-accent-cyan">{selected.size} sélectionné(s)</span>
              <select value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)} className="text-xs px-2 py-1 border border-slate-200 rounded-lg ml-auto">
                <option value="">Transférer vers...</option>
                {otherCampaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button onClick={handleTransfer} disabled={!transferTarget} className="px-3 py-1 text-xs font-medium bg-accent-cyan text-white rounded-lg disabled:opacity-50">OK</button>
            </div>
          )}

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
                {filteredContacts.length > 0 ? filteredContacts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} className="rounded" /></td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{c.first_name} {c.last_name}</p>
                      <p className="text-xs text-slate-400">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.company || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{c.campaign_status !== "en_attente" ? `Email ${(c.current_step || 0) + 1}/${steps.length || 1}` : "—"}</td>
                    <td className="px-4 py-3">{c.opened_at ? <span className="text-xs text-cyan-700 font-medium">Oui</span> : <span className="text-xs text-slate-300">—</span>}</td>
                    <td className="px-4 py-3">{c.clicked_at ? <span className="text-xs text-violet-700 font-medium">Oui</span> : <span className="text-xs text-slate-300">—</span>}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[c.campaign_status || "en_attente"] || "bg-slate-100 text-slate-600"}`}>
                        {STATUS_OPTIONS.find((s) => s.key === c.campaign_status)?.label || c.campaign_status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    {campaign.list_id ? "Aucun contact dans cette liste." : "Sélectionnez une liste de contacts ci-dessus."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Batch modal */}
          {showBatchModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowBatchModal(false)}>
              <div className="bg-white rounded-xl border border-slate-200 p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-semibold text-slate-900 mb-4">Configuration envoi auto</h3>
                <div className="space-y-3">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-slate-600">Contacts par batch</span>
                    <input type="number" min={1} max={5000} value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value))} className="px-3 py-2 border border-slate-200 rounded-lg" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-slate-600">Fréquence (heures)</span>
                    <input type="number" min={1} max={168} value={batchFrequency} onChange={(e) => setBatchFrequency(Number(e.target.value))} className="px-3 py-2 border border-slate-200 rounded-lg" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="text-slate-600">Statut</span>
                    <select value={batchStatus} onChange={(e) => setBatchStatus(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg">
                      <option value="active">Actif</option>
                      <option value="paused">En pause</option>
                    </select>
                  </label>
                </div>
                <div className="flex gap-2 mt-5">
                  <button onClick={saveBatchConfig} className="flex-1 px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg">Sauvegarder</button>
                  <button onClick={() => setShowBatchModal(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">Annuler</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== STATS TAB ===== */}
      {tab === "Stats" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Envoyés", value: stats.sent || 0, color: "text-slate-900" },
              { label: "Ouverts", value: stats.sent ? `${Math.round(((stats.opened || 0) / stats.sent) * 100)}%` : "0%", sub: `${stats.opened || 0}/${stats.sent || 0}`, color: "text-accent-cyan" },
              { label: "Cliqués", value: stats.sent ? `${Math.round(((stats.clicked || 0) / stats.sent) * 100)}%` : "0%", sub: `${stats.clicked || 0}/${stats.sent || 0}`, color: "text-accent-violet" },
              { label: "Rebonds", value: stats.bounced || 0, color: "text-red-500" },
            ].map((m) => (
              <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <p className="text-xs text-slate-500 uppercase font-medium mb-1">{m.label}</p>
                <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
                {"sub" in m && <p className="text-xs text-slate-400 mt-1">{m.sub}</p>}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Entonnoir</h3>
            <div className="space-y-3">
              {[
                { label: "Envoyés", value: stats.sent || 0, color: "bg-slate-300" },
                { label: "Ouverts", value: stats.opened || 0, color: "bg-cyan-400" },
                { label: "Cliqués", value: stats.clicked || 0, color: "bg-violet-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-slate-500 text-right">{item.label}</span>
                  <div className="flex-1 bg-slate-50 rounded-full h-7 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all flex items-center justify-end pr-2`} style={{ width: `${Math.max(stats.sent ? (item.value / stats.sent) * 100 : 0, 5)}%` }}>
                      <span className="text-[10px] font-bold text-white">{item.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Batch config</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-slate-500">Taille batch</p><p className="font-semibold text-slate-900">{batchSize}</p></div>
              <div><p className="text-slate-500">Fréquence</p><p className="font-semibold text-slate-900">Toutes les {batchFrequency}h</p></div>
              <div><p className="text-slate-500">Statut</p><p className={`font-semibold ${batchStatus === "active" ? "text-emerald-600" : "text-slate-600"}`}>{batchStatus}</p></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
