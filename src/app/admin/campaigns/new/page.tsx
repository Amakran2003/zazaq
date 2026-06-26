"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TEMPLATES, type TemplateId } from "@/lib/email-templates";

type Step = {
  template_id: TemplateId;
  subject: string;
  delay_days: number;
};

type ContactList = { id: string; name: string };

export default function NewCampaignPage() {
  const [name, setName] = useState("");
  const [lists, setLists] = useState<ContactList[]>([]);
  const [selectedList, setSelectedList] = useState("");
  const [steps, setSteps] = useState<Step[]>([
    { template_id: "cabinets", subject: TEMPLATES.cabinets.subject, delay_days: 0 },
  ]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("contact_lists").select("id, name").order("name").then(({ data }) => setLists(data || []));
  }, []);

  const addStep = () => {
    setSteps([...steps, { template_id: "relance", subject: TEMPLATES.relance.subject, delay_days: 3 }]);
  };

  const removeStep = (idx: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const updateStep = (idx: number, field: keyof Step, value: string | number) => {
    setSteps(steps.map((s, i) => {
      if (i !== idx) return s;
      const updated = { ...s, [field]: value };
      if (field === "template_id") {
        updated.subject = TEMPLATES[value as TemplateId].subject;
      }
      return updated;
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedList) return;
    setSaving(true);

    const { data: campaign } = await supabase
      .from("campaigns")
      .insert({ name, list_id: selectedList, status: "draft", stats: {} })
      .select("id")
      .single();

    if (campaign) {
      const stepsData = steps.map((s, i) => ({
        campaign_id: campaign.id,
        step_order: i,
        template_id: s.template_id,
        subject: s.subject,
        html_content: TEMPLATES[s.template_id].html,
        delay_days: s.delay_days,
      }));
      await supabase.from("campaign_steps").insert(stepsData);
      router.push(`/admin/campaigns/${campaign.id}`);
    }
    setSaving(false);
  };

  const previewTemplate = steps[0]?.template_id ? TEMPLATES[steps[0].template_id] : null;

  return (
    <>
      <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900 mb-8">Nouvelle campagne</h1>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleCreate} className="space-y-6">
          {/* Campaign info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
              Nom de la campagne
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Experts comptables — séquence Q3" className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
              Liste de contacts
              <select value={selectedList} onChange={(e) => setSelectedList(e.target.value)} required className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30">
                <option value="">Sélectionner une liste...</option>
                {lists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </label>
          </div>

          {/* Sequence steps */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Séquence email</h2>
              <button type="button" onClick={addStep} className="text-xs font-medium text-accent-cyan hover:underline">+ Ajouter un email</button>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="relative border border-slate-100 rounded-xl p-4">
                  {idx > 0 && (
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                      <span className="text-xs text-slate-500">Attendre</span>
                      <input type="number" min={0} max={30} value={step.delay_days} onChange={(e) => updateStep(idx, "delay_days", Number(e.target.value))} className="w-14 px-2 py-1 text-xs border border-slate-200 rounded-lg text-center" />
                      <span className="text-xs text-slate-500">jours</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">Email {idx + 1}</span>
                    {steps.length > 1 && (
                      <button type="button" onClick={() => removeStep(idx)} className="ml-auto text-xs text-red-400 hover:text-red-600">Supprimer</button>
                    )}
                  </div>
                  <select value={step.template_id} onChange={(e) => updateStep(idx, "template_id", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30">
                    {Object.entries(TEMPLATES).map(([id, t]) => (
                      <option key={id} value={id}>{t.name}</option>
                    ))}
                  </select>
                  <input value={step.subject} onChange={(e) => updateStep(idx, "subject", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" placeholder="Sujet de l'email" />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving || !name || !selectedList} className="w-full px-6 py-3 text-sm font-semibold bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 transition-colors">
            {saving ? "Création..." : "Créer la campagne"}
          </button>
        </form>

        {/* Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-8">
          <h2 className="font-semibold text-slate-900 mb-1">Aperçu — Email 1</h2>
          <p className="text-xs text-slate-400 mb-3">Sujet : {steps[0]?.subject}</p>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            {previewTemplate && (
              <iframe
                srcDoc={previewTemplate.html
                  .replaceAll("{{prenom}}", "Jean")
                  .replaceAll("{{nom}}", "Dupont")
                  .replaceAll("{{entreprise}}", "Cabinet XYZ")
                  .replaceAll("{{lien_tracking}}", "#")
                  .replaceAll("{{contenu}}", "")
                  .replaceAll("{{pixel_url}}", "")}
                className="w-full h-[450px] border-0"
                title="Aperçu email"
              />
            )}
          </div>
          <p className="mt-3 text-xs text-slate-400">Variables : {"{{prenom}}"}, {"{{entreprise}}"}, {"{{lien_tracking}}"}</p>
        </div>
      </div>
    </>
  );
}
