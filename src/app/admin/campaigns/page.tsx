import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*, contact_lists(name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">Campagnes</h1>
        <Link href="/admin/campaigns/new" className="px-5 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors">+ Nouvelle campagne</Link>
      </div>

      {campaigns && campaigns.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => {
            const stats = (c.stats as { sent?: number; opened?: number; clicked?: number }) || {};
            const openRate = stats.sent ? Math.round(((stats.opened || 0) / stats.sent) * 100) : 0;
            return (
              <Link key={c.id} href={`/admin/campaigns/${c.id}`} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 truncate">{c.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex-none ${c.status === "sent" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{c.status}</span>
                </div>
                {c.contact_lists && <p className="text-xs text-slate-400 mb-3">Liste : {(c.contact_lists as { name: string }).name}</p>}
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>{stats.sent || 0} envoyés</span>
                  <span>{openRate}% ouverts</span>
                  <span>{stats.clicked || 0} clics</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-400">Aucune campagne. Créez-en une pour commencer.</p>
        </div>
      )}
    </>
  );
}
