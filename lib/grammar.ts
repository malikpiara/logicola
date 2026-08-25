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

/**
 * Verbs whose final silent `e` survives -ing, because dropping it would
 * collapse a soft g/soft c onto the suffix: "binging" reads as /bɪŋɪŋ/.
 * AP and Merriam-Webster both prefer the -e- spellings.
 */
const GERUND_KEEPS_E: readonly string[] = ['binge', 'singe', 'tinge'];

/**
 * Multi-syllable verbs that double their final consonant because the stress
 * falls on the last syllable ("upsetting", "regretting"). The CVC regex below
 * only proves doubling for monosyllables — stress is not recoverable from
 * spelling, so the polysyllables are enumerated. `upset` is the only pool
 * verb affected today (latently: verbsA has no gerund consumer), found by the
 * attestation audit of 2026-08-20; the others are here so the next vocabulary
 * round doesn't re-discover this the way the e-drop verbs were discovered.
 */
const GERUND_DOUBLES: readonly string[] = [
  'upset',
  'regret',
  'admit',
  'commit',
  'forget',
  'begin',
  'refer',
  'occur',
  'prefer',
  'permit',
];

/**
 * The -ing form of `verb`.
 *
 * Until 2026-08-20 both Set L and Set N carried a private one-line version
 * of this ("verb + 'ing'") whose comment claimed e-final verbs "aren't in
 * the current pool". That was true of the 2008 pool and silently broken by
 * the modern layer — "hesitateing" and "argueing" reached committed
 * snapshots before anyone read the output. Same species as the indefinite-
 * article bug above: an unwritten 2008 constraint, violated the first time
 * the vocabulary moved. The morphology below mirrors superlative() in
 * setA.generator.ts: handle the rule, keep the exceptions in a named list.
 */
export function gerund(verb: string): string {
  if (GERUND_KEEPS_E.includes(verb)) return verb + 'ing';
  if (GERUND_DOUBLES.includes(verb)) return verb + verb.slice(-1) + 'ing';
  if (verb.endsWith('ie')) return verb.slice(0, -2) + 'ying';
  if (verb.endsWith('e') && !/[eoy]e$/.test(verb))
    return verb.slice(0, -1) + 'ing';
  // Monosyllabic consonant-vowel-consonant doubles: "chat" → "chatting".
  // The single-[aeiou] requirement keeps vowel digraphs safe ("steal" →
  // "stealing") and multisyllables take US spelling ("travel" → "traveling").
  if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(verb))
    return verb + verb.slice(-1) + 'ing';
  return verb + 'ing';
}

/**
 * Third-person singular of `verb` ("Every economist complains").
 *
 * English 3sg -s follows the same rule as noun pluralization — sibilants
 * take -es ("guesses"), consonant-y takes -ies, everything else -s. All
 * 41 verbsB forms were attestation-checked on 2026-08-20 (none score
 * Zipf 0.00). The rule's ONLY failure modes are the irregular verbs
 * go/do/have/be — none is in any pool, and lexicons.test.ts guards the
 * door, because "every economist gos" is one careless addition away.
 */
export function verbThirdPerson(verb: string): string {
  if (/(s|x|z|ch|sh)$/.test(verb)) return verb + 'es';
  if (/[^aeiou]y$/.test(verb)) return verb.slice(0, -1) + 'ies';
  return verb + 's';
}
