"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export function ConditionNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 bg-violet-50 border-2 border-violet-200 rounded-xl shadow-sm min-w-[160px]">
      <Handle type="target" position={Position.Top} className="!bg-violet-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-500"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-600">Condition</span>
      </div>
      <p className="text-sm font-medium text-slate-900">{(data as { label?: string }).label || "Si..."}</p>
      <Handle type="source" position={Position.Bottom} id="yes" className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white !left-[30%]" />
      <Handle type="source" position={Position.Bottom} id="no" className="!bg-red-500 !w-3 !h-3 !border-2 !border-white !left-[70%]" />
    </div>
  );
}
