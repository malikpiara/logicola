'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { GeneratedSetKey } from '@/content/generators';
import type { GeneratedQuizProps } from './generatedQuiz';

/**
 * setKey → per-set chunk, behind a CLIENT-side `next/dynamic` boundary.
 *
 * Both halves of that sentence are load-bearing, and each was proven by
 * a failed build measurement (2026-08-10):
 *
 *   - Static imports of the six wrappers — from anywhere — fuse their
 *     graphs into the shared quiz route's chunk set, because all
 *     thirteen quiz slugs are ONE `[...slugs]` route and a route pays
 *     for every client module statically reachable from it, rendered
 *     or not. That was the original 204 KB all-generators chunk.
 *   - `dynamic()` in a SERVER module doesn't split either: the client
 *     references still land in the route's chunk group (measured: the
 *     same generators, re-merged at 108 KB).
 *
 * Only `import()` inside a client module is a real async boundary.
 * Each wrapper below becomes its own chunk; the page that SSR-renders
 * one preloads just that one.
 */
const GENERATED_QUIZ_COMPONENTS: Record<
  GeneratedSetKey,
  ComponentType<GeneratedQuizProps>
> = {
  setA: dynamic(() => import('./setA')),
  setC: dynamic(() => import('./setC')),
  setJ: dynamic(() => import('./setJ')),
  setL: dynamic(() => import('./setL')),
  setN: dynamic(() => import('./setN')),
  setR: dynamic(() => import('./setR')),
};

export interface GeneratedQuizDispatcherProps extends GeneratedQuizProps {
  setKey: GeneratedSetKey;
}

export default function GeneratedQuizDispatcher({
  setKey,
  ...props
}: GeneratedQuizDispatcherProps) {
  const GeneratedQuizForSet = GENERATED_QUIZ_COMPONENTS[setKey];
  return <GeneratedQuizForSet {...props} />;
}
