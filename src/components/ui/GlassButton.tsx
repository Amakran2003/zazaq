import Link from "next/link";
import { cn } from "@/lib/cn";

type GlassButtonProps = {
  href: string;
  prominent?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function GlassButton({ href, className, children, prominent }: GlassButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex items-center justify-center min-h-[44px] px-6 py-3",
        "text-[0.9375rem] font-semibold rounded-full",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/40 focus-visible:ring-offset-2",
        "hover:-translate-y-0.5 active:translate-y-0",
        prominent
          ? "bg-slate-900 text-white shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50",
        className
      )}
    >
      {children}
    </Link>
  );
}
