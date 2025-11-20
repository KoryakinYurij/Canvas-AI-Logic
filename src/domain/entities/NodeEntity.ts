export interface NodeEntity {
  id: string;
  type: 'topic' | 'action' | 'note';
  data: {
    title: string;
    body?: string;
  };
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
}
