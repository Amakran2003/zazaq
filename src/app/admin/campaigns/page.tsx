import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    scheduled: "bg-amber-50 text-amber-700",
    sent: "bg-emerald-50 text-emerald-700",
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">Campagnes</h1>
        <Link href="/admin/campaigns/new" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10" /></svg>
          Nouvelle campagne
        </Link>
      </div>

      {campaigns && campaigns.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => {
            const stats = (c.stats as { sent?: number; opened?: number; clicked?: number }) || {};
            const openRate = stats.sent ? Math.round(((stats.opened || 0) / stats.sent) * 100) : 0;
            const clickRate = stats.sent ? Math.round(((stats.clicked || 0) / stats.sent) * 100) : 0;
            return (
              <Link key={c.id} href={`/admin/campaigns/${c.id}`} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 truncate pr-2">{c.name}</h3>
                  <span className={`flex-none px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[c.status] || statusColors.draft}`}>{c.status}</span>
                </div>
                {c.subject && <p className="text-sm text-slate-500 truncate mb-4">{c.subject}</p>}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="px-2 py-1 bg-slate-50 rounded">{c.segment || "all"}</span>
                  {c.status === "sent" && (
                    <>
                      <span>{stats.sent || 0} envoyés</span>
                      <span className="text-accent-cyan font-medium">{openRate}% ouverts</span>
                      <span className="text-accent-violet font-medium">{clickRate}% clics</span>
                    </>
                  )}
                </div>
                <p className="mt-3 text-xs text-slate-300">{new Date(c.created_at).toLocaleDateString("fr-FR")}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-400 mb-4">Aucune campagne pour le moment.</p>
          <Link href="/admin/campaigns/new" className="text-sm font-medium text-accent-cyan hover:underline">Créer votre première campagne</Link>
        </div>
      )}
    </>
  );
}
