"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ContactList = { id: string; name: string };

export default function NewCampaignPage() {
  const [name, setName] = useState("");
  const [lists, setLists] = useState<ContactList[]>([]);
  const [selectedList, setSelectedList] = useState("");
  const [mode, setMode] = useState<"list" | "import">("list");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("contact_lists").select("id, name").order("name").then(({ data }) => setLists(data || []));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (mode === "list" && !selectedList) return;
    setSaving(true);

    const { data: campaign } = await supabase
      .from("campaigns")
      .insert({
        name: name.trim(),
        list_id: mode === "list" ? selectedList : null,
        status: "draft",
        stats: {},
        workflow_json: [],
        batch_config: {},
      })
      .select("id")
      .single();

    if (campaign) {
      if (mode === "import") {
        router.push(`/admin/contacts/import?campaign=${campaign.id}`);
      } else {
        router.push(`/admin/campaigns/${campaign.id}`);
      }
    }
    setSaving(false);
  };

  return (
    <>
      <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900 mb-8">Nouvelle campagne</h1>

      <form onSubmit={handleCreate} className="max-w-xl space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Nom de la campagne</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Experts comptables — Q3 2026" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-3 block">Contacts</label>
            <div className="flex gap-2 mb-4">
              <button type="button" onClick={() => setMode("list")} className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${mode === "list" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                Choisir une liste existante
              </button>
              <button type="button" onClick={() => setMode("import")} className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${mode === "import" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                Importer un fichier
              </button>
            </div>

            {mode === "list" ? (
              <select value={selectedList} onChange={(e) => setSelectedList(e.target.value)} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/30">
                <option value="">Sélectionner une liste...</option>
                {lists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            ) : (
              <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3">Après création, vous serez redirigé vers l&apos;import de fichier Excel/CSV.</p>
            )}
          </div>
        </div>

        <button type="submit" disabled={saving || !name.trim() || (mode === "list" && !selectedList)} className="w-full px-6 py-3 text-sm font-semibold bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 transition-colors">
          {saving ? "Création..." : "Créer la campagne"}
        </button>
      </form>
    </>
  );
}
