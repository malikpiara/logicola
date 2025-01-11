import { Set } from '../types';

const setB: Set = {
  name: 'Set B',
  logicType: 'Syllogistic',
  slugs: ['informal', 'definitions'],
  id: 3,
  title: 'Syllogistic Arguments: English, Idiomatic',
  header: 'What is wrong with this definition?',
  subSets: [
    {
      name: 'Subset B1',
      logicType: 'Basic Translations',
      slugs: ['syllogistic', 'translations', 'basic'],
      id: 101,
      title: 'Basic Syllogistic Translations',
      header: 'Translates into logic as:',
      isNew: true,
      questions: [],
    },
  ],
};

export { setB };
