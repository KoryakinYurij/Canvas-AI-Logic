import { NodeEntity } from '../../domain/entities/NodeEntity';
import { EdgeEntity } from '../../domain/entities/EdgeEntity';

export interface LayoutEngine {
  calculateLayout(nodes: Record<string, NodeEntity>, edges: Record<string, EdgeEntity>): Promise<{ nodes: Record<string, NodeEntity> }>;
}
