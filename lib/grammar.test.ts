import { describe, expect, it } from 'vitest';
import { indefiniteArticle, indefiniteArticleCapitalized } from './grammar';
import {
  adjectives,
  baselines2008,
  nounsProfessions,
} from '@/content/lexicons';
import { generateSetA } from '@/content/sets/setA.generator';
import { generateSetJ } from '@/content/sets/setJ.generator';

describe('indefiniteArticle', () => {
  it('goes by sound, not spelling', () => {
    // consonant letter, vowel sound
    expect(indefiniteArticle('honest')).toBe('an');
    expect(indefiniteArticle('hour')).toBe('an');
    // vowel letter, consonant sound
    expect(indefiniteArticle('university')).toBe('a');
    expect(indefiniteArticle('one')).toBe('a');
    expect(indefiniteArticle('european')).toBe('a');
  });

  it('handles the ordinary cases', () => {
    expect(indefiniteArticle('engineer')).toBe('an');
    expect(indefiniteArticle('optician')).toBe('an');
    expect(indefiniteArticle('nurse')).toBe('a');
    expect(indefiniteArticle('cheerful')).toBe('a');
  });

  it('resolves on the first word of a phrase', () => {
    expect(indefiniteArticle('efficient logician')).toBe('an');
    expect(indefiniteArticle('cheerful architect')).toBe('a');
  });

  it('is case-insensitive and capitalises on demand', () => {
    expect(indefiniteArticle('Honest')).toBe('an');
    expect(indefiniteArticleCapitalized('optimistic')).toBe('An');
    expect(indefiniteArticleCapitalized('nurse')).toBe('A');
  });

  it('does not throw on empty input', () => {
    expect(indefiniteArticle('')).toBe('a');
    expect(indefiniteArticle('   ')).toBe('a');
  });

  /**
   * The 2008 pools contain no vowel-initial entries — that is how the
   * templates got away with a hardcoded "a" for eighteen years. Pinned so
   * the discovery is not lost: if this fails, a baseline array was edited.
   */
  it('the 2008 baselines contain no vowel-initial entry', () => {
    for (const pool of ['adjectives', 'nounsProfessions'] as const) {
      for (const word of baselines2008[pool]) {
        expect(
          /^[aeiou]/i.test(word),
          `2008 ${pool} entry "${word}" is vowel-initial — baseline changed?`
        ).toBe(false);
      }
    }
  });

  /**
   * The modern layer deliberately breaks that constraint, which is the
   * whole reason this helper exists.
   */
  it('the modern layer does contain vowel-initial entries', () => {
    const vowelInitial = [...adjectives, ...nounsProfessions].filter((w) =>
      /^[aeiou]/i.test(w)
    );
    expect(vowelInitial.length).toBeGreaterThan(0);
    for (const word of vowelInitial) {
      expect(indefiniteArticle(word)).toBe('an');
    }
  });
});

/**
 * End-to-end guard. Set J shipped "is a accidental property" for 290
 * distinct prompts before this was caught by reading generated output
 * rather than by any test — so the regression test reads output too.
 */
describe('generated prompts take the right article', () => {
  it.each([
    ['setA', generateSetA],
    ['setJ', generateSetJ],
  ])('%s emits no "a <vowel>" or "an <consonant>"', (_name, generate) => {
    for (let seed = 1; seed <= 120; seed++) {
      for (const subSet of generate(seed, 8).subSets) {
        for (const question of subSet.questions) {
          const texts = [
            question.prompt,
            ...question.options.map((o) => o.hint ?? ''),
          ];
          for (const text of texts) {
            expect(text, `bad article: "${text}"`).not.toMatch(
              /[Aa] [aeiouAEIOU]/
            );
            expect(text, `bad article: "${text}"`).not.toMatch(
              /[Aa]n [b-df-hj-np-tv-z]/i
            );
          }
        }
      }
    }
  });
});
