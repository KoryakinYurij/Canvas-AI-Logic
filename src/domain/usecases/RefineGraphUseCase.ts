import { AIConnector } from '../ports/AIConnector';
import { useGraphStore } from '../graph/useGraphStore';

export class RefineGraphUseCase {
  constructor(private aiConnector: AIConnector) {}

  async execute(command: string): Promise<void> {
    try {
      const currentGraph = useGraphStore.getState();
      const graphModel = {
        nodes: currentGraph.nodes,
        edges: currentGraph.edges,
        metadata: currentGraph.metadata
      };

      const updatedGraph = await this.aiConnector.refineGraph(graphModel, command);

      // Update the store with the new graph
      useGraphStore.getState().setGraph(updatedGraph);
    } catch (error) {
      console.error('Failed to refine graph:', error);
      throw error;
    }
  }
}
