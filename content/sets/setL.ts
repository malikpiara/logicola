import { Set } from '../types';

const setL: Set = {
  name: 'Set L',
  slugs: ['informal', 'definitions'],
  logicType: 'Deontic',
  id: 9,
  title: 'Deontic Translations: Imperative',
  header: 'What is wrong with this definition?',
  subSets: [
    {
      name: 'Subset C1',
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

export { setL };
