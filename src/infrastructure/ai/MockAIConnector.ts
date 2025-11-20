import { AIConnector } from '../../domain/ports/AIConnector';
import { GraphModel } from '../../domain/graph/GraphModel';
import { v4 as uuidv4 } from 'uuid';

export class MockAIConnector implements AIConnector {
  async generateGraph(prompt: string): Promise<GraphModel> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('MockAIConnector generating graph for:', prompt);

    // Return a dummy graph based on the "Sales Funnel" example
    return {
      nodes: {
        '1': {
          id: '1',
          type: 'topic',
          data: { title: 'Lead Capture', body: 'Landing Page form submission' },
          position: { x: 0, y: 0 }, // Layout engine will fix this
          dimensions: { width: 200, height: 100 },
        },
        '2': {
          id: '2',
          type: 'action',
          data: { title: 'Qualify Lead', body: 'Check budget and timeline' },
          position: { x: 0, y: 0 },
          dimensions: { width: 200, height: 100 },
        },
        '3': {
          id: '3',
          type: 'note',
          data: { title: 'CRM Update', body: 'Log to Salesforce' },
          position: { x: 0, y: 0 },
          dimensions: { width: 200, height: 100 },
        },
      },
      edges: {
        'e1': { id: 'e1', sourceId: '1', targetId: '2', label: 'Submit' },
        'e2': { id: 'e2', sourceId: '2', targetId: '3', label: 'Qualified' },
      },
      metadata: {
        version: '1.0.0',
        created: new Date(),
      },
    };
  }

  async refineGraph(currentGraph: GraphModel, command: string): Promise<GraphModel> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('MockAIConnector refining graph with:', command);

    // Simple mock refinement: Add a new node
    const newNodeId = uuidv4();
    const newEdgeId = uuidv4();

    return {
      ...currentGraph,
      nodes: {
        ...currentGraph.nodes,
        [newNodeId]: {
          id: newNodeId,
          type: 'action',
          data: { title: 'Refined Step', body: `Result of: ${command}` },
          position: { x: 0, y: 0 },
          dimensions: { width: 200, height: 100 },
        }
      },
      edges: {
        ...currentGraph.edges,
        [newEdgeId]: {
          id: newEdgeId,
          sourceId: Object.keys(currentGraph.nodes)[0], // Connect to first node for simplicity
          targetId: newNodeId,
        }
      }
    };
  }
}
