import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RefineGraphUseCase } from './RefineGraphUseCase';
import { AIConnector, AIResponse } from '../ports/AIConnector';

// Mock the store
const mockSetGraph = vi.fn();
vi.mock('../graph/useGraphStore', () => ({
  useGraphStore: {
    getState: vi.fn(() => ({
      nodes: { '1': { id: '1', type: 'topic', data: { title: 'Test', body: 'Body' }, position: {x:0,y:0}, dimensions: {width:100,height:100} } },
      edges: {},
      metadata: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setGraph: (graph: any) => mockSetGraph(graph),
    })),
  },
}));

describe('RefineGraphUseCase', () => {
  let useCase: RefineGraphUseCase;
  let mockAIConnector: AIConnector;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAIConnector = {
      generateGraph: vi.fn(),
      refineGraph: vi.fn().mockResolvedValue({
        type: 'graph',
        content: {
          nodes: { '2': { id: '2', type: 'topic', data: { title: 'New', body: 'New' }, position: {x:0,y:0}, dimensions: {width:100,height:100} } },
          edges: {},
          metadata: {},
        },
        message: 'Updated'
      } as AIResponse),
    };
    useCase = new RefineGraphUseCase(mockAIConnector);
  });

  it('should call aiConnector.refineGraph with current graph and command', async () => {
    const command = 'add a node';
    await useCase.execute(command);

    expect(mockAIConnector.refineGraph).toHaveBeenCalledWith(
      expect.objectContaining({
        nodes: expect.any(Object),
      }),
      command
    );
  });

  it('should update the store with the new graph if response type is graph', async () => {
    await useCase.execute('command');
    expect(mockSetGraph).toHaveBeenCalledWith(
      expect.objectContaining({
        nodes: expect.objectContaining({ '2': expect.any(Object) }),
      })
    );
  });

  it('should NOT update the store if response type is text', async () => {
     mockAIConnector.refineGraph = vi.fn().mockResolvedValue({
        type: 'text',
        content: 'Just chatting'
      } as AIResponse);

    const result = await useCase.execute('hello');
    expect(result.type).toBe('text');
    expect(mockSetGraph).not.toHaveBeenCalled();
  });

  it('should throw error if connector fails', async () => {
    const error = new Error('AI Error');
    mockAIConnector.refineGraph = vi.fn().mockRejectedValue(error);

    // Suppress console.error for this specific test to avoid noise in output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(useCase.execute('command')).rejects.toThrow(error);

    consoleSpy.mockRestore();
  });
});
