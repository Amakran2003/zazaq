"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Contact = { id: string; email: string; first_name: string; last_name: string; company: string; phone: string; status: string };

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [listName, setListName] = useState("");
  const [members, setMembers] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [addingContact, setAddingContact] = useState("");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    const { data: list } = await supabase.from("contact_lists").select("name").eq("id", id).single();
    if (list) setListName(list.name);

    const { data: memberData } = await supabase
      .from("contact_list_members")
      .select("contact_id, contacts(id, email, first_name, last_name, company, phone, status)")
      .eq("list_id", id);

    if (memberData) setMembers(memberData.map((m) => m.contacts as unknown as Contact).filter(Boolean));

    const { data: contacts } = await supabase.from("contacts").select("id, email, first_name, last_name, company, phone, status").order("created_at", { ascending: false });
    if (contacts) setAllContacts(contacts);
  };

  useEffect(() => { load(); }, [id]);

  const handleAdd = async () => {
    if (!addingContact) return;
    await supabase.from("contact_list_members").insert({ list_id: id, contact_id: addingContact });
    setAddingContact("");
    load();
  };

  const handleRemove = async (contactId: string) => {
    await supabase.from("contact_list_members").delete().eq("list_id", id).eq("contact_id", contactId);
    load();
  };

  const handleDeleteList = async () => {
    if (!confirm("Supprimer cette liste ? Les contacts ne seront pas supprimés.")) return;
    setDeleting(true);
    await supabase.from("contact_list_members").delete().eq("list_id", id);
    await supabase.from("contact_lists").delete().eq("id", id);
    router.push("/admin/contacts");
  };

  const availableContacts = allContacts.filter((c) => !members.find((m) => m.id === c.id));
  const filtered = members.filter((c) =>
    !search || `${c.first_name} ${c.last_name} ${c.email} ${c.company}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/contacts" className="text-xs text-slate-400 hover:text-slate-600 mb-1 inline-block">← Contacts</Link>
          <h1 className="[font-family:var(--font-display)] text-2xl font-bold text-slate-900">{listName}</h1>
          <p className="text-sm text-slate-500 mt-1">{members.length} contact{members.length > 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/contacts/import?list=${id}`} className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50">Importer dans cette liste</Link>
          <button onClick={handleDeleteList} disabled={deleting} className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50">Supprimer liste</button>
        </div>
      </div>

      {/* Add contact */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex gap-3">
        <select value={addingContact} onChange={(e) => setAddingContact(e.target.value)} className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-cyan/30">
          <option value="">Ajouter un contact existant...</option>
          {availableContacts.map((c) => (
            <option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.email}</option>
          ))}
        </select>
        <button onClick={handleAdd} disabled={!addingContact} className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">Ajouter</button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent-cyan/30" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Entreprise</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Téléphone</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{c.first_name} {c.last_name}</td>
                <td className="px-4 py-3 text-slate-600">{c.email}</td>
                <td className="px-4 py-3 text-slate-600">{c.company || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{c.phone || "—"}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent-cyan/10 text-accent-cyan">{c.status || "lead"}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleRemove(c.id)} className="text-xs text-red-500 hover:text-red-700">Retirer</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Aucun contact dans cette liste.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
