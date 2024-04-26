import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/sidebar';
import { useParams } from 'next/navigation';
import type { Mock } from 'vitest';

vitest.mock('next/navigation', () => ({
  useParams: vitest.fn(),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    (useParams as Mock).mockReturnValue({
      chapter: 'chapter1',
      subchapter: 'subchapter1',
      question: '1',
    });
  });

  it('renders the chapter accordion', () => {
    render(<Sidebar />);
    expect(screen.getByText('Basic Propositional Logic')).toBeInTheDocument();
  });
});
