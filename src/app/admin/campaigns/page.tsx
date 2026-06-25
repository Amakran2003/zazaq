import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">Campagnes</h1>
        <Link href="/admin/campaigns?new=true" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10" /></svg>
          Nouvelle campagne
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Sujet</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Statut</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Segment</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.subject || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${c.status === "sent" ? "bg-emerald-50 text-emerald-700" : c.status === "scheduled" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{c.segment || "all"}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(c.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Aucune campagne pour le moment.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
