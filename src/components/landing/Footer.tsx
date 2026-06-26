import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-4 max-w-[1100px] mx-auto border-t border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2 py-4">
        <Link href="/" className="[font-family:var(--font-display)] font-bold text-slate-900">Zazaq</Link>
        <p className="text-sm text-slate-400">Automatisation sur mesure pour les PME et indépendants.</p>
      </div>
    </footer>
  );
}
