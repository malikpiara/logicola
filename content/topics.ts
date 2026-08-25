import { quizCatalog, type QuizCatalogEntry } from '@/lib/quizCatalog';

/**
 * The two-level exercises IA — topic → drill — decided in the nav lab
 * (docs/nav-lab.html, 2026-08-14): the topic is the first slug segment of
 * every quiz route (which is also Gensler's chapter structure), topics
 * follow SET-LETTER order (D3), chapter numbers stay out of the UI (D10),
 * and "Informal Logic" merges Sets Q + R (D2 — both live under
 * /informal/).
 *
 * Colours are the quiz screens' own triads, verbatim from
 * components/quiz/quizColors.ts. Informal wears Set Q's triad — one
 * topic, two sets; R stays present through the NEW gem (the lab's D13
 * rider). The derived tiers (meta/body/hair/grab) were produced by the
 * lab's ensure-contrast loop — the colour walks toward the ink until it
 * clears 4.5:1 on the surface — and are checked into constants here so
 * the app never ships an unverified pairing. Re-derive if a triad moves.
 */

export interface TopicColors {
  surface: string;
  ink: string;
  accent: string;
  /** the accent, walked toward the ink until ≥ 4.5:1 on the surface */
  meta: string;
  /** the ink softened toward the surface, floored at 4.5:1 */
  body: string;
  /** hairline: surface mixed 16% toward the ink */
  hair: string;
  /** grabber pill on a painted sheet: surface mixed 35% toward the ink */
  grab: string;
}

export interface Topic {
  id: string;
  name: string;
  /** syllabus reference — professors assign by set letter (D6) */
  sets: string;
  blurb: string;
  colors: TopicColors;
  drills: QuizCatalogEntry[];
}

const TOPIC_META: Array<Omit<Topic, 'drills'> & { colors: TopicColors }> = [
  {
    id: 'syllogistic',
    name: 'Syllogistic Logic',
    sets: 'Set A',
    blurb: 'All, no, some: the logic of categories.',
    colors: {
      surface: '#FFABC6',
      ink: '#4A1040',
      accent: '#674900',
      meta: '#674900',
      body: '#6E2F5B',
      hair: '#E292B1',
      grab: '#C07597',
    },
  },
  {
    id: 'propositional',
    name: 'Propositional Logic',
    sets: 'Set C',
    blurb: 'And, or, if-then: the logic of statements.',
    colors: {
      surface: '#E7F099',
      ink: '#02302C',
      accent: '#BD00AD',
      meta: '#BD00AD',
      body: '#305642',
      hair: '#C2D188',
      grab: '#97AD73',
    },
  },
  {
    id: 'modal',
    name: 'Modal Logic',
    sets: 'Set J',
    blurb: 'Necessity and possibility: box and diamond.',
    colors: {
      surface: '#E6ACF4',
      ink: '#1C3601',
      accent: '#674900',
      meta: '#674900',
      body: '#444E32',
      hair: '#C699CD',
      grab: '#9F839F',
    },
  },
  {
    id: 'deontic',
    name: 'Deontic Logic',
    sets: 'Set L',
    blurb: 'Ought, permissible, forbidden, and commands.',
    colors: {
      surface: '#CFF6DD',
      ink: '#3F0167',
      accent: '#BD00AD',
      meta: '#BD00AD',
      body: '#5C327F',
      hair: '#B8CFCA',
      grab: '#9DA0B4',
    },
  },
  {
    id: 'belief',
    name: 'Belief Logic',
    sets: 'Set N',
    blurb: 'Believing, willing, and what it is rational to believe.',
    colors: {
      surface: '#9EDAFF',
      ink: '#4A1040',
      accent: '#8D0381',
      meta: '#8D0381',
      body: '#5B3866',
      hair: '#91BAE0',
      grab: '#8193BC',
    },
  },
  {
    id: 'informal',
    name: 'Informal Logic',
    sets: 'Sets Q · R',
    blurb: 'Definitions, meaning, and the classic fallacies.',
    colors: {
      surface: '#D9CCF9',
      ink: '#3E1060',
      accent: '#745400',
      meta: '#745400',
      body: '#5D367F',
      hair: '#C0AEE1',
      grab: '#A38AC3',
    },
  },
];

export const topics: Topic[] = TOPIC_META.map((meta) => ({
  ...meta,
  drills: quizCatalog.filter((entry) => entry.slugs[0] === meta.id),
}));

export const topicIsNew = (topic: Topic) =>
  topic.drills.some((drill) => drill.isNew);

/**
 * A topic spanning several sets (today just Informal, Q + R) tags each
 * drill; single-set topics let the panel header carry the set (D6).
 */
export const topicIsMultiSet = (topic: Topic) =>
  topic.drills.some((d) => d.chapter !== topic.drills[0]!.chapter);

/**
 * Drill display name inside a topic panel: the topic adjective comes off
 * ("Syllogistic Translations: Easy" → "Translations: Easy") because the
 * rail already says it; single-title sets (Meanings and Definitions,
 * Informal Fallacies) keep their full names. Link text stays meaningful
 * out of context (WCAG 2.4.4, the lab's D4).
 */
export function drillTitle(entry: QuizCatalogEntry) {
  return entry.title.replace(
    /^(Syllogistic|Propositional|Modal|Deontic|Belief) /,
    ''
  );
}
