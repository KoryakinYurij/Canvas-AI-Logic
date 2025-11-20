import { NodeEntity } from '../entities/NodeEntity';
import { EdgeEntity } from '../entities/EdgeEntity';

export interface GraphModel {
  nodes: Record<string, NodeEntity>;
  edges: Record<string, EdgeEntity>;
  metadata: {
    version: string;
    created: Date;
  };
}
