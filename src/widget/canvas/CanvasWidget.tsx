import React, { useEffect, useRef, useState } from 'react';
import { useGraphStore } from '@domain/graph/useGraphStore';
import { VisualNodeCard } from '@presentation/organisms/VisualNodeCard';
import { ConnectionLine } from '@presentation/molecules/ConnectionLine';
import { ElkAdapter } from '@widget/layout/ElkAdapter';
import { AutoLayoutUseCase } from '@domain/usecases/AutoLayout';

const layoutEngine = new ElkAdapter();
const autoLayout = new AutoLayoutUseCase(layoutEngine);

export const CanvasWidget: React.FC = () => {
  const { nodes, edges } = useGraphStore();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Trigger auto-layout when graph structure changes (simple heuristic)
  const nodeCount = Object.keys(nodes).length;
  const edgeCount = Object.keys(edges).length;

  useEffect(() => {
    autoLayout.execute();
  }, [nodeCount, edgeCount]);

  // Simple Pan/Zoom state (placeholder for full implementation)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomSensitivity = 0.001;
    const newScale = Math.max(0.1, Math.min(5, transform.scale - e.deltaY * zoomSensitivity));
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-screen overflow-hidden bg-slate-50 relative cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <div
        id="canvas-export-root"
        className="absolute origin-top-left transition-transform duration-75 ease-linear"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
        }}
      >
        <svg className="absolute top-0 left-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible">
           {Object.values(edges).map(edge => (
             <ConnectionLine
               key={edge.id}
               edge={edge}
               sourceNode={nodes[edge.sourceId]}
               targetNode={nodes[edge.targetId]}
             />
           ))}
        </svg>

        {Object.values(nodes).map(node => (
          <VisualNodeCard
            key={node.id}
            node={node}
            selected={selectedNode === node.id}
            onSelect={setSelectedNode}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur p-2 rounded shadow text-xs text-slate-500">
        {Object.keys(nodes).length} nodes • {Object.keys(edges).length} edges
      </div>
    </div>
  );
};
