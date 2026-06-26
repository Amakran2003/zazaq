import { GlassPanel } from "@/components/ui/GlassPanel";

const steps = [
  { num: "01", title: "Expression libre du besoin", desc: "On commence sans structure. Contexte métier, acteurs, outils, problèmes — on transmet le maximum de réalité terrain." },
  { num: "02", title: "Compréhension + documents", desc: "L'IA reformule, puis on injecte fichiers, procédures internes et cas réels. On corrige jusqu'à la bonne compréhension." },
  { num: "03", title: "Test sur un cas réel", desc: "On prend un dossier déjà traité. L'IA refait le même travail, on compare résultats et écarts." },
  { num: "04", title: "Correction progressive", desc: "Règles manquantes, exceptions oubliées, cas limites — on stabilise le raisonnement étape par étape." },
  { num: "05", title: "Structuration de l'output", desc: "Format exact défini : Excel, document, mail, synthèse. Structure, ordre, règles de validation." },
  { num: "06", title: "Industrialisation", desc: "On transforme en système : projet dédié, workflow automatisé ou outil métier avec règles validées." },
];

export function Methodology() {
  return (
    <section id="methode" className="py-[clamp(4rem,10vw,7rem)] px-4 max-w-[1100px] mx-auto">
      <div data-reveal className="text-center max-w-2xl mx-auto mb-12">
        <p className="inline-block mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-accent-cyan">Notre méthode</p>
        <h2 className="[font-family:var(--font-display)] text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-slate-900 mb-3">
          On regarde ensemble où vous perdez du temps
        </h2>
        <p className="text-slate-500">Une approche progressive : on forme l&apos;IA sur vos vrais besoins, pas l&apos;inverse.</p>
      </div>
      <div data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          <GlassPanel key={step.num} className="p-6">
            <span className="block [font-family:var(--font-display)] text-xs font-bold text-accent-violet mb-3">{step.num}</span>
            <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
          </GlassPanel>
        ))}
      </div>
      <GlassPanel data-reveal variant="strong" className="mt-8 p-6 max-w-3xl mx-auto">
        <p className="text-sm text-slate-500 leading-relaxed">
          <strong className="text-slate-800 font-semibold">Point important :</strong> Tout ne doit pas être fait avec de l&apos;IA. Pour les tâches répétitives et structurées, une automatisation classique est souvent plus fiable. L&apos;IA sert à comprendre et interpréter, pas à tout exécuter.
        </p>
      </GlassPanel>
    </section>
  );
}
