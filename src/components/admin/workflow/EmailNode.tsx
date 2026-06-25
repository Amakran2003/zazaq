"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export function EmailNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-xl shadow-sm min-w-[160px]">
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">Email</span>
      </div>
      <p className="text-sm font-medium text-slate-900">{(data as { label?: string }).label || "Envoyer email"}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}
