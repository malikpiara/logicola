/**
 * English grammar helpers for the question generators.
 *
 * Exists because of a constraint Gensler observed but never wrote down:
 * the 2008 lexicons contain **no vowel-initial entries at all** — zero
 * across 52 professions and 87 adjectives. That is not chance. It let the
 * templates hardcode the article ("is a $C person"), and the article was
 * always right because no drawn word could ever need "an".
 *
 * The modern layer in content/lexicons.ts breaks that constraint on
 * purpose: refusing every word starting with a, e, i, o or u would cost
 * `nurse`/`engineer`/`honest`/`optimistic` and would keep the initial-letter
 * spread as narrow as it was, which was one of the things the layer set out
 * to fix. So the templates learn the rule instead.
 *
 * Set J was already getting this wrong before any of that: templates *26
 * and *29 pick from {contingent, accidental} and {necessary, essential} and
 * emit "is a accidental property" roughly half the time (Malik, 2026-08-19
 * — 290 distinct broken prompts across 300 seeds).
 */

/**
 * Words that start with a vowel LETTER but a consonant SOUND, so they take
 * "a". Nearly all are the "yoo" onset (`university`, `unique`) plus the
 * "wun" onset of `one`.
 */
const CONSONANT_SOUND_VOWEL_START = [
  'eulogy',
  'european',
  'ewe',
  'once',
  'one',
  'ubiquitous',
  'unicorn',
  'uniform',
  'union',
  'unique',
  'unit',
  'united',
  'universal',
  'university',
  'usage',
  'use',
  'useful',
  'usual',
  'utensil',
  'utopia',
];

/**
 * Words that start with a consonant LETTER but a vowel SOUND, so they take
 * "an". English silent-h, essentially — `honest` is the one that matters
 * here, since it is in the adjective pool.
 */
const VOWEL_SOUND_CONSONANT_START = [
  'heir',
  'heiress',
  'honest',
  'honestly',
  'honor',
  'honorable',
  'honour',
  'honourable',
  'hour',
  'hourly',
];

/**
 * The correct indefinite article for `word` — "a" or "an".
 *
 * Sound, not spelling: "an honest logician", "a university". Matching is on
 * the first whitespace-delimited token so a phrase can be passed through
 * ("efficient logician" resolves on "efficient").
 */
export function indefiniteArticle(word: string): 'a' | 'an' {
  const first = word.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  if (!first) return 'a';
  if (VOWEL_SOUND_CONSONANT_START.includes(first)) return 'an';
  if (CONSONANT_SOUND_VOWEL_START.includes(first)) return 'a';
  return /^[aeiou]/.test(first) ? 'an' : 'a';
}

/** `indefiniteArticle`, capitalised — for phrases that open a sentence. */
export function indefiniteArticleCapitalized(word: string): 'A' | 'An' {
  return indefiniteArticle(word) === 'an' ? 'An' : 'A';
}

/** "an honest logician" — the article and the phrase, joined. */
export function withArticle(phrase: string): string {
  return `${indefiniteArticle(phrase)} ${phrase}`;
}
