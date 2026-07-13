import { describe, expect, it } from 'vitest';
import {
  getGenerator,
  registeredSetKeys,
  type GeneratedSetKey,
} from './generators';

describe('generators dispatcher', () => {
  it('returns undefined for unregistered keys', () => {
    // Cast through unknown — we want to test the runtime behavior
    // when an unknown string is passed (e.g., a typo or a setKey
    // that hasn't been wired yet).
    const result = getGenerator(
      'setDoesNotExist' as unknown as GeneratedSetKey
    );
    expect(result).toBeUndefined();
  });

  it('registeredSetKeys returns the currently registered generators', () => {
    const keys = registeredSetKeys();
    expect(keys).toContain('setA'); // T1.5 (May 9, 2026)
    expect(keys).toContain('setC'); // T1.6 (May 10, 2026)
    expect(keys).toContain('setJ'); // T1.4 (May 10, 2026)
    expect(keys).toContain('setL'); // T1.3 (May 10, 2026)
    expect(keys).toContain('setN'); // T1.2 (May 10, 2026)
  });

  it('getGenerator returns a callable function for setA', () => {
    const gen = getGenerator('setA');
    expect(gen).toBeDefined();
    const out = gen!(42, 3);
    expect(out.subSets.length).toBe(2);
    expect(out.subSets[0]!.questions.length).toBe(3);
  });
});
