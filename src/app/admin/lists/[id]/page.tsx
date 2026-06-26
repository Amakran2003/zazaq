"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Contact = { id: string; email: string; first_name: string; last_name: string; status: string };

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [listName, setListName] = useState("");
  const [members, setMembers] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [adding, setAdding] = useState(false);
  const [selectedContact, setSelectedContact] = useState("");
  const supabase = createClient();

  const load = async () => {
    const { data: list } = await supabase.from("contact_lists").select("name").eq("id", id).single();
    if (list) setListName(list.name);

    const { data: memberData } = await supabase
      .from("contact_list_members")
      .select("contact_id, contacts(id, email, first_name, last_name, status)")
      .eq("list_id", id);

    if (memberData) setMembers(memberData.map((m) => m.contacts as unknown as Contact).filter(Boolean));

    const { data: contacts } = await supabase.from("contacts").select("id, email, first_name, last_name, status").order("created_at", { ascending: false });
    if (contacts) setAllContacts(contacts);
  };

  useEffect(() => { load(); }, [id]);

  const handleAdd = async () => {
    if (!selectedContact) return;
    setAdding(true);
    await supabase.from("contact_list_members").insert({ list_id: id, contact_id: selectedContact });
    setSelectedContact("");
    setAdding(false);
    load();
  };

  const handleRemove = async (contactId: string) => {
    await supabase.from("contact_list_members").delete().eq("list_id", id).eq("contact_id", contactId);
    load();
  };

  const availableContacts = allContacts.filter((c) => !members.find((m) => m.id === c.id));

  return (
    <>
      <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900 mb-2">{listName}</h1>
      <p className="text-sm text-slate-500 mb-8">{members.length} contact{members.length > 1 ? "s" : ""} dans cette liste</p>

      {/* Add contact */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex gap-3">
        <select value={selectedContact} onChange={(e) => setSelectedContact(e.target.value)} className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan/30">
          <option value="">Ajouter un contact...</option>
          {availableContacts.map((c) => (
            <option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.email}</option>
          ))}
        </select>
        <button onClick={handleAdd} disabled={adding || !selectedContact} className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">Ajouter</button>
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.length > 0 ? members.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{c.first_name} {c.last_name}</td>
                <td className="px-4 py-3 text-slate-600">{c.email}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent-cyan/10 text-accent-cyan">{c.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleRemove(c.id)} className="text-xs text-red-500 hover:text-red-700">Retirer</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">Aucun contact dans cette liste.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
