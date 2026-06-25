"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export function WaitNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-xl shadow-sm min-w-[160px]">
      <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">Attendre</span>
      </div>
      <p className="text-sm font-medium text-slate-900">{(data as { label?: string }).label || "Attendre"}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}
