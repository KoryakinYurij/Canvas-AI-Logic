import { GraphModel } from '../graph/GraphModel';
import { NodeEntity } from '../entities/NodeEntity';
import { EdgeEntity } from '../entities/EdgeEntity';

export type GraphAction =
  | { type: 'ADD_NODE'; payload: NodeEntity }
  | { type: 'UPDATE_NODE'; payload: { id: string; data: { title?: string; body?: string } } }
  | { type: 'REMOVE_NODE'; payload: { id: string } }
  | { type: 'ADD_EDGE'; payload: EdgeEntity }
  | { type: 'REMOVE_EDGE'; payload: { id: string } };

export type AIResponse =
  | { type: 'text'; content: string }
  | { type: 'proposal'; content: GraphAction[]; message: string };

export interface AIConnector {
  generateGraph(prompt: string): Promise<GraphAction[]>;
  refineGraph(currentGraph: GraphModel, command: string): Promise<AIResponse>;
}
