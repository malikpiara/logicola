'use client';

import { generateSetN } from '@/content/sets/setN.generator';
import GeneratedQuiz, { type GeneratedQuizProps } from './generatedQuiz';

/**
 * Set N's client entry. One generator import per wrapper — the
 * bundle contract lives in ./generatedQuiz.tsx.
 */
export default function SetNQuiz(props: GeneratedQuizProps) {
  return <GeneratedQuiz generate={generateSetN} setKey='setN' {...props} />;
}
