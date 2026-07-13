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
 * The 2003 documented lexicon (the generator plan) is
 * superseded where they differ; its catalog is recorded in the
 * "vs. 2003" comments below for traceability.
 */

/**
 * Profession nouns. 52 entries.
 *
 * vs. 2003: 7 added (`backpacker`, `poet`, `lawyer`, `pharmacist`,
 * `politician`, `republican`, `pickpocket`); 1 removed (`dictator`).
 */
export const nounsProfessions: readonly string[] = [
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
export const adjectives: readonly string[] = [
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
export const names: readonly string[] = [
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
export const verbsA: readonly string[] = [
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
export const praiseStrings: readonly string[] = [
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
export const relations: readonly string[] = [
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
export const verbsB: readonly string[] = [
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
export const verbsTransitive: readonly string[] = [
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
