import { GraphModel } from '../graph/GraphModel';

export type AIResponse =
  | { type: 'text'; content: string }
  | { type: 'graph'; content: GraphModel; message: string };

export interface AIConnector {
  generateGraph(prompt: string): Promise<GraphModel>;
  refineGraph(currentGraph: GraphModel, command: string): Promise<AIResponse>;
}
