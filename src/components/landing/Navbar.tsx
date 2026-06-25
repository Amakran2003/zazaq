import Link from "next/link";
import { GlassButton } from "@/components/ui/GlassButton";

export function Navbar() {
  return (
    <header className="sticky top-4 z-50 px-4 max-w-[1100px] mx-auto">
      <nav
        aria-label="Navigation principale"
        className="flex items-center gap-4 px-6 py-3 rounded-full border border-glass-border bg-white/70 backdrop-blur-[20px] backdrop-saturate-[120%] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)]"
      >
        <Link href="/" className="font-[var(--font-display)] font-extrabold text-lg tracking-tight mr-auto text-slate-900">
          Zazaq
        </Link>
        <ul className="hidden md:flex gap-6 list-none m-0 p-0">
          <li><a href="#calculateur" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Calculateur</a></li>
          <li><a href="#methode" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Méthode</a></li>
          <li><a href="#diagnostic" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Diagnostic</a></li>
        </ul>
        <GlassButton href="/reserver" prominent className="hidden sm:inline-flex text-sm">
          Réserver un créneau
        </GlassButton>
      </nav>
    </header>
  );
}
