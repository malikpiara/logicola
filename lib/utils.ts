import { Question } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

export function shuffleOptionsWithCorrectIndices(question: Question) {
  // Create an array from the options which includes the original index.
  const indexedOptions = question.options.map((option, index) => ({
    option,
    originalIndex: index,
  }));

  shuffleArray(indexedOptions);

  // Now, map back to get the shuffled options.
  const shuffledOptions = indexedOptions.map(
    (indexedOption) => indexedOption.option
  );

  // Update the correctIndices based on where the original correct options ended up.
  const updatedCorrectIndices = question.correctIndices.map((correctIndex) =>
    indexedOptions.findIndex(
      (indexedOption) => indexedOption.originalIndex === correctIndex
    )
  );

  // Return a new question object with the updated options and correctIndices.
  return {
    ...question,
    options: shuffledOptions,
    correctIndices: updatedCorrectIndices,
  };
}
