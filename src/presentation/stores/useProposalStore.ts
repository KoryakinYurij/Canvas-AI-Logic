import { create } from 'zustand';
import { GraphAction } from '@domain/ports/AIConnector';

interface ProposalState {
  queue: GraphAction[];
  addProposals: (actions: GraphAction[]) => void;
  dismissCurrent: () => void;
  clearQueue: () => void;
}

export const useProposalStore = create<ProposalState>((set) => ({
  queue: [],
  addProposals: (actions) =>
    set((state) => ({
      queue: [...state.queue, ...actions],
    })),
  dismissCurrent: () =>
    set((state) => ({
      queue: state.queue.slice(1),
    })),
  clearQueue: () => set({ queue: [] }),
}));
