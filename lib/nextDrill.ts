import {
  quizCatalog,
  getQuizRouteKey,
  type QuizCatalogEntry,
} from '@/lib/quizCatalog';

/**
 * "What do I do next?" — answered from the catalog, for the end screen.
 *
 * The rule is deliberately narrow: **the next drill inside the same SET**,
 * never the next row of the catalog. Adjacency in `quiz-catalog.json` is a
 * file order; a set is a claim Gensler already made. Set A's Easy is
 * followed by Set A's Hard because the textbook says those two are one
 * exercise at two difficulties — but Set A Hard is NOT followed by Set C,
 * because nothing in the source says a student who can translate
 * syllogisms is ready for propositional logic. Offering it anyway would
 * be the app inventing a curriculum out of an array index (Malik,
 * 2026-08-23).
 *
 * So the four progressions that exist today are exactly the four the
 * catalog's own `chapter` field draws:
 *
 *   Set A  Easy → Hard          Set J  Basic → Quantified
 *   Set C  Easy → Hard          Set L  Imperative → Deontic
 *   Set N  Believing → Willing → Rationality
 *
 * and Sets Q and R, being one drill each, honestly have no next. They get
 * the exit and nothing else — a dead end you can leave is not a dead end.
 *
 * Set-scoped, not topic-scoped, for the same reason. Our IA merges Q and R
 * into one "Informal Logic" topic, so a topic rule would chain Meanings and
 * Definitions → Informal Fallacies. Those are different chapters and
 * neither is a step up from the other; the chain would be a navigational
 * convenience wearing the costume of a syllabus.
 */
export function nextDrillAfter(slugs: string[]): QuizCatalogEntry | undefined {
  const key = getQuizRouteKey(slugs);
  const current = quizCatalog.find((e) => getQuizRouteKey(e.slugs) === key);
  if (!current) return undefined;
  // Filter to the set FIRST, then step — so the answer never depends on
  // where a future set gets spliced into the catalog file.
  const siblings = quizCatalog.filter((e) => e.chapter === current.chapter);
  const index = siblings.findIndex((e) => getQuizRouteKey(e.slugs) === key);
  return siblings[index + 1];
}

/**
 * What to call the step, in the successor's own words.
 *
 * Every title in the catalog is `Subject: Variant`, and the variant is the
 * only part that carries new information here — the learner just spent a
 * run on the subject. Naming it "Hard" where it is literally the hard set
 * is what Malik asked for; naming the others by their own variant
 * ("Quantified", "Rationality") keeps the promise honest, because Set J's
 * second drill is a different job rather than the same job turned up.
 *
 * Link text has to survive being read out of context (WCAG 2.4.4) — the
 * same rule `drillTitle` follows in the nav — so the variant never travels
 * alone: it is always "the hard set" or "Next: Quantified", never "Hard".
 */
export function nextDrillLabel(entry: QuizCatalogEntry): string {
  const variant = entry.title.split(': ')[1];
  if (!variant) return `Next: ${entry.title}`;
  return /^hard$/i.test(variant) ? 'Try the hard set' : `Next: ${variant}`;
}
