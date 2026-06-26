import { createClient } from "@/lib/supabase/server";

async function getStats() {
  const supabase = await createClient();
  const [contacts, deals, links, campaigns] = await Promise.all([
    supabase.from("contacts").select("id", { count: "exact", head: true }),
    supabase.from("deals").select("id", { count: "exact", head: true }),
    supabase.from("tracking_links").select("id, clicks"),
    supabase.from("campaigns").select("id", { count: "exact", head: true }),
  ]);

  const totalClicks = links.data?.reduce((sum, l) => sum + (l.clicks || 0), 0) || 0;

  return {
    contactsCount: contacts.count || 0,
    dealsCount: deals.count || 0,
    linksCount: links.data?.length || 0,
    totalClicks,
    campaignsCount: campaigns.count || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Contacts", value: stats.contactsCount, color: "text-accent-cyan" },
    { label: "Deals", value: stats.dealsCount, color: "text-accent-violet" },
    { label: "Liens trackés", value: stats.linksCount, color: "text-accent-amber" },
    { label: "Clics totaux", value: stats.totalClicks, color: "text-accent-rose" },
    { label: "Campagnes", value: stats.campaignsCount, color: "text-slate-700" },
  ];

  return (
    <>
      <h1 className="[font-family:var(--font-display)] text-2xl font-bold text-slate-900 mb-8">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Dernières interactions</h2>
        <p className="text-sm text-slate-400">Les interactions apparaîtront ici une fois les premiers contacts créés.</p>
      </div>
    </>
  );
}
