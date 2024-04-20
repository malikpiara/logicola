import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '../app/page';

test('Page', () => {
  render(<Page />);
  expect(screen.getByText('What is LogiCola?')).toBeDefined();
});
