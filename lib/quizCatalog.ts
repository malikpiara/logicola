import quizCatalogData from '@/content/quiz-catalog.json';

export interface QuizCatalogEntry {
  chapter: string;
  title: string;
  /**
   * One-sentence summary of what the subset drills. Mirrors the matching
   * `SubSet.description` (which the start screen renders) and is the source
   * for the route's meta description — the catalog is what `generateMetadata`
   * can read without running a generator. `quizCatalog.test.ts` asserts the
   * two stay in sync.
   */
  description: string;
  slugs: string[];
  quizPath: string;
  isNew?: boolean;
}

export const quizCatalog: QuizCatalogEntry[] = quizCatalogData;

export const quizRouteSlugs = quizCatalog.map(({ slugs }) => [
  ...slugs,
  'quiz',
]);

export function normalizeQuizSlugs(slugs: string[]) {
  return slugs.at(-1) === 'quiz' ? slugs.slice(0, -1) : slugs;
}

export function getQuizRouteKey(slugs: string[]) {
  // Lower-cased so quiz lookup is case-insensitive: catalog slugs are all
  // lowercase, and this lets any-case request paths (e.g. an old
  // capitalized bookmark like /Deontic/translations/Imperative) resolve
  // to the same quiz instead of 404-ing. A same-path case-canonicalizing
  // redirect can't be used here — Next.js matches redirect `source`
  // case-insensitively, so it would redirect the lowercase path to itself.
  return normalizeQuizSlugs(slugs).join('/').toLowerCase();
}

const quizCatalogByKey = new Map(
  quizCatalog.map((entry) => [getQuizRouteKey(entry.slugs), entry] as const)
);

export function findQuizCatalogEntry(slugs: string[]) {
  return quizCatalogByKey.get(getQuizRouteKey(slugs));
}
