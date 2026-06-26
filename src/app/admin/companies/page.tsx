import { createClient } from "@/lib/supabase/server";

export default async function CompaniesPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="[font-family:var(--font-display)] text-2xl font-bold text-slate-900">Entreprises</h1>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Domaine</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Secteur</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Taille</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies && companies.length > 0 ? (
              companies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.domain || "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{c.sector || "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{c.size || "—"}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">Aucune entreprise pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
