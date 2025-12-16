import { AIConnector, AIResponse } from '../ports/AIConnector';
import { useGraphStore } from '../graph/useGraphStore';

export class RefineGraphUseCase {
  constructor(private aiConnector: AIConnector) {}

  async execute(command: string): Promise<AIResponse> {
    try {
      const currentGraph = useGraphStore.getState();
      const graphModel = {
        nodes: currentGraph.nodes,
        edges: currentGraph.edges,
        metadata: currentGraph.metadata
      };

      const response = await this.aiConnector.refineGraph(graphModel, command);

      if (response.type === 'graph') {
        useGraphStore.getState().setGraph(response.content);
      }

      return response;
    } catch (error) {
      console.error('Failed to refine graph:', error);
      throw error;
    }
  }
}
