import { describe, it, expect, beforeEach } from 'vitest';
import { useGraphStore } from './useGraphStore';
import { NodeEntity } from '../entities/NodeEntity';
import { EdgeEntity } from '../entities/EdgeEntity';

describe('useGraphStore', () => {
  beforeEach(() => {
    useGraphStore.setState({
      nodes: {},
      edges: {},
      metadata: { version: '1.0.0', created: new Date() },
    });
  });

  it('should add a node', () => {
    const node: NodeEntity = {
      id: '1',
      type: 'topic',
      data: { title: 'Test Node' },
      position: { x: 0, y: 0 },
      dimensions: { width: 100, height: 50 },
    };

    useGraphStore.getState().addNode(node);

    expect(useGraphStore.getState().nodes['1']).toEqual(node);
  });

  it('should update a node', () => {
    const node: NodeEntity = {
      id: '1',
      type: 'topic',
      data: { title: 'Test Node' },
      position: { x: 0, y: 0 },
      dimensions: { width: 100, height: 50 },
    };
    useGraphStore.getState().addNode(node);

    useGraphStore.getState().updateNode('1', {
      data: { title: 'Updated Node' },
    });

    expect(useGraphStore.getState().nodes['1'].data.title).toBe('Updated Node');
  });

  it('should remove a node and connected edges', () => {
    const node1: NodeEntity = {
      id: '1',
      type: 'topic',
      data: { title: 'Node 1' },
      position: { x: 0, y: 0 },
      dimensions: { width: 100, height: 50 },
    };
    const node2: NodeEntity = {
      id: '2',
      type: 'topic',
      data: { title: 'Node 2' },
      position: { x: 100, y: 0 },
      dimensions: { width: 100, height: 50 },
    };
    const edge: EdgeEntity = {
      id: 'e1',
      sourceId: '1',
      targetId: '2',
    };

    useGraphStore.getState().addNode(node1);
    useGraphStore.getState().addNode(node2);
    useGraphStore.getState().addEdge(edge);

    useGraphStore.getState().removeNode('1');

    expect(useGraphStore.getState().nodes['1']).toBeUndefined();
    expect(useGraphStore.getState().nodes['2']).toBeDefined();
    expect(useGraphStore.getState().edges['e1']).toBeUndefined();
  });

  it('should add an edge', () => {
     const edge: EdgeEntity = {
      id: 'e1',
      sourceId: '1',
      targetId: '2',
    };
    useGraphStore.getState().addEdge(edge);
    expect(useGraphStore.getState().edges['e1']).toEqual(edge);
  });

  it('should remove an edge', () => {
      const edge: EdgeEntity = {
      id: 'e1',
      sourceId: '1',
      targetId: '2',
    };
    useGraphStore.getState().addEdge(edge);
    useGraphStore.getState().removeEdge('e1');
    expect(useGraphStore.getState().edges['e1']).toBeUndefined();
  });
});
