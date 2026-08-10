'use client';

import { generateSetL } from '@/content/sets/setL.generator';
import GeneratedQuiz, { type GeneratedQuizProps } from './generatedQuiz';

/**
 * Set L's client entry. One generator import per wrapper — the
 * bundle contract lives in ./generatedQuiz.tsx.
 */
export default function SetLQuiz(props: GeneratedQuizProps) {
  return <GeneratedQuiz generate={generateSetL} setKey='setL' {...props} />;
}
