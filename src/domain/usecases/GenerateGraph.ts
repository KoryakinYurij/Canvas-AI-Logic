import { AIConnector } from '../ports/AIConnector';
import { useGraphStore } from '../graph/useGraphStore';

export class GenerateGraphUseCase {
  constructor(private aiConnector: AIConnector) {}

  async execute(prompt: string): Promise<void> {
    try {
      const graph = await this.aiConnector.generateGraph(prompt);
      // Directly updating the store via its action
      useGraphStore.getState().setGraph(graph);
    } catch (error) {
      console.error('Failed to generate graph:', error);
      throw error;
    }
  }
}
