import { describe, expect, it } from 'vitest';
import { patternKindForSubSet } from './patternLayer';

describe('patternKindForSubSet — camo classic (easy) vs giant (hard)', () => {
  it('hard slugs wear camo giant', () => {
    expect(
      patternKindForSubSet({
        slugs: ['syllogistic', 'translations', 'hard'],
        title: 'Syllogistic Translations: Hard',
      })
    ).toBe('camo-giant');
  });

  it('a Hard title alone is enough (belt and braces)', () => {
    expect(patternKindForSubSet({ slugs: [], title: 'Anything: Hard' })).toBe(
      'camo-giant'
    );
  });

  it('easy and unpaired subsets wear camo classic', () => {
    expect(
      patternKindForSubSet({
        slugs: ['syllogistic', 'translations', 'basic'],
        title: 'Syllogistic Translations: Easy',
      })
    ).toBe('camo');
    // Outside an Easy/Hard pair — counts as easy until Malik says otherwise.
    expect(
      patternKindForSubSet({
        slugs: ['informal', 'fallacies'],
        title: 'Informal Fallacies',
      })
    ).toBe('camo');
  });
});
