"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TEMPLATES, type TemplateId } from "@/lib/email-templates";

const segments = [
  { value: "all", label: "Tous les contacts" },
  { value: "leads", label: "Leads uniquement" },
  { value: "prospects", label: "Prospects" },
  { value: "clients", label: "Clients" },
];

export default function NewCampaignPage() {
  const [name, setName] = useState("");
  const [template, setTemplate] = useState<TemplateId>("welcome");
  const [segment, setSegment] = useState("all");
  const [customContent, setCustomContent] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const selectedTemplate = TEMPLATES[template];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setSaving(true);

    const { data } = await supabase
      .from("campaigns")
      .insert({
        name,
        subject: selectedTemplate.subject,
        html_content: selectedTemplate.html,
        segment,
        status: "draft",
        stats: {},
      })
      .select("id")
      .single();

    if (data) router.push(`/admin/campaigns/${data.id}`);
    setSaving(false);
  };

  return (
    <>
      <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900 mb-8">Nouvelle campagne</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
            Nom de la campagne
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Relance leads Juin" className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
            Template
            <select value={template} onChange={(e) => setTemplate(e.target.value as TemplateId)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30">
              {Object.entries(TEMPLATES).map(([id, t]) => (
                <option key={id} value={id}>{t.name}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
            Segment
            <select value={segment} onChange={(e) => setSegment(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30">
              {segments.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
            Contenu personnalisé <span className="font-normal text-slate-400">(optionnel, remplace {"{{contenu}}"})</span>
            <textarea value={customContent} onChange={(e) => setCustomContent(e.target.value)} rows={4} placeholder="Votre message ici..." className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
          </label>

          <button type="submit" disabled={saving || !name} className="w-full px-6 py-3 text-sm font-semibold bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 transition-colors">
            {saving ? "Création..." : "Créer la campagne"}
          </button>
        </form>

        {/* Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Aperçu</h2>
          <p className="text-xs text-slate-400 mb-3">Sujet : {selectedTemplate.subject}</p>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <iframe
              srcDoc={selectedTemplate.html
                .replaceAll("{{prenom}}", "Jean")
                .replaceAll("{{nom}}", "Dupont")
                .replaceAll("{{entreprise}}", "MonEntreprise")
                .replaceAll("{{lien_tracking}}", "#")
                .replaceAll("{{contenu}}", customContent || "Votre contenu ici...")
                .replaceAll("{{pixel_url}}", "")}
              className="w-full h-[400px] border-0"
              title="Aperçu email"
            />
          </div>
          <p className="mt-3 text-xs text-slate-400">Variables disponibles : {"{{prenom}}"}, {"{{nom}}"}, {"{{entreprise}}"}, {"{{lien_tracking}}"}, {"{{contenu}}"}</p>
        </div>
      </div>
    </>
  );
}
