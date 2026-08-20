/**
 * Set R — Informal Fallacies: live-random generator.
 *
 * Phase 2. Ports Gensler's 2008 LCEXE Set R as a passage-identification
 * drill: show a passage, ask which of the 18 informal fallacies it
 * commits. Goes with the "Fallacies and Argumentation" chapter (ch. 4)
 * of Gensler's Introduction to Logic.
 *
 * Fidelity notes (source: logicola-ghidra/notes/exercises/2008/decoded/set_R.txt,
 * ported by logicola-ghidra/tools/port_set_r.py into ./setR.data.ts):
 *
 *   - The original engine draws a random fallacy *section* per problem
 *     (uniform over fallacy types, with recency avoidance), then a random
 *     passage variant within it. We mirror that: each 18-question cycle
 *     is a shuffle of all 18 fallacies, so any 10 consecutive draws are
 *     10 distinct fallacy types.
 *   - Every question offers the full 18-fallacy taxonomy as options, in
 *     the original answer grid's fixed order (no shuffling — stable
 *     positions build the student's mental map of the taxonomy).
 *   - Some passages commit more than one fallacy and accept several
 *     answers (the original M-codes), preserved via `correctId`.
 *   - Names, cars, parties, and pronouns are substituted fresh per draw
 *     from the original lexicon pools, with pronoun agreement guaranteed
 *     by choosing one gender bundle per passage.
 */

import type { Option, Question, Set } from '../types';
import { pickFresh, rngFromSeed, type Rng } from '@/lib/rng';
import {
  CARS,
  FALLACIES,
  GROUPS,
  GENDERS,
  PARTIES,
  SECTIONS,
  PLAYERS,
  POLITICIANS,
  SURNAMES,
  type Fallacy,
  type FallacyCode,
  type FallacySection,
} from './setR.data';

const FALLACY_BY_CODE: ReadonlyMap<FallacyCode, Fallacy> = new Map(
  FALLACIES.map((f) => [f.code, f])
);

// =============================================================
// Option list — the fixed 18-entry taxonomy grid
// =============================================================

/**
 * One readable gloss per fallacy, used as the wrong-guess hint and in
 * answer reveals. For aa/ah the description is just a lead-in
 * ("This is fallacious if:"), so the numbered clauses are inlined.
 */
function fallacyGloss(fallacy: Fallacy): string {
  if (!fallacy.clauses) return fallacy.description;
  const clauses = fallacy.clauses
    .map((clause, i) => `(${i + 1}) ${trimClause(clause)}`)
    .join('; ');
  return `${fallacy.description} ${clauses}.`;
}

/**
 * Strip the list-connective tail ("…, or") and final period off a clause.
 * Exported for the reference guide, which sets the clauses as the same
 * hanging-numeral list as the hints — the numerals make the disjunction
 * structural, so the prose tails would just stutter.
 */
export function trimClause(clause: string): string {
  return clause.replace(/,? or$/, '').replace(/\.$/, '');
}

function buildOptions(): Option[] {
  return FALLACIES.map((fallacy) => ({
    id: fallacy.id,
    // The grid cell takes the terse label the original's palette used;
    // the hint, which is the reference gloss, names the full term.
    label: fallacy.label,
    hint: `${fallacy.name}: ${fallacyGloss(fallacy)}`,
    // The same gloss with its structure kept: the renderer sets the
    // clauses as the numbered list they are in the source, instead of
    // the flat semicolon run-on above (which stays as the fallback).
    hintParts: {
      term: fallacy.name,
      lead: fallacy.description,
      clauses: fallacy.clauses?.map(trimClause),
    },
    // Badge label + typeable shortcut, matching the original's
    // "click a fallacy or type its abbreviation".
    abbreviation: fallacy.code,
  }));
}

// =============================================================
// Template substitution
// =============================================================

/**
 * Resolve the {a}/{b}/{d}/… tokens of a passage template. One value is
 * drawn per token for the whole question, so the same surname, car,
 * party, and pronoun gender carry through passage and answer note.
 */
function makeSubstitutions(
  rng: Rng,
  pool?: string[],
  usesPolitician = false
): Record<string, string> {
  const surname = pickFresh(rng, SURNAMES);
  const party = pickFresh(rng, PARTIES);
  // Six passages name a real figure. Their pronouns must travel with them —
  // a random gender bundle there yields "vote for him" after naming Thatcher.
  const politician = usesPolitician ? pickFresh(rng, POLITICIANS) : undefined;
  const group = pickFresh(rng, GROUPS);
  const gender = politician ?? pickFresh(rng, GENDERS);
  return {
    a: surname,
    A: surname,
    b: gender.b,
    B: gender.B,
    hc: gender.hc,
    hC: gender.hC,
    HC: gender.HC,
    d: pickFresh(rng, CARS),
    D: party.noun,
    E: party.adj,
    g: pool ? pickFresh(rng, pool) : '',
    p: politician?.name ?? '',
    P: politician?.name ?? '',
    l: politician?.label ?? '',
    f: pickFresh(rng, PLAYERS),
    // Drawn once per question so {s} and {S} name the same group.
    s: group,
    S: group[0]!.toUpperCase() + group.slice(1),
  };
}

function resolve(template: string, subs: Record<string, string>): string {
  return template.replace(
    /\{(a|A|b|B|hc|hC|HC|d|D|E|g|p|P|l|f|s|S)\}/g,
    (_, token: string) => {
      const value = subs[token];
      if (!value) throw new Error(`setR: unresolved token {${token}}`);
      return value;
    }
  );
}

// =============================================================
// Answer text
// =============================================================

/**
 * Expand "(1)"/"(2)" clause references in an answer note against the
 * primary fallacy's numbered clauses, so the reveal is self-contained.
 */
function expandClauseRefs(note: string, fallacy: Fallacy): string {
  if (!fallacy.clauses || !/\(\d\)/.test(note)) return note;
  const referenced = [...new Set(note.match(/\((\d)\)/g))]
    .map((ref) => Number(ref[1]))
    .filter((n) => n >= 1 && n <= fallacy.clauses!.length)
    .sort();
  const expansion = referenced
    .map((n) => `(${n}) ${trimClause(fallacy.clauses![n - 1]!)}`)
    .join('; ');
  return `${note} Here, ${expansion}.`;
}

/**
 * The lead sentence takes the TERSE label, not the full term — that is what
 * the original's own sentence does (`The passage illustrates the $H
 * fallacy:`), and it is the only reading under which every one of the
 * eighteen comes out grammatical: "the genetic fallacy", "the post hoc
 * fallacy", "the opposition fallacy". Using `name` here gave "the genetic
 * fallacy fallacy" and "the post hoc ergo propter hoc fallacy".
 */
function answerLead(fallacy: Fallacy): string {
  return `This passage illustrates the ${fallacy.label.toLowerCase()} fallacy.`;
}

function buildAnswer(
  section: FallacySection,
  note: string | undefined,
  subs: Record<string, string>
): string {
  const fallacy = FALLACY_BY_CODE.get(section.code)!;
  const lead = answerLead(fallacy);
  if (!note) return `${lead} ${fallacyGloss(fallacy)}`;
  return `${lead} ${resolve(expandClauseRefs(note, fallacy), subs)}`;
}

// =============================================================
// Question generation
// =============================================================

function shuffled<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function qid(code: FallacyCode, n: number): string {
  return `gen.R.${code}.${n}`;
}

function buildQuestion(
  section: FallacySection,
  rng: Rng,
  counter: number
): Question {
  const variant = pickFresh(rng, section.variants);
  const template =
    variant.mirror && rng() < 0.5 ? variant.mirror : variant.template;
  // The note is rendered with the same subs, so detect the token across both.
  const usesPolitician = /\{[pPl]\}/.test(template + (variant.note ?? ''));
  const subs = makeSubstitutions(rng, variant.pool, usesPolitician);
  return {
    id: qid(section.code, counter),
    prompt: resolve(template, subs),
    options: buildOptions(),
    correctId: variant.accepted.map((code) => FALLACY_BY_CODE.get(code)!.id),
    answer: buildAnswer(section, variant.note, subs),
  };
}

/**
 * Endless question stream. Each 18-question cycle is a fresh shuffle of
 * all 18 fallacy sections, so a 10-question quiz always drills 10
 * distinct fallacy types (the original's uniform-over-types draw).
 */
export function* fallacyQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    for (const section of shuffled(SECTIONS, rng)) {
      yield buildQuestion(section, rng, counter++);
    }
  }
}

function take<T>(it: Generator<T>, n: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    const r = it.next();
    if (r.done) break;
    out.push(r.value);
  }
  return out;
}

// =============================================================
// Public API
// =============================================================

export function generateSetR(seed?: number, perSubset = 10): Set {
  return {
    name: 'Set R',
    logicType: 'Informal',
    slugs: ['informal', 'fallacies'],
    id: 18,
    title: 'Informal Fallacies',
    header: 'What fallacy does this illustrate?',
    subSets: [
      {
        name: 'Set R',
        logicType: 'Informal',
        isNew: true,
        slugs: ['informal', 'fallacies'],
        // Also keys the fallacy reference guide in the quiz drawer — see
        // GUIDE_SUBSET_IDS in components/quiz/wffGuide.tsx.
        id: 18,
        title: 'Informal Fallacies',
        header: 'What fallacy does this illustrate?',
        // The fixed grid order IS the taxonomy the student learns —
        // never shuffle it.
        shuffleOptions: false,
        optionLayout: 'grid',
        maxWrongGuesses: 3,
        // Some passages commit more than one fallacy — let the user name
        // several (subset rule: every pick must be a genuine fallacy).
        multiSelect: true,
        description:
          'Read a short passage and name the fallacy it commits — from ad hominem to post hoc.',
        questions: take(fallacyQuestions(seed), perSubset),
      },
    ],
  };
}
