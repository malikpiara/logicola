import type { SubSet } from '@/content/types';
import { findQuizCatalogEntry, getQuizRouteKey } from '@/lib/quizCatalog';

type PublishedQuizLoader = () => Promise<SubSet>;

const publishedQuizLoaders: Record<string, PublishedQuizLoader> = {
  [getQuizRouteKey(['syllogistic', 'translations', 'basic'])]: async () =>
    (await import('@/content/sets/setA')).setA.subSets[0],
  [getQuizRouteKey(['syllogistic', 'translations', 'hard'])]: async () =>
    (await import('@/content/sets/setA')).setA.subSets[1],
  [getQuizRouteKey(['propositional', 'translations'])]: async () =>
    (await import('@/content/sets/setC')).setC.subSets[0],
  [getQuizRouteKey(['propositional', 'translations', 'hard'])]: async () =>
    (await import('@/content/sets/setC')).setC.subSets[1],
  [getQuizRouteKey(['modal', 'translations', 'basic'])]: async () =>
    (await import('@/content/sets/setJ')).setJ.subSets[0],
  [getQuizRouteKey(['modal', 'translations', 'quantified'])]: async () =>
    (await import('@/content/sets/setJ')).setJ.subSets[1],
  [getQuizRouteKey(['Deontic', 'translations', 'Imperative'])]: async () =>
    (await import('@/content/sets/setL')).setL.subSets[0],
  [getQuizRouteKey(['Deontic', 'translations', 'Deontic'])]: async () =>
    (await import('@/content/sets/setL')).setL.subSets[1],
  [getQuizRouteKey(['belief', 'translations', 'basic'])]: async () =>
    (await import('@/content/sets/setN')).setN.subSets[0],
  [getQuizRouteKey(['belief', 'translations', 'willing'])]: async () =>
    (await import('@/content/sets/setN')).setN.subSets[1],
  [getQuizRouteKey(['belief', 'translations', 'rationality'])]: async () =>
    (await import('@/content/sets/setN')).setN.subSets[2],
  [getQuizRouteKey(['informal', 'definitions'])]: async () =>
    (await import('@/content/sets/setQ')).setQ.subSets[0],
};

export async function loadPublishedQuizSubSet(slugs: string[]) {
  const publishedQuiz = findQuizCatalogEntry(slugs);
  if (!publishedQuiz) {
    return null;
  }

  const loadQuiz = publishedQuizLoaders[getQuizRouteKey(publishedQuiz.slugs)];

  return loadQuiz ? loadQuiz() : null;
}
