import { Node } from './Graph';

export const createNode = (
  id: string,
  type: string,
  title: string,
  position: { x: number; y: number }
): Node => {
  const baseNode = {
    id,
    type,
    position,
    data: { title },
  };

  switch (type) {
    case 'Action':
      return {
        ...baseNode,
        rules: { maxInConnections: 1, maxOutConnections: 1 },
      };
    case 'Condition':
      return {
        ...baseNode,
        rules: { maxInConnections: 1, maxOutConnections: 2 },
      };
    default:
      return {
        ...baseNode,
        rules: { maxInConnections: -1, maxOutConnections: -1 }, // -1 for unlimited
      };
  }
};
