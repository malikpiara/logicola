import type { SubSet } from '@/content/types';
import type { GeneratedSetKey } from '@/content/generators';
import { findQuizCatalogEntry, getQuizRouteKey } from '@/lib/quizCatalog';

/**
 * Result of a quiz lookup. Tagged union dispatched by the route page:
 *   - `static`: existing pipeline. The full SubSet (with questions)
 *     is server-rendered and baked into the cached HTML.
 *   - `generated`: Pre.4 pipeline. The route returns a setKey +
 *     subsetIndex; the page picks that set's client wrapper (see
 *     components/quiz/generated/), which draws questions client-side
 *     per page refresh.
 */
export type LoadedQuiz =
  | { runtime: 'static'; subSet: SubSet }
  | { runtime: 'generated'; setKey: GeneratedSetKey; subsetIndex: number };

type StaticLoader = () => Promise<SubSet>;

/**
 * Static-set loaders. Each returns the SubSet directly via dynamic
 * import. Set Q is the canonical static set (flat 60-definition list,
 * no template structure). Other sets currently live here too because
 * their generators haven't been built yet — as each set's generator
 * ships (T1.2..T1.6), its entries move from `staticLoaders` to
 * `generatedRoutes` below.
 */
const staticLoaders: Record<string, StaticLoader> = {
  // Set A's slug paths moved to `generatedRoutes` below in T1.5.
  // Set C's slug paths moved to `generatedRoutes` below in T1.6.
  // Set J's slug paths moved to `generatedRoutes` below in T1.4.
  // Set L's slug paths moved to `generatedRoutes` below in T1.3.
  // Set N's slug paths moved to `generatedRoutes` below in T1.2.
  [getQuizRouteKey(['informal', 'definitions'])]: async () =>
    (await import('@/content/sets/setQ')).setQ.subSets[0]!,
};

/**
 * Generated-set route mapping: slug-path → (setKey, subsetIndex).
 * Empty until T1.2 lands the first generator. When a generator
 * ships, its routes move here from `staticLoaders` and the route
 * automatically dispatches via its per-set client wrapper.
 *
 * Set Q routes never live here — Set Q stays on the static path
 * forever (it's a flat list, not a template engine).
 */
const generatedRoutes: Record<
  string,
  { setKey: GeneratedSetKey; subsetIndex: number }
> = {
  // T1.5 (May 9, 2026): Set A — Syllogistic Translations
  // Generator currently covers 8 of 23 templates; remaining 15 are
  // being ported incrementally. See notes/sets/setA-work.md for
  // the template-port checklist + richer-hints task.
  [getQuizRouteKey(['syllogistic', 'translations', 'basic'])]: {
    setKey: 'setA',
    subsetIndex: 0,
  },
  [getQuizRouteKey(['syllogistic', 'translations', 'hard'])]: {
    setKey: 'setA',
    subsetIndex: 1,
  },
  // T1.6 (May 10, 2026): Set C — Propositional Translations
  // Generator covers all 34 templates (`*0`..`*33`) with paired NL
  // and abstract prompt forms (50/50 random pick) plus Layer-1 +
  // Layer-2 hints from the 2008 `*e` block. See
  // notes/audits/setC.md for the per-template inventory.
  [getQuizRouteKey(['propositional', 'translations'])]: {
    setKey: 'setC',
    subsetIndex: 0,
  },
  [getQuizRouteKey(['propositional', 'translations', 'hard'])]: {
    setKey: 'setC',
    subsetIndex: 1,
  },
  // T1.4 (May 10, 2026): Set J — Modal Translations
  // Generator covers 26 of 31 procedural templates from the 2008
  // source (skipping *10 variable-modal and *12 conditional-with-
  // premise as too complex for v1; remaining 26 cover the entire
  // Gensler §10.1 + §11.2 idiom catalog including ambiguous
  // "If A, then it's necessary that B" → "Ambiguous between
  // (A ⊃ ☐B) and ☐(A ⊃ B)" form. See notes/textbook/setJ.md.
  [getQuizRouteKey(['modal', 'translations', 'basic'])]: {
    setKey: 'setJ',
    subsetIndex: 0,
  },
  [getQuizRouteKey(['modal', 'translations', 'quantified'])]: {
    setKey: 'setJ',
    subsetIndex: 1,
  },
  // T1.3 (May 10, 2026): Set L — Imperative & Deontic Translations
  // Generator covers all 11 translation templates split between
  // Imperative (`*0`, `*1`, `*3`, `*6`, `*9`) and Deontic (`*7`,
  // `*8`, `*11`, `*12`, `*13`, `*14`) subsets — Gensler §12.1 /
  // §12.3 boundary. Underline imperative-marker convention
  // preserved as `\underline{u}` in KaTeX. See
  // notes/textbook/setL.md.
  [getQuizRouteKey(['deontic', 'translations', 'imperative'])]: {
    setKey: 'setL',
    subsetIndex: 0,
  },
  [getQuizRouteKey(['deontic', 'translations', 'deontic'])]: {
    setKey: 'setL',
    subsetIndex: 1,
  },
  // T1.2 (May 10, 2026): Set N — Belief Translations
  // 3 subsets (Believing / Willing / Rationality) matching
  // Gensler §13.1 + §13.5 organization. Generator FIXES the
  // P0 prompt-truncation bug — every prompt is freshly
  // generated to match its formula, so the static's
  // 6-questions-with-identical-prompt situation in Rationality
  // can't recur. See notes/textbook/setN.md.
  [getQuizRouteKey(['belief', 'translations', 'basic'])]: {
    setKey: 'setN',
    subsetIndex: 0,
  },
  [getQuizRouteKey(['belief', 'translations', 'willing'])]: {
    setKey: 'setN',
    subsetIndex: 1,
  },
  [getQuizRouteKey(['belief', 'translations', 'rationality'])]: {
    setKey: 'setN',
    subsetIndex: 2,
  },
  // Phase 2 (Jul 15, 2026): Set R — Informal Fallacies
  // Passage-identification drill against the full 18-fallacy
  // taxonomy (compact grid UI). One passage variant per fallacy
  // type per session, matching the 2008 engine's uniform-over-types
  // draw. All 18 fallacies drilled, including op/pc from DSL
  // section *14 (dropped by the legacy parsed JSON). See
  // notes/audits/setR.md + tools/port_set_r.py in logicola-ghidra.
  [getQuizRouteKey(['informal', 'fallacies'])]: {
    setKey: 'setR',
    subsetIndex: 0,
  },
};

export async function loadPublishedQuizSubSet(
  slugs: string[]
): Promise<LoadedQuiz | null> {
  const publishedQuiz = findQuizCatalogEntry(slugs);
  if (!publishedQuiz) {
    return null;
  }

  const routeKey = getQuizRouteKey(publishedQuiz.slugs);

  // Generated sets win: if the slug path has been wired to a
  // generator, route through its client wrapper. This branch is empty until
  // T1.2 ships.
  const generated = generatedRoutes[routeKey];
  if (generated) {
    return { runtime: 'generated', ...generated };
  }

  // Otherwise fall back to the static loader.
  const loadStatic = staticLoaders[routeKey];
  if (loadStatic) {
    const subSet = await loadStatic();
    return { runtime: 'static', subSet };
  }

  return null;
}
