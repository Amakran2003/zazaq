"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type ContactList = {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  member_count?: number;
};

export default function ListsPage() {
  const [lists, setLists] = useState<ContactList[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from("contact_lists").select("*").order("created_at", { ascending: false });
    if (!data) return;

    const listsWithCount: ContactList[] = await Promise.all(
      data.map(async (l) => {
        const { count } = await supabase
          .from("contact_list_members")
          .select("*", { count: "exact", head: true })
          .eq("list_id", l.id);
        return { ...l, member_count: count || 0 };
      })
    );
    setLists(listsWithCount);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    await supabase.from("contact_lists").insert({ name: name.trim() });
    setName("");
    setCreating(false);
    load();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">Listes de contacts</h1>
      </div>

      <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 p-6 mb-6 flex gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de la liste (ex: Experts comptables)" required className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
        <button type="submit" disabled={creating} className="px-5 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">Créer</button>
      </form>

      {lists.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((l) => (
            <Link key={l.id} href={`/admin/lists/${l.id}`} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                <h3 className="font-semibold text-slate-900">{l.name}</h3>
              </div>
              <p className="text-sm text-slate-500">{l.member_count} contact{(l.member_count || 0) > 1 ? "s" : ""}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-400">Créez votre première liste pour segmenter vos contacts.</p>
        </div>
      )}
    </>
  );
}
