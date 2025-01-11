import { Set } from '../types';
import { feedback_single_person } from '../constants';

const setA: Set = {
  name: 'Set A',
  logicType: 'Syllogistic Translations',
  slugs: ['syllogistic', 'translations'],
  id: 1,
  title: 'Syllogistic Translations: Easy',
  header: 'Translates into logic as:',
  subSets: [
    {
      name: 'Set Ae',
      logicType: 'Basic Translations',
      slugs: ['syllogistic', 'translations', 'basic'],
      id: 1,
      title: 'Syllogistic Translations: Easy',
      header: 'Translates into logic as:',
      questions: [
        {
          id: '1.1',
          prompt: "You aren't the cleanest biologist.",
          options: [
            { id: 0, label: 'u is not B' },
            { id: 1, label: 'U is not b' },
            { id: 2, label: 'U is not B' },
            { id: 3, label: 'u is not b' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '1.2',
          prompt: "You aren't a short convict.",
          options: [
            { id: 0, label: 'u is not c' },
            { id: 1, label: 'U is not c' },
            { id: 2, label: 'u is not C' },
            { id: 3, label: 'U is not C' },
          ],
          correctId: [2],
          answer:
            '"A short convict" could describe many persons, and so translates into a capital letter.',
        },
        {
          id: '1.3',
          prompt: "The dancer isn't the most cheerful person.",
          options: [
            { id: 0, label: 'D is not C' },
            { id: 1, label: 'D is not c' },
            { id: 2, label: 'd is not C' },
            { id: 3, label: 'd is not c' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '1.4',
          prompt: 'All soldiers in Berlin forgive people who are remarkable.',
          options: [
            { id: 0, label: 'S is F' },
            { id: 1, label: 'all S is F' },
            { id: 2, label: 'all s is F' },
            { id: 3, label: 'all F is S' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '1.5',
          prompt: "You aren't the smartest criminal.",
          options: [
            { id: 0, label: 'u is not C' },
            { id: 1, label: 'U is not C' },
            { id: 2, label: 'U is not c' },
            { id: 3, label: 'u is not c' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '1.6',
          prompt: "You aren't a slow druggist.",
          options: [
            { id: 0, label: 'U is not d' },
            { id: 1, label: 'u is not D' },
            { id: 2, label: 'U is not D' },
            { id: 3, label: 'u is not d' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '1.7',
          prompt: "I'm the cheapest poet in Paris.",
          options: [
            { id: 0, label: 'I is P' },
            { id: 1, label: 'i is P' },
            { id: 2, label: 'I is p' },
            { id: 3, label: 'i is p' },
          ],
          correctId: [3],
          answer: `"The cheapest poet" ${feedback_single_person}`,
        },
        {
          id: '1.8',
          prompt: 'All detectives in London hate people who are frantic.',
          options: [
            { id: 0, label: 'all H is D' },
            { id: 1, label: 'all D is H' },
            { id: 2, label: 'all d is H' },
            { id: 3, label: 'D is H' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '1.9',
          prompt: "You aren't the wildest plumber.",
          options: [
            { id: 0, label: 'u is not P' },
            { id: 1, label: 'u is not p' },
            { id: 2, label: 'U is not P' },
            { id: 3, label: 'U is not p' },
          ],
          correctId: [1],
          answer: `"The wildest plumber" ${feedback_single_person}`,
        },
        {
          id: '1.10',
          prompt: "You aren't a short customer.",
          options: [
            { id: 0, label: 'U is not c' },
            { id: 1, label: 'U is not C' },
            { id: 2, label: 'u is not c' },
            { id: 3, label: 'u is not C' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '1.11',
          prompt: "I'm the boldest guitarist in New York.",
          options: [
            { id: 0, label: 'I is G' },
            { id: 1, label: 'i is g' },
            { id: 2, label: 'i is G' },
            { id: 3, label: 'I is g' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '1.12',
          prompt: 'All judges in Madrid appreciate people who are tactful.',
          options: [
            { id: 0, label: 'J is A' },
            { id: 1, label: 'all J is A' },
            { id: 2, label: 'all A is J' },
            { id: 3, label: 'all j is A' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '1.13',
          prompt: "You aren't the slowest dentist.",
          options: [
            { id: 0, label: 'U is not d' },
            { id: 1, label: 'u is not d' },
            { id: 2, label: 'u is not D' },
            { id: 3, label: 'U is not D' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '1.14',
          prompt: "Some prisoners don't blame any frivolous people.",
          options: [
            { id: 0, label: 'P is not B' },
            { id: 1, label: 'some P is B' },
            { id: 2, label: 'some P is not B' },
            { id: 3, label: 'some p is not B' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '1.15',
          prompt: "I'm the cleanest musician in Moscow.",
          options: [
            { id: 0, label: 'I is M' },
            { id: 1, label: 'i is M' },
            { id: 2, label: 'I is m' },
            { id: 3, label: 'i is m' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '1.16',
          prompt:
            'All pessimists in Detroit encourage people who are dishonest.',
          options: [
            { id: 0, label: 'P is E' },
            { id: 1, label: 'all E is P' },
            { id: 2, label: 'all P is E' },
            { id: 3, label: 'all p is E' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '1.17',
          prompt: "You aren't the meanest politician.",
          options: [
            { id: 0, label: 'U is not P' },
            { id: 1, label: 'U is not p' },
            { id: 2, label: 'u is not p' },
            { id: 3, label: 'u is not P' },
          ],
          correctId: [2],
          answer: `"The meanest politician" ${feedback_single_person}`,
        },
        {
          id: '1.18',
          prompt: "Some republicans don't hate any filthy people.",
          options: [
            { id: 0, label: 'some R is H' },
            { id: 1, label: 'some R is not H' },
            { id: 2, label: 'R is not H' },
            { id: 3, label: 'some r is not H' },
          ],
          correctId: [1],
          answer: '',
        },
        /* {
                id: '1.19',
                prompt: "I'm the smartest doctor in Chicago.",
                options: [
                  { id: 0, label: 'some R is H' },
                  { id: 1, label: 'some R is not H' },
                  { id: 2, label: 'R is not H' },
                  { id: 3, label: 'some r is not H' },
                ],
                correctId: [0],
                answer: `"The smartest doctor" ${feedback_single_person}`,
              }, */
        {
          id: '1.20',
          prompt: 'All pickpockets in Rome hurt people who are fortunate.',
          options: [
            { id: 0, label: 'all H is P' },
            { id: 1, label: 'All P is H' },
            { id: 2, label: 'P is H' },
            { id: 3, label: 'all p is H' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '1.21',
          prompt: "You aren't the strongest banker.",
          options: [
            { id: 0, label: 'U is not b' },
            { id: 1, label: 'u is not b' },
            { id: 2, label: 'U is not B' },
            { id: 3, label: 'u is not B' },
          ],
          correctId: [1],
          answer: `"The strongest banker" ${feedback_single_person}`,
        },
        {
          id: '1.22',
          prompt: "Some Germans don't blame any miserable people.",
          options: [
            { id: 0, label: 'some G is B' },
            { id: 1, label: 'some g is not B' },
            { id: 2, label: 'some G is not B' },
            { id: 3, label: 'G is not B' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '1.23',
          prompt: "I'm the cruelest bachelor in Santa Monica.",
          options: [
            { id: 0, label: 'I is b' },
            { id: 1, label: 'i is B' },
            { id: 2, label: 'i is b' },
            { id: 3, label: 'I is B' },
          ],
          correctId: [2],
          answer: `"The cruelest bachelor" ${feedback_single_person}`,
        },
        {
          id: '1.24',
          prompt: 'All carpenters in Virginia bother people who are dangerous.',
          options: [
            { id: 0, label: 'all c is B' },
            { id: 1, label: 'all B is C' },
            { id: 2, label: 'all C is B' },
            { id: 3, label: 'C is B' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '1.25',
          prompt: "You aren't the brightest convict.",
          options: [
            { id: 0, label: 'u is not C' },
            { id: 1, label: 'u is not c' },
            { id: 2, label: 'U is not C' },
            { id: 3, label: 'U is not c' },
          ],
          correctId: [2],
          answer: `"The brightest" ${feedback_single_person}`,
        },
        {
          id: '1.25',
          prompt: 'Some vicious criminals are boring.',
          options: [
            { id: 0, label: 'C is b' },
            { id: 1, label: 'some C is B' },
            { id: 2, label: 'some C is b' },
            { id: 3, label: 'C is B' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '1.26',
          prompt: "I'm the slowest diabetic in Boston.",
          options: [
            { id: 0, label: 'I is d' },
            { id: 1, label: 'I is D' },
            { id: 2, label: 'i is d' },
            { id: 3, label: 'i is D' },
          ],
          correctId: [2],
          answer: `"The slowest diabetic" ${feedback_single_person}`,
        },
        {
          id: '1.27',
          prompt:
            'All backpackers in Mexico City know people who are prosperous.',
          options: [
            { id: 0, label: 'B is K' },
            { id: 1, label: 'all b is K' },
            { id: 2, label: 'all B is K' },
            { id: 3, label: 'all K is B' },
          ],
          correctId: [2],
          answer: ``,
        },
        {
          id: '1.28',
          prompt: "You aren't the tallest cannibal.",
          options: [
            { id: 0, label: 'u is not C' },
            { id: 1, label: 'u is not c' },
            { id: 2, label: 'U is not C' },
            { id: 3, label: 'U is not c' },
          ],
          correctId: [1],
          answer: ``,
        },
        {
          id: '1.29',
          prompt: 'Some notorious fugitives are dishonest.',
          options: [
            { id: 0, label: 'F is D' },
            { id: 1, label: 'F is d' },
            { id: 2, label: 'some F is D' },
            { id: 3, label: 'some F is d' },
          ],
          correctId: [2],
          answer: ``,
        },
        {
          id: '1.30',
          prompt: "I'm the meanest bandit in Bratislava.",
          options: [
            { id: 0, label: 'i is B' },
            { id: 1, label: 'I is B' },
            { id: 2, label: 'I is b' },
            { id: 3, label: 'i is b' },
          ],
          correctId: [3],
          answer: `"The meanest bandit" ${feedback_single_person}`,
        },
      ],
    },
  ],
};
export { setA };
