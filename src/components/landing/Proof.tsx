import { GlassPanel } from "@/components/ui/GlassPanel";

export function Proof() {
  return (
    <section className="py-[clamp(3rem,8vw,5rem)] px-4 max-w-[1100px] mx-auto">
      <GlassPanel data-reveal variant="strong" className="p-[clamp(1.5rem,4vw,2.5rem)] max-w-3xl">
        <blockquote className="m-0 p-0 border-none">
          <p className="text-[clamp(1.125rem,2.5vw,1.375rem)] text-slate-700 leading-relaxed mb-3">
            Une relance envoyée manuellement prend environ <strong className="text-accent-cyan font-semibold">2 minutes</strong>.
          </p>
          <p className="text-[clamp(1.125rem,2.5vw,1.375rem)] text-slate-700 leading-relaxed">
            Avec une automatisation, elle part automatiquement dès qu&apos;une condition est remplie.
          </p>
        </blockquote>
        <p className="mt-6 text-[0.9375rem] text-slate-500">
          CRM, documents, relances, formulaires, espace client et workflows sur mesure — nous identifions ce qui mérite d&apos;être automatisé.
        </p>
      </GlassPanel>
    </section>
  );
}
