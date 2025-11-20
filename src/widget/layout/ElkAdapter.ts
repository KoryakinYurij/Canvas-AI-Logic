import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled';
import { LayoutEngine } from '../../domain/ports/LayoutEngine';
import { NodeEntity } from '../../domain/entities/NodeEntity';
import { EdgeEntity } from '../../domain/entities/EdgeEntity';

const elk = new ELK();

export class ElkAdapter implements LayoutEngine {
  async calculateLayout(nodes: Record<string, NodeEntity>, edges: Record<string, EdgeEntity>): Promise<{ nodes: Record<string, NodeEntity> }> {
    const elkNodes: ElkNode[] = Object.values(nodes).map((node) => ({
      id: node.id,
      width: node.dimensions.width,
      height: node.dimensions.height,
    }));

    const elkEdges: ElkExtendedEdge[] = Object.values(edges).map((edge) => ({
      id: edge.id,
      sources: [edge.sourceId],
      targets: [edge.targetId],
    }));

    const graph: ElkNode = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': 'DOWN',
        'elk.spacing.nodeNode': '50',
        'elk.layered.spacing.nodeNodeBetweenLayers': '50',
      },
      children: elkNodes,
      edges: elkEdges,
    };

    try {
      const layout = await elk.layout(graph);

      const newNodes = { ...nodes };
      layout.children?.forEach((child) => {
        if (newNodes[child.id]) {
          newNodes[child.id] = {
            ...newNodes[child.id],
            position: { x: child.x || 0, y: child.y || 0 },
          };
        }
      });

      return { nodes: newNodes };
    } catch (error) {
      console.error('Elk Layout Error:', error);
      return { nodes }; // Return original nodes on error
    }
  }
}
