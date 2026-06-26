"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

const baseStyle = "rounded-xl border-2 shadow-sm min-w-[180px] text-left";

export const TriggerNode = memo(function TriggerNode({ data }: NodeProps) {
  return (
    <div className={`${baseStyle} border-emerald-300 bg-emerald-50 px-4 py-3`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
        </div>
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Trigger</span>
      </div>
      <p className="text-sm text-emerald-900">{(data as { label?: string }).label || "Démarrage"}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
});

export const EmailNode = memo(function EmailNode({ data }: NodeProps) {
  return (
    <div className={`${baseStyle} border-blue-300 bg-blue-50 px-4 py-3`}>
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" /><rect x="3" y="5" width="18" height="14" rx="2" /></svg>
        </div>
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Email</span>
      </div>
      <p className="text-sm text-blue-900">{(data as { label?: string }).label || "Envoyer email"}</p>
      {(data as { template?: string }).template && <p className="text-xs text-blue-600 mt-0.5">Template: {(data as { template?: string }).template}</p>}
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
});

export const WaitNode = memo(function WaitNode({ data }: NodeProps) {
  return (
    <div className={`${baseStyle} border-amber-300 bg-amber-50 px-4 py-3`}>
      <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
        </div>
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Attente</span>
      </div>
      <p className="text-sm text-amber-900">{(data as { label?: string }).label || "3 jours"}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
});

export const ConditionNode = memo(function ConditionNode({ data }: NodeProps) {
  return (
    <div className={`${baseStyle} border-violet-300 bg-violet-50 px-4 py-3`}>
      <Handle type="target" position={Position.Top} className="!bg-violet-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-md bg-violet-500 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 3l9 9-9 9-9-9 9-9z" /></svg>
        </div>
        <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">Condition</span>
      </div>
      <p className="text-sm text-violet-900">{(data as { label?: string }).label || "Si ouvert"}</p>
      <Handle type="source" position={Position.Bottom} id="yes" className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white !left-[30%]" />
      <Handle type="source" position={Position.Bottom} id="no" className="!bg-red-500 !w-3 !h-3 !border-2 !border-white !left-[70%]" />
    </div>
  );
});

export const ActionNode = memo(function ActionNode({ data }: NodeProps) {
  return (
    <div className={`${baseStyle} border-rose-300 bg-rose-50 px-4 py-3`}>
      <Handle type="target" position={Position.Top} className="!bg-rose-500 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-md bg-rose-500 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
        </div>
        <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">Action</span>
      </div>
      <p className="text-sm text-rose-900">{(data as { label?: string }).label || "Transférer"}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-rose-500 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
});

export const nodeTypes = {
  trigger: TriggerNode,
  email: EmailNode,
  wait: WaitNode,
  condition: ConditionNode,
  action: ActionNode,
};
