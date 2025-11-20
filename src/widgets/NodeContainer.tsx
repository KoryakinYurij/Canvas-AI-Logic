import React from 'react';
import { VisualNodeCard } from '../components/organisms/VisualNodeCard';
import { Node } from '../domain/Graph';

interface NodeContainerProps {
  node: Node;
}

export const NodeContainer: React.FC<NodeContainerProps> = ({ node }) => {
  return (
    <div style={{ position: 'absolute', left: node.position.x, top: node.position.y }}>
      <VisualNodeCard title={node.data.title} icon={node.data.icon}>
        {node.data.content}
      </VisualNodeCard>
    </div>
  );
};
