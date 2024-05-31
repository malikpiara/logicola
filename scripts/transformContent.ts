import { chapters } from '@/content';
import { writeFile } from 'fs';

type OldChapter = {
  id: number | string;
  title: string;
  questions: OldQuestion[];
};

type OldQuestion = {
  id: string;
  prompt: string;
  options: { id: number; label: string }[];
  correctId: number[];
  answer: string;
};

type NewContent = {
  chapters: {
    [key: string]: NewChapter;
  };
};

type NewChapter = {
  title: string;
  index: number;
  subChapters: {
    [key: string]: NewSubChapter;
  };
};

type NewSubChapter = {
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

const transformChapters = (oldChapters: OldChapter[]): NewContent => {
  const newContent: NewContent = { chapters: {} };

  oldChapters.forEach((chapter) => {
    const chapterKey = chapter.title.toLowerCase().replace(/ /g, '-');
    const newChapter: NewChapter = {
      title: chapter.title,
      index: chapter.id as number,
      subChapters: {},
    };

    const subChapterKey = 'definitions'; // Assuming a single subChapter for simplicity
    const newSubChapter: NewSubChapter = {
      title: 'Definitions',
      index: 0,
      exercises: chapter.questions.map((question) => ({
        prompt: question.prompt,
        options: question.options.map((option) => option.label),
        correctIndices: question.correctId,
        answer: question.answer,
      })),
    };

    newChapter.subChapters[subChapterKey] = newSubChapter;
    newContent.chapters[chapterKey] = newChapter;
  });

  return newContent;
};

const newContent = transformChapters(chapters);
console.log(newContent);

const str = JSON.stringify(newContent, null, 2);

writeFile('new-content.json', str, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('File has been created');
});
