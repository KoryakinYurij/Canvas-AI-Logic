import { GraphModel } from '../graph/GraphModel';

export interface AIConnector {
  generateGraph(prompt: string): Promise<GraphModel>;
  refineGraph(currentGraph: GraphModel, command: string): Promise<GraphModel>;
}
