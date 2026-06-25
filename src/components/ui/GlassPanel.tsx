"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type GlassPanelProps = ComponentPropsWithoutRef<"div"> & {
  interactive?: boolean;
  variant?: "default" | "strong";
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, children, interactive, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border border-glass-border",
          "backdrop-blur-[20px] backdrop-saturate-[120%]",
          "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_rgba(0,0,0,0.06)]",
          variant === "default" ? "bg-white/65" : "bg-white/82",
          interactive &&
            "group cursor-pointer hover:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.1)] transition-shadow duration-300",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = "GlassPanel";
