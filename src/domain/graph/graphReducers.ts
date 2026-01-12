import { GraphModel } from './GraphModel';
import { GraphAction } from '../ports/AIConnector';

/**
 * Pure function to apply ADD_NODE action.
 */
export const applyAddNode = (state: GraphModel, action: Extract<GraphAction, { type: 'ADD_NODE' }>): GraphModel => {
  const node = action.payload;
  // Overwrite if exists, or add new.
  return {
    ...state,
    nodes: {
      ...state.nodes,
      [node.id]: node,
    },
  };
};

/**
 * Pure function to apply ADD_EDGE (Connect Nodes) action.
 */
export const applyAddEdge = (state: GraphModel, action: Extract<GraphAction, { type: 'ADD_EDGE' }>): GraphModel => {
  const edge = action.payload;

  // Validation: Ensure source and target nodes exist.
  if (!state.nodes[edge.sourceId]) {
    console.warn(`applyAddEdge: Source node ${edge.sourceId} not found.`);
    return state;
  }
  if (!state.nodes[edge.targetId]) {
    console.warn(`applyAddEdge: Target node ${edge.targetId} not found.`);
    return state;
  }

  return {
    ...state,
    edges: {
      ...state.edges,
      [edge.id]: edge,
    },
  };
};
