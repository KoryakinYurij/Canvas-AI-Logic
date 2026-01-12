import React from 'react';
import { useProposalStore } from '../stores/useProposalStore';
import { useGraphStore } from '@domain/graph/useGraphStore';
import { Check, X, Undo2 } from 'lucide-react';
import { GraphAction } from '@domain/ports/AIConnector';

export const ProposalReview: React.FC = () => {
  const { queue, dismissCurrent } = useProposalStore();
  const { applyAction, undoLastAction, lastSnapshot } = useGraphStore();

  const currentAction = queue[0];
  const hasUndo = !!lastSnapshot;

  // Don't render anything if nothing to do
  if (!currentAction && !hasUndo) return null;

  const handleApprove = () => {
    if (currentAction) {
      applyAction(currentAction);
      dismissCurrent();
    }
  };

  const handleReject = () => {
    dismissCurrent();
  };

  const renderActionDescription = (action: GraphAction) => {
    switch (action.type) {
      case 'ADD_NODE':
        return (
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-600 text-sm">Add Node</span>
              <span className="text-xs text-slate-400 font-mono">{action.payload.type}</span>
            </div>
            <div className="text-sm font-semibold text-slate-800">{action.payload.data.title}</div>
            <div className="text-xs text-slate-500 truncate max-w-[200px]">{action.payload.data.body}</div>
          </div>
        );
      case 'ADD_EDGE':
        return (
           <div>
            <span className="font-bold text-green-600 text-sm">Connect Nodes</span>
            <div className="text-xs text-slate-500 font-mono mt-1">
                {action.payload.sourceId.substring(0,6)}... → {action.payload.targetId.substring(0,6)}...
            </div>
            <div className="text-sm font-semibold text-slate-800">{action.payload.label || '(Related)'}</div>
          </div>
        );
      default:
        // Fallback for types we might not explicitly handle in UI yet but are in types
        return <div className="text-sm">Unknown Action</div>;
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-4 items-center z-50 pointer-events-none w-full max-w-md px-4">
      {/* Undo Button (Visible if undo is available) */}
      {hasUndo && !currentAction && (
        <button
          onClick={undoLastAction}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors text-sm"
        >
          <Undo2 size={16} /> Undo Last Change
        </button>
      )}

      {/* Proposal Card (Visible if actions are pending) */}
      {currentAction && (
        <div className="pointer-events-auto w-full bg-white p-4 rounded-xl shadow-2xl border border-slate-200 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center mb-1">
               <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                 Proposal • {queue.length} Pending
               </div>
               {hasUndo && (
                 <button onClick={undoLastAction} className="text-slate-400 hover:text-slate-600" title="Undo Previous">
                   <Undo2 size={14} />
                 </button>
               )}
            </div>
            {renderActionDescription(currentAction)}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleReject}
              className="p-3 rounded-full bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 transition-colors"
              title="Reject"
            >
              <X size={20} />
            </button>
            <button
              onClick={handleApprove}
              className="p-3 rounded-full bg-green-50 text-green-600 hover:bg-green-100 border border-green-100 transition-colors"
              title="Approve"
            >
              <Check size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
