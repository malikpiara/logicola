/**
 * Set R — Informal Fallacies: live-random generator.
 *
 * Phase 2. Ports Gensler's 2008 LCEXE Set R as a passage-identification
 * drill: show a passage, ask which of the 18 informal fallacies it
 * commits. Goes with the "Fallacies and Argumentation" chapter (ch. 4)
 * of Gensler's Introduction to Logic.
 *
 * Fidelity notes (source: the original program for Set R,
 * ported by the port into ./setR.data.ts):
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
import { pickFrom, rngFromSeed, type Rng } from '@/lib/rng';
import {
  CARS,
  FALLACIES,
  GENDERS,
  PARTIES,
  SECTIONS,
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

/** Strip the list-connective tail ("…, or") and final period off a clause. */
function trimClause(clause: string): string {
  return clause.replace(/,? or$/, '').replace(/\.$/, '');
}

function buildOptions(): Option[] {
  return FALLACIES.map((fallacy) => ({
    id: fallacy.id,
    label: fallacy.name,
    hint: `${fallacy.name}: ${fallacyGloss(fallacy)}`,
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
function makeSubstitutions(rng: Rng, pool?: string[]): Record<string, string> {
  const surname = pickFrom(rng, SURNAMES);
  const gender = pickFrom(rng, GENDERS);
  const party = pickFrom(rng, PARTIES);
  return {
    a: surname,
    A: surname,
    b: gender.b,
    B: gender.B,
    hc: gender.hc,
    hC: gender.hC,
    HC: gender.HC,
    d: pickFrom(rng, CARS),
    D: party.noun,
    E: party.adj,
    g: pool ? pickFrom(rng, pool) : '',
  };
}

function resolve(template: string, subs: Record<string, string>): string {
  return template.replace(
    /\{(a|A|b|B|hc|hC|HC|d|D|E|g)\}/g,
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

function buildAnswer(
  section: FallacySection,
  note: string | undefined,
  subs: Record<string, string>
): string {
  const fallacy = FALLACY_BY_CODE.get(section.code)!;
  const lead = `This passage illustrates the ${fallacy.name.toLowerCase()} fallacy.`;
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
  const variant = pickFrom(rng, section.variants);
  const template =
    variant.mirror && rng() < 0.5 ? variant.mirror : variant.template;
  const subs = makeSubstitutions(rng, variant.pool);
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
        questions: take(fallacyQuestions(seed), perSubset),
      },
    ],
  };
}
