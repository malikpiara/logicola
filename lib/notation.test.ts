import { describe, expect, it } from 'vitest';
import { glyphsToLatex, hugNegation, latexToGlyphs } from './notation';

describe('hugNegation', () => {
  it('makes negation an ordinary atom so it hugs its operand', () => {
    expect(hugNegation('\\sim S \\cdot \\sim B')).toBe(
      '{\\sim}S \\cdot {\\sim}B'
    );
  });

  it('separates a negation glued to a preceding relation', () => {
    // `\supset \sim` merged into ONE relation atom, which is why the
    // gap landed between the negation and the letter it negates.
    expect(hugNegation('(I \\supset \\sim T)')).toBe('(I \\supset {\\sim}T)');
  });

  it('leaves other operators alone', () => {
    const untouched = '(C \\cdot (S \\vee M))';
    expect(hugNegation(untouched)).toBe(untouched);
  });

  it('never eats a longer macro that merely starts with sim', () => {
    expect(hugNegation('\\simeq X')).toBe('\\simeq X');
  });

  it('is idempotent', () => {
    const once = hugNegation('\\sim P');
    expect(hugNegation(once)).toBe(once);
  });
});

describe('latexToGlyphs', () => {
  it('renders the fallback in notation rather than source', () => {
    // The exact string that was appearing on screen before the fix.
    expect(latexToGlyphs('$ (C \\cdot (S \\vee M)) $')).toBe('(C · (S ∨ M))');
  });

  it('covers every operator the sets actually emit', () => {
    expect(
      latexToGlyphs(
        '$\\square P \\lozenge Q \\sim R \\cdot S \\vee T \\supset U \\equiv V \\exists W$'
      )
    ).toBe('☐P ◇Q ∼R · S ∨ T ⊃ U ≡ V ∃W');
  });

  it('keeps the letter when an underline cannot survive plain text', () => {
    expect(latexToGlyphs('$\\underline{P} \\supset Q$')).toBe('P ⊃ Q');
  });

  it('undoes hugNegation braces too', () => {
    expect(
      latexToGlyphs('$' + hugNegation('\\sim S \\cdot \\sim B') + '$')
    ).toBe('∼S · ∼B');
  });

  it('leaves prose outside the delimiters untouched', () => {
    expect(latexToGlyphs('Translates as $\\sim P$ in symbols.')).toBe(
      'Translates as ∼P in symbols.'
    );
  });

  it('drops backtick delimiters from hint strings', () => {
    expect(latexToGlyphs('use `∼P` here')).toBe('use ∼P here');
  });

  it('passes through text with no math at all', () => {
    expect(latexToGlyphs('You aren’t a logical professor.')).toBe(
      'You aren’t a logical professor.'
    );
  });
});

describe('glyphsToLatex', () => {
  it('round-trips back through latexToGlyphs', () => {
    const glyphs = '∼P · ◇Q ⊃ ☐R';
    expect(latexToGlyphs(`$${glyphsToLatex(glyphs)}$`)).toBe(glyphs);
  });

  it('keeps the trailing space that separates a macro from its operand', () => {
    // `\simP` would tokenise as one unknown macro.
    expect(glyphsToLatex('∼P')).toBe('\\sim P');
  });
});
