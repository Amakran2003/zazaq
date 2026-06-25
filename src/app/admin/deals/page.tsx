import { createClient } from "@/lib/supabase/server";

const stages = ["discovery", "diagnostic", "proposal", "won", "lost"];
const stageLabels: Record<string, string> = {
  discovery: "Découverte",
  diagnostic: "Diagnostic",
  proposal: "Proposition",
  won: "Gagné",
  lost: "Perdu",
};
const stageColors: Record<string, string> = {
  discovery: "bg-slate-100 text-slate-700",
  diagnostic: "bg-blue-50 text-blue-700",
  proposal: "bg-amber-50 text-amber-700",
  won: "bg-emerald-50 text-emerald-700",
  lost: "bg-red-50 text-red-700",
};

export default async function DealsPage() {
  const supabase = await createClient();
  const { data: deals } = await supabase
    .from("deals")
    .select("*, contacts(first_name, last_name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  const grouped = stages.reduce<Record<string, typeof deals>>((acc, stage) => {
    acc[stage] = deals?.filter((d) => d.stage === stage) || [];
    return acc;
  }, {});

  return (
    <>
      <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900 mb-8">Pipeline</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${stageColors[stage]}`}>
                {stageLabels[stage]}
              </span>
              <span className="text-xs text-slate-400">{grouped[stage]?.length || 0}</span>
            </div>
            <div className="space-y-2">
              {grouped[stage]?.map((deal) => (
                <div key={deal.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm font-medium text-slate-900 truncate">{deal.title}</p>
                  {deal.value && <p className="text-xs text-accent-cyan font-semibold mt-1">{deal.value} €</p>}
                  {deal.contacts && <p className="text-xs text-slate-400 mt-1">{deal.contacts.first_name} {deal.contacts.last_name}</p>}
                </div>
              )) || null}
              {(!grouped[stage] || grouped[stage]!.length === 0) && (
                <p className="text-xs text-slate-300 text-center py-4">Vide</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
