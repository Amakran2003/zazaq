"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Workflow = {
  id: string;
  name: string;
  status: string;
  created_at: string;
  nodes: unknown[];
};

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [creating, setCreating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("workflows").select("*").order("created_at", { ascending: false }).then(({ data }) => setWorkflows(data || []));
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    const { data } = await supabase
      .from("workflows")
      .insert({
        name: "Nouveau workflow",
        nodes: [{ id: "trigger-1", type: "trigger", position: { x: 250, y: 50 }, data: { label: "Nouveau contact" } }],
        edges: [],
      })
      .select()
      .single();
    if (data) window.location.href = `/admin/workflows/${data.id}`;
    setCreating(false);
  };

  const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    active: "bg-emerald-50 text-emerald-700",
    paused: "bg-amber-50 text-amber-700",
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">Workflows</h1>
        <button onClick={handleCreate} disabled={creating} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10" /></svg>
          Nouveau workflow
        </button>
      </div>

      {workflows.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((w) => (
            <Link key={w.id} href={`/admin/workflows/${w.id}`} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900">{w.name}</h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[w.status] || statusColors.draft}`}>{w.status}</span>
              </div>
              <p className="text-xs text-slate-400">{(w.nodes as unknown[])?.length || 0} nœuds</p>
              <p className="mt-2 text-xs text-slate-300">{new Date(w.created_at).toLocaleDateString("fr-FR")}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-400 mb-4">Aucun workflow pour le moment.</p>
          <button onClick={handleCreate} className="text-sm font-medium text-accent-cyan hover:underline">Créer votre premier workflow</button>
        </div>
      )}
    </>
  );
}
