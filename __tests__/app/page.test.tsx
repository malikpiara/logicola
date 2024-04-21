import { render, screen } from '@testing-library/react';
import Page from '@/app/page';
import '@testing-library/jest-dom';

test('Page', () => {
  render(<Page />);
  expect(screen.getByText('What is LogiCola?')).toBeDefined();
});
