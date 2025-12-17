import { AIConnector, AIResponse, GraphAction } from '../../domain/ports/AIConnector';
import { GraphModel } from '../../domain/graph/GraphModel';
import { v4 as uuidv4 } from 'uuid';

export class MockAIConnector implements AIConnector {
  async generateGraph(prompt: string): Promise<GraphAction[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('MockAIConnector generating actions for:', prompt);

    const id1 = uuidv4();
    const id2 = uuidv4();

    return [
      {
        type: 'ADD_NODE',
        payload: {
          id: id1,
          type: 'topic',
          data: { title: 'Proposed Topic', body: `From: ${prompt}` },
          position: { x: 0, y: 0 },
          dimensions: { width: 200, height: 100 }
        }
      },
      {
        type: 'ADD_NODE',
        payload: {
          id: id2,
          type: 'note',
          data: { title: 'Insight', body: 'This is a generated proposal.' },
          position: { x: 300, y: 0 },
          dimensions: { width: 200, height: 100 }
        }
      },
      {
        type: 'ADD_EDGE',
        payload: {
          id: uuidv4(),
          sourceId: id1,
          targetId: id2,
          label: 'connects to'
        }
      }
    ];
  }

  async refineGraph(currentGraph: GraphModel, command: string): Promise<AIResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simple mock intent
    if (command.toLowerCase().startsWith('hi')) {
      return { type: 'text', content: 'Mock AI: Hello! How can I help?' };
    }

    const newId = uuidv4();
    return {
      type: 'proposal',
      content: [
        {
          type: 'ADD_NODE',
          payload: {
            id: newId,
            type: 'action',
            data: { title: 'New Action', body: command },
            position: { x: 100, y: 100 },
            dimensions: { width: 200, height: 100 }
          }
        }
      ],
      message: 'I have proposed adding a new node based on your request.'
    };
  }
}
