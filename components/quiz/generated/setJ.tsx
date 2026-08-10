'use client';

import { generateSetJ } from '@/content/sets/setJ.generator';
import GeneratedQuiz, { type GeneratedQuizProps } from './generatedQuiz';

/**
 * Set J's client entry. One generator import per wrapper — the
 * bundle contract lives in ./generatedQuiz.tsx.
 */
export default function SetJQuiz(props: GeneratedQuizProps) {
  return <GeneratedQuiz generate={generateSetJ} setKey='setJ' {...props} />;
}
