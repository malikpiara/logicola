import quizCatalogData from '@/content/quiz-catalog.json';

export interface QuizCatalogEntry {
  chapter: string;
  title: string;
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
  return normalizeQuizSlugs(slugs).join('/');
}

const quizCatalogByKey = new Map(
  quizCatalog.map((entry) => [getQuizRouteKey(entry.slugs), entry] as const)
);

export function findQuizCatalogEntry(slugs: string[]) {
  return quizCatalogByKey.get(getQuizRouteKey(slugs));
}
