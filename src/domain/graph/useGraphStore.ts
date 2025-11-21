import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GraphModel } from './GraphModel';
import { NodeEntity } from '../entities/NodeEntity';
import { EdgeEntity } from '../entities/EdgeEntity';

interface GraphState extends GraphModel {
  addNode: (node: NodeEntity) => void;
  updateNode: (id: string, data: Partial<NodeEntity>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: EdgeEntity) => void;
  removeEdge: (id: string) => void;
  setGraph: (graph: GraphModel) => void;
  clearGraph: () => void;
}

export const useGraphStore = create<GraphState>()(
  persist(
    (set) => ({
      nodes: {},
      edges: {},
      metadata: {
        version: '1.0.0',
        created: new Date(),
      },

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
          const { [id]: removed, ...rest } = state.nodes;
          // Also remove connected edges
          const remainingEdges = Object.fromEntries(
            Object.entries(state.edges).filter(
              ([_, edge]) => edge.sourceId !== id && edge.targetId !== id
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
          const { [id]: removed, ...rest } = state.edges;
          return { edges: rest };
        }),

      setGraph: (graph) => set(() => graph),

      clearGraph: () => set(() => ({
        nodes: {},
        edges: {},
        metadata: { version: '1.0.0', created: new Date() }
      })),
    }),
    {
      name: 'canvas-ai-storage',
    }
  )
);
