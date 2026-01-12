import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GraphModel } from './GraphModel';
import { NodeEntity } from '../entities/NodeEntity';
import { EdgeEntity } from '../entities/EdgeEntity';
import { GraphAction } from '../ports/AIConnector';
import { applyAddNode, applyAddEdge } from './graphReducers';

interface GraphState extends GraphModel {
  // Existing manual mutations (preserved for VisualNodeCard)
  addNode: (node: NodeEntity) => void;
  updateNode: (id: string, data: Partial<NodeEntity>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: EdgeEntity) => void;
  removeEdge: (id: string) => void;
  setGraph: (graph: GraphModel) => void;
  clearGraph: () => void;

  // New Core Action Loop API
  lastSnapshot: GraphModel | null; // TEMPORARY MVP: Single-step undo snapshot
  applyAction: (action: GraphAction) => void;
  undoLastAction: () => void;
}

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
      nodes: {},
      edges: {},
      metadata: {
        version: '1.0.0',
        created: new Date(),
      },
      lastSnapshot: null,

      addNode: (node) =>
        set((state) => ({
          nodes: { ...state.nodes, [node.id]: node },
        })),

      updateNode: (id, data) =>
        set((state) => {
          const node = state.nodes[id];
          if (!node) return state;
          return {
            nodes: {
              ...state.nodes,
              [id]: { ...node, ...data },
            },
          };
        }),

      removeNode: (id) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...rest } = state.nodes;
          const remainingEdges = Object.fromEntries(
            Object.entries(state.edges).filter(
              ([_id, edge]) => edge.sourceId !== id && edge.targetId !== id
            )
          );
          return { nodes: rest, edges: remainingEdges };
        }),

      addEdge: (edge) =>
        set((state) => ({
          edges: { ...state.edges, [edge.id]: edge },
        })),

      removeEdge: (id) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [id]: _, ...rest } = state.edges;
          return { edges: rest };
        }),

      setGraph: (graph) => set(() => graph),

      clearGraph: () => set(() => ({
        nodes: {},
        edges: {},
        metadata: { version: '1.0.0', created: new Date() },
        lastSnapshot: null
      })),

      // --- Core Action Loop Implementation ---

      applyAction: (action: GraphAction) => {
        const currentState = get();

        // 1. Snapshot current state before mutation
        const snapshot: GraphModel = {
            nodes: currentState.nodes,
            edges: currentState.edges,
            metadata: currentState.metadata
        };

        // Save snapshot (overwriting any previous one - single step only)
        set({ lastSnapshot: snapshot });

        // 2. Dispatch to pure reducer
        let newState: GraphModel = {
            nodes: currentState.nodes,
            edges: currentState.edges,
            metadata: currentState.metadata
        };

        switch (action.type) {
            case 'ADD_NODE':
                newState = applyAddNode(newState, action);
                break;
            case 'ADD_EDGE':
                newState = applyAddEdge(newState, action);
                break;
            default:
                console.warn(`applyAction: Unsupported action type ${action.type}`);
                return; // Abort update
        }

        // 3. Update Store with new state
        set({
            nodes: newState.nodes,
            edges: newState.edges
        });
      },

      undoLastAction: () => {
          const { lastSnapshot } = get();
          if (lastSnapshot) {
              set({
                  nodes: lastSnapshot.nodes,
                  edges: lastSnapshot.edges,
                  metadata: lastSnapshot.metadata,
                  lastSnapshot: null // Clear snapshot after undo (Single step strictness)
              });
              console.log('Undo successful. Snapshot restored.');
          } else {
              console.warn('Undo failed: No snapshot available.');
          }
      }
    }),
    {
      name: 'canvas-ai-storage',
      partialize: (state) => ({
          nodes: state.nodes,
          edges: state.edges,
          metadata: state.metadata
          // Exclude lastSnapshot from persistence to avoid stale undo states on reload
      }),
    }
  )
);
