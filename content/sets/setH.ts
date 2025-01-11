import { Set } from '../types';

const setH: Set = {
  name: 'Set H',
  slugs: ['informal', 'definitions'],
  logicType: 'Quantificational Logic',
  isNew: true,
  id: 3,
  title: 'Quantificational Translations: Easy',
  header: 'What is wrong with this definition?',
  subSets: [
    {
      name: 'Subset H1',
      logicType: 'Basic Translations',
      slugs: ['syllogistic', 'translations', 'basic'],
      id: 101,
      title: 'Basic Syllogistic Translations',
      header: 'Translates into logic as:',
      questions: [],
    },
  ],
};

export { setH };
