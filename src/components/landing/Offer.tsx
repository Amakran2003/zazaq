import { GlassPanel } from "@/components/ui/GlassPanel";
import { GlassButton } from "@/components/ui/GlassButton";

const benefits = [
  "Cartographie de vos tâches répétitives",
  "Identification des automatisations envisageables",
  "Proposition d'une solution adaptée",
  "Estimation du coût et du temps de mise en œuvre",
];

const tags = ["Gratuit", "Sans engagement", "En visio"];

export function Offer() {
  return (
    <section id="diagnostic" className="py-[clamp(4rem,10vw,7rem)] px-4 max-w-[1100px] mx-auto">
      <div data-reveal className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div>
          <p className="inline-block mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-accent-cyan">Offre</p>
          <h2 className="font-[var(--font-display)] text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-tight text-slate-900 mb-4">Diagnostic Zazaq</h2>
          <p className="text-[1.0625rem] text-slate-500 mb-8 max-w-lg leading-relaxed">
            Pendant 30 minutes, nous regardons ensemble où vous perdez du temps — sans jargon, sans engagement.
          </p>
          <ul className="list-none p-0 m-0 grid gap-3 mb-8">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-slate-600">
                <span className="flex-none w-1.5 h-1.5 mt-2.5 rounded-full bg-accent-cyan" />
                {b}
              </li>
            ))}
          </ul>
          <GlassButton href="/reserver" prominent>Réserver mon diagnostic gratuit</GlassButton>
        </div>
        <GlassPanel variant="strong" className="p-8">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 rounded">30 min</span>
          <h3 className="font-[var(--font-display)] text-xl font-bold text-slate-900 mb-3">Démonstration gratuite</h3>
          <p className="text-[0.9375rem] text-slate-500 leading-relaxed mb-5">
            Découvrez ce qui peut être automatisé dans votre entreprise et estimez le temps potentiellement économisé.
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">{tag}</span>
            ))}
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
