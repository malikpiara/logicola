import { describe, expect, it } from 'vitest';
import {
  END_SCREEN_PRAISE,
  praiseFor,
  praiseStrings,
  withoutBang,
} from './praise';

describe('end screen praise — Gensler’s words, not ours', () => {
  it('every line is one of the 2008 strings once the "!" comes off', () => {
    // The whole reason praise.ts exists as a module rather than an inline
    // array: a typo here would put words in Gensler's mouth.
    for (const line of END_SCREEN_PRAISE) {
      expect(praiseStrings).toContain(withoutBang(line));
    }
  });

  it('every line carries the exclamation mark, which 2008 did not', () => {
    for (const line of END_SCREEN_PRAISE) {
      expect(line.endsWith('!')).toBe(true);
      // ...and the source string must NOT already have one, or the
      // departure would be silently undone by a lexicon edit.
      expect(praiseStrings).not.toContain(line);
    }
  });

  it('is the five person-directed lines', () => {
    expect([...END_SCREEN_PRAISE]).toEqual([
      'Logic whiz!',
      'A logic brain!',
      'Sharp student!',
      'Pretty smart!',
      'What a brain!',
    ]);
  });
});

describe('praiseFor', () => {
  it('is stable for a seed', () => {
    expect(praiseFor(7)).toBe(praiseFor(7));
  });

  it('covers the whole pool across seeds', () => {
    const seen = new Set(Array.from({ length: 40 }, (_, i) => praiseFor(i)));
    expect(seen.size).toBe(END_SCREEN_PRAISE.length);
  });

  it('survives a negative seed', () => {
    // Date.now()-style seeds are positive, but a caller passing a delta or a
    // hash could go negative and an out-of-range index would render
    // "undefined" as the headline.
    expect(END_SCREEN_PRAISE).toContain(praiseFor(-3) as never);
  });
});
