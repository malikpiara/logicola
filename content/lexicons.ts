/**
 * Logicola lexicons — substitution pools for the per-set generators.
 *
 * Each generator (setA, setC, setJ, setL, setN) draws from these arrays
 * to produce concrete questions from the 2008-source DSL templates.
 * E.g., template `*0 T:"$J is a $C person in $p"` resolves $C to an
 * adjective and $J to a name.
 *
 * Source: extracted directly from `LCEXE_2008.exe`'s data section
 * (strings dump, May 9, 2026). The 2008 binary holds the lexicon as
 * eight contiguous blocks of plain ASCII strings starting around the
 * 1.5KB position. Entry order is preserved from the binary so the
 * sequence matches Gensler's authoring intent.
 *
 * Per the source-of-truth policy in
 * notes/PHASE-1-WORKPLAN.md (Q3): the 2008 binary is authoritative.
 * The 2003 documented lexicon (notes/03-question-generators.md) is
 * superseded where they differ; its catalog is recorded in the
 * "vs. 2003" comments below for traceability.
 *
 * TWO LAYERS, as of 2026-08-19. The arrays in the first half of this
 * file are the 2008 binary and are frozen — they are named `*2008` and
 * nothing imports them directly. The exported pools the generators
 * actually draw from are composed in the second half, under "The modern
 * layer", as (baseline − retirements) + additions. Read that block's
 * doc comment before changing any vocabulary; it records why the shape
 * is what it is and which invariants the composition has to preserve.
 */

/**
 * Profession nouns. 52 entries.
 *
 * vs. 2003: 7 added (`backpacker`, `poet`, `lawyer`, `pharmacist`,
 * `politician`, `republican`, `pickpocket`); 1 removed (`dictator`).
 */
const nounsProfessions2008: readonly string[] = [
  'bachelor',
  'terrorist',
  'professor',
  'biologist',
  'carpenter',
  'lifeguard',
  'convict',
  'dancer',
  'soldier',
  'dentist',
  'criminal',
  'foreigner',
  'diabetic',
  'lunatic',
  'druggist',
  'backpacker',
  'farmer',
  'cannibal',
  'poet',
  'fugitive',
  'detective',
  'plumber',
  'bandit',
  'grocer',
  'lawyer',
  'customer',
  'guitarist',
  'hypocrite',
  'clown',
  'pilot',
  'judge',
  'librarian',
  'prisoner',
  'logician',
  'musician',
  'novelist',
  'pessimist',
  'scientist',
  'pharmacist',
  'reporter',
  'politician',
  'republican',
  'scholar',
  'Canadian',
  'senator',
  'doctor',
  'pickpocket',
  'student',
  'banker',
  'teacher',
  'democrat',
  'wrestler',
] as const;

/**
 * Adjectives. 87 entries.
 *
 * vs. 2003: ~15 added — mostly simple monosyllabic adjectives
 * (`slow`, `strong`, `tall`, `wild`, `dull`, `mean`, `poor`, `rich`,
 * `bold`, `bright`, `weak`) plus `frightened`, `remarkable`,
 * `courageous`, `disgusting`.
 */
const adjectives2008: readonly string[] = [
  'slow',
  'cheap',
  'strong',
  'tall',
  'clean',
  'wild',
  'cruel',
  'dull',
  'short',
  'mean',
  'poor',
  'rich',
  'bold',
  'rough',
  'bright',
  'smart',
  'tough',
  'weak',
  'bashful',
  'sociable',
  'tactful',
  'boring',
  'careful',
  'scholarly',
  'talented',
  'cautious',
  'vicious',
  'charitable',
  'frivolous',
  'generous',
  'charming',
  'frightened',
  'gentle',
  'prosperous',
  'realistic',
  'cheerful',
  'boastful',
  'courteous',
  'powerful',
  'remarkable',
  'cowardly',
  'lively',
  'creative',
  'dishonest',
  'faithful',
  'notorious',
  'famous',
  'childish',
  'fanatical',
  'courageous',
  'bitter',
  'filthy',
  'confused',
  'greedy',
  'hideous',
  'forgetful',
  'confident',
  'brilliant',
  'candid',
  'fortunate',
  'beautiful',
  'selfish',
  'frantic',
  'loveable',
  'mediocre',
  'friendly',
  'gloomy',
  'colorful',
  'lonely',
  'miserable',
  'comical',
  'humorous',
  'likeable',
  'disgusting',
  'logical',
  'naive',
  'poetic',
  'nervous',
  'persistent',
  'dangerous',
  'polite',
  'romantic',
  'curious',
  'demented',
  'sarcastic',
  'terrified',
  'virtuous',
] as const;

/**
 * First names used in translations. 8 entries.
 *
 * vs. 2003: identical. Per the runtime, the user's own first name
 * (the `$n` substitution from the welcome dialog) may also appear in
 * prompts in addition to this static catalog.
 */
const names2008: readonly string[] = [
  'Sally',
  'Madonna',
  'Harry',
  'George',
  'Carol',
  'Donna',
  'Keith',
  'David',
] as const;

/**
 * Class A verbs. 22 entries.
 *
 * Transitive verbs expressing attitude or feeling toward a person
 * (e.g., "I admire George", "I hate Sally").
 *
 * vs. 2003: 8 added (`love`, `hate`, `hurt`, `appreciate`, `help`,
 * `know`, `like`, `understand`). Some entries (`hurt`, `help`) also
 * appear in `verbsTransitive` — these are intentional duplicates;
 * the 2008 source has them in both pools.
 */
const verbsA2008: readonly string[] = [
  'bribe',
  'forget',
  'love',
  'respect',
  'forgive',
  'hate',
  'admire',
  'hurt',
  'ignore',
  'appreciate',
  'blame',
  'injure',
  'bother',
  'help',
  'insult',
  'know',
  'like',
  'understand',
  'despise',
  'encourage',
  'flatter',
  'upset',
] as const;

/**
 * Praise strings shown after a correct answer. 30 entries.
 *
 * vs. 2003: 6 added (`A logic brain`, `I am impressed`,
 * `Sharp student`, `Yes! Yes`, `Totally cool`, `Good response`).
 */
const praiseStrings2008: readonly string[] = [
  'Wonderful',
  'Logic whiz',
  'Brilliant',
  'Fabulous',
  'Touchdown',
  'What talent',
  'A logic brain',
  'Awesome',
  'I am impressed',
  'Tremendous',
  'Marvelous',
  'Home run',
  'Fantastic',
  'Very nice',
  'What ability',
  'Magnificent',
  'Phenomenal',
  'Pretty smart',
  'Excellent',
  'Good job',
  'Incredible',
  'Sharp student',
  'Yes! Yes',
  'Totally cool',
  'Superb',
  'What a brain',
  'Good response',
  'What insight',
  'Accurate',
  'Exactly',
] as const;

/**
 * Relationship nouns. 13 entries.
 *
 * Used in templates expressing one person's relation to another
 * (e.g., "Harry's classmate").
 *
 * vs. 2003: identical.
 */
const relations2008: readonly string[] = [
  'classmate',
  'lover',
  'neighbor',
  'cousin',
  'friend',
  'client',
  'parent',
  'companion',
  'relative',
  'critic',
  'defender',
  'colleague',
  'roommate',
] as const;

/**
 * Class B verbs. 25 entries.
 *
 * Intransitive verbs (or verbs used in intransitive constructions);
 * roughly action/behavior verbs the subject performs.
 *
 * vs. 2003: 12 added — nearly doubled. New: `complain`, `look`,
 * `sing`, `fail`, `flirt`, `sleep`, `park`, `bluff`, `pray`, `sell`,
 * `stay`, `talk`.
 */
const verbsB2008: readonly string[] = [
  'complain',
  'guess',
  'invest',
  'conform',
  'look',
  'despair',
  'sing',
  'fail',
  'flirt',
  'sleep',
  'groan',
  'laugh',
  'steal',
  'park',
  'bluff',
  'pray',
  'repent',
  'sell',
  'cheer',
  'speak',
  'forfeit',
  'boast',
  'cheat',
  'stay',
  'talk',
] as const;

/**
 * Transitive action verbs. 21 entries.
 *
 * vs. 2003: 6 added (`hurt`, `kick`, `help`, `disappoint`, `fool`,
 * `harm`). Note that `hurt` and `help` also appear in `verbsA` —
 * the 2008 binary has them in both pools and the generators may
 * draw from either.
 */
const verbsTransitive2008: readonly string[] = [
  'abandon',
  'disturb',
  'exploit',
  'flatter',
  'appoint',
  'bother',
  'defeat',
  'hurt',
  'insult',
  'kick',
  'defraud',
  'help',
  'arrest',
  'humor',
  'attack',
  'disappoint',
  'fool',
  'harm',
  'betray',
  'pester',
  'trick',
] as const;

// =============================================================
// The modern layer (Malik, 2026-08-19)
// =============================================================

/**
 * Everything above this line is the 2008 binary, verbatim and frozen —
 * the arrays are named `*2008` and are never edited, so the original
 * catalog stays reconstructible from this file alone. Everything below
 * is ours.
 *
 * Two operations produce the live pools:
 *
 *   1. **Retirement** — a 2008 entry withdrawn from play. Kept in the
 *      baseline array (fidelity) but filtered out of the live pool.
 *      Each retirement carries its reason; the bar is "a 2026 student
 *      reads this as wrong", not merely "old".
 *   2. **Addition** — vocabulary the 2008 pools never had.
 *
 * Why this shape rather than editing the arrays: the 2008 binary is the
 * project's source of truth for exercise *structure*, and an audit trail
 * is only worth something if the baseline stays readable next to what we
 * changed. `lexicons.test.ts` asserts the baseline counts, so a silent
 * edit to a 2008 array fails the suite.
 *
 * Grading is unaffected by any of this: every generator derives its wff
 * letter from the drawn word at runtime (`noun[0].toUpperCase()`), so
 * substituting vocabulary moves questions between letters rather than
 * breaking answers. What DOES matter is initial-letter spread —
 * `pickDifferentLetter` filters a pool to entries whose first letter
 * differs from an already-drawn word, so the additions below deliberately
 * favour letters the 2008 pools were thin on (a, e, i, j, k, o, q, u, v).
 */

/** Entries withdrawn from `nounsProfessions`. */
const nounsProfessionsRetired: readonly string[] = [
  'druggist', // archaic; the 2008 pool already carries `pharmacist`
  'lunatic', // slur for mental illness
];

/** Entries withdrawn from `adjectives`. */
const adjectivesRetired: readonly string[] = [
  'demented', // clinical term for dementia, used here pejoratively
];

/**
 * Entries withdrawn from `names`: none.
 *
 * `Madonna` was proposed for retirement and reinstated on review (Malik,
 * 2026-08-19). She is still globally known, and among Sally, Harry, Carol
 * and Donna the odd name out reads as Gensler's joke — which is a reason
 * to keep it, not to cut it. Recorded so nobody re-proposes it.
 */
const namesRetired: readonly string[] = [];

/**
 * Lowercase letters a name's initial may NOT take.
 *
 * Every generator turns a name into a singular term by lowercasing its
 * first letter (`name[0].toLowerCase()`), so a name's initial IS a piece
 * of logical notation. Seven letters are already spoken for, and a name
 * landing on one emits a symbol that reads as something else entirely:
 *
 *   x, y, z  bound variables. Sets J, L and N ship `(x)` and `(∃x)`
 *            throughout; an individual constant `y` next to them reads
 *            as a free variable, which is a different claim.
 *   i        the first person. Set A's templates *2 and *3 emit `i is C`
 *            for "I'm a wild clown in Berlin."
 *   u        "you". Set L's imperative notation is `S{u}` — "you, sing!"
 *   v        reads as ∨ (vel, disjunction) to anyone who has met ASCII
 *            logic notation.
 *   w        used as a fourth variable alongside x, y, z in several
 *            textbooks. Softer than the rest, but there is no shortage
 *            of safe letters, so it is not worth the argument.
 *
 * Gensler appears to have worked to this rule without writing it down:
 * his eight names take initials c, d, g, h, k, m and s — with 8 names
 * drawn from 26 letters, missing all seven reserved ones is not chance.
 *
 * Caught by Malik on review, 2026-08-19, after `Zara`, `Zendaya`, `Yoda`,
 * `Vader` and `Wolverine` had all been proposed and none of the earlier
 * checks noticed. `lexicons.test.ts` now enforces it.
 */
export const RESERVED_NAME_INITIALS: readonly string[] = [
  'i',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

/**
 * Modern professions. 21 entries.
 *
 * Jobs a 2026 undergraduate has actually met, weighted toward initials the
 * 2008 list barely used — it held nothing under a, e, i or o, which cost
 * `pickDifferentLetter` its headroom and made the wff letters repetitive.
 *
 * The vowel-initial entries here are deliberate; see the note on the
 * indefinite article below.
 */
const nounsProfessionsModern: readonly string[] = [
  'architect',
  'athlete',
  'barista',
  'chemist',
  'designer',
  'economist',
  'electrician',
  'engineer',
  'illustrator',
  'intern',
  'journalist',
  'mechanic',
  'nurse',
  'optician',
  'paramedic',
  'programmer',
  'researcher',
  'therapist',
  'translator',
  'veterinarian',
  'volunteer',
];

/**
 * Modern adjectives. 21 entries.
 *
 * Character traits, rather than the 2008 list's taste for the lurid
 * (`hideous`, `frantic`). Those stay — a logic drill wants vivid predicates
 * and they are not slurs — but they were most of what the pool had, so a
 * student met the same handful of extremes every run.
 *
 * `kind` and `quiet` also join Set A's ESTREGULARS so they inflect ("the
 * kindest poet") instead of falling through to "the most kind".
 */
const adjectivesModern: readonly string[] = [
  'ambitious',
  'anxious',
  'awkward',
  'easygoing',
  'efficient',
  'energetic',
  'honest',
  'impatient',
  'impulsive',
  'jealous',
  'kind',
  'optimistic',
  'organized',
  'patient',
  'practical',
  'quiet',
  'reliable',
  'skeptical',
  'stubborn',
  'thoughtful',
  'unpredictable',
];

/**
 * Modern first names.
 *
 * Reviewed name by name with Malik, 2026-08-19. Two registers, kept
 * deliberately small after the first draft sprawled across five:
 *
 *   - ordinary given names, chosen because PostHog GeoIP puts the drilling
 *     population in Metro Manila, Ontario, Nairobi and Singapore, and the
 *     2008 eight are one generation of one country;
 *   - five famous mononyms, extending what `Madonna` already does. Real
 *     people and characters both appear in predicate slots ("X is a
 *     cowardly person in Ottawa"), which is inert for Batman and merely
 *     unremarkable for Ronaldo, but is the reason the list stopped here
 *     rather than growing.
 *
 * Every initial is checked against RESERVED_NAME_INITIALS above — that
 * rule is why Zendaya, Yoda, Vader, Wolverine and Zara are all absent
 * despite being wanted.
 *
 * Names ending in `s` are fine today: no generator takes a possessive,
 * every interpolation is bare. That would only change if Set H ships and
 * uses the `relations` pool ("Harry's classmate"). An earlier revision of
 * this file claimed the constraint was already live; it was not.
 */
const namesModern: readonly string[] = [
  // Ordinary given names. PostHog GeoIP puts the drilling population in
  // Metro Manila, Ontario, Nairobi and Singapore; the 2008 eight are one
  // generation of one country.
  'Aisha',
  'Amani',
  'Ana',
  'André',
  'Ben',
  'Diego',
  'Elena',
  'Jonathan',
  'Luca',
  'Maria',
  'Mark',
  'Mary',
  'Maya',
  'Mei',
  'Miguel',
  'Moritz',
  'Nia',
  'Noah',
  'Omar',
  'Pedro',
  'Priya',
  'Ravi',
  'Sarah',
  'Sebastian',
  'Sofia',
  'Svitlana',
  'Syed',
  'Tariq',
  'Timothy',
  // Marvel first names. These read as ordinary given names in a prompt and
  // only land as a reference if the reader catches them, which is the whole
  // point — no register shift, no cost to anyone who misses it. `Frank` and
  // `Jessica` were chosen for their initials as much as their characters:
  // f and j were the last unused safe letters in the pool.
  //
  // `Carol` needs no adding — Gensler put it in the 2008 list, and Carol
  // Danvers is Captain Marvel. Pure accident, predating the MCU.
  'Bruce',
  'Frank',
  'Jessica',
  'Natasha',
  'Peter',
  'Tony',
  // Mononyms, extending what `Madonna` already does.
  'Ronaldo',
  'Rihanna',
  'Batman',
  'Thor',
  'Loki',
];

/** Modern Class A verbs (attitude or feeling toward a person). 9 entries. */
const verbsAModern: readonly string[] = [
  'avoid',
  'doubt',
  'envy',
  'notice',
  'remember',
  'resent',
  'support',
  'trust',
  'value',
];

/** Modern Class B verbs (intransitive action). 10 entries. */
const verbsBModern: readonly string[] = [
  'apologize',
  'argue',
  'celebrate',
  'hesitate',
  'improvise',
  'listen',
  'negotiate',
  'travel',
  'volunteer',
  'wander',
];

/**
 * Modern transitive action verbs. 8 entries.
 *
 * `overlook` was here and was removed (Malik, 2026-08-19). A verb's initial
 * becomes its PREDICATE letter, and this pool feeds Sets L and N, where `O`
 * is the deontic operator — so "It's your duty not to overlook Peter" came
 * out as `O∼O{u}p`, in which the two Os mean entirely different things and
 * nothing distinguishes them. Gensler has no O-initial verb in any of the
 * three verb pools; see RESERVED_VERB_INITIALS below.
 */
const verbsTransitiveModern: readonly string[] = [
  'confuse',
  'criticize',
  'defend',
  'distract',
  'impress',
  'interrupt',
  'mislead',
  'rescue',
];

/**
 * TERM initials are NOT restricted — and the reasoning is worth keeping,
 * because the obvious inference is wrong (investigated 2026-08-19).
 *
 * The 2008 noun and adjective pools contain no vowel-initial entry at all.
 * Two explanations fit that fact:
 *
 *   1. LOGIC. A noun or adjective becomes a CAPITAL term letter, and in
 *      traditional syllogistic logic — what Set A teaches — A, E, I and O
 *      already name the four categorical forms (from *AffIrmo* / *nEgO*).
 *      A vowel-initial term yields `some E is not K`: an O-form proposition
 *      whose subject letter is E.
 *   2. GRAMMAR. The templates hardcoded the indefinite article ("is a $C
 *      person"), so a vowel-initial word would have produced "a efficient
 *      person".
 *
 * Explanation 1 is FALSE, and Gensler's own lexicon disproves it. `verbsA`
 * contains admire, ignore, appreciate, injure, insult, understand,
 * encourage and upset — and verb initials become capital letters in Set A
 * too, so the unmodified 2008 engine already emits `all C is E` and
 * `some P is not I`. He plainly did not treat those as collisions.
 *
 * Explanation 2 fits everything with nothing left over: nouns and
 * adjectives are the ONLY pools that follow an article in the templates.
 * Verbs never do, names never do — and those are exactly the pools that
 * contain vowel-initial entries.
 *
 * That constraint is now handled properly by lib/grammar.ts, so it no
 * longer restricts vocabulary. An A/E/I/O restriction was written, applied,
 * and reversed once the verb evidence turned up; do not re-derive it.
 */

/**
 * Uppercase letters a VERB's initial may not take.
 *
 * The sibling of RESERVED_NAME_INITIALS, and discovered the same way — by
 * reading generated output rather than by any test. `verbsB` and
 * `verbsTransitive` feed Sets L and N, where a verb's initial becomes its
 * predicate letter, and where `O` is already the deontic operator:
 *
 *   O{u}:A   "you ought to believe A"
 *   O∼O{u}p  ← "it's your duty not to overlook Peter", with `overlook`
 *              in the pool. Unreadable: same glyph, two meanings.
 *
 * The 2008 verb pools contain no O-initial verb at all — across verbsA,
 * verbsB and verbsTransitive combined. Same signature as the name rule:
 * a constraint Gensler worked to and never wrote down.
 *
 * NOT included, deliberately: `R`, which Set N uses for "reasonable"
 * (`R{u}:A`). Gensler's own `repent` takes it, so he evidently judged the
 * contexts distinguishable — the operator always carries `{u}:`. Recorded
 * so the omission reads as a decision rather than an oversight.
 */
export const RESERVED_VERB_INITIALS: readonly string[] = ['o'];

/**
 * Compose a live pool: the 2008 baseline minus its retirements, then the
 * modern additions. Order is deliberate — baseline first keeps the 2008
 * sequence (Gensler's authoring intent) at the head of the pool, so a
 * draw can still be diffed against the original.
 */
function live(
  baseline: readonly string[],
  retired: readonly string[] = [],
  modern: readonly string[] = []
): readonly string[] {
  const withdrawn = new Set(retired);
  return [...baseline.filter((e) => !withdrawn.has(e)), ...modern];
}

// =============================================================
// Live pools — what the generators actually draw from
// =============================================================

export const nounsProfessions = live(
  nounsProfessions2008,
  nounsProfessionsRetired,
  nounsProfessionsModern
);
export const adjectives = live(
  adjectives2008,
  adjectivesRetired,
  adjectivesModern
);
export const names = live(names2008, namesRetired, namesModern);
export const verbsA = live(verbsA2008, [], verbsAModern);
export const verbsB = live(verbsB2008, [], verbsBModern);
export const verbsTransitive = live(
  verbsTransitive2008,
  [],
  verbsTransitiveModern
);

/**
 * `relations` and `praiseStrings` are imported by nothing (verified
 * 2026-08-19). `praiseStrings` is 2008's per-answer applause, which the
 * scored end screen replaced.
 *
 * `relations` is unexplained rather than explained. What is verified: no
 * ported generator draws it. What is NOT: which templates consumed it in
 * 2008. notes/03-question-generators.md attributes it to the translation
 * drills (sets A, C, H, J, L, N) — of which H is still an empty skeleton
 * with 93 unbuilt templates — but that same note flags the template
 * combinatorics as unresolved pending a driver-function trace. So "it
 * belongs to Set H" is a reasonable guess, not a finding; do not repeat
 * it as one.
 *
 * Both pass through unmodernised — and if a future port revives one, it
 * should arrive as the 2008 text and be modernised then, deliberately.
 */
export const relations = live(relations2008);
export const praiseStrings = live(praiseStrings2008);

/** The 2008 baselines, exported so the fidelity tests can assert them. */
export const baselines2008 = {
  nounsProfessions: nounsProfessions2008,
  adjectives: adjectives2008,
  names: names2008,
  verbsA: verbsA2008,
  verbsB: verbsB2008,
  verbsTransitive: verbsTransitive2008,
  relations: relations2008,
  praiseStrings: praiseStrings2008,
} as const;

/** Every retirement, keyed by pool, for the tests and for docs. */
export const retired2008 = {
  nounsProfessions: nounsProfessionsRetired,
  adjectives: adjectivesRetired,
  names: namesRetired,
} as const;

/**
 * Convenience type for any lexicon array (for generic generator helpers
 * that pick a random entry from any pool).
 */
export type Lexicon = readonly string[];

/**
 * All lexicons keyed by name — useful for testing and for generators
 * that need dynamic lookup.
 */
export const lexicons = {
  nounsProfessions,
  adjectives,
  names,
  verbsA,
  verbsB,
  verbsTransitive,
  relations,
  praiseStrings,
} as const;

export type LexiconName = keyof typeof lexicons;
