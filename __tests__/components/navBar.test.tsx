import { render, screen } from '@testing-library/react';
import Navbar from '@/components/navbar';
import { content } from '@/content';

describe('Navbar', () => {
  it('renders the logo and title', () => {
    render(<Navbar chapters={content.chapters} />);
    expect(screen.getByAltText('Logicola')).toBeInTheDocument();
    expect(screen.getByText('LogiCola')).toBeInTheDocument();
  });

  it('renders the chapters dropdown', () => {
    render(<Navbar chapters={content.chapters} />);
    expect(screen.getByText('Chapters')).toBeInTheDocument();
  });

  it('renders the donate link', () => {
    render(<Navbar chapters={content.chapters} />);
    expect(screen.getByText('Donate')).toBeInTheDocument();
  });
});
