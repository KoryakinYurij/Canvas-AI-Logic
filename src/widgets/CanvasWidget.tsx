import React from 'react';
import { NodeContainer } from './NodeContainer';
import { GraphModel } from '../domain/Graph';

interface CanvasWidgetProps {
  graph: GraphModel;
}

export const CanvasWidget: React.FC<CanvasWidgetProps> = ({ graph }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', border: '1px solid black' }}>
      {graph.nodes.map(node => (
        <NodeContainer key={node.id} node={node} />
      ))}
    </div>
  );
};
