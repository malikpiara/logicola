import { describe, expect, it } from 'vitest';
import { loadPublishedQuizSubSet } from './publishedQuizLookup';

/**
 * These tests pin the loader's tagged-union return shape. Pre.4 added
 * the `runtime: 'static' | 'generated'` discriminator; before any
 * generator is registered, every catalog entry resolves to `static`.
 *
 * As generators ship (T1.2..T1.6) and entries move from
 * `staticLoaders` to `generatedRoutes` in publishedQuizLookup.ts,
 * update the assertions below to reflect the move.
 */
describe('loadPublishedQuizSubSet', () => {
  it('returns null for unknown slugs', async () => {
    const result = await loadPublishedQuizSubSet([
      'nonexistent',
      'route',
      'path',
    ]);
    expect(result).toBeNull();
  });

  it('resolves Set Q (informal/definitions) as static', async () => {
    const result = await loadPublishedQuizSubSet([
      'informal',
      'definitions',
      'quiz',
    ]);
    expect(result).not.toBeNull();
    if (result === null) return;
    expect(result.runtime).toBe('static');
    if (result.runtime === 'static') {
      expect(result.subSet).toBeDefined();
      expect(result.subSet.questions.length).toBeGreaterThan(0);
    }
  });

  it('resolves Set A basic via the generator (post-T1.5)', async () => {
    const result = await loadPublishedQuizSubSet([
      'syllogistic',
      'translations',
      'basic',
      'quiz',
    ]);
    expect(result).not.toBeNull();
    if (result === null) return;
    expect(result.runtime).toBe('generated');
    if (result.runtime === 'generated') {
      expect(result.setKey).toBe('setA');
      expect(result.subsetIndex).toBe(0);
    }
  });

  it('resolves Set A hard via the generator (post-T1.5)', async () => {
    const result = await loadPublishedQuizSubSet([
      'syllogistic',
      'translations',
      'hard',
      'quiz',
    ]);
    expect(result).not.toBeNull();
    if (result === null) return;
    expect(result.runtime).toBe('generated');
    if (result.runtime === 'generated') {
      expect(result.setKey).toBe('setA');
      expect(result.subsetIndex).toBe(1);
    }
  });

  it('resolves Set N basic via the generator (post-T1.2)', async () => {
    const result = await loadPublishedQuizSubSet([
      'belief',
      'translations',
      'basic',
      'quiz',
    ]);
    expect(result).not.toBeNull();
    if (result === null) return;
    expect(result.runtime).toBe('generated');
    if (result.runtime === 'generated') {
      expect(result.setKey).toBe('setN');
      expect(result.subsetIndex).toBe(0);
    }
  });
});
