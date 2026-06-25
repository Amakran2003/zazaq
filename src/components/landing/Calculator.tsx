"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";

const AUTOMATION_RATE = 0.5;

function formatHours(hours: number): string {
  if (hours >= 10) return `${Math.round(hours)} h`;
  if (hours === Math.floor(hours)) return `${hours} h`;
  return `${hours.toFixed(1).replace(".", ",")} h`;
}

export function Calculator() {
  const [collaborators, setCollaborators] = useState(3);
  const [hours, setHours] = useState(4);
  const recoverable = collaborators * hours * AUTOMATION_RATE;

  return (
    <section id="calculateur" className="py-[clamp(4rem,10vw,7rem)] px-4 max-w-[1100px] mx-auto">
      <div data-reveal className="text-center max-w-lg mx-auto mb-10">
        <h2 className="font-[var(--font-display)] text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-slate-900 mb-3">
          Combien de temps pourriez-vous récupérer&nbsp;?
        </h2>
        <p className="text-slate-500">Estimation indicative à affiner lors d&apos;un échange.</p>
      </div>
      <div data-reveal className="grid gap-6 md:grid-cols-2 md:items-start">
        <GlassPanel className="p-6 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            <span>Nombre de collaborateurs</span>
            <input type="number" min={1} max={500} value={collaborators} onChange={(e) => setCollaborators(Math.max(1, Number(e.target.value) || 1))} className="min-h-[44px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/30 focus-visible:border-accent-cyan transition-colors" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            <span>Temps administratif par semaine <em className="font-normal text-slate-400">(par collaborateur, en heures)</em></span>
            <input type="number" min={0.5} max={40} step={0.5} value={hours} onChange={(e) => setHours(Math.max(0, Number(e.target.value) || 0))} className="min-h-[44px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/30 focus-visible:border-accent-cyan transition-colors" />
          </label>
        </GlassPanel>
        <GlassPanel variant="strong" className="p-6 text-center" aria-live="polite">
          <span className="block text-xs font-semibold uppercase tracking-[0.04em] text-slate-500 mb-3">Temps potentiellement automatisable</span>
          <span className="block font-[var(--font-display)] text-[3rem] font-extrabold tracking-tight text-accent-cyan leading-none">{formatHours(recoverable)}</span>
          <span className="block mt-1 text-base text-slate-500">/ semaine</span>
          <p className="mt-4 text-xs text-slate-400 leading-relaxed">
            Basé sur 50&nbsp;% des tâches administratives répétitives. Le diagnostic gratuit permet de chiffrer votre situation.
          </p>
        </GlassPanel>
      </div>
    </section>
  );
}
