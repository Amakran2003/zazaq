"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type TrackingLink = {
  id: string;
  slug: string;
  name: string;
  target_url: string;
  clicks: number;
  created_at: string;
};

export default function LinksPage() {
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [target, setTarget] = useState("/");
  const [creating, setCreating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("tracking_links")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setLinks(data || []));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setCreating(true);
    const { data } = await supabase
      .from("tracking_links")
      .insert({ name, slug, target_url: target })
      .select()
      .single();
    if (data) setLinks([data, ...links]);
    setName("");
    setSlug("");
    setTarget("/");
    setCreating(false);
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://zazaq.fr";

  return (
    <>
      <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900 mb-8">Générateur de liens</h1>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="font-semibold text-slate-900 mb-4">Créer un nouveau lien</h2>
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Nom</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Google Ads Juin" required className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Slug (URL)</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="gads-paris-06" required className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Page cible</span>
            <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="/" className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
          </label>
          <div className="flex items-end">
            <button type="submit" disabled={creating} className="w-full px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors">
              Créer
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">URL</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Clics</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Créé le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {links.length > 0 ? links.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{l.name}</td>
                <td className="px-4 py-3">
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded">{baseUrl}/r/{l.slug}</code>
                </td>
                <td className="px-4 py-3 font-semibold text-accent-cyan">{l.clicks}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(l.created_at).toLocaleDateString("fr-FR")}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">Aucun lien créé.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
