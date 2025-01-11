import { Set } from '../types';

const setJ: Set = {
  name: 'Set J',
  logicType: 'Modal',
  slugs: ['informal', 'definitions'],
  isNew: true,
  id: 3,
  title: 'Modal Translations: Basic',
  header: 'What is wrong with this definition?',
  subSets: [
    {
      name: 'Subset C1',
      logicType: 'Basic Translations',
      slugs: ['syllogistic', 'translations', 'basic'],
      id: 101,
      title: 'Basic Syllogistic Translations',
      header: 'Translates into logic as:',
      questions: [],
    },
  ],
};

export { setJ };
