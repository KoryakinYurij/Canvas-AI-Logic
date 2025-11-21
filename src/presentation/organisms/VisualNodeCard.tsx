import React, { useState, useEffect } from 'react';
import { NodeEntity } from '@domain/entities/NodeEntity';
import { clsx } from 'clsx';
import { useGraphStore } from '@domain/graph/useGraphStore';

interface VisualNodeCardProps {
  node: NodeEntity;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export const VisualNodeCard: React.FC<VisualNodeCardProps> = ({ node, selected, onSelect }) => {
  const { updateNode } = useGraphStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(node.data.title);
  const [editBody, setEditBody] = useState(node.data.body);

  useEffect(() => {
    setEditTitle(node.data.title);
    setEditBody(node.data.body);
  }, [node.data]);

  const semanticColors = {
    topic: 'border-blue-500 bg-white',
    action: 'border-green-500 bg-white',
    note: 'border-amber-400 bg-amber-50',
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    updateNode(node.id, {
      data: { ...node.data, title: editTitle, body: editBody },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(node.data.title);
    setEditBody(node.data.body);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent canvas hotkeys (like Delete) from firing
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className={clsx(
        'absolute flex flex-col rounded-lg shadow-sm border-l-4 transition-all cursor-pointer',
        !isEditing && 'hover:shadow-md hover:scale-[1.02]',
        semanticColors[node.type] || 'border-slate-300 bg-white',
        selected && !isEditing && 'ring-2 ring-offset-2 ring-blue-500',
        isEditing && 'ring-2 ring-blue-400 shadow-xl z-50 scale-105'
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.dimensions.width,
        height: node.dimensions.height, // Allow expansion? For now fixed.
      }}
      onClick={() => !isEditing && onSelect?.(node.id)}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div className="flex flex-col h-full bg-white rounded-r-lg">
          <input
            className="px-3 py-2 border-b border-slate-100 font-semibold text-sm text-slate-800 focus:outline-none focus:bg-slate-50"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <textarea
            className="p-3 text-xs text-slate-600 resize-none flex-1 focus:outline-none focus:bg-slate-50"
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-end p-1 gap-1 border-t border-slate-100">
             <button onClick={handleCancel} className="text-[10px] px-2 py-1 text-slate-500 hover:bg-slate-100 rounded">Cancel</button>
             <button onClick={handleSave} className="text-[10px] px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
          </div>
        </div>
      ) : (
        <>
          <div className="px-3 py-2 border-b border-slate-100 font-semibold text-sm text-slate-800 truncate select-none">
            {node.data.title}
          </div>
          <div className="p-3 text-xs text-slate-600 overflow-hidden select-none">
            {node.data.body}
          </div>
        </>
      )}
    </div>
  );
};
