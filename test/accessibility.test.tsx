import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VisualNodeCard } from '../src/presentation/organisms/VisualNodeCard';
import React from 'react';

// Mock dependencies
vi.mock('@domain/graph/useGraphStore', () => ({
  useGraphStore: () => ({
    updateNode: vi.fn(),
  }),
}));

describe('VisualNodeCard Accessibility', () => {
  const mockNode = {
    id: '1',
    type: 'topic',
    data: { title: 'Test Node', body: 'Body text' },
    position: { x: 0, y: 0 },
    dimensions: { width: 100, height: 100 },
  };

  it('should have correct accessibility attributes', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { getByRole } = render(<VisualNodeCard node={mockNode as any} />);
    const card = getByRole('button');

    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label', 'Node: Test Node');
  });

  it('should toggle selection on Enter key', () => {
    const onSelect = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { getByRole } = render(<VisualNodeCard node={mockNode as any} onSelect={onSelect} />);
    const card = getByRole('button');

    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('should toggle selection on Space key', () => {
    const onSelect = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { getByRole } = render(<VisualNodeCard node={mockNode as any} onSelect={onSelect} />);
    const card = getByRole('button');

    fireEvent.keyDown(card, { key: ' ' });
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
