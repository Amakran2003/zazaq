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
  member_count: number;
};

export default function ContactsPage() {
  const [lists, setLists] = useState<ContactList[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const supabase = createClient();

  const load = async () => {
    const { data } = await supabase.from("contact_lists").select("*").order("created_at", { ascending: false });
    if (!data) return;
    const listsWithCount: ContactList[] = await Promise.all(
      data.map(async (l) => {
        const { count } = await supabase.from("contact_list_members").select("*", { count: "exact", head: true }).eq("list_id", l.id);
        return { ...l, member_count: count || 0 };
      })
    );
    setLists(listsWithCount);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    await supabase.from("contact_lists").insert({ name: newName.trim() });
    setNewName("");
    setShowCreate(false);
    setCreating(false);
    load();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">Contacts</h1>
        <div className="flex gap-2">
          <Link href="/admin/contacts/import" className="px-4 py-2.5 text-sm font-medium border border-slate-200 text-slate-700 rounded-full hover:bg-slate-50 transition-colors">Importer Excel</Link>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors">+ Nouvelle liste</button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 p-5 mb-6 flex gap-3">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus placeholder="Nom de la liste (ex: Experts comptables)" required className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
          <button type="submit" disabled={creating} className="px-5 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">Créer</button>
          <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 text-sm text-slate-500 hover:text-slate-700">Annuler</button>
        </form>
      )}

      {lists.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((l) => (
            <Link key={l.id} href={`/admin/contacts/${l.id}`} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: l.color }}>
                  {l.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-accent-cyan transition-colors">{l.name}</h3>
                  <p className="text-xs text-slate-400">{l.member_count} contact{l.member_count > 1 ? "s" : ""}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">Créée le {new Date(l.created_at).toLocaleDateString("fr-FR")}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <p className="text-slate-500 mb-2">Aucune liste de contacts</p>
          <p className="text-xs text-slate-400">Créez une liste et importez vos contacts via Excel/CSV.</p>
        </div>
      )}
    </>
  );
}
