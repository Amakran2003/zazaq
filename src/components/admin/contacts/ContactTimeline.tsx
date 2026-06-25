type Interaction = {
  id: string;
  type: string;
  metadata: Record<string, unknown>;
  created_at: string;
  campaign_id?: string;
};

const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
  booking: { label: "Réservation", color: "bg-emerald-500", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  email_sent: { label: "Email envoyé", color: "bg-blue-500", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  email_opened: { label: "Email ouvert", color: "bg-cyan-500", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
  email_delivered: { label: "Email délivré", color: "bg-slate-400", icon: "M5 13l4 4L19 7" },
  link_clicked: { label: "Lien cliqué", color: "bg-violet-500", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" },
  email_bounced: { label: "Email rebond", color: "bg-red-500", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" },
  note: { label: "Note", color: "bg-amber-500", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  status_change: { label: "Changement statut", color: "bg-slate-600", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
};

export function ContactTimeline({ interactions }: { interactions: Interaction[] }) {
  if (interactions.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-8">Aucune interaction pour le moment.</p>;
  }

  return (
    <div className="relative">
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-100" />
      <div className="space-y-4">
        {interactions.map((i) => {
          const config = typeConfig[i.type] || { label: i.type, color: "bg-slate-400", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" };
          return (
            <div key={i.id} className="relative flex gap-4 pl-10">
              <div className={`absolute left-[8px] top-1 w-[14px] h-[14px] rounded-full ${config.color} ring-4 ring-white`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{config.label}</p>
                  <time className="text-xs text-slate-400">{new Date(i.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</time>
                </div>
                {i.metadata && Object.keys(i.metadata).length > 0 && (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {i.type === "booking" && `Créneau : ${(i.metadata as { slot?: string }).slot || ""}`}
                    {i.type === "link_clicked" && `URL : ${(i.metadata as { url?: string }).url || ""}`}
                    {i.type === "email_sent" && `Campagne`}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
