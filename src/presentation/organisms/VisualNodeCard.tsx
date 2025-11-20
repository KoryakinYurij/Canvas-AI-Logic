import React from 'react';
import { NodeEntity } from '@domain/entities/NodeEntity';
import { clsx } from 'clsx';

interface VisualNodeCardProps {
  node: NodeEntity;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export const VisualNodeCard: React.FC<VisualNodeCardProps> = ({ node, selected, onSelect }) => {
  const semanticColors = {
    topic: 'border-primary bg-white',
    action: 'border-secondary bg-white',
    note: 'border-amber-400 bg-amber-50',
  };

  return (
    <div
      className={clsx(
        'absolute flex flex-col rounded-lg shadow-sm border-l-4 transition-all cursor-pointer',
        'hover:shadow-md hover:scale-[1.02]',
        semanticColors[node.type] || 'border-slate-300 bg-white',
        selected && 'ring-2 ring-offset-2 ring-primary',
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.dimensions.width,
        height: node.dimensions.height,
      }}
      onClick={() => onSelect?.(node.id)}
    >
      <div className="px-3 py-2 border-b border-slate-100 font-semibold text-sm text-slate-800 truncate">
        {node.data.title}
      </div>
      <div className="p-3 text-xs text-slate-600 overflow-hidden">
        {node.data.body}
      </div>
    </div>
  );
};
