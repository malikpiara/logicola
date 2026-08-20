import { describe, expect, it } from 'vitest';
import {
  gerund,
  verbThirdPerson,
  indefiniteArticle,
  indefiniteArticleCapitalized,
} from './grammar';
import {
  adjectives,
  baselines2008,
  nounsProfessions,
} from '@/content/lexicons';
import { generateSetA } from '@/content/sets/setA.generator';
import { generateSetJ } from '@/content/sets/setJ.generator';
import { generateSetL } from '@/content/sets/setL.generator';
import { generateSetN } from '@/content/sets/setN.generator';

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
            // REPAIRED 2026-08-20: the original regexes contained a literal
            // backspace byte (0x08) where \b was intended — the guard had
            // never matched anything since it was written. Once live, the
            // naive forms false-positived on legitimate text, so the shapes
            // are narrow: a real article error is lowercase "a" before a
            // lowercase vowel word, or sentence-initial "A" before one —
            // never "A is/isn't" (a wff mention, which hints quote) and
            // never mid-sentence capital A ("each A inherently B"). The
            // an-check excludes h: sound-based words (honest, hour) take
            // "an" correctly and the pools are vetted by indefiniteArticle.
            // The uni|use|one|eu exclusions mirror indefiniteArticle's
            // CONSONANT_SOUND_VOWEL_START list ("a universal", "a one").
            expect(text, `bad article: "${text}"`).not.toMatch(
              /(?:^|[\s‘"(])a (?!is\b|isn[’']t\b|uni|use|one\b|eu)[aeiou]/
            );
            // No sentence-initial capital-A rule: "A entails that T is
            // false" is a propositional letter, indistinguishable by shape
            // from a capitalized article error — and every capitalized
            // article in the app comes from indefiniteArticleCapitalized,
            // which shares the logic the lowercase rule already polices.
            expect(text, `bad article: "${text}"`).not.toMatch(
              /\b[Aa]n (?![’'])[b-df-gj-np-tv-z]/i
            );
          }
        }
      }
    }
  });
});

describe('verbThirdPerson', () => {
  it('shares the pluralize rule', () => {
    expect(verbThirdPerson('complain')).toBe('complains');
    expect(verbThirdPerson('guess')).toBe('guesses');
    expect(verbThirdPerson('binge')).toBe('binges');
    expect(verbThirdPerson('pray')).toBe('prays');
  });
});

describe('gerund', () => {
  it('drops silent e, keeps digraph e, preserves binge', () => {
    expect(gerund('hesitate')).toBe('hesitating');
    expect(gerund('argue')).toBe('arguing');
    expect(gerund('apologize')).toBe('apologizing');
    expect(gerund('commute')).toBe('commuting');
    expect(gerund('binge')).toBe('bingeing');
    // Final-stress polysyllables double; found latent by the attestation
    // audit — 'upseting' has a wordfreq Zipf of exactly 0.00.
    expect(gerund('upset')).toBe('upsetting');
    expect(gerund('regret')).toBe('regretting');
  });

  it('handles doubling and digraphs like superlative() does', () => {
    expect(gerund('chat')).toBe('chatting');
    expect(gerund('run')).toBe('running');
    expect(gerund('steal')).toBe('stealing');
    expect(gerund('travel')).toBe('traveling');
    expect(gerund('ghost')).toBe('ghosting');
    expect(gerund('scroll')).toBe('scrolling');
  });

  /**
   * End-to-end, because "hesitateing" reached committed snapshots without
   * any test noticing — the guard reads rendered output, like the article
   * sweep above.
   */
  it('Sets L and N emit no broken gerund', () => {
    for (const generate of [generateSetL, generateSetN]) {
      for (let seed = 1; seed <= 120; seed++) {
        for (const subSet of generate(seed, 8).subSets) {
          for (const q of subSet.questions) {
            const text = q.prompt.replace(/bingeing/gi, '');
            expect(text, `broken gerund: "${q.prompt}"`).not.toMatch(/eing\b/);
          }
        }
      }
    }
  });
});
