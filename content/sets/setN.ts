import { Set } from '../types';

const setN: Set = {
  name: 'Set N',
  slugs: ['informal', 'definitions'],
  logicType: 'Belief',
  id: 3,
  title: 'Belief Translations: Believing',
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
export { setN };
