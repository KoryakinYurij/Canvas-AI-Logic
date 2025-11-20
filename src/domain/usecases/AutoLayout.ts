import { LayoutEngine } from '../ports/LayoutEngine';
import { useGraphStore } from '../graph/useGraphStore';

export class AutoLayoutUseCase {
  constructor(private layoutEngine: LayoutEngine) {}

  async execute(): Promise<void> {
    const { nodes, edges, setGraph, metadata } = useGraphStore.getState();
    if (Object.keys(nodes).length === 0) return;

    const { nodes: layoutedNodes } = await this.layoutEngine.calculateLayout(nodes, edges);

    setGraph({
      nodes: layoutedNodes,
      edges,
      metadata
    });
  }
}
