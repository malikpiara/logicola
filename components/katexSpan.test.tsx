/**
 * KatexSpan rendering tests for the literal-dollar convention.
 *
 * The delimiter scanner treats every bare `$` as a math delimiter with
 * no escape handling, so content that needs a literal dollar amount
 * (Set R's pw "about $20 a day" passage) must ship it as an
 * inline-math dollar: `$\$20$`. These tests pin that convention: the
 * amount renders as "$20" (KaTeX markup containing the dollar sign),
 * and the surrounding prose stays plain text.
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
// The impl, not the lazy boundary: these tests pin the delimiter
// scanner's convention, and the boundary would suspend on first render.
import KatexSpan from './katexSpanImpl';

describe('KatexSpan — literal dollar amounts', () => {
  it('renders $\\$20$ as a dollar amount, leaving prose untouched', () => {
    const { container } = render(
      <KatexSpan text='The payments will only come to about $\$20$ a day. Now $\$20$ is not much at all these days.' />
    );

    const text = container.textContent!;
    // Prose retained on both sides of and between the two math regions
    expect(text).toContain('The payments will only come to about');
    expect(text).toContain('a day. Now');
    expect(text).toContain('is not much at all these days.');
    // Two KaTeX regions, each rendering the literal $20
    const katexNodes = container.querySelectorAll('.katex');
    expect(katexNodes).toHaveLength(2);
    for (const node of katexNodes) {
      expect(node.textContent).toContain('$20');
    }
    // Nothing swallowed: the prose between the delimiters must NOT have
    // been treated as math ("a day. Now" would vanish into a formula).
    expect(screen.queryByText(/a day\. Now/)).toBeTruthy();
  });

  it('does not treat dollar-free Set R passages as math', () => {
    const passage =
      'The sports hero Smith has a TV ad in which he says that Honda is the best car.';
    const { container } = render(<KatexSpan text={passage} />);
    expect(container.querySelectorAll('.katex')).toHaveLength(0);
    expect(container.textContent).toContain('sports hero Smith');
  });
});
