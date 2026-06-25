import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ContactTimeline } from "@/components/admin/contacts/ContactTimeline";

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: contact } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .single();

  if (!contact) notFound();

  const { data: interactions } = await supabase
    .from("interactions")
    .select("*")
    .eq("contact_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("contact_id", id)
    .order("created_at", { ascending: false });

  const statusColors: Record<string, string> = {
    lead: "bg-blue-50 text-blue-700",
    prospect: "bg-amber-50 text-amber-700",
    client: "bg-emerald-50 text-emerald-700",
    churned: "bg-red-50 text-red-700",
  };

  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-slate-900">
            {contact.first_name} {contact.last_name}
          </h1>
          <p className="text-slate-500 mt-1">{contact.email}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[contact.status] || "bg-slate-100 text-slate-600"}`}>
          {contact.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          {/* Info card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Informations</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Téléphone</dt>
                <dd className="text-slate-900 font-medium">{contact.phone || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Entreprise</dt>
                <dd className="text-slate-900 font-medium">{contact.company || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Source</dt>
                <dd className="text-slate-900 font-medium">{contact.source || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Créé le</dt>
                <dd className="text-slate-900 font-medium">{new Date(contact.created_at).toLocaleDateString("fr-FR")}</dd>
              </div>
            </dl>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Notes</h2>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{contact.notes || "Aucune note."}</p>
          </div>

          {/* Deals */}
          {deals && deals.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Deals</h2>
              <div className="space-y-2">
                {deals.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{d.title}</p>
                      <p className="text-xs text-slate-500">{d.stage}</p>
                    </div>
                    {d.value && <span className="text-sm font-semibold text-accent-cyan">{d.value} €</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Historique</h2>
          <ContactTimeline interactions={interactions || []} />
        </div>
      </div>
    </>
  );
}
