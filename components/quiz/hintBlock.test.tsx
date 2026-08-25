// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HintBlock, hintPartsOf, proseSegments } from './hintBlock';

describe('proseSegments — the hint markup grammar', () => {
  it('passes plain prose through untouched', () => {
    expect(proseSegments('Never affirm the consequent.')).toEqual([
      { type: 'prose', text: 'Never affirm the consequent.' },
    ]);
  });

  it('chips an ∴ inference to the end of its sentence', () => {
    expect(proseSegments('Most people believe A. ∴ A is true.')).toEqual([
      { type: 'prose', text: 'Most people believe A. ' },
      { type: 'chip', text: '∴ A is true' },
      { type: 'prose', text: '.' },
    ]);
  });

  it('extracts *emphasis* runs (the 0xBD byte, restored)', () => {
    expect(
      proseSegments(
        'the authority *must* be right (and isn’t just probably right).'
      )
    ).toEqual([
      { type: 'prose', text: 'the authority ' },
      { type: 'em', text: 'must' },
      { type: 'prose', text: ' be right (and isn’t just probably right).' },
    ]);
  });

  it('handles a gloss holding both markups', () => {
    const segs = proseSegments('A *always* holds. ∴ B is true. And so on.');
    expect(segs).toEqual([
      { type: 'prose', text: 'A ' },
      { type: 'em', text: 'always' },
      { type: 'prose', text: ' holds. ' },
      { type: 'chip', text: '∴ B is true' },
      { type: 'prose', text: '. And so on.' },
    ]);
  });
});

describe('hintPartsOf', () => {
  const base = { id: 0, label: 'x' };

  it('prefers the structured hint', () => {
    const parts = { term: 'Post hoc', lead: 'After ≠ because.' };
    expect(hintPartsOf({ ...base, hint: 'flat', hintParts: parts })).toBe(
      parts
    );
  });

  it('falls back to the flat string as a bare lead', () => {
    expect(hintPartsOf({ ...base, hint: 'flat gloss' })).toEqual({
      lead: 'flat gloss',
    });
  });

  it('returns undefined when the option has no hint at all', () => {
    expect(hintPartsOf(base)).toBeUndefined();
  });
});

describe('HintBlock', () => {
  it('runs the term into the sentence, 2008-style, and lists the clauses', () => {
    const { container } = render(
      <HintBlock
        hint={{
          term: 'Appeal to authority',
          lead: 'This is fallacious if:',
          clauses: [
            'the person isn’t an authority on the subject',
            'the argument concludes that the authority *must* be right',
          ],
        }}
      />
    );

    const head = container.querySelector('.qhint-head')!;
    expect(head.textContent).toContain(
      'Appeal to authority. This is fallacious if:'
    );

    const items = container.querySelectorAll('.qhint-clauses li');
    expect(items).toHaveLength(2);
    expect(items[1]!.querySelector('em')!.textContent).toBe('must');
  });

  it('runs straight on when the lead opens on a parenthetical', () => {
    const { container } = render(
      <HintBlock
        hint={{ term: 'Ad hominem', lead: '(“personal attack”). This is…' }}
      />
    );
    expect(container.querySelector('.qhint-head')!.textContent).toContain(
      'Ad hominem (“personal attack”). This is…'
    );
  });

  it('renders a bare-lead hint (flat fallback) with the lamp only', () => {
    render(<HintBlock hint={{ lead: 'Wrong: ‘∼’ negates.' }} />);
    expect(screen.queryByText('.')).toBeNull();
    expect(document.querySelector('.qhint-term')).toBeNull();
    expect(document.querySelector('.qhint-lamp')).not.toBeNull();
  });
});
