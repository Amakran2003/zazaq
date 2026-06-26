"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassPanel } from "@/components/ui/GlassPanel";

const tasks = [
  "Relances clients",
  "Génération de devis",
  "Envoi de documents",
  "Classement de fichiers",
  "Suivi commercial",
  "Prise de rendez-vous",
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-eyebrow]", { y: 16, opacity: 0, duration: 0.5 })
        .from("[data-hero-title]", { y: 24, opacity: 0, duration: 0.6 }, "-=0.3")
        .from("[data-hero-lead]", { y: 20, opacity: 0, duration: 0.5 }, "-=0.35")
        .from("[data-hero-list] li", { y: 14, opacity: 0, duration: 0.4, stagger: 0.06 }, "-=0.3")
        .from("[data-hero-cta]", { y: 16, opacity: 0, duration: 0.5 }, "-=0.2")
        .from("[data-hero-card]", { y: 30, opacity: 0, duration: 0.7, ease: "power2.out" }, "-=0.5");
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="pt-[clamp(4rem,10vw,7rem)] pb-12 px-4 max-w-[1100px] mx-auto grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <p data-hero-eyebrow className="inline-block mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-accent-cyan">
          Automatisation sur mesure
        </p>
        <h1 data-hero-title className="[font-family:var(--font-display)] text-[clamp(2.25rem,5.5vw,3.25rem)] font-extrabold leading-[1.1] tracking-tight text-slate-900 mb-6">
          Combien d&apos;heures perdez-vous chaque semaine&nbsp;?
        </h1>
        <p data-hero-lead className="text-[clamp(1rem,2vw,1.125rem)] text-slate-500 max-w-[34rem] mb-8 leading-relaxed">
          Relances, devis, documents, suivi commercial… Certaines tâches répétitives peuvent être automatisées pour libérer du temps à vos équipes.
        </p>
        <ul data-hero-list className="grid gap-2.5 sm:grid-cols-2 list-none p-0 m-0 mb-8">
          {tasks.map((task) => (
            <li key={task} className="flex items-center gap-2.5 text-[0.9375rem] text-slate-700">
              <span className="flex-none w-5 h-5 rounded-md bg-accent-cyan/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan" />
                </svg>
              </span>
              {task}
            </li>
          ))}
        </ul>
        <div data-hero-cta>
          <GlassButton href="/reserver" prominent>
            Réservez un diagnostic gratuit de 30 minutes
          </GlassButton>
        </div>
      </div>

      <GlassPanel data-hero-card className="p-8">
        <div className="text-center">
          <span className="block text-[2.5rem] [font-family:var(--font-display)] font-extrabold tracking-tight text-slate-300">2 min</span>
          <span className="block text-sm text-slate-500 mt-1">par relance manuelle</span>
        </div>
        <div className="h-px bg-slate-100 my-6" />
        <div className="text-center">
          <span className="block text-[2.5rem] [font-family:var(--font-display)] font-extrabold tracking-tight text-accent-cyan">0 min</span>
          <span className="block text-sm text-slate-500 mt-1">avec une automatisation</span>
        </div>
        <p className="mt-6 text-center text-sm text-slate-400 leading-relaxed">
          Exemple concret : une relance part seule dès qu&apos;une condition est remplie.
        </p>
      </GlassPanel>
    </section>
  );
}
