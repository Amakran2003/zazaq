"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { createClient } from "@/lib/supabase/client";
import { TriggerNode } from "@/components/admin/workflow/TriggerNode";
import { EmailNode } from "@/components/admin/workflow/EmailNode";
import { WaitNode } from "@/components/admin/workflow/WaitNode";
import { ConditionNode } from "@/components/admin/workflow/ConditionNode";
import { ActionNode } from "@/components/admin/workflow/ActionNode";

const nodeTypes = {
  trigger: TriggerNode,
  email: EmailNode,
  wait: WaitNode,
  condition: ConditionNode,
  action: ActionNode,
};

const nodeOptions = [
  { type: "email", label: "Email" },
  { type: "wait", label: "Attendre" },
  { type: "condition", label: "Condition" },
  { type: "action", label: "Action" },
];

export default function WorkflowEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("workflows").select("*").eq("id", id).single().then(({ data }) => {
      if (data) {
        setName(data.name);
        setStatus(data.status);
        setNodes((data.nodes as Node[]) || []);
        setEdges((data.edges as Edge[]) || []);
      }
    });
  }, [id]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#94a3b8" } }, eds));
  }, [setEdges]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("workflows").update({ name, nodes, edges, status, updated_at: new Date().toISOString() }).eq("id", id);
    setSaving(false);
  };

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 250, y: (nodes.length + 1) * 120 },
      data: { label: type === "email" ? "Envoyer email" : type === "wait" ? "Attendre 3 jours" : type === "condition" ? "Si ouvert ?" : "Changer statut" },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] -mx-6 -my-8">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white flex-none">
        <div className="flex items-center gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-1.5 text-sm font-semibold border border-transparent hover:border-slate-200 rounded-lg focus:outline-none focus:border-slate-300 bg-transparent text-slate-900" />
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{status}</span>
        </div>
        <div className="flex items-center gap-2">
          {nodeOptions.map((n) => (
            <button key={n.type} onClick={() => addNode(n.type)} className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors">+ {n.label}</button>
          ))}
          <div className="w-px h-6 bg-slate-200 mx-2" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none">
            <option value="draft">Brouillon</option>
            <option value="active">Actif</option>
            <option value="paused">Pause</option>
          </select>
          <button onClick={handleSave} disabled={saving} className="px-4 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">
            {saving ? "..." : "Sauvegarder"}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-50"
        >
          <Controls />
          <Background gap={20} size={1} color="#e2e8f0" />
        </ReactFlow>
      </div>
    </div>
  );
}
