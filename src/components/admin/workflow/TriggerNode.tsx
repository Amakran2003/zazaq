"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";

export function TriggerNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl shadow-sm min-w-[160px]">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">Trigger</span>
      </div>
      <p className="text-sm font-medium text-slate-900">{(data as { label?: string }).label || "Déclencheur"}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}
