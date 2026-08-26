"use client";

import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { TeachingAnalysis } from "../../runner/contracts";

type TeachingFlowGraphProps = {
  flow: TeachingAnalysis["flow"];
};

export function TeachingFlowGraph({ flow }: TeachingFlowGraphProps) {
  const columns = flow.length > 8 ? 4 : 3;
  const nodes: Node[] = flow.map((step, index) => ({
    id: step.id,
    position: { x: (index % columns) * 210, y: Math.floor(index / columns) * 118 },
    data: { label: `${String(index + 1).padStart(2, "0")} · ${step.label} · L${step.line}` },
    style: {
      width: 180,
      border: "1px solid var(--line)",
      borderTop: "3px solid var(--accent)",
      borderRadius: 4,
      background: "var(--paper)",
      color: "var(--ink)",
      fontSize: 10,
      lineHeight: 1.35,
      padding: 10,
    },
  }));
  const edges: Edge[] = flow.slice(1).map((step, index) => ({
    id: `edge-${flow[index].id}-${step.id}`,
    source: flow[index].id,
    target: step.id,
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--accent)" },
    style: { stroke: "var(--accent)", strokeWidth: 1.5 },
  }));

  return (
    <div className="teaching-flow-graph" role="img" aria-label="Representação visual complementar do fluxo do código">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.45}
        maxZoom={1.4}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable
        zoomOnDoubleClick={false}
      >
        <Background gap={20} size={1} color="var(--line)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
