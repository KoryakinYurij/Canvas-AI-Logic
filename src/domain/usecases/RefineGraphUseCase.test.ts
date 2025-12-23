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
      setGraph: mockSetGraph,
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
        type: 'proposal',
        content: [
            { type: 'ADD_NODE', payload: { id: '2', type: 'topic', data: { title: 'New' }, position: {x:0,y:0}, dimensions: {width:100,height:100} } }
        ],
        message: 'Proposed'
      } as unknown as AIResponse), // Cast to unknown because payload might be incomplete mock
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

  it('should NOT update the store (Phase 3: Separation of Proposal and Application)', async () => {
    await useCase.execute('command');
    expect(mockSetGraph).not.toHaveBeenCalled();
  });

  it('should return the proposal', async () => {
    const result = await useCase.execute('command');
    expect(result.type).toBe('proposal');
    if (result.type === 'proposal') {
        expect(result.content).toHaveLength(1);
        expect(result.content[0].type).toBe('ADD_NODE');
    }
  });

  it('should throw error if connector fails', async () => {
    const error = new Error('AI Error');
    mockAIConnector.refineGraph = vi.fn().mockRejectedValue(error);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(useCase.execute('command')).rejects.toThrow(error);

    consoleSpy.mockRestore();
  });
});
