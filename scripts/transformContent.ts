import * as sets from '@/content/sets';
import { Set, SubSet } from '@/content/types';
import { writeFile } from 'fs/promises';

type NewContent = {
  subsets: {
    [key: string]: NewSubSet;
  };
};

type NewSubSet = {
  title: string;
  index: number;
  exercises: NewExercise[];
};

type NewExercise = {
  prompt: string;
  options: string[];
  correctIndices: number[];
  answer: string;
};

// Utility to extract all subsets from sets
const extractSubSets = (allSets: Set[]): SubSet[] => {
  return allSets.flatMap((set) => set.subSets);
};

const transformSubSets = (oldSubSets: SubSet[]): NewContent => {
  const newContent: NewContent = { subsets: {} };

  oldSubSets.forEach((subSet) => {
    if (!subSet || !subSet.questions || subSet.questions.length === 0) {
      console.warn(
        `Skipping empty or invalid subset: ${subSet?.title || 'Unknown'}`
      );
      return;
    }

    const subSetKey = subSet.title.toLowerCase().replace(/ /g, '-');
    const newSubSet: NewSubSet = {
      title: subSet.title,
      index: subSet.id,
      exercises: subSet.questions.map((question) => ({
        prompt: question.prompt,
        options: question.options.map((option) => option.label),
        correctIndices: question.correctId,
        answer: question.answer,
      })),
    };

    newContent.subsets[subSetKey] = newSubSet;
  });

  return newContent;
};

(async () => {
  try {
    const allSets: Set[] = Object.values(sets);

    if (allSets.length === 0) {
      console.error('No valid sets found to transform.');
      return;
    }

    // Extract all subsets from sets
    const allSubSets: SubSet[] = extractSubSets(allSets);

    if (allSubSets.length === 0) {
      console.error('No valid subsets found to transform.');
      return;
    }

    const newContent = transformSubSets(allSubSets);
    console.log('Transformed Content:', newContent);

    const fileName = `new-content-${Date.now()}.json`;
    const str = JSON.stringify(newContent, null, 2);

    await writeFile(fileName, str);
    console.log(`File has been created: ${fileName}`);
  } catch (error) {
    console.error('Error transforming subsets or writing file:', error);
  }
})();
