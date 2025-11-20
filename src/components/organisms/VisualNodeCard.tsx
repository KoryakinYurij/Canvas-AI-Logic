import React from 'react';
import { NodeShell } from '../atoms/NodeShell';
import { NodeHeader } from '../molecules/NodeHeader';

interface VisualNodeCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export const VisualNodeCard: React.FC<VisualNodeCardProps> = ({ title, icon, children }) => {
  return (
    <NodeShell>
      <NodeHeader title={title} icon={icon} />
      <div>{children}</div>
    </NodeShell>
  );
};
