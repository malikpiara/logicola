import { describe, expect, it } from 'vitest';
import { getGenerator, registeredSetKeys } from '@/content/generators';
import { setQ } from '@/content/sets/setQ';
import type { SubSet } from '@/content/types';
import { getQuizRouteKey, quizCatalog } from './quizCatalog';

/**
 * `SubSet.description` (rendered on the quiz start screen) and
 * `QuizCatalogEntry.description` (the route's meta description) are the same
 * sentence held in two places: `generateMetadata` can read the catalog JSON
 * without running a generator, which the subsets would require. That
 * duplication is the price of a cheap metadata path — these tests are what
 * stop the two drifting, so a reworded start screen can't silently leave a
 * stale sentence in search results.
 */
function everySubSet(): SubSet[] {
  const generated = registeredSetKeys().flatMap((key) => {
    // Seeded and drawn at one question per subset: we only want the subsets'
    // metadata here, not their questions.
    const generator = getGenerator(key);
    return generator ? generator(1, 1).subSets : [];
  });
  return [...generated, ...setQ.subSets];
}

describe('quiz catalog', () => {
  const byRoute = new Map(
    everySubSet().map((subSet) => [getQuizRouteKey(subSet.slugs), subSet])
  );

  it('covers every published subset exactly once', () => {
    expect(quizCatalog).toHaveLength(byRoute.size);
  });

  it.each(quizCatalog)('$title matches its subset', (entry) => {
    const subSet = byRoute.get(getQuizRouteKey(entry.slugs));

    expect(subSet, `no subset for ${entry.quizPath}`).toBeDefined();
    expect(entry.title).toBe(subSet!.title);
    expect(entry.description).toBe(subSet!.description);
  });

  it.each(quizCatalog)('$title has a usable meta description', (entry) => {
    // Google renders roughly 160 characters. `generateMetadata` appends a
    // 42-char suffix, so the catalog sentence has ~118 to play with — this
    // guards the ceiling rather than the exact rendered length.
    expect(entry.description.length).toBeGreaterThan(40);
    expect(entry.description.length).toBeLessThanOrEqual(118);
  });
});
