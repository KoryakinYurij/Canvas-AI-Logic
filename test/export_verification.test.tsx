import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ChatSidebar } from '../src/presentation/organisms/ChatSidebar';
import React from 'react';

// Mock dependencies
vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,fake'),
}));

// Mock HTMLElement.prototype.scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Correctly mock zustand store hook - using factory function to avoid hoisting issues
vi.mock('@domain/graph/useGraphStore', () => {
  const mockClearGraph = vi.fn();
  const mockGetState = vi.fn().mockReturnValue({ nodes: {}, edges: {} });

  const useGraphStore = () => ({
    nodes: {},
    edges: {},
    clearGraph: mockClearGraph,
  });

  // Attach getState to the hook function itself, as zustand does
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (useGraphStore as any).getState = mockGetState;

  return {
    useGraphStore
  };
});

vi.mock('../src/di', () => ({
    refineGraphUseCase: {
        execute: vi.fn()
    }
}));

describe('ChatSidebar Export', () => {
  it('should attempt to find the canvas element by ID when export is clicked', async () => {
    // Mock document.getElementById
    const mockElement = document.createElement('div');
    mockElement.id = 'canvas-export-root';
    document.body.appendChild(mockElement);

    const getElementSpy = vi.spyOn(document, 'getElementById');

    // Render the component
    const { getByTitle } = render(<ChatSidebar />);

    // Open the sidebar first (it's closed by default)
    const openButton = document.querySelector('button[aria-label="Open Chat"]');
    if (openButton) {
        fireEvent.click(openButton);
    } else {
        // If it renders closed, we need to open it
        const button = document.querySelector('button');
        if (button) fireEvent.click(button);
    }

    // Find and click the export button
    const exportButton = getByTitle('Export PNG');
    fireEvent.click(exportButton);

    // Verify getElementById was called with the correct ID
    expect(getElementSpy).toHaveBeenCalledWith('canvas-export-root');

    // Cleanup
    document.body.removeChild(mockElement);
    vi.restoreAllMocks();
  });
});
