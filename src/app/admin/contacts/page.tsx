import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ContactsPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">Contacts</h1>
        <div className="flex items-center gap-2">
          <Link href="/admin/contacts/import" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 10v1a3 3 0 003 3h2a3 3 0 003-3v-1M8 3v7M5 6l3-3 3 3" /></svg>
            Importer Excel
          </Link>
          <Link href="/admin/contacts?new=true" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10" /></svg>
            Ajouter
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Statut</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Source</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts && contacts.length > 0 ? (
              contacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/contacts/${c.id}`} className="font-medium text-slate-900 hover:text-accent-cyan transition-colors">
                      {c.first_name} {c.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-accent-cyan/10 text-accent-cyan">{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.source || "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(c.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Aucun contact pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
