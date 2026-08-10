'use client';

import { generateSetR } from '@/content/sets/setR.generator';
import GeneratedQuiz, { type GeneratedQuizProps } from './generatedQuiz';

/**
 * Set R's client entry. One generator import per wrapper — the
 * bundle contract lives in ./generatedQuiz.tsx.
 */
export default function SetRQuiz(props: GeneratedQuizProps) {
  return <GeneratedQuiz generate={generateSetR} setKey='setR' {...props} />;
}
