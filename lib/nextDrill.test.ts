import { describe, expect, it } from 'vitest';
import { nextDrillAfter, nextDrillLabel } from './nextDrill';
import { quizCatalog } from './quizCatalog';

describe('nextDrillAfter — the next drill inside the same set', () => {
  it('Set A: Easy hands off to Hard', () => {
    const next = nextDrillAfter(['syllogistic', 'translations', 'basic']);
    expect(next?.title).toBe('Syllogistic Translations: Hard');
  });

  it('Set C: Easy hands off to Hard', () => {
    const next = nextDrillAfter(['propositional', 'translations']);
    expect(next?.title).toBe('Propositional Translations: Hard');
  });

  it('Set N chains all three', () => {
    expect(nextDrillAfter(['belief', 'translations', 'basic'])?.title).toBe(
      'Belief Translations: Willing'
    );
    expect(nextDrillAfter(['belief', 'translations', 'willing'])?.title).toBe(
      'Belief Translations: Rationality'
    );
  });

  it('the last drill of a set has no next', () => {
    expect(
      nextDrillAfter(['syllogistic', 'translations', 'hard'])
    ).toBeUndefined();
    expect(
      nextDrillAfter(['belief', 'translations', 'rationality'])
    ).toBeUndefined();
  });

  it('never crosses into another set', () => {
    // Set A Hard is followed in the FILE by Set C Easy. Adjacency in the
    // catalog is not a curriculum — see the module note.
    const setAHard = quizCatalog.findIndex(
      (e) => e.title === 'Syllogistic Translations: Hard'
    );
    expect(quizCatalog[setAHard + 1]?.chapter).toBe('Set C');
    expect(
      nextDrillAfter(['syllogistic', 'translations', 'hard'])
    ).toBeUndefined();
  });

  it('single-drill sets (Q, R) have no next', () => {
    expect(nextDrillAfter(['informal', 'definitions'])).toBeUndefined();
    expect(nextDrillAfter(['informal', 'fallacies'])).toBeUndefined();
  });

  it('tolerates the route form and mixed case, like the lookup does', () => {
    expect(
      nextDrillAfter(['Syllogistic', 'Translations', 'Basic', 'quiz'])?.title
    ).toBe('Syllogistic Translations: Hard');
  });

  it("Set L's capitalised content slugs still resolve", () => {
    // content/sets/setL.generator.ts ships ['Deontic', 'translations',
    // 'Imperative'] — the one set whose SubSet.slugs are not lowercase.
    // Case folding lives in getQuizRouteKey, and this is the case that
    // proves we go through it.
    expect(
      nextDrillAfter(['Deontic', 'translations', 'Imperative'])?.title
    ).toBe('Deontic Translations: Deontic');
  });

  it('an unknown drill has no next rather than the first one', () => {
    expect(nextDrillAfter(['nope', 'not-a-drill'])).toBeUndefined();
  });
});

describe('nextDrillLabel', () => {
  it('names the hard set as the hard set', () => {
    const next = nextDrillAfter(['syllogistic', 'translations', 'basic'])!;
    expect(nextDrillLabel(next)).toBe('Try the hard set');
  });

  it('names other successors by their own variant', () => {
    const next = nextDrillAfter(['modal', 'translations', 'basic'])!;
    expect(nextDrillLabel(next)).toBe('Next: Quantified');
  });

  it('falls back to the whole title when there is no variant', () => {
    expect(
      nextDrillLabel({
        chapter: 'Set Z',
        title: 'Something Undivided',
        description: '',
        slugs: [],
        quizPath: '/',
      })
    ).toBe('Next: Something Undivided');
  });

  it('every real successor gets a label that reads out of context', () => {
    for (const entry of quizCatalog) {
      const next = nextDrillAfter(entry.slugs);
      if (!next) continue;
      const label = nextDrillLabel(next);
      // WCAG 2.4.4: no bare variant words like "Hard" or "Willing".
      expect(label.split(' ').length).toBeGreaterThan(1);
    }
  });
});
