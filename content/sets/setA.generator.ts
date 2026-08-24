/**
 * Set A — Syllogistic Translations: live-random generator.
 *
 * Phase 1 / T1.5. Ports Gensler's 2008 LCEXE Set A as a procedural
 * drill engine. Coverage: all 23 original templates, the restored
 * only/none-but idiom (*23, mis-ported as All/Some until 2026-08-20 —
 * see template12/template23), and the per-mistake `*e`-block
 * explanations attached to wrong options via `Option.hint`. Every
 * wrong option carries a hint (pinned by test): the feedback slot in
 * `components/quiz/feedbackSlot.tsx` renders it after a miss, so a
 * hintless option would show the student a blank slot.
 *
 * The 2008 per-template `m:` letter-pair line ("the first letters
 * in 'Sally' and 'humorous'") is NOT a wrong-answer hint — in the
 * original it's instruction text for type-the-answer mode
 * ("Symbolize using $m"), a mode LC3 hasn't built yet. Source:
 * the original program for Set A.
 *
 * Letter convention (Gensler §2.1; verified against the original program
 * letter-binding block — dKJJ = lowercase name, dRJ = uppercase —
 * see the Set A fidelity audit):
 *
 *   Lowercase letter — singular term (picks out one individual)
 *     proper names (Sally → s; "G is C" is Gensler's canonical
 *       non-wff)
 *     "you" / "I" (pronouns)
 *     "the [SUPERLATIVE] X" (definite description picking out a
 *     unique individual)
 *     "this X" (demonstrative)
 *
 *   Uppercase letter — general term (class)
 *     "a [ADJ] X" (indefinite, referring to the class)
 *     "$ADJ people" (subject class defined by adjective)
 *     plural noun phrases ("biologists" → B)
 *     bare-adjective predicates ("...is rich" → R, the class of
 *       rich things — Gensler's syllogistic convention)
 */

import type { Option, Question, Set } from '../types';
import {
  rngFromSeed,
  pickFresh,
  pickFrom,
  noteUsed,
  isRecent,
  type Rng,
} from '@/lib/rng';
import {
  FANTASY_REALM,
  adjectives,
  names,
  nounsProfessions,
  verbsA,
  verbsB,
} from '../lexicons';
import {
  indefiniteArticle,
  indefiniteArticleCapitalized,
  verbThirdPerson,
} from '@/lib/grammar';

// =============================================================
// Lexicon — places (used for $p substitution)
// =============================================================

const places: readonly string[] = [
  'Berlin',
  'London',
  'Madrid',
  'Paris',
  'New York',
  'Moscow',
  'Boston',
  'Tokyo',
  'Rome',
  'Lisbon',
  'Hamburg',
  'Dallas',
  // Emended from the 2008 catalog's 'Kiev'. Ukraine asked for the
  // Ukrainian-derived 'Kyiv' in 1995, AP switched in 2019, and US
  // newsrooms have used it exclusively since 2022 — so to a student
  // this is no longer a neutral flavor word, it reads as taking a
  // side. This is the one class of stale vocabulary that frequency
  // data cannot find: the word is neither rare nor falling, it names
  // a RENAMED ENTITY. Guarded by the exonym sweep in
  // content/generators.test.ts. (Malik, 2026-08-20)
  'Kyiv',
  'Milan',
  'Bratislava',
  'Detroit',
  'Barcelona',
  'Santa Monica',
  'Mexico City',
  'Virginia',
  // Entries above are the 2008 catalog, order preserved. Entries below
  // are the top cities of actual drilling users per PostHog GeoIP
  // (quiz_started, logicola.org only, 180 days to 2026-08-19) —
  // hypothesis: prompts naming a student's own city read as written
  // for their classroom, not a 2008 American one. Place strings are
  // flavor only; no wff letter derives from them. (Malik, 2026-08-19)
  'Quezon City',
  'Manila',
  'Makati',
  'Caloocan',
  'Ottawa',
  'Toronto',
  'Sudbury',
  'Nairobi',
  'Singapore',
  'Saint Paul',
  'Minneapolis',
  'Newport News',
  // 'Providenciales' was here and is removed (2026-08-20). Turks and Caicos is
  // not a drilling population — it is where an Apple Private Relay or VPN
  // egress node geolocates. GeoIP city counts include relay exits, so presence
  // in the list is not evidence of a user; only session weight would be.
  // A third layer, and it answers to neither of the two above (Malik,
  // 2026-08-20). The 2008 entries are Gensler's; the block above them was
  // chosen because a student's own city reads as written for their classroom.
  // These are chosen for the opposite reason — nobody lives here. They pair
  // with the fictional names already in the pool (Batman and Bruce for Gotham,
  // six Westerosi for the rest), and their whole job is that a drill which
  // says "all dentists in Harrenhal" is a drill someone might remember.
  // Places carry no wff letter, so the pool is free in a way the others aren't.
] as const;

// The fantasy layer lives apart so that name-bearing templates can realm-match
// (see placeFor below). First-person and generic-noun templates draw from both
// pools — "I'm the meanest reporter in Gotham" has no name to contradict.
// Deactivating the fantasy layer = empty this array and FANTASY_NAMES.
/**
 * Realm place pools, expanded 2026-08-21 to follow the TAGGED roster —
 * every entry is some tagged character's home ground: Arkham (Batman,
 * Joker), Krypton and Smallville (Superman), Knowhere (Groot), Sakaar
 * (Hulk and Thor, per Ragnarok), the TVA (Loki), Casterly Rock
 * (Lannisters, Cersei, Tyrion), Dragonstone (Daenerys, Targaryens),
 * Braavos (Arya). Central City, Kamar-Taj and Themyscira were wanted
 * and are EXCLUDED for an architectural reason: their characters
 * (Barry, Stephen, Diana) live in the ambiguous channel, which never
 * draws realm places — a place no tagged character can visit serves
 * nobody. Titan fell to the one-word-one-meaning rule (the moon).
 */
const placesByRealm: Readonly<Record<string, readonly string[]>> = {
  westeros: [
    'Essos',
    'King’s Landing',
    'Harrenhal',
    'Winterfell',
    'Casterly Rock',
    'Dragonstone',
    'Braavos',
  ],
  dc: ['Gotham', 'Metropolis', 'Arkham', 'Krypton', 'Smallville'],
  // Knowhere was here for a day (2026-08-21): Zipf 1.54, the most
  // obscure place ever measured in — the pun carried it, and Malik
  // called it. Groot draws Sakaar and Wakanda instead.
  marvel: ['Asgard', 'Wakanda', 'Sakaar', 'the TVA'],
};

/**
 * The free-roaming templates (first-person, generic-noun) draw only the
 * MARQUEE fantasy places — the original eight. The 2026-08-21 additions
 * are realm-matched-only: they exist to enrich tagged-character prompts
 * ("Thanos in Sakaar"), and keeping them out of the free pool keeps the
 * 10% dosage guard's headroom intact.
 */
const PLACES_MARQUEE: readonly string[] = [
  'Essos',
  'King’s Landing',
  'Harrenhal',
  'Winterfell',
  'Gotham',
  'Metropolis',
  'Asgard',
  'Wakanda',
];

const placesAny: readonly string[] = [...places, ...PLACES_MARQUEE];

/**
 * Realm-matched place draw for templates that pair a NAME with a place.
 * "Daenerys in Winterfell" is a joke; "Batman is a bachelor in Rome" is a
 * glitch — and so, one level down, was "Loki in Gotham", which the first
 * version of this helper allowed. Realm is now per-franchise, and every
 * franchise carries at least two places so no name maps to a single city
 * (Malik, 2026-08-20).
 */
function placeFor(rng: Rng, name: string): string {
  const realm = FANTASY_REALM[name];
  return pickFresh(rng, realm ? placesByRealm[realm]! : places);
}

/**
 * The noun rule is deliberately ASYMMETRIC (Malik, 2026-08-20): a fantasy
 * class noun matches its realm strictly — "all Lannisters in Minneapolis"
 * reads as a glitch — but a real noun roams the full pool, because "all
 * bachelors in Essos" reads as the joke it is. Names get no such freedom
 * in placeFor above: a named individual has a home, a class doesn't.
 */
function placeForNoun(rng: Rng, noun: string): string {
  const realm = FANTASY_REALM[noun];
  return pickFresh(rng, realm ? placesByRealm[realm]! : placesAny);
}

// =============================================================
// Layer-2 hints — per-mistake explanations from 2008's `*e` block
// =============================================================

/**
 * Adjectives that take the inflected -est superlative cleanly.
 * Quick-win ported from 2008's `$Best` substitution; a full
 * port of the morphology rule is deferred (see the remaining template ports P2).
 * Adjectives outside this set fall through to "most X" form.
 */
const ESTREGULARS: ReadonlySet<string> = new Set([
  // Modern-layer adjectives; the 2008 morphology rule never saw these,
  // so the inflection is ours (Malik, 2026-08-19).
  'kind',
  'quiet',
  'quick',
  // `shy` inflects cleanly; `witty` would need y->i and `lovable` an -e drop,
  // which this rule does not do, so both fall through to "most X" (2026-08-20).
  'shy',
  'old',
  'young',
  'sad',
  'wise',
  'calm',
  'proud',
  'brave',
  'clean',
  'smart',
  'short',
  'tall',
  'wild',
  'tough',
  'rough',
  'weak',
  'mean',
  'poor',
  'rich',
  'bold',
  'bright',
  'slow',
  'dull',
  'cruel',
  'cheap',
  'strong',
]);

const NO_INFLECTION: ReadonlySet<string> = new Set(['cowardly', 'scholarly']);

const HINT_SWITCHED = 'Why did you switch the letters around?';
const HINT_FORGOT_NOT = 'You forgot the ‘not.’';
const HINT_PUT_NOT = 'Why did you put in the ‘not’?';
const HINT_15_ALL = 'This is an ‘all’-sentence.';
const HINT_16_COMMON_MISTAKE = 'People often get this one wrong.';
const HINT_17_NOT_SOME = '‘Not some’ means ‘none.’';
const HINT_19_AS_ARE_BS = 'Logicians take ‘As are Bs’ to mean ‘all A is B.’';
const HINT_20_AS_NOT_BS = 'Logicians take ‘As are not Bs’ to mean ‘no A is B.’';
const HINT_22_NOT_SINGLE =
  '‘Not a single one isn’t’ is the same as ‘Every one is.’';
/**
 * Ours, not Gensler's (2026-08-20): the 2008 *e block wrote no message
 * for the dropped-quantifier mistake, so 10 wrong options rendered a
 * BLANK feedback slot. The wording leans on the *w block's eight-forms
 * doctrine.
 */
const HINT_NO_QUANTIFIER =
  '‘A is B’ with two capital letters isn’t a wff — start with ‘all,’ ‘no,’ or ‘some.’';
/**
 * Gensler, near-verbatim from Introduction to Logic §2.4. Template *16
 * keeps his own *16-specific hint on the identical distractor — the
 * asymmetry is deliberate (Gensler-where-Gensler-wrote-one).
 */
const HINT_ALL_IS_NOT =
  'Never use ‘all A is not B’ — besides not being a wff, it’s ambiguous: it could mean ‘no A is B’ or ‘some A is not B.’';

/**
 * The contradictories quartet (2026-08-20 expansion, *24/*25). Grounded
 * in Gensler's own pedagogy: his footnote to exercise 2.4a #7 asks how
 * to refute "No one is happy unless they are rich" — find ONE
 * counterexample. Denial of a quantified sentence is its contradictory,
 * not its contrary.
 */
const HINT_CONTRADICTORY_ALL =
  'Denying ‘all A is B’ gives ‘some A is not B’ — one exception is enough to refute an ‘all.’';
const HINT_CONTRADICTORY_NO =
  'Denying ‘no A is B’ gives ‘some A is B’ — one example is enough to refute a ‘no.’';
const HINT_DROPPED_FALSE = 'You forgot the ‘It’s false that.’';
/** Parallel of HINT_15_ALL, for the negative conditional (*27). */
const HINT_NO_SENTENCE = 'This is a ‘no’-sentence.';
/** The predicate-first inversion (*30): subject comes LAST. */
const HINT_INVERSION =
  'The subject comes last — ‘Blessed are the merciful’ says the merciful are blessed: all M is B.';
/** The two faces of ‘any’ (*31), parallel to HINT_17_NOT_SOME. */
const HINT_ANY_ALL =
  '‘Any’ claims it of every one — ‘any A is B’ is an ‘all’-sentence.';
const HINT_NOT_ANY = '‘Not any’ means ‘none.’';
/** For affirming too much on a ‘some’ (*32). */
const HINT_SOME_ONLY = '‘Some’ claims one or more — it doesn’t claim all.';
const HINT_13_ONLY =
  'You only switch the parts around with ‘only’ and ‘none but.’';

function classHint(term: string): string {
  return `“${term}” could describe many persons, and so translates into a capital letter.`;
}

function individualHint(term: string): string {
  return `“${term}” stands for a single person, and so translates into a small letter.`;
}

// =============================================================
// Helpers — option assembly + hint composition
// =============================================================

function pluralize(noun: string): string {
  if (/(s|x|z|ch|sh)$/.test(noun)) return noun + 'es';
  if (/[^aeiou]y$/.test(noun)) return noun.slice(0, -1) + 'ies';
  return noun + 's';
}

function qid(template: string, n: number): string {
  return `gen.A.${template}.${n}`;
}

/**
 * Build an English superlative from a base adjective. Regulars
 * (single-syllable adjectives that take -est cleanly) get the
 * inflected form; everything else falls back to "most X".
 */
function superlative(adj: string): string {
  // Consonant + y inflects for ANY adjective, not just the allowlist: English
  // has no "most friendly", only "friendliest". Twelve live adjectives end
  // this way — nine of them Gensler's — and every one of them rendered as
  // "most X" until this was measured (2026-08-20).
  //
  // PROVENANCE (2026-08-20, settling whether the original's behaviour was
  // pedagogy or limitation): it was limitation. The 2008 engine's parser
  // reads ONE character after '$', so $Best was word($B) + literal "est" —
  // it shipped "beautifulest" and "cheerfulest" (confirmed in the original program).
  // Verified for the 2008 build ONLY. The earliest binary available is
  // 2003 and its data file does not yield templates to a inspection, so how
  // far back this goes is unknown — do not repeat it as "since 1985". Gensler's hand-written textbook prose, where
  // no parser constrains him, inflects exactly as this function now does:
  // "nastiest" (y->i, Intro to Logic Set B) and "biggest" (consonant
  // doubling, Set Q), with zero "most X person" constructions anywhere in
  // the book notes. This function converges with the author; the original program
  // never could.
  // Length guard: English keeps the y in one-syllable words. Measured, not
  // assumed — "shyest" is Zipf 1.56 and "shiest" is 0.00.
  //
  // NO_INFLECTION holds the only two consonant+y adjectives in these pools
  // whose -iest form does not exist: "cowardliest" and "scholarliest" both
  // measure Zipf 0.00, against 1.50-3.59 for every other y-adjective here.
  // Both are -ly adjectives built on a noun; the basic ones (friendly,
  // lively, lonely) inflect normally. These two fall through to "most X".
  if (adj.length > 3 && !NO_INFLECTION.has(adj) && /[^aeiou]y$/.test(adj))
    return adj.slice(0, -1) + 'iest';
  if (!ESTREGULARS.has(adj)) return `most ${adj}`;
  if (adj.endsWith('e')) return adj + 'st';
  // Single-syllable consonant-vowel-consonant doubles the final letter:
  // sad -> saddest, big -> biggest. Guarded to the allowlist, so it cannot
  // fire on a long adjective that merely ends CVC.
  if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(adj))
    return adj + adj.slice(-1) + 'est';
  return adj + 'est';
}

/** Spec for one option being assembled. */
interface OptionSpec {
  label: string;
  /** Optional per-mistake explanation (2008 `*e` block), shown on wrong options. */
  layer2?: string;
}

/**
 * Assemble Option[] + correctId from per-option specs. The correct
 * option carries no hint; a wrong option carries its per-mistake
 * explanation if one is specified.
 */
function buildOptions(
  specs: readonly OptionSpec[],
  correctIdx: number
): { options: Option[]; correctId: number[] } {
  const options: Option[] = specs.map((s, i) => {
    if (i === correctIdx || s.layer2 === undefined)
      return { id: i, label: s.label };
    return { id: i, label: s.label, hint: s.layer2 };
  });
  return { options, correctId: [correctIdx] };
}

/** Pick an entry from the pool whose first letter differs from `avoid`'s.
 *  Falls back to any non-equal entry if the letter-filter empties the pool. */
function pickDifferentLetter<T extends string>(
  rng: Rng,
  pool: readonly T[],
  avoid: string
): T {
  // The reject predicate (not a filtered copy) keeps the pool's identity, so
  // pickFresh's recently-drawn memory works — a filtered array is a new
  // object every call and would silently disable it.
  const initial = avoid[0]!.toLowerCase();
  return pickFresh(rng, pool, {
    reject: (x) => x[0]!.toLowerCase() === initial || x === avoid,
  });
}

// =============================================================
// Easy templates: *0–*12 (LC3's All/Some *12) and LC3's *29
// =============================================================

/**
 * *0 — "$J is a $C person in $p"
 *
 *   "Sally is a humorous person in Paris." → s is H
 *
 * Subject: proper name (singular term) → lowercase.
 * Predicate: "a $C person in $p" → CAPITAL (class).
 * 2008 correct option is `$K is $k` = lower(name) is upper(adj).
 */
function template0(rng: Rng, counter: number): Question {
  const name = pickFresh(rng, names);
  const adj = pickDifferentLetter(rng, adjectives, name);
  const place = placeFor(rng, name);
  const J = name[0]!.toUpperCase();
  const j = name[0]!.toLowerCase();
  const C = adj[0]!.toUpperCase();
  const c = adj[0]!.toLowerCase();
  const classTerm = `${indefiniteArticleCapitalized(adj)} ${adj} person in ${place}`;

  return {
    id: qid('0', counter),
    prompt: `${name} is ${indefiniteArticle(adj)} ${adj} person in ${place}.`,
    ...buildOptions(
      [
        { label: `${j} is ${C}` },
        { label: `${j} is ${c}`, layer2: classHint(classTerm) },
        { label: `${J} is ${C}`, layer2: individualHint(name) },
        {
          label: `${J} is ${c}`,
          layer2: `${individualHint(name)}\n${classHint(classTerm)}`,
        },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *2 — "I'm a $B $A in $p"
 *
 *   "I'm a wild clown in Berlin." → i is C
 *
 * Subject: "I" → "i" (lowercase pronoun, individual).
 * Predicate: "a $B $A" → CAPITAL (class — e.g., "a wild clown" is
 *   the class of wild clowns).
 */
function template2(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adjB = pickFresh(rng, adjectives);
  const place = placeForNoun(rng, noun);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const classTerm = `${indefiniteArticleCapitalized(adjB)} ${adjB} ${noun}`;

  return {
    id: qid('2', counter),
    prompt: `I'm ${indefiniteArticle(adjB)} ${adjB} ${noun} in ${place}.`,
    ...buildOptions(
      [
        { label: `i is ${A}` },
        { label: `i is ${a}`, layer2: classHint(classTerm) },
        { label: `I is ${A}`, layer2: individualHint('I') },
        { label: `I is ${a}`, layer2: classHint(classTerm) },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *3 — "I'm the $Best $A in $p"
 *
 *   "I'm the cheapest poet in Paris." → i is p
 *
 * Subject: "I" → "i".
 * Predicate: "the $Best $A" (definite description) → lowercase
 *   (single referent — "the cheapest poet" picks out one person).
 */
function template3(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickFresh(rng, adjectives);
  const place = placeForNoun(rng, noun);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const sup = superlative(adj);
  const indTerm = `The ${sup} ${noun}`;

  return {
    id: qid('3', counter),
    prompt: `I'm the ${sup} ${noun} in ${place}.`,
    ...buildOptions(
      [
        { label: `i is ${a}` },
        { label: `i is ${A}`, layer2: individualHint(indTerm) },
        { label: `I is ${a}`, layer2: individualHint('I') },
        { label: `I is ${A}`, layer2: individualHint(indTerm) },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *4 — "This $A isn't a $C person"
 *
 *   "This terrorist isn't a candid person." → t is not C
 *
 * Subject: "this $A" (demonstrative — picks out a single referent
 *   in context) → lowercase.
 * Predicate: "a $C person" → CAPITAL (class).
 */
function template4(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const C = adj[0]!.toUpperCase();
  const c = adj[0]!.toLowerCase();
  const classTerm = `${indefiniteArticleCapitalized(adj)} ${adj} person`;

  return {
    id: qid('4', counter),
    prompt: `This ${noun} isn't ${indefiniteArticle(adj)} ${adj} person.`,
    ...buildOptions(
      [
        { label: `${a} is not ${C}` },
        { label: `${a} is not ${c}`, layer2: classHint(classTerm) },
        {
          label: `${A} is not ${C}`,
          layer2: individualHint(`This ${noun}`),
        },
        { label: `${A} is not ${c}`, layer2: classHint(classTerm) },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *5 — "This $A isn't the most $C person"
 *
 *   "The dancer isn't the most cheerful person." → d is not c
 *
 * Subject: "this $A" → lowercase.
 * Predicate: superlative phrase → lowercase (definite, single
 *   referent).
 *
 * The original program hardcodes "most $C" here, but that was a workaround for
 * a parser that could not inflect ($Best was $B + literal "est" —
 * the original program 0121b7d), not authored style: Gensler's textbook
 * writes this exact sentence shape inflected ("David isn't the
 * nastiest person at the party", Intro to Logic Set B). This template
 * now uses superlative(), converging with the book (2026-08-20).
 */
function template5(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const C = adj[0]!.toUpperCase();
  const c = adj[0]!.toLowerCase();
  const sup = superlative(adj);
  const indTerm = `The ${sup} person`;

  return {
    id: qid('5', counter),
    prompt: `This ${noun} isn't the ${sup} person.`,
    ...buildOptions(
      [
        { label: `${a} is not ${c}` },
        { label: `${a} is not ${C}`, layer2: individualHint(indTerm) },
        {
          label: `${A} is not ${c}`,
          layer2: individualHint(`This ${noun}`),
        },
        { label: `${A} is not ${C}`, layer2: individualHint(indTerm) },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *6 — "You aren't a $B $A"
 *
 *   "You aren't a short convict." → u is not C
 *
 * Subject: "you" → "u" (lowercase pronoun, individual).
 * Predicate: "a $B $A" → CAPITAL (class).
 */
function template6(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adjB = pickFresh(rng, adjectives);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const classTerm = `${indefiniteArticleCapitalized(adjB)} ${adjB} ${noun}`;

  return {
    id: qid('6', counter),
    prompt: `You aren't ${indefiniteArticle(adjB)} ${adjB} ${noun}.`,
    ...buildOptions(
      [
        { label: `u is not ${A}` },
        { label: `u is not ${a}`, layer2: classHint(classTerm) },
        { label: `U is not ${A}`, layer2: individualHint('You') },
        { label: `U is not ${a}`, layer2: classHint(classTerm) },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *7 — "You aren't the $Best $A"
 *
 *   "You aren't the smartest criminal." → u is not c
 *
 * Subject: "you" → "u".
 * Predicate: "the $Best $A" → lowercase (definite, single).
 */
function template7(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickFresh(rng, adjectives);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const sup = superlative(adj);
  const indTerm = `The ${sup} ${noun}`;

  return {
    id: qid('7', counter),
    prompt: `You aren't the ${sup} ${noun}.`,
    ...buildOptions(
      [
        { label: `u is not ${a}` },
        { label: `u is not ${A}`, layer2: individualHint(indTerm) },
        { label: `U is not ${a}`, layer2: individualHint('You') },
        { label: `U is not ${A}`, layer2: individualHint(indTerm) },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *8 — "All $As in $p $D people who are $C"
 *
 *   "All soldiers in Berlin forgive people who are remarkable."
 *     → all S is F
 *
 * Subject: "$As" plural noun-class → CAPITAL.
 * Predicate: "$D" verb (treated as noun-class for syllogistic
 *   rendering: the class of those who $D-relate to others) → CAPITAL.
 */
function template8(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const verb = pickDifferentLetter(rng, verbsA, noun);
  const adj = pickFresh(rng, adjectives);
  const place = placeForNoun(rng, noun);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const D = verb[0]!.toUpperCase();

  return {
    id: qid('8', counter),
    prompt: `All ${pluralize(noun)} in ${place} ${verb} people who are ${adj}.`,
    ...buildOptions(
      [
        { label: `all ${A} is ${D}` },
        { label: `all ${D} is ${A}`, layer2: HINT_SWITCHED },
        {
          label: `all ${a} is ${D}`,
          layer2: classHint(`${pluralize(noun)} in ${place}`),
        },
        { label: `${A} is ${D}`, layer2: HINT_NO_QUANTIFIER },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *9 — "Some $As don't $D any $C people"
 *
 *   "Some prisoners don't blame any frivolous people."
 *     → some P is not B
 */
function template9(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const verb = pickDifferentLetter(rng, verbsA, noun);
  const adj = pickFresh(rng, adjectives);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const D = verb[0]!.toUpperCase();

  return {
    id: qid('9', counter),
    prompt: `Some ${pluralize(noun)} don't ${verb} any ${adj} people.`,
    ...buildOptions(
      [
        { label: `some ${A} is not ${D}` },
        { label: `some ${A} is ${D}`, layer2: HINT_FORGOT_NOT },
        { label: `${A} is not ${D}`, layer2: HINT_NO_QUANTIFIER },
        {
          label: `some ${a} is not ${D}`,
          layer2: classHint(pluralize(noun)),
        },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *10 — "Some $D $As are $C"
 *
 *   "Some vicious criminals are boring." → some C is B
 *
 * Subject: "$D $As" → CAPITAL (the class of $D $As).
 * Predicate: "$C" bare adjective → CAPITAL (the class of $C things,
 *   per Gensler's syllogistic convention).
 */
function template10(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adjPred = pickDifferentLetter(rng, adjectives, noun);
  const adjSubj = pickDifferentLetter(rng, adjectives, adjPred);
  const A = noun[0]!.toUpperCase();
  const C = adjPred[0]!.toUpperCase();
  const c = adjPred[0]!.toLowerCase();

  // Distractors follow 2008's *10 grid (`$h is $k`, `$h is $f`,
  // `some $b`). A switched form (`some C is A`) must never appear
  // here: Gensler treats `some A is B` and `some B is A` as the
  // same wff, so it would be a correct answer marked wrong.
  return {
    id: qid('10', counter),
    prompt: `Some ${adjSubj} ${pluralize(noun)} are ${adjPred}.`,
    ...buildOptions(
      [
        { label: `some ${A} is ${C}` },
        { label: `${A} is ${C}`, layer2: HINT_NO_QUANTIFIER },
        { label: `${A} is ${c}`, layer2: classHint(adjPred) },
        { label: `some ${A} is ${c}`, layer2: classHint(adjPred) },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *11 — "No $D $A is $C"
 *
 *   "No dangerous foreigner is poetic." → no F is P
 *
 * Subject: "$D $A" → CAPITAL (the class of $D $As).
 * Predicate: "$C" bare adjective → CAPITAL.
 */
function template11(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adjPred = pickDifferentLetter(rng, adjectives, noun);
  const adjSubj = pickDifferentLetter(rng, adjectives, adjPred);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const C = adjPred[0]!.toUpperCase();
  const subjectTermHint = `The term “${adjSubj} ${noun}” could describe many persons, and so translates into a capital letter.`;

  return {
    id: qid('11', counter),
    prompt: `No ${adjSubj} ${noun} is ${adjPred}.`,
    ...buildOptions(
      [
        { label: `no ${A} is ${C}` },
        { label: `all ${A} is not ${C}`, layer2: HINT_ALL_IS_NOT },
        { label: `${A} is not ${C}`, layer2: HINT_NO_QUANTIFIER },
        { label: `${a} is not ${C}`, layer2: subjectTermHint },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *12 — "$Quant $C people are $As" (All/Some, LC3's own variant)
 *
 * PROVENANCE (2026-08-20): 2008's *12 was NOT this sentence. The original program's
 * *m block (cw=12:Tonly, cw=23:Tnone but) rendered "Only/None but $C
 * people are $As" with the REVERSED answer `all A is C` — the §2.4
 * idiom where the letters switch, drilled at double weight. The port
 * replaced it with this All/Some variant, silently losing that lesson;
 * the restored idiom now lives in template23 (hard), and this template
 * stays as a deliberate LC3 addition — it is the only template that
 * drills quantifier CHOICE (all vs some) rather than a fixed form.
 * (main's e5c4a5e fixed the same loss by rewriting *12 itself; at the
 * 2026-08-24 merge the branch's 12-easy/23-hard split won, so this
 * function stays the All/Some variant. Malik, 2026-08-24)
 *
 *   "Some kind people are doctors." → some K is D
 *   "All cheerful people are scholars." → all C is S
 *
 * Subject: "$C people" → CAPITAL (class of $C things).
 * Predicate: "$As" plural noun → CAPITAL (class).
 */
function template12(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adjSubj = pickDifferentLetter(rng, adjectives, noun);
  const C = adjSubj[0]!.toUpperCase();
  const c = adjSubj[0]!.toLowerCase();
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const isAll = rng() < 0.5;
  const Quant = isAll ? 'All' : 'Some';
  const quant = isAll ? 'all' : 'some';
  const otherQuant = isAll ? 'some' : 'all';

  return {
    id: qid('12', counter),
    prompt: `${Quant} ${adjSubj} people are ${pluralize(noun)}.`,
    ...buildOptions(
      [
        { label: `${quant} ${C} is ${A}` },
        {
          label: `${otherQuant} ${C} is ${A}`,
          layer2: `The sentence says ‘${quant},’ not ‘${otherQuant}.’`,
        },
        {
          label: `${quant} ${c} is ${a}`,
          layer2:
            classHint(`${adjSubj} people`) + '\n' + classHint(pluralize(noun)),
        },
        { label: `${C} is ${A}`, layer2: HINT_NO_QUANTIFIER },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *23 — "Only/None but $C people are $As"  (RESTORED 2026-08-20)
 *
 *   "Only wise people are logicians." → all L is W
 *   "None but brave people are soldiers." → all S is B
 *
 * The one idiom family where the letters SWITCH: "only B's are A's" =
 * "none but B's are A's" = all A is B (textbook §2.4). 2008 drilled it
 * as *12/*23 at double weight; LC3 ships it at 1× first — the
 * duplicate-entry trick in hardTemplates is safe with pickFresh if
 * drill data ever argues for 2×. The non-reversed `all C is A` is the
 * canonical mistake and MUST stay a distractor; `only C is A` is a
 * non-wff distractor, precedented by *22's `not some A is C`.
 *
 * The hint is Gensler's own NFL example from the 2008 *e block, shown
 * on every wrong option exactly as 2008 did (C:xr=12!r=23 was
 * unconditional on which wrong option was picked). Flat string: \n
 * collapses in .qhint-head, and the 2008 formula line carries the
 * 0xAA table glyph, not the 0xBD emphasis byte, so no *x* markup.
 */
function template23(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adjSubj = pickDifferentLetter(rng, adjectives, noun);
  const C = adjSubj[0]!.toUpperCase();
  const A = noun[0]!.toUpperCase();
  const isOnly = rng() < 0.5;
  const T = isOnly ? 'only' : 'none but';
  const S = isOnly ? 'Only' : 'None but';
  const nflHint =
    `You have to switch the parts around with ‘${T}.’ ` +
    `‘${S} men are NFL football players’ doesn’t mean ‘All men are NFL football players.’ ` +
    `Rather it means ‘All NFL football players are men.’ ‘${T} A is B’ = ‘all B is A.’`;

  return {
    id: qid('23', counter),
    prompt: `${S} ${adjSubj} people are ${pluralize(noun)}.`,
    ...buildOptions(
      [
        { label: `all ${A} is ${C}` },
        { label: `all ${C} is ${A}`, layer2: nflHint },
        { label: `${C} is ${A}`, layer2: nflHint },
        { label: `${T} ${C} is ${A}`, layer2: nflHint },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *24/*25 — the other two corners of the contradictories quartet
 * (2026-08-20 expansion). 2008 drilled "It isn't true that some As are
 * B" (*17 → no) and "It is false that some As aren't C" (*22 → all) but
 * never the denials of ‘all’ and ‘no’ themselves — despite listing both
 * in its own help screen. With these two, the square of opposition is
 * fully drilled: every quantified form and its contradictory.
 */
function template24(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('24', counter),
    prompt: `It's false that all ${pluralize(noun)} are ${adj}.`,
    ...buildOptions(
      [
        { label: `some ${A} is not ${B}` },
        { label: `all ${A} is ${B}`, layer2: HINT_DROPPED_FALSE },
        { label: `no ${A} is ${B}`, layer2: HINT_CONTRADICTORY_ALL },
        { label: `${A} is not ${B}`, layer2: HINT_NO_QUANTIFIER },
      ],
      0
    ),
    answer: '',
  };
}

function template25(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('25', counter),
    prompt: `It's false that no ${pluralize(noun)} are ${adj}.`,
    ...buildOptions(
      [
        { label: `some ${A} is ${B}` },
        { label: `no ${A} is ${B}`, layer2: HINT_DROPPED_FALSE },
        { label: `all ${A} is ${B}`, layer2: HINT_CONTRADICTORY_NO },
        { label: `${A} is ${B}`, layer2: HINT_NO_QUANTIFIER },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *26/*27 — the conditional idioms (2026-08-20 expansion). Both are
 * 2008 help-screen entries ("If a person is A, then she is B" — note
 * Gensler's generic pronoun arc across editions: she → he or she →
 * they; the exercises of the 2017 edition use "they", which is what we
 * render). Pedagogically the bridge to Set J: a student who has drilled
 * "an ‘if’ about anyone is an ‘all’" meets (x)(Ax ⊃ Bx) already knowing
 * its central move.
 */
function template26(rng: Rng, counter: number): Question {
  const adjB = pickFresh(rng, adjectives);
  const adjD = pickDifferentLetter(rng, adjectives, adjB);
  const B = adjB[0]!.toUpperCase();
  const D = adjD[0]!.toUpperCase();

  return {
    id: qid('26', counter),
    prompt: pickFrom(rng, [
      `If a person is ${adjB}, then they're ${adjD}.`,
      `If you're ${adjB}, then you're ${adjD}.`,
    ]),
    ...buildOptions(
      [
        { label: `all ${B} is ${D}` },
        { label: `all ${D} is ${B}`, layer2: HINT_SWITCHED },
        { label: `some ${B} is ${D}`, layer2: HINT_15_ALL },
        { label: `${B} is ${D}`, layer2: HINT_NO_QUANTIFIER },
      ],
      0
    ),
    answer: '',
  };
}

function template27(rng: Rng, counter: number): Question {
  const adjB = pickFresh(rng, adjectives);
  const adjD = pickDifferentLetter(rng, adjectives, adjB);
  const B = adjB[0]!.toUpperCase();
  const D = adjD[0]!.toUpperCase();

  return {
    id: qid('27', counter),
    prompt: pickFrom(rng, [
      `If a person is ${adjB}, then they aren't ${adjD}.`,
      `If you're ${adjB}, then you aren't ${adjD}.`,
    ]),
    ...buildOptions(
      [
        { label: `no ${B} is ${D}` },
        { label: `all ${B} is not ${D}`, layer2: HINT_ALL_IS_NOT },
        { label: `some ${B} is not ${D}`, layer2: HINT_NO_SENTENCE },
        { label: `${B} is not ${D}`, layer2: HINT_NO_QUANTIFIER },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *28 — "No one is $B without being $D" (2026-08-20 expansion). The one
 * idiom genuinely absent from the 2008 canon — it appears in the 2017
 * third edition's §2.4 box but not in the 2008 help — so this is the
 * single place where the book outgrew the software. Same trap family as
 * *15/*18: the sentence starts with "No" and the answer is an ‘all’.
 * The switched option carries HINT_13_ONLY per the 2008 *e remap
 * (Cw=15:r15-2*(x=b)): picking the reversed wff on this family is the
 * only/none-but confusion, and Gensler hinted it as such.
 *
 * The "Nothing is A unless it's B" thing-variant from the same box is
 * deliberately NOT rotated in: the adjective pool is person-flavored
 * ("Nothing is friendly unless it's brave" misfires), and thing-safe
 * adjectives would be a new constraint class on the pool.
 */
function template28(rng: Rng, counter: number): Question {
  const adjB = pickFresh(rng, adjectives);
  const adjD = pickDifferentLetter(rng, adjectives, adjB);
  const B = adjB[0]!.toUpperCase();
  const D = adjD[0]!.toUpperCase();

  return {
    id: qid('28', counter),
    prompt: `No one is ${adjB} without being ${adjD}.`,
    ...buildOptions(
      [
        { label: `all ${B} is ${D}` },
        { label: `all ${D} is ${B}`, layer2: HINT_13_ONLY },
        { label: `no ${B} is ${D}`, layer2: HINT_15_ALL },
        { label: `${B} is not ${D}`, layer2: HINT_15_ALL },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *29 — "All $As $verb" (2026-08-20 expansion, EASY). §2.1's rephrasing
 * rule — "All dogs bark" = all D is B ("All dogs is [are] barkers") —
 * is taught in the easier chapter and was never drilled: every 2008
 * template hands the student an "is". Here the predicate letter comes
 * from a bare intransitive verb ("All logicians procrastinate" → all L
 * is P), drawing on verbsB — the pool's first Set A consumer. Bare
 * plural agreement keeps the morphology safe: no third-person -s
 * conjugation exists in this codebase, by design.
 */
function template29(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const verb = pickDifferentLetter(rng, verbsB, noun);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const V = verb[0]!.toUpperCase();

  return {
    id: qid('29', counter),
    prompt: pickFrom(rng, [
      `All ${pluralize(noun)} ${verb}.`,
      `Every ${noun} ${verbThirdPerson(verb)}.`,
      `Each ${noun} ${verbThirdPerson(verb)}.`,
    ]),
    ...buildOptions(
      [
        { label: `all ${A} is ${V}` },
        { label: `all ${V} is ${A}`, layer2: HINT_SWITCHED },
        { label: `${A} is ${V}`, layer2: HINT_NO_QUANTIFIER },
        { label: `all ${a} is ${V}`, layer2: classHint(pluralize(noun)) },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *30 — predicate-first inversion (2026-08-20). "Blessed are the
 * merciful" = all M is B: the subject comes LAST, so the letters reverse
 * against surface order — the same skill family as *23, arrived at by
 * poetry instead of "only". Two streams:
 *
 * AUTHORED items carry real allusions (Beatitudes, Shakespeare, the
 * house mottos, one Age-of-Discovery homage — Malik's world-knowledge
 * embedding, marked invented). Letters are stored per item because the
 * texts are fixed.
 *
 * GENERATED items are aphorisms: the frame's native register
 * substantivizes adjectives ("the patient", "the bold"), so a curated
 * benedictory fronted-slot plus a pool-drawn class slot reads as proverb
 * rather than error. This is the answer to "are we sure we can't
 * generate them?" — we can, if the fronted slot is curated; what cannot
 * be generated is a specific allusion, which is what the authored list
 * is for.
 */
const FRONTABLE: readonly string[] = [
  'Blessed',
  'Happy',
  'Fortunate',
  'Lucky',
  'Wise',
];

const INVERSIONS: readonly {
  text: string;
  S: string;
  P: string;
  echoes?: readonly string[];
}[] = [
  // S = subject letter (the class, surface-LAST), P = predicate letter.
  // Authored 2026-08-20; the first five approved by Malik, the second
  // five authored at his request.
  // `echoes` lists the pool adjectives a fixed text QUOTES — they feed
  // the freshness memory in both directions (see noteUsed in lib/rng.ts).
  { text: 'Blessed are the merciful.', S: 'M', P: 'B' },
  { text: 'Blessed are the peacemakers.', S: 'P', P: 'B' },
  {
    text: 'Rich are the Lannisters.',
    S: 'L',
    P: 'R',
    echoes: ['rich', 'Lannister'],
  },
  {
    text: 'Proud are the Targaryens.',
    S: 'T',
    P: 'P',
    echoes: ['proud', 'Targaryen'],
  },
  {
    text: 'Brave are the Avengers.',
    S: 'A',
    P: 'B',
    echoes: ['brave', 'Avenger'],
  },
  { text: 'Blessed are the meek.', S: 'M', P: 'B' },
  // As You Like It — the one thing-classed item; the book's own
  // "Nothing is worthwhile unless it's difficult" licenses non-persons.
  { text: 'Sweet are the uses of adversity.', S: 'U', P: 'S' },
  // "Earth's Mightiest Heroes" — the allusion is the tagline itself.
  { text: 'Mighty are the Avengers.', S: 'A', P: 'M', echoes: ['Avenger'] },
  // House Tyrell's words are "Growing Strong."
  { text: 'Strong are the Tyrells.', S: 'T', P: 'S', echoes: ['strong'] },
  // Invented homage, no allusion claimed: the Age of Discovery nod.
  { text: 'Bold are the navigators.', S: 'N', P: 'B', echoes: ['bold'] },
];

/**
 * A quoted word belongs to whichever pool holds it — adjectives OR
 * class nouns (`Avenger`, `Lannister`). Resolution by membership keeps
 * the item lists simple and the memory honest.
 */
function echoRecent(rng: Rng, words: readonly string[] | undefined): boolean {
  return !!words?.some(
    (w) => isRecent(rng, adjectives, w) || isRecent(rng, nounsProfessions, w)
  );
}

function echoNote(rng: Rng, words: readonly string[] | undefined): void {
  for (const w of words ?? []) {
    if (adjectives.includes(w)) noteUsed(rng, adjectives, w);
    else if (nounsProfessions.includes(w)) noteUsed(rng, nounsProfessions, w);
  }
}

function template30(rng: Rng, counter: number): Question {
  const useAuthored = rng() < 0.5;
  let prompt: string, S: string, P: string;
  if (useAuthored) {
    // Both directions: skip items whose quoted word was recently drawn,
    // and register the quoted word so nearby draws avoid it.
    const item = pickFresh(rng, INVERSIONS, {
      reject: (m) => echoRecent(rng, m.echoes),
    });
    echoNote(rng, item.echoes);
    prompt = item.text;
    S = item.S;
    P = item.P;
  } else {
    const fronted = pickFresh(rng, FRONTABLE);
    // `Wise` and `Happy` are pool adjectives wearing a capital — quote
    // them into the shared memory too.
    noteUsed(rng, adjectives, fronted.toLowerCase());
    const cls = pickDifferentLetter(rng, adjectives, fronted);
    prompt = `${fronted} are the ${cls}.`;
    S = cls[0]!.toUpperCase();
    P = fronted[0]!.toUpperCase();
  }

  return {
    id: qid('30', counter),
    prompt,
    ...buildOptions(
      [
        { label: `all ${S} is ${P}` },
        { label: `all ${P} is ${S}`, layer2: HINT_INVERSION },
        { label: `${S} is ${P}`, layer2: HINT_NO_QUANTIFIER },
        { label: `some ${S} is ${P}`, layer2: HINT_15_ALL },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *31 — the two faces of "any" (2026-08-20). Gensler lists "any" among
 * the all-synonyms and "not any A is B" among the no-forms, but treats
 * it apart from every/each because it FLIPS under negation — which is
 * why it was never a rotation surface and gets its own trap instead.
 * Bare "any" reads as "some" to many students (the interrogative
 * habit: "is any A B?"); that misreading is the key distractor.
 */
function template31(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();
  const negated = rng() < 0.5;

  if (negated) {
    return {
      id: qid('31', counter),
      prompt: `Not any ${pluralize(noun)} are ${adj}.`,
      ...buildOptions(
        [
          { label: `no ${A} is ${B}` },
          { label: `all ${A} is ${B}`, layer2: HINT_NOT_ANY },
          { label: `some ${A} is not ${B}`, layer2: HINT_NOT_ANY },
          { label: `${A} is not ${B}`, layer2: HINT_NO_QUANTIFIER },
        ],
        0
      ),
      answer: '',
    };
  }
  return {
    id: qid('31', counter),
    prompt: `Any ${noun} is ${adj}.`,
    ...buildOptions(
      [
        { label: `all ${A} is ${B}` },
        { label: `some ${A} is ${B}`, layer2: HINT_ANY_ALL },
        { label: `no ${A} is ${B}`, layer2: HINT_ANY_ALL },
        { label: `${A} is ${B}`, layer2: HINT_NO_QUANTIFIER },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *32 — mottos as content (2026-08-20, Malik-approved). The deep-
 * personalization move (Walkington): everywhere else the fantasy layer
 * swaps a name into an existing template — here the motto IS the
 * categorical sentence. Fiction has a property real content lacks:
 * class membership is STIPULATED, so "all Lannisters pay their debts"
 * has a clean truth-value with no real-world contention, and the
 * student meets the form inside a sentence they already know by heart —
 * the Aristotle-enthymeme trick.
 *
 * Each item is hand-authored with fixed letters and a form tag; the
 * options are built per form, mirroring the corresponding template's
 * distractor pattern. `Stark` is banned from the DRAW pools (Tony
 * Stark / the adjective), but a fixed text set in Winterfell is
 * unambiguous — the one-word-one-realm rule governs draws, not prose.
 */
type MottoForm =
  'all' | 'no' | 'some' | 'someNot' | 'onlyRev' | 'sing' | 'singDef';
const MOTTOS: readonly {
  text: string;
  form: MottoForm;
  S: string;
  P: string;
  /** sing-form only: the name and the class phrase, for the case hints. */
  nameTerm?: string;
  classTerm?: string;
  /** Pool adjectives the fixed text quotes — fed to the freshness memory. */
  echoes?: readonly string[];
}[] = [
  // S = subject letter OF THE ANSWER, P = predicate letter.
  {
    text: 'Lannisters always pay their debts.',
    form: 'all',
    S: 'L',
    P: 'P',
    echoes: ['Lannister'],
  },
  {
    text: 'No Targaryen fears fire.',
    form: 'no',
    S: 'T',
    P: 'F',
    echoes: ['Targaryen'],
  },
  // Canon-true "some": only some of them ride.
  {
    text: 'Some Targaryens ride dragons.',
    form: 'some',
    S: 'T',
    P: 'R',
    echoes: ['Targaryen'],
  },
  {
    text: "Some Avengers aren't human.",
    form: 'someNot',
    S: 'A',
    P: 'H',
    echoes: ['Avenger'],
  },
  // Only-reversal: "Only Starks hold Winterfell" = all H(olders) is S.
  { text: 'Only Starks hold Winterfell.', form: 'onlyRev', S: 'H', P: 'S' },
  // The one real-world proverb — students know it by heart, which is
  // the entire pedagogical bet of this template.
  { text: 'Not all heroes wear capes.', form: 'someNot', S: 'H', P: 'W' },
  // Singular terms: a name takes the small letter even in a motto.
  {
    text: 'Batman works alone.',
    form: 'sing',
    S: 'b',
    P: 'W',
    nameTerm: 'Batman',
    classTerm: 'works alone',
  },
  // "That's my secret, Cap: I'm always angry." — and `always` on an
  // individual doesn't make the sentence quantified.
  {
    text: 'Banner is always angry.',
    form: 'sing',
    S: 'b',
    P: 'A',
    nameTerm: 'Banner',
    classTerm: 'always angry',
    echoes: ['angry'],
  },
  // The Green Lantern oath — a recited text that BEGINS with its own
  // quantifier. ("With great power comes great responsibility" was
  // proposed alongside it and rejected on review, 2026-08-21: the maxim
  // is NORMATIVE — an obligation about the powerful, not a description
  // of them — so it belongs to Set L's deontic mottos, with the modal
  // "a hero can be anyone" family belonging to Set J. Superhero
  // rhetoric runs on modality and obligation; categorical mottos are
  // the rare case, which is why this list is short and vetted.)
  { text: 'No evil shall escape my sight.', form: 'no', S: 'E', P: 'S' },
  // 2026-08-21 round. "the fastest man alive" is a superlative definite
  // description — BOTH letters small, the *1/*3 lesson in catchphrase
  // form and the motto family's first x-is-y item.
  {
    text: 'Barry is the fastest man alive.',
    form: 'singDef',
    S: 'b',
    P: 'f',
    nameTerm: 'Barry',
    classTerm: 'the fastest man alive',
  },
  // The Loki show's core revealed fact — stipulated canon, and it wears
  // the §2.4 "Everyone" surface.
  { text: 'Everyone at the TVA is a variant.', form: 'all', S: 'T', P: 'V' },
  {
    text: 'Loki is burdened with glorious purpose.',
    form: 'sing',
    S: 'l',
    P: 'B',
    nameTerm: 'Loki',
    classTerm: 'burdened with glorious purpose',
  },
  { text: 'All Wakandans guard vibranium.', form: 'all', S: 'W', P: 'G' },
];

function mottoOptions(
  form: MottoForm,
  S: string,
  P: string,
  nameTerm?: string,
  classTerm?: string
): OptionSpec[] {
  switch (form) {
    case 'all':
      return [
        { label: `all ${S} is ${P}` },
        { label: `all ${P} is ${S}`, layer2: HINT_SWITCHED },
        { label: `${S} is ${P}`, layer2: HINT_NO_QUANTIFIER },
        { label: `some ${S} is ${P}`, layer2: HINT_15_ALL },
      ];
    case 'no':
      return [
        { label: `no ${S} is ${P}` },
        { label: `all ${S} is not ${P}`, layer2: HINT_ALL_IS_NOT },
        { label: `${S} is not ${P}`, layer2: HINT_NO_QUANTIFIER },
        { label: `some ${S} is not ${P}`, layer2: HINT_NO_SENTENCE },
      ];
    case 'some':
      return [
        { label: `some ${S} is ${P}` },
        { label: `all ${S} is ${P}`, layer2: HINT_SOME_ONLY },
        { label: `${S} is ${P}`, layer2: HINT_NO_QUANTIFIER },
        { label: `some ${S} is not ${P}`, layer2: HINT_PUT_NOT },
      ];
    case 'someNot':
      return [
        { label: `some ${S} is not ${P}` },
        { label: `no ${S} is ${P}`, layer2: HINT_CONTRADICTORY_ALL },
        { label: `all ${S} is not ${P}`, layer2: HINT_ALL_IS_NOT },
        { label: `${S} is not ${P}`, layer2: HINT_NO_QUANTIFIER },
      ];
    case 'onlyRev':
      return [
        { label: `all ${S} is ${P}` },
        { label: `all ${P} is ${S}`, layer2: HINT_13_ONLY },
        { label: `${S} is ${P}`, layer2: HINT_NO_QUANTIFIER },
        { label: `only ${P} is ${S}`, layer2: HINT_13_ONLY },
      ];
    case 'singDef': {
      const s0 = S.toLowerCase();
      const S0 = S.toUpperCase();
      const p0 = P.toLowerCase();
      const P0 = P.toUpperCase();
      return [
        { label: `${s0} is ${p0}` },
        { label: `${s0} is ${P0}`, layer2: individualHint(classTerm!) },
        { label: `${S0} is ${p0}`, layer2: individualHint(nameTerm!) },
        {
          label: `${S0} is ${P0}`,
          layer2: individualHint(nameTerm!) + '\n' + individualHint(classTerm!),
        },
      ];
    }
    case 'sing': {
      const s0 = S.toLowerCase();
      const S0 = S.toUpperCase();
      const p0 = P.toLowerCase();
      return [
        { label: `${s0} is ${P}` },
        { label: `${s0} is ${p0}`, layer2: classHint(classTerm!) },
        { label: `${S0} is ${P}`, layer2: individualHint(nameTerm!) },
        { label: `${S0} is ${p0}`, layer2: individualHint(nameTerm!) },
      ];
    }
  }
}

function template32(rng: Rng, counter: number): Question {
  const motto = pickFresh(rng, MOTTOS, {
    reject: (m) => echoRecent(rng, m.echoes),
  });
  echoNote(rng, motto.echoes);
  return {
    id: qid('32', counter),
    prompt: motto.text,
    ...buildOptions(
      mottoOptions(
        motto.form,
        motto.S,
        motto.P,
        motto.nameTerm,
        motto.classTerm
      ),
      0
    ),
    answer: '',
  };
}

// 2008 split: easier = *0–*11, harder = *12–*23 (`C:wz%12 … Cm:ww+12`).
// *1 re-seated here at the 2026-08-24 merge, porting main's e5c4a5e
// (the port had mis-filed it as hard). *12 stays easy as LC3's
// All/Some variant; 2008's *12 lesson is template23 in hard. *29 is an
// LC3 addition.
const easyTemplates = [
  template0,
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
  template7,
  template8,
  template9,
  template10,
  template11,
  template12,
  template29,
] as const;

// =============================================================
// Hard templates: *13–*23 (2008's harder half, with *23 twice
// covering the w=12/w=23 only/none-but slots) + LC3's *24–*28,
// *30–*32
// =============================================================

/**
 * *1 — "$J is the $C one in $p"
 *
 *   "Harry is the smartest one in NYC." → h is s
 *
 * Subject: proper name (singular term) → lowercase.
 * Predicate: "the $C one in $p" (definite description) → lowercase.
 * 2008 correct option is `$K is $f` = lower(name) is lower(adj).
 */
function template1(rng: Rng, counter: number): Question {
  const name = pickFresh(rng, names);
  const adj = pickDifferentLetter(rng, adjectives, name);
  const place = placeFor(rng, name);
  const J = name[0]!.toUpperCase();
  const j = name[0]!.toLowerCase();
  const C = adj[0]!.toUpperCase();
  const c = adj[0]!.toLowerCase();
  const sup = superlative(adj);
  const indTerm = `The ${sup} one in ${place}`;

  return {
    id: qid('1', counter),
    prompt: `${name} is the ${sup} one in ${place}.`,
    ...buildOptions(
      [
        { label: `${j} is ${c}` },
        { label: `${j} is ${C}`, layer2: individualHint(indTerm) },
        { label: `${J} is ${c}`, layer2: individualHint(name) },
        {
          label: `${J} is ${C}`,
          layer2: `${individualHint(name)}\n${individualHint(indTerm)}`,
        },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *13 — "Whoever is $C is $D"
 *
 *   "Whoever is dangerous is sarcastic." → all D is S
 */
function template13(rng: Rng, counter: number): Question {
  const adjC = pickFresh(rng, adjectives);
  const adjD = pickDifferentLetter(rng, adjectives, adjC);
  const C = adjC[0]!.toUpperCase();
  const D = adjD[0]!.toUpperCase();

  return {
    id: qid('13', counter),
    prompt: `Whoever is ${adjC} is ${adjD}.`,
    ...buildOptions(
      [
        { label: `all ${C} is ${D}` },
        { label: `all ${D} is ${C}`, layer2: HINT_13_ONLY },
        { label: `${C} is ${D}`, layer2: HINT_NO_QUANTIFIER },
        { label: `${D} is ${C}`, layer2: HINT_13_ONLY },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *14 — "Whoever is $C isn't $D"
 *
 *   "Whoever is powerful isn't dishonest." → no P is D
 */
function template14(rng: Rng, counter: number): Question {
  const adjC = pickFresh(rng, adjectives);
  const adjD = pickDifferentLetter(rng, adjectives, adjC);
  const C = adjC[0]!.toUpperCase();
  const D = adjD[0]!.toUpperCase();

  return {
    id: qid('14', counter),
    prompt: `Whoever is ${adjC} isn't ${adjD}.`,
    ...buildOptions(
      [
        { label: `no ${C} is ${D}` },
        { label: `all ${C} is not ${D}`, layer2: HINT_ALL_IS_NOT },
        { label: `${C} is not ${D}`, layer2: HINT_NO_QUANTIFIER },
        { label: `all ${D} is not ${C}`, layer2: HINT_13_ONLY },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *15 — 2008: "No one is $B unless he or she is $D"
 *
 * Rendered with singular they since 2026-08-20 (Malik's call): "he or
 * she" ran in 9.2% of Set A questions and reads dated to 2026 students;
 * APA, AP and Chicago all accept singular they. The wff derivation never
 * touches the pronoun, so the change is grading-safe. Gensler's own §2.4
 * box offers pronoun-free variants ("No one is A without being B") if
 * this is ever revisited.
 *
 *   "No one is rough unless they are demented." → all R is D
 *   (logically: ∀x. R(x) → D(x))
 */
function template15(rng: Rng, counter: number): Question {
  const adjB = pickFresh(rng, adjectives);
  const adjD = pickDifferentLetter(rng, adjectives, adjB);
  const B = adjB[0]!.toUpperCase();
  const D = adjD[0]!.toUpperCase();

  return {
    id: qid('15', counter),
    prompt: `No one is ${adjB} unless they are ${adjD}.`,
    ...buildOptions(
      [
        { label: `all ${B} is ${D}` },
        { label: `all ${D} is ${B}`, layer2: HINT_SWITCHED },
        { label: `no ${B} is ${D}`, layer2: HINT_15_ALL },
        { label: `${B} is not ${D}`, layer2: HINT_15_ALL },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *16 — "Not all $As are $B"
 *
 *   "Not all druggists are rough." → some D is not R
 *   (logically: ¬∀x. D(x) → R(x), equivalently ∃x. D(x) ∧ ¬R(x))
 */
function template16(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('16', counter),
    prompt: `Not all ${pluralize(noun)} are ${adj}.`,
    ...buildOptions(
      [
        { label: `some ${A} is not ${B}` },
        { label: `some ${A} is ${B}`, layer2: HINT_FORGOT_NOT },
        { label: `${A} is not ${B}`, layer2: HINT_NO_QUANTIFIER },
        { label: `all ${A} is not ${B}`, layer2: HINT_16_COMMON_MISTAKE },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *17 — "It isn't true that some $As are $B"
 *
 *   "It isn't true that some teachers are rich." → no T is R
 *   (logically: ¬∃x. T(x) ∧ R(x), equivalently ∀x. T(x) → ¬R(x))
 */
function template17(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('17', counter),
    // Surface rotation (2026-08-20): the 2008 help's own synonyms for
    // this form. All three keep the same letters and answer. Every/Each
    // rotate on *19 and *29 (3sg via verbThirdPerson); "any" alone stays
    // excluded — Gensler treats it separately because it flips meaning
    // under negation ("not any A is B" = no, but "any A is B" = all).
    // "Not any" moved to *31 (2026-08-20), where the any/not-any contrast
    // gets its own distractor set instead of borrowing *17's.
    prompt: pickFrom(rng, [
      `It isn't true that some ${pluralize(noun)} are ${adj}.`,
      `There isn't a single ${noun} that's ${adj}.`,
    ]),
    ...buildOptions(
      [
        { label: `no ${A} is ${B}` },
        { label: `all ${A} is ${B}`, layer2: HINT_17_NOT_SOME },
        { label: `${A} is not ${B}`, layer2: HINT_NO_QUANTIFIER },
        { label: `some ${A} is not ${B}`, layer2: HINT_17_NOT_SOME },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *18 — 2008: "A person isn't $B unless he or she is $D"
 *
 * Singular they since 2026-08-20, as in *15 — note the plural verb
 * agreement ("unless they ARE").
 *
 *   "A person isn't tall unless they are remarkable." → all T is R
 *   (Same logical form as *15.)
 */
function template18(rng: Rng, counter: number): Question {
  const adjB = pickFresh(rng, adjectives);
  const adjD = pickDifferentLetter(rng, adjectives, adjB);
  const B = adjB[0]!.toUpperCase();
  const D = adjD[0]!.toUpperCase();

  return {
    id: qid('18', counter),
    prompt: `A person isn't ${adjB} unless they are ${adjD}.`,
    ...buildOptions(
      [
        { label: `all ${B} is ${D}` },
        { label: `all ${D} is ${B}`, layer2: HINT_SWITCHED },
        { label: `no ${B} is ${D}`, layer2: HINT_15_ALL },
        { label: `${B} is not ${D}`, layer2: HINT_15_ALL },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *19 — "People who are $As are $B"
 *
 *   "People who are dancers are wild." → all D is W
 */
function template19(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('19', counter),
    prompt: pickFrom(rng, [
      `People who are ${pluralize(noun)} are ${adj}.`,
      `Those who are ${pluralize(noun)} are ${adj}.`,
      // Every/Each take a singular subject and the copula — no verb
      // conjugation involved, so these were always safe. Reversed from a
      // deliberate exclusion on 2026-08-20 when the 3sg rule turned out
      // to be pluralize's own (see verbThirdPerson in lib/grammar.ts).
      `Every ${noun} is ${adj}.`,
      `Each ${noun} is ${adj}.`,
    ]),
    ...buildOptions(
      [
        { label: `all ${A} is ${B}` },
        { label: `${B} is ${A}`, layer2: HINT_SWITCHED },
        { label: `${A} is ${B}`, layer2: HINT_19_AS_ARE_BS },
        { label: `some ${A} is ${B}`, layer2: HINT_19_AS_ARE_BS },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *20 — "People who are $As aren't $B"
 *
 *   "People who are soldiers aren't bright." → no S is B
 */
function template20(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('20', counter),
    prompt: `${pickFrom(rng, ['People', 'Those'])} who are ${pluralize(noun)} aren't ${adj}.`,
    ...buildOptions(
      [
        { label: `no ${A} is ${B}` },
        { label: `all ${A} is not ${B}`, layer2: HINT_20_AS_NOT_BS },
        { label: `${A} is not ${B}`, layer2: HINT_20_AS_NOT_BS },
        { label: `some ${A} is not ${B}`, layer2: HINT_20_AS_NOT_BS },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *21 — "One or more $As are $B"
 *
 *   "One or more dentists are mean." → some D is M
 */
function template21(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('21', counter),
    prompt: pickFrom(rng, [
      `One or more ${pluralize(noun)} are ${adj}.`,
      `At least some ${pluralize(noun)} are ${adj}.`,
      `${pluralize(noun)[0]!.toUpperCase() + pluralize(noun).slice(1)} are sometimes ${adj}.`,
    ]),
    ...buildOptions(
      [
        { label: `some ${A} is ${B}` },
        { label: `${B} is ${A}`, layer2: HINT_SWITCHED },
        { label: `${A} is ${B}`, layer2: HINT_NO_QUANTIFIER },
        { label: `some ${A} is not ${B}`, layer2: HINT_PUT_NOT },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *22 — "It is false that some $As aren't $C"
 *
 *   "It is false that some Germans aren't confused." → all G is C
 *   (logically: ¬∃x. A(x) ∧ ¬C(x), equivalently ∀x. A(x) → C(x))
 */
function template22(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const C = adj[0]!.toUpperCase();

  return {
    id: qid('22', counter),
    prompt: `It is false that some ${pluralize(noun)} aren't ${adj}.`,
    ...buildOptions(
      [
        { label: `all ${A} is ${C}` },
        { label: `not some ${A} is ${C}`, layer2: HINT_22_NOT_SINGLE },
        { label: `some ${A} is ${C}`, layer2: HINT_22_NOT_SINGLE },
        { label: `${A} is ${C}`, layer2: HINT_22_NOT_SINGLE },
      ],
      0
    ),
    answer: '',
  };
}

const hardTemplates = [
  template13,
  template14,
  template15,
  template16,
  template17,
  template18,
  template19,
  template20,
  template21,
  template22,
  template23,
  // template23 appears TWICE on purpose (2026-08-20): 2008 gave the
  // only/none-but reversal two of its 24 slots (w=12 and w=23), and with
  // the hard pool grown to 17 entries a single listing would dilute the
  // idiom Gensler weighted highest. pickFresh dedupes on function
  // identity, so the anti-adjacency guard still holds.
  template23,
  template24,
  template25,
  template26,
  template27,
  template28,
  template30,
  template31,
  template32,
] as const;

// =============================================================
// Streaming iterators
// =============================================================

export function* easyQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFresh(rng, easyTemplates);
    yield renderer(rng, counter++);
  }
}

export function* hardQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFresh(rng, hardTemplates);
    yield renderer(rng, counter++);
  }
}

// =============================================================
// Top-level Set generator
// =============================================================

function take<T>(it: Generator<T>, n: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    const r = it.next();
    if (r.done) break;
    out.push(r.value);
  }
  return out;
}

/**
 * Top-level Set A generator. Production calls this with no seed
 * (Math.random); tests pass a fixed seed.
 */
export function generateSetA(seed?: number, perSubset = 10): Set {
  const seedFor = (offset: number) =>
    seed != null ? seed + offset : undefined;
  return {
    name: 'Set A',
    logicType: 'Syllogistic',
    slugs: ['syllogistic', 'translations'],
    id: 1,
    title: 'Syllogistic Translations: Easy',
    header: 'Translates into logic as:',
    subSets: [
      {
        name: 'Set A',
        logicType: 'Basic Translations',
        shuffleOptions: true,
        slugs: ['syllogistic', 'translations', 'basic'],
        id: 1,
        title: 'Syllogistic Translations: Easy',
        header: 'Translates into logic as:',
        description:
          'Translate everyday English — all, no, some — into syllogistic logic without losing the structure of the claim.',
        questions: take(easyQuestions(seedFor(1)), perSubset),
      },
      {
        name: 'Set A',
        logicType: 'Syllogistic',
        shuffleOptions: true,
        slugs: ['syllogistic', 'translations', 'hard'],
        id: 1,
        title: 'Syllogistic Translations: Hard',
        header: 'Translates into logic as:',
        description:
          'Tackle the trickier idioms — only, every, and sentences that reorder subject and predicate.',
        questions: take(hardQuestions(seedFor(2)), perSubset),
      },
    ],
  };
}
