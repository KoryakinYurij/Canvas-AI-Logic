import { AIConnector, GraphAction } from '../ports/AIConnector';

export class GenerateGraphUseCase {
  constructor(private aiConnector: AIConnector) {}

  async execute(prompt: string): Promise<GraphAction[]> {
    try {
      const actions = await this.aiConnector.generateGraph(prompt);
      // SIMPLIFICATION: We no longer auto-apply actions to the store.
      // The caller handles the proposal.
      return actions;
    } catch (error) {
      console.error('Failed to generate graph:', error);
      throw error;
    }
  }
}
