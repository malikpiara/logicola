export type Content = {
  chapters: {
    [key: string]: Chapter;
  };
};

export type Chapter = {
  title: string;
  index: number;
  subChapters: {
    [key: string]: SubChapter;
  };
};

export type SubChapter = {
  title: string;
  description?: string;
  index: number;
  questions: Question[];
};

export type Question = {
  prompt: string;
  options: string[];
  correctIndices: number[];
  answer?: string;
};
