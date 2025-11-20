// TODO: Это мок-версия AI Connector.
// Замените этот файл на реальную реализацию, которая будет делать API-запросы.

import { GraphModel } from '../domain/Graph';
import { createNode } from '../domain/NodeFactory';

export const generateGraphFromText = async (
  userInput: string
): Promise<GraphModel> => {
  console.log(`[MOCK] AI Connector вызван с текстом: "${userInput}"`);

  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Возвращаем заранее определенный граф
  const mockGraph: GraphModel = {
    nodes: [
      createNode('node-1', 'Concept', 'Привлечение', { x: 50, y: 50 }),
      createNode('node-2', 'Action', 'Конверсия', { x: 250, y: 150 }),
      createNode('node-3', 'Concept', 'Удержание', { x: 50, y: 250 }),
    ],
    edges: [
      { id: 'edge-1', sourceNodeId: 'node-1', targetNodeId: 'node-2' },
      { id: 'edge-2', sourceNodeId: 'node-2', targetNodeId: 'node-3' },
    ],
  };

  return mockGraph;
};
