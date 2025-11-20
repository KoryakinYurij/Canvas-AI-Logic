import React from 'react';
import { EdgeEntity } from '@domain/entities/EdgeEntity';
import { NodeEntity } from '@domain/entities/NodeEntity';

interface ConnectionLineProps {
  edge: EdgeEntity;
  sourceNode: NodeEntity;
  targetNode: NodeEntity;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({ edge, sourceNode, targetNode }) => {
  if (!sourceNode || !targetNode) return null;

  // Simple straight line from bottom-center to top-center
  const startX = sourceNode.position.x + sourceNode.dimensions.width / 2;
  const startY = sourceNode.position.y + sourceNode.dimensions.height;
  const endX = targetNode.position.x + targetNode.dimensions.width / 2;
  const endY = targetNode.position.y;

  // Cubic Bezier for smooth curve
  const path = `M ${startX} ${startY} C ${startX} ${startY + 50}, ${endX} ${endY - 50}, ${endX} ${endY}`;

  return (
    <g>
      <path
        d={path}
        stroke="#94a3b8"
        strokeWidth="2"
        fill="none"
      />
      {edge.label && (
        <text
          x={(startX + endX) / 2}
          y={(startY + endY) / 2}
          textAnchor="middle"
          className="text-[10px] fill-slate-500 bg-white"
        >
          {edge.label}
        </text>
      )}
    </g>
  );
};
