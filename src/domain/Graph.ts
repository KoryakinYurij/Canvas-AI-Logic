export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    title: string;
    content?: string;
    icon?: string;
  };
  rules: {
    maxInConnections: number;
    maxOutConnections: number;
  };
}

export interface Edge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

export interface GraphModel {
  nodes: Node[];
  edges: Edge[];
}
