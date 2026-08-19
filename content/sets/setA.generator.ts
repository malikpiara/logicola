/**
 * Set A — Syllogistic Translations: live-random generator.
 *
 * Phase 1 / T1.5. Ports Gensler's 2008 LCEXE Set A as a procedural
 * drill engine. Coverage: all 23 templates plus the per-mistake
 * `*e`-block explanations from 2008, attached to wrong options via
 * `Option.hint`. The runtime renders the hint in red below the
 * answer reveal at `components/quiz/index.tsx:142`.
 *
 * The 2008 per-template `m:` letter-pair line ("the first letters
 * in 'Sally' and 'humorous'") is NOT a wrong-answer hint — in the
 * original it's instruction text for type-the-answer mode
 * ("Symbolize using $m"), a mode LC3 hasn't built yet. Source:
 * logicola-ghidra/notes/exercises/2008/decoded/set_A.txt.
 *
 * Letter convention (Gensler §2.1; verified against the 2008 DSL
 * letter-binding block — dKJJ = lowercase name, dRJ = uppercase —
 * see logicola-ghidra/notes/audits/setA.md):
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
import { rngFromSeed, pickFrom, type Rng } from '@/lib/rng';
import { adjectives, names, nounsProfessions, verbsA } from '../lexicons';
import { indefiniteArticle, indefiniteArticleCapitalized } from '@/lib/grammar';

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
  'Kiev',
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
  'Providenciales',
] as const;

// =============================================================
// Layer-2 hints — per-mistake explanations from 2008's `*e` block
// =============================================================

/**
 * Adjectives that take the inflected -est superlative cleanly.
 * Quick-win ported from 2008's `$Best` substitution; full Ghidra
 * decode of the morphology rule is deferred (see setA-work.md P2).
 * Adjectives outside this set fall through to "most X" form.
 */
const ESTREGULARS: ReadonlySet<string> = new Set([
  // Modern-layer adjectives; the 2008 morphology rule never saw these,
  // so the inflection is ours (Malik, 2026-08-19).
  'kind',
  'quiet',
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
  if (ESTREGULARS.has(adj)) {
    return adj.endsWith('e') ? adj + 'st' : adj + 'est';
  }
  return `most ${adj}`;
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
  const initial = avoid[0]!.toLowerCase();
  const filtered = pool.filter(
    (x) => x[0]!.toLowerCase() !== initial && x !== (avoid as unknown as T)
  );
  return pickFrom(
    rng,
    filtered.length > 0
      ? filtered
      : pool.filter((x) => x !== (avoid as unknown as T))
  );
}

// =============================================================
// Easy templates: *0, *2, *3, *4, *5, *6, *7, *8, *9, *10, *11, *12
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
  const name = pickFrom(rng, names);
  const adj = pickDifferentLetter(rng, adjectives, name);
  const place = pickFrom(rng, places);
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
  const noun = pickFrom(rng, nounsProfessions);
  const adjB = pickFrom(rng, adjectives);
  const place = pickFrom(rng, places);
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
        { label: `I is ${A}` },
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
  const noun = pickFrom(rng, nounsProfessions);
  const adj = pickFrom(rng, adjectives);
  const place = pickFrom(rng, places);
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
        { label: `I is ${a}` },
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
  const noun = pickFrom(rng, nounsProfessions);
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
        { label: `${A} is not ${C}` },
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
 * Predicate: "the most $C person" → lowercase (definite, single
 *   referent).
 */
function template5(rng: Rng, counter: number): Question {
  const noun = pickFrom(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const C = adj[0]!.toUpperCase();
  const c = adj[0]!.toLowerCase();
  const indTerm = `The most ${adj} person`;

  return {
    id: qid('5', counter),
    prompt: `This ${noun} isn't the most ${adj} person.`,
    ...buildOptions(
      [
        { label: `${a} is not ${c}` },
        { label: `${a} is not ${C}`, layer2: individualHint(indTerm) },
        { label: `${A} is not ${c}` },
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
  const noun = pickFrom(rng, nounsProfessions);
  const adjB = pickFrom(rng, adjectives);
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
        { label: `U is not ${A}` },
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
  const noun = pickFrom(rng, nounsProfessions);
  const adj = pickFrom(rng, adjectives);
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
        { label: `U is not ${a}` },
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
  const noun = pickFrom(rng, nounsProfessions);
  const verb = pickDifferentLetter(rng, verbsA, noun);
  const adj = pickFrom(rng, adjectives);
  const place = pickFrom(rng, places);
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
        { label: `all ${a} is ${D}` },
        { label: `${A} is ${D}` },
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
  const noun = pickFrom(rng, nounsProfessions);
  const verb = pickDifferentLetter(rng, verbsA, noun);
  const adj = pickFrom(rng, adjectives);
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
        { label: `${A} is not ${D}` },
        { label: `some ${a} is not ${D}` },
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
  const noun = pickFrom(rng, nounsProfessions);
  const adjPred = pickDifferentLetter(rng, adjectives, noun);
  const adjSubj = pickDifferentLetter(rng, adjectives, adjPred);
  const A = noun[0]!.toUpperCase();
  const a = noun[0]!.toLowerCase();
  const C = adjPred[0]!.toUpperCase();
  const c = adjPred[0]!.toLowerCase();

  return {
    id: qid('10', counter),
    prompt: `Some ${adjSubj} ${pluralize(noun)} are ${adjPred}.`,
    ...buildOptions(
      [
        { label: `some ${A} is ${C}` },
        { label: `${A} is ${C}` },
        { label: `some ${a} is ${c}` },
        { label: `some ${C} is ${A}`, layer2: HINT_SWITCHED },
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
  const noun = pickFrom(rng, nounsProfessions);
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
        { label: `all ${A} is not ${C}` },
        { label: `${A} is not ${C}` },
        { label: `${a} is not ${C}`, layer2: subjectTermHint },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *12 — "$S $C people are $As"  ($S = "Some" or "All")
 *
 *   "Some kind people are doctors." → some K is D
 *   "All cheerful people are scholars." → all C is S
 *
 * Subject: "$C people" → CAPITAL (class of $C things).
 * Predicate: "$As" plural noun → CAPITAL (class).
 */
function template12(rng: Rng, counter: number): Question {
  const noun = pickFrom(rng, nounsProfessions);
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
        { label: `${otherQuant} ${C} is ${A}` },
        { label: `${quant} ${c} is ${a}` },
        { label: `${C} is ${A}` },
      ],
      0
    ),
    answer: '',
  };
}

const easyTemplates = [
  template0,
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
] as const;

// =============================================================
// Hard templates: *1, *13, *14, *15, *16, *17, *18, *19, *20, *21, *22
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
  const name = pickFrom(rng, names);
  const adj = pickDifferentLetter(rng, adjectives, name);
  const place = pickFrom(rng, places);
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
  const adjC = pickFrom(rng, adjectives);
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
        { label: `${C} is ${D}` },
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
  const adjC = pickFrom(rng, adjectives);
  const adjD = pickDifferentLetter(rng, adjectives, adjC);
  const C = adjC[0]!.toUpperCase();
  const D = adjD[0]!.toUpperCase();

  return {
    id: qid('14', counter),
    prompt: `Whoever is ${adjC} isn't ${adjD}.`,
    ...buildOptions(
      [
        { label: `no ${C} is ${D}` },
        { label: `all ${C} is not ${D}` },
        { label: `${C} is not ${D}` },
        { label: `all ${D} is not ${C}`, layer2: HINT_13_ONLY },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *15 — "No one is $B unless he or she is $D"
 *
 *   "No one is rough unless he or she is demented." → all R is D
 *   (logically: ∀x. R(x) → D(x))
 */
function template15(rng: Rng, counter: number): Question {
  const adjB = pickFrom(rng, adjectives);
  const adjD = pickDifferentLetter(rng, adjectives, adjB);
  const B = adjB[0]!.toUpperCase();
  const D = adjD[0]!.toUpperCase();

  return {
    id: qid('15', counter),
    prompt: `No one is ${adjB} unless he or she is ${adjD}.`,
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
  const noun = pickFrom(rng, nounsProfessions);
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
        { label: `${A} is not ${B}` },
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
  const noun = pickFrom(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('17', counter),
    prompt: `It isn't true that some ${pluralize(noun)} are ${adj}.`,
    ...buildOptions(
      [
        { label: `no ${A} is ${B}` },
        { label: `all ${A} is ${B}`, layer2: HINT_17_NOT_SOME },
        { label: `${A} is not ${B}` },
        { label: `some ${A} is not ${B}`, layer2: HINT_17_NOT_SOME },
      ],
      0
    ),
    answer: '',
  };
}

/**
 * *18 — "A person isn't $B unless he or she is $D"
 *
 *   "A person isn't tall unless he or she is remarkable." → all T is R
 *   (Same logical form as *15.)
 */
function template18(rng: Rng, counter: number): Question {
  const adjB = pickFrom(rng, adjectives);
  const adjD = pickDifferentLetter(rng, adjectives, adjB);
  const B = adjB[0]!.toUpperCase();
  const D = adjD[0]!.toUpperCase();

  return {
    id: qid('18', counter),
    prompt: `A person isn't ${adjB} unless he or she is ${adjD}.`,
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
  const noun = pickFrom(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('19', counter),
    prompt: `People who are ${pluralize(noun)} are ${adj}.`,
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
  const noun = pickFrom(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('20', counter),
    prompt: `People who are ${pluralize(noun)} aren't ${adj}.`,
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
  const noun = pickFrom(rng, nounsProfessions);
  const adj = pickDifferentLetter(rng, adjectives, noun);
  const A = noun[0]!.toUpperCase();
  const B = adj[0]!.toUpperCase();

  return {
    id: qid('21', counter),
    prompt: `One or more ${pluralize(noun)} are ${adj}.`,
    ...buildOptions(
      [
        { label: `some ${A} is ${B}` },
        { label: `${B} is ${A}`, layer2: HINT_SWITCHED },
        { label: `${A} is ${B}` },
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
  const noun = pickFrom(rng, nounsProfessions);
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
  template1,
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
] as const;

// =============================================================
// Streaming iterators
// =============================================================

export function* easyQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFrom(rng, easyTemplates);
    yield renderer(rng, counter++);
  }
}

export function* hardQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFrom(rng, hardTemplates);
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
