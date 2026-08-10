'use client';

import { generateSetA } from '@/content/sets/setA.generator';
import GeneratedQuiz, { type GeneratedQuizProps } from './generatedQuiz';

/**
 * Set A's client entry. One generator import per wrapper — the
 * bundle contract lives in ./generatedQuiz.tsx.
 */
export default function SetAQuiz(props: GeneratedQuizProps) {
  return <GeneratedQuiz generate={generateSetA} setKey='setA' {...props} />;
}
