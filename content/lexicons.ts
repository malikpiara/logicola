/**
 * Logicola lexicons — substitution pools for the per-set generators.
 *
 * Each generator (setA, setC, setJ, setL, setN) draws from these arrays
 * to produce concrete questions from the 2008-source original program templates.
 * E.g., template `*0 T:"$J is a $C person in $p"` resolves $C to an
 * adjective and $J to a name.
 *
 * Source: observed directly from `LCEXE_2008.exe`'s data section
 * (inspection, May 9, 2026). The original program holds the lexicon as
 * eight contiguous blocks of plain ASCII strings starting around the
 * 1.5KB position. Entry order is preserved from the original program so the
 * sequence matches Gensler's authoring intent.
 *
 * Per the source-of-truth policy in
 * the Phase 1 plan (Q3): the original program is authoritative.
 * The 2003 documented lexicon (the question-generator notes) is
 * superseded where they differ; its catalog is recorded in the
 * "vs. 2003" comments below for traceability.
 *
 * TWO LAYERS, as of 2026-08-19. The arrays in the first half of this
 * file are the original program and are frozen — they are named `*2008` and
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
 * the original program has them in both pools and the generators may
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
 * Everything above this line is the original program, verbatim and frozen —
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
 * Why this shape rather than editing the arrays: the original program is the
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
  // 0.78/M and falling (0.88x) — the same profile as `courteous`, the one
  // genuinely dated adjective. Its replacement `expat` is no commoner TODAY
  // (both 3.01 on wordfreq) but the trends are opposite: grocer x0.88 against
  // expat x73. That gap is the whole "dated vs merely rare" distinction, and
  // it is the clearest case of it in the file. (Malik, 2026-08-20)
  'grocer',
  // Retired 2026-08-21 AGAINST its instruments — the frantic shape, on
  // the noun side: bandit is rising (x1.64 since 1950), sits mid-pool
  // (3.37), and 100% of 18-23s know it. The evidence says the word is
  // alive; the judgment is that it lives in the GAMING register (bandit
  // camps) while being dead in the news register, and Malik wants the
  // crime cluster to read like the news. Don't relitigate from the
  // figures alone — they were on the table.
  'bandit',
];

/** Entries withdrawn from `adjectives`. */
const adjectivesRetired: readonly string[] = [
  'demented', // clinical term for dementia, used here pejoratively
  // Reviewed against Google Books Ngram frequencies, 2026-08-20. Figures are
  // occurrences per million in 2015-19, and the multiple is 2015-19 against
  // 1948-52 — the pool's median adjective runs 9.39/M.
  //
  // The measurement corrected two intuitions and produced one word nobody had
  // flagged. `comical` was retired here and REINSTATED: it reads dated but has
  // nearly tripled since 1950 (2.87x, 1.57/M). And "dated" turned out to be
  // the wrong charge against `bashful`, which is rising — its problem is
  // rarity, not decline.
  'bashful', // 0.59/M — a sixteenth of the pool median. Rare, though rising.
  'courteous', // 2.01/M and falling (0.77x) — the one genuinely dated word,
  // and `polite` (8.83/M, rising) already covers it
  'tactful', // 0.59/M AND falling (0.79x). The only 2008 adjective failing
  // both tests, and it was waved through on intuition as "still used, fine".
  'boastful', // 2.50 — rarer than `bashful`; neither of us flagged it, the
  // measurement did. `arrogant` (3.74) covers the same ground.
  'sociable', // 2.97 — `friendly` (4.64) is already in the pool, and
  // `outgoing` (3.59) joins it
  'fanatical', // 3.02 and falling (0.81x on Ngrams) — `obsessive` (3.43)
  // NOT retired despite being rare: `forgetful` (2.87) has no one-word
  // replacement, and the pool needs conceptual range, not only frequency.
  // `likeable` (3.02) has no reform available either — the American spelling
  // `likable` is 2.96, RARER than the British one, which is the opposite of
  // the loveable/lovable case and would have been got wrong by analogy.
  'frivolous', // retired for SENSE DRIFT, not rarity — at 3.22 it is no rarer
  // than `comical` (3.23), which stays. In Google Books 2000-19 the bigram
  // "frivolous lawsuits" runs 51.1 per billion against "frivolous person" at
  // 3.1: the word has become a legal term, and its overall frequency rests on
  // a sense that never appears in "a frivolous biologist". `silly` (4.39)
  // covers the ground. Malik spotted this one; the collocation test confirmed
  // it (2026-08-20).
  //
  // The same test flags colorful (1.8), notorious (2.1), prosperous (3.4),
  // realistic (3.5) and persistent (3.9) on "X person" counts — but NOT acted
  // on, because the test undercounts adjectives that prefer a specific noun.
  // We say "notorious criminal", never "notorious person". Only frivolous had
  // a measured ratio showing the drift.
  //
  // `frantic` is the one retirement here that the DATA ARGUES AGAINST, and
  // that is deliberate. It runs 3.33 — no rarer than `comical` (3.23), which
  // stays — and it is the steepest riser in its cluster (2.64x since 1950).
  // Both instruments say keep it. Malik retired it anyway (2026-08-20), on
  // the ground the measurement cannot reach: not the word's health, but the
  // company it keeps. The 2008 pool had a real taste for the lurid — hideous,
  // disgusting, miserable, filthy, gloomy, frantic — at 16% of 87 entries, so
  // a student met one roughly every six draws. The modern layer dilutes that
  // to 12%; this takes one more out of the cluster rather than out of the
  // language. Recorded in full because the comical case ran the other way and
  // someone reading the Ngram figure alone would "fix" this back.
  'frantic', // 3.33 and RISING — retired on editorial judgment, not evidence
  //
  'loveable', // respelling, not datedness: `lovable` runs 0.84/M against this
  // spelling's 0.18/M. The frozen-baseline rule forbids editing the 2008 array
  // in place, so the fix is a retirement plus an addition.
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
  'expat', // 3.01, up 73x since 1950 — replaces `grocer` (0.88x).
  // KEPT 2026-08-20 with the counter-evidence on the table: Brysbaert
  // prevalence has expat at 56% known among 18-23s (grocer: 92%). Malik's
  // call, twice affirmed. Note the norms measure NATIVE speakers — for the
  // L2 students this app also serves, a Latinate/international word can be
  // the more familiar one, not the less. Don't relitigate from either
  // instrument alone.
  // 2026-08-20 second round (see the adjectives block for method):
  'founder', // 4.46 — above the pool median; pairs with Set R's startup passages
  'gamer', // 3.62 — near median, unambiguous, a definitional student identity
  'influencer', // 2.95 but x3.06 — the `expat` profile: rare, steeply rising
  'hacker', // 3.67, rising, 98.9% of 18-23s — replaces `bandit` (Malik's
  // pick over `spy` at 4.24; spy's place-synergy noted for a future round)
  // 2026-08-20, fantasy class nouns — the `Canadian` precedent: a proper-noun
  // class term is exactly what categorical logic wants, and "all Lannisters
  // are rich" is the categorical form students already know as a motto.
  // `Stark` was wanted and is excluded: it is House Stark, Tony Stark and the
  // adjective at once, so it fails the one-word-one-realm rule. These carry
  // FANTASY_REALM tags below; Set A matches their places strictly while REAL
  // nouns roam free — "all bachelors in Essos" is a joke, "all Lannisters in
  // Minneapolis" is a glitch (Malik's call, 2026-08-20).
  'Lannister', // 3.04
  'Targaryen', // 2.71
  'Avenger', // 3.09
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
 * Modern adjectives. 46 entries — pinned by lexicons.test.ts, because this
 * count read "24" while the array held 40 and nobody noticed for a day.
 *
 * Character traits, rather than the 2008 list's taste for the lurid
 * (`hideous`, `disgusting`, `miserable`, `filthy`). Most of those stay — a
 * logic drill wants vivid predicates and they are not slurs — but they were
 * 16% of the 87-word pool, so a student met one roughly every six draws.
 * These additions dilute that to 12%; `frantic` was the one taken out of the
 * cluster outright (see adjectivesRetired).
 *
 * `kind` and `quiet` also join Set A's ESTREGULARS so they inflect ("the
 * kindest poet") instead of falling through to "the most kind".
 */
const adjectivesModern: readonly string[] = [
  // Added 2026-08-20, chosen on measured frequency rather than taste. Figures
  // are wordfreq Zipf, which blends subtitles, social media, news, Wikipedia
  // and books — a better instrument here than books alone, because the
  // question is what a nineteen-year-old actually meets. The pool median is
  // 4.07; every word below is at or above it.
  //
  // These continue a revision GENSLER STARTED. Across 24 Latinate/plain
  // synonym pairs his 2003 core holds the Latinate word alone 17 times and
  // the plain word alone once — plausibly the formation of a Jesuit
  // philosopher in a discipline whose own vocabulary is Latin. But the head
  // of his 2008 list is eighteen plain monosyllables, eleven of them added
  // that year. He diagnosed it himself; this finishes the move.
  // The six commonest person-adjectives the pool lacked entirely. `happy`,
  // `sad` and `funny` are again the plain partners to `cheerful`, `gloomy`
  // and `humorous` — the Latinate/plain pattern keeps producing the same
  // answer. `old`/`young` fill a stranger gap: the pool had no age dimension
  // at all. Four of the six needed the superlative rule fixed first.
  'busy', // 4.75
  'funny', // 5.02
  'happy', // 5.35
  'old', // 5.75
  'sad', // 4.84
  'young', // 5.43
  //
  'arrogant', // 3.74 — replaces `boastful` (2.50)
  'brave', // 4.33 — the plain partner to `courageous` (3.59), which stays
  'calm', // 4.54
  'lazy', // 4.24
  'obsessive', // 3.43 — replaces `fanatical` (3.02)
  'outgoing', // 3.59 — replaces `sociable` (2.97)
  'proud', // 4.78
  'sensitive', // 4.46
  'silly', // 4.39
  'wise', // 4.51
  //
  // `stressed` (4.18) replaces `frantic` — the same agitation, in the word a
  // student would actually use for it. It is also the exact inverse of the
  // `frivolous` finding above, and the collocation test that condemned that
  // word is what vindicates this one: in Google Books, "he stressed that"
  // (the emphasis sense, useless to us) is FLAT at 0.91x, while "feeling
  // stressed" has gone from 0.1 to 70.7 per billion — 592x — and "stressed
  // out" 191x. So the psychological sense, the only one that can appear in
  // "a stressed logician", is not merely current but the fastest-growing
  // word in this file. Its blended 4.18 understates it. Stays out of
  // ESTREGULARS on purpose: "most stressed" is right, "stressedest" is not.
  'stressed', // 4.18 — replaces `frantic` (3.33)
  //
  // `quick` (4.98) is not a replacement for anything — it closes a gap that
  // had been open since 1985. `slow` is in the pool and always has been; its
  // antonym never was, so a drill could say a logician was slow but never
  // that one was quick. It also thins the worst letter crowding: 19 of 118
  // adjectives began with C and 13 with S against one apiece for J, K, Q and
  // U, and since the wff letter is the adjective's initial, that lopsidedness
  // is something a student SEES. Joins ESTREGULARS in setA.generator.ts —
  // "the quickest" outruns "the most quick" 716 to 3 per billion, and beats
  // "the slowest" (419), which already inflects.
  'quick', // 4.98 — the missing antonym of `slow`
  //
  // 2026-08-20 vocabulary review, second round: words that rose in the last
  // decade, proposed with figures and approved by Malik as a slate. Zipf from
  // wordfreq; trend is Books 2005-09 vs 2015-19. Both instruments end around
  // 2019-2021, so post-2020 coinages are invisible to them — everything here
  // is either measured or carries its judgment argument inline.
  'relatable', // 3.33, x4.39 in Books — the steepest riser found in any pool
  'toxic', // 4.24 — the `stressed` pattern: "toxic chemicals" falls x0.8 while
  // "toxic relationship" runs x5.2 and "toxic people" x2.9; the person-sense
  // is the current one and the only sense a drill can render
  'chill', // 4.18, x1.58 — student register; stays OUT of ESTREGULARS
  // ("chillest" is 1.92, "most chill" wins). Cost accepted: C now holds 21
  // initials, the pool's most crowded letter.
  'mindful', // 3.49, x1.52
  //
  // Excluded despite scoring well, to avoid padding: `sweet` and `warm`
  // overlap `gentle` and `charming`; `clever` overlaps `smart` and `bright`;
  // `loyal` (4.20) is barely commoner than `faithful` (4.10), already present.
  //
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
  'lovable', // the respelling of the retired `loveable`
  'shy', // replaces `bashful`
  'skeptical',
  'stubborn',
  'thoughtful',
  'unpredictable',
  'witty', // replaces `comical`
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
  'Alida',
  'Amani',
  'Ana',
  'André',
  'Ben',
  'Diego',
  'Elena',
  'Grace', // 4.56 — the commonest name in the pool (Malik's pick, 2026-08-20)
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
  'Sophia',
  'Svitlana',
  'Syed',
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
  // Added 2026-08-20. `Viserys` was wanted alongside these and is BLOCKED:
  // V is a reserved name initial — it reads as ∨. Nothing else about the name
  // fails, which is exactly why the rule is a test and not a habit.
  'Cersei',
  'Daenerys', // trailing `s` is fine — no generator takes a possessive
  'Tyrion',
  'Arya',
  'Jaime',
  'Sansa',
  // 2026-08-20, second fantasy round (approved slate): each franchise needs
  // at least two names and two places once Set A realm-matches draws.
  // `Vision` (4.63) would have been the strongest fictional name in the pool
  // and is blocked — V reads as ∨. Wanda and Wonder Woman fall to W.
  'Superman',
  'Joker',
  'Groot',
  'Thanos',
  'Hulk', // tagged marvel — fills the H-gap (Harry stood alone)
  // 2026-08-21, the AMBIGUOUS channel extended (Malik-approved): each
  // reads as an ordinary name to non-fans and as a wink to fans, so none
  // is realm-tagged and none costs fantasy dosage — the Bruce/Tony
  // design. `Diana` is the deliberate route around the W-ban: Wonder
  // Woman falls to the reserved initial, her name doesn't. `Kamala` was
  // wanted and is excluded: it collides with Harris in Set R's
  // politician roster — one word, two people, ACROSS realms.
  'Miles',
  'Gwen',
  'Diana',
  'Clark',
  'Logan',
  'Alfred',
];

/** Modern Class A verbs (attitude or feeling toward a person). 9 entries. */
const verbsAModern: readonly string[] = [
  'avoid',
  // 2026-08-20 second round. `follow` (5.14 — the commonest word added to any
  // pool today) is the one addition where the 2008 frame and the 2026 sense
  // collapse into each other: "everyone who follows Rihanna" was gibberish in
  // 2008 and is literal now. Both readings translate identically, so the
  // ambiguity costs the logic nothing.
  'follow',
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
  // 2026-08-20 second round (method in the adjectives block). These land in
  // the deontic and belief frames, where "whether you ought to scroll" is a
  // moral question 2026 students actually have:
  'scroll', // 3.86
  'binge', // 3.60 — "binge-watching" ran x1081 in Books 2005-19
  'vent', // 3.80
  'procrastinate', // 2.71 — rarest word added today, kept on the `forgetful`
  // precedent: no one-word substitute, and arguably the most student-central
  // verb in English. Frequency was never the only test.
  'meditate', // 3.26
  'commute', // 3.56
  'run', // ~5 — generically useful and, in passing, Flash-flavored;
  // gerund 'running' (CVC doubling) and 3sg 'runs' both covered
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
  // 2026-08-20 second round. The figures for `ghost` and `troll` are noun-
  // contaminated and were treated as floors, not measurements: "ghosted
  // him/her" ran x8 in Books by 2019 — and Books ENDS mid-climb. A deontic
  // drill about whether you may ghost someone teaches the logic in the
  // student's own moral vocabulary, which is the whole hypothesis.
  'ghost', // 4.42, noun-contaminated
  'troll', // 3.73, noun-contaminated
  'block', // 4.88 — the social and physical readings both work in the frame
  'mute', // 3.66
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
 * Names whose bearer is unambiguously fictional, each tagged with its
 * franchise. Set A realm-matches draws on this, so "Batman is a bachelor in
 * Rome" cannot render and neither can "Loki in Gotham" — fictional names
 * draw places from their own world (Malik, 2026-08-20).
 *
 * Bruce, Natasha, Tony, Peter and Jaime are deliberately NOT here: they were
 * chosen because they read as ordinary names, and tagging them would forfeit
 * exactly that ambiguity. Madonna, Ronaldo and Rihanna are real people.
 */
export type FantasyRealm = 'marvel' | 'dc' | 'westeros';

export const FANTASY_REALM: Readonly<Record<string, FantasyRealm>> = {
  Batman: 'dc',
  Superman: 'dc',
  Joker: 'dc',
  Thor: 'marvel',
  Loki: 'marvel',
  Groot: 'marvel',
  Thanos: 'marvel',
  Cersei: 'westeros',
  Daenerys: 'westeros',
  Tyrion: 'westeros',
  Arya: 'westeros',
  Sansa: 'westeros',
  // Class nouns share the map — realm is a property of the word, not of
  // whether it names an individual or a class.
  Hulk: 'marvel',
  Lannister: 'westeros',
  Targaryen: 'westeros',
  Avenger: 'marvel',
};

export const FANTASY_NAMES: ReadonlySet<string> = new Set(
  Object.keys(FANTASY_REALM)
);

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
 * 2008. the question-generator notes attributes it to the translation
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
