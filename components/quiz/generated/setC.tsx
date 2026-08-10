'use client';

import { generateSetC } from '@/content/sets/setC.generator';
import GeneratedQuiz, { type GeneratedQuizProps } from './generatedQuiz';

/**
 * Set C's client entry. One generator import per wrapper — the
 * bundle contract lives in ./generatedQuiz.tsx.
 */
export default function SetCQuiz(props: GeneratedQuizProps) {
  return <GeneratedQuiz generate={generateSetC} setKey='setC' {...props} />;
}
