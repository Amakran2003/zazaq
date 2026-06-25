"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export function ActionNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl shadow-sm min-w-[160px]">
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Action</span>
      </div>
      <p className="text-sm font-medium text-slate-900">{(data as { label?: string }).label || "Action"}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}
