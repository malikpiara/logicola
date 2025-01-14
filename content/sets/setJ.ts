import { Set } from '../types';

const setJ: Set = {
  name: 'Set J',
  logicType: 'Modal',
  slugs: ['modal', 'translations', 'basic'],
  id: 4,
  title: 'Modal Translations: Basic',
  header: 'What is wrong with this definition?',
  subSets: [
    {
      name: 'Set Jb',
      logicType: 'Modal',
      isNew: true,
      slugs: ['modal', 'translations', 'basic'],
      id: 4,
      title: 'Modal Translations: Basic',
      header: 'Translates into logic as:',
      questions: [
        {
          id: '4.1',
          prompt: "It isn't possible that you're careful",
          options: [
            { id: 0, label: '$ \\sim \\lozenge (C) $' },
            { id: 1, label: '$ \\sim (\\lozenge C) $' },
            { id: 2, label: '$ \\sim \\lozenge C $' },
            { id: 3, label: '$ \\lozenge \\sim C $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.2',
          prompt: 'If B is necessary then C is necessary',
          options: [
            { id: 0, label: '$ \\square (B \\supset \\square C) $' },
            { id: 1, label: '$ (\\square B \\supset \\square C) $' },
            { id: 2, label: '$ \\square B \\supset \\square C $' },
            { id: 3, label: '$ \\square (B \\supset C) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.3',
          prompt: 'F-and-D entails C',
          options: [
            { id: 0, label: '$ ((F \\cdot D) \\supset \\square C) $' },
            { id: 1, label: '$ \\square ((F \\cdot D) \\supset C) $' },
            {
              id: 2,
              label:
                '$ (\\square(F \\supset C) \\cdot \\square(D \\supset C)) $',
            },
            { id: 3, label: 'Ambiguous between 1 & 2' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.4',
          prompt: "It's necessary that S is possible",
          options: [
            { id: 0, label: '$ \\square S $' },
            { id: 1, label: '$ (\\square \\lozenge S) $' },
            { id: 2, label: '$ \\square \\lozenge S $' },
            { id: 3, label: '$ \\square(\\lozenge S) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.5',
          prompt: "Madonna couldn't be powerful",
          options: [
            { id: 0, label: '$ \\lozenge \\sim P $' },
            { id: 1, label: '$ \\sim \\lozenge P $' },
            { id: 2, label: '$ \\sim (\\lozenge P) $' },
            { id: 3, label: '$ \\sim \\lozenge (P) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.6',
          prompt: 'D is true',
          options: [
            { id: 0, label: '$ \\square D $' },
            { id: 1, label: '$ D $' },
            { id: 2, label: '$ \\square (D) $' },
            { id: 3, label: '$ (\\square (D)) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.7',
          prompt: "'You're faithful and tall' entails 'You're a backpacker'",
          options: [
            { id: 0, label: '$ ((F \\cdot T) \\supset \\square B) $' },
            { id: 1, label: '$ \\square ((F \\cdot T) \\supset B) $' },
            {
              id: 2,
              label:
                '$ (\\square (F \\supset B) \\cdot \\square (T \\supset B)) $',
            },
            { id: 3, label: 'Ambiguous between 1 & 2' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.8',
          prompt: "It isn't necessary that N is true",
          options: [
            { id: 0, label: '$ \\sim \\square (N) $' },
            { id: 1, label: '$ \\sim (\\square N) $' },
            { id: 2, label: '$ \\square \\sim N $' },
            { id: 3, label: '$ \\sim \\square N $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.9',
          prompt: "It isn't possible that F",
          options: [
            { id: 0, label: '$ \\lozenge \\sim F $' },
            { id: 1, label: '$ \\sim \\lozenge F $' },
            { id: 2, label: '$ \\sim (\\lozenge F) $' },
            { id: 3, label: '$ \\sim \\lozenge (F) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.10',
          prompt: "'You're mean' is consistent with 'You're bitter'",
          options: [
            { id: 0, label: '$ (M \\cdot B) $' },
            { id: 1, label: '$ (\\lozenge M \\cdot B) $' },
            { id: 2, label: '$ \\lozenge (M \\cdot B) $' },
            { id: 3, label: '$ (\\lozenge M \\cdot B) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.11',
          prompt: "'You're greedy and bright' entails 'You're a clown'",
          options: [
            { id: 0, label: '$ \\square ((G \\cdot B) \\supset C) $' },
            {
              id: 1,
              label:
                '$ (\\square (G \\supset C) \\cdot \\square (B \\supset C)) $',
            },
            { id: 2, label: '$ ((G \\cdot B) \\supset \\square C) $' },
            { id: 3, label: 'Ambiguous between 1 & 3' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.12',
          prompt: "P doesn't entail S",
          options: [
            { id: 0, label: 'Ambiguous between 2 & 4' },
            { id: 1, label: '$ (P \\supset \\square \\sim S) $' },
            { id: 2, label: '$ \\sim \\square (P \\supset S) $' },
            { id: 3, label: '$ \\square (P \\supset \\sim S) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.13',
          prompt: 'Peter could be forgetful',
          options: [
            { id: 0, label: '$ (\\lozenge (F)) $' },
            { id: 1, label: '$ \\lozenge F $' },
            { id: 2, label: '$ \\lozenge (F) $' },
            { id: 3, label: '$ (\\lozenge F) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.14',
          prompt: 'C is consistent with B',
          options: [
            { id: 0, label: '$ (\\lozenge C \\cdot \\lozenge B) $' },
            { id: 1, label: '$ \\lozenge (C \\cdot B) $' },
            { id: 2, label: '$ (C \\cdot B) $' },
            { id: 3, label: '$ (\\lozenge C \\cdot B) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.15',
          prompt: "'You're candid and mean' entails 'You're a pharmacist'",
          options: [
            { id: 0, label: 'Ambiguous between 3 & 4' },
            {
              id: 1,
              label:
                '$ (\\square (C \\supset P) \\cdot \\square (M \\supset P)) $',
            },
            { id: 2, label: '$ ((C \\cdot M) \\supset \\square P) $' },
            { id: 3, label: '$ \\square ((C \\cdot M) \\supset P) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.16',
          prompt: "If Jim is a politician, then Jim couldn't be bold",
          options: [
            { id: 0, label: '$ (P \\supset \\square \\sim B) $' },
            { id: 1, label: '$ \\square (P \\supset \\sim B) $' },
            { id: 2, label: '$ \\square P \\supset \\sim B $' },
            { id: 3, label: 'Ambiguous between 1 & 2' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.17',
          prompt: 'F is self-contradictory',
          options: [
            { id: 0, label: '$ \\sim \\lozenge F $' },
            { id: 1, label: '$ \\lozenge \\sim F $' },
            { id: 2, label: '$ \\sim \\lozenge (F) $' },
            { id: 3, label: '$ \\sim (\\lozenge F) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.18',
          prompt: "'You're smart' is consistent with 'You're gloomy'",
          options: [
            { id: 0, label: '$ (S \\cdot G) $' },
            { id: 1, label: '$ \\lozenge (S \\cdot G) $' },
            { id: 2, label: '$ (\\lozenge S \\cdot \\lozenge G) $' },
            { id: 3, label: '$ (\\lozenge S \\cdot G) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.19',
          prompt: "'You're comical and tough' entails 'You're a banker'",
          options: [
            { id: 0, label: 'Ambiguous between 3 & 4' },
            {
              id: 1,
              label:
                '$ (\\square (C \\supset B) \\cdot \\square (T \\supset B)) $',
            },
            { id: 2, label: '$ ((C \\cdot T) \\supset \\square B) $' },
            { id: 3, label: '$ \\square ((C \\cdot T) \\supset B) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.20',
          prompt:
            "If you're a German, then it's impossible for you to be strong",
          options: [
            { id: 0, label: '$ \\square (G \\supset \\sim S) $' },
            { id: 1, label: 'Ambiguous between 1 & 4' },
            { id: 2, label: '$ \\square G \\supset \\sim S $' },
            { id: 3, label: '$ (G \\supset \\square \\sim S) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.21',
          prompt: "Necessarily, if you're a biologist then you're cruel",
          options: [
            { id: 0, label: '$ \\square (B \\supset C) $' },
            { id: 1, label: 'Ambiguous between 1 & 4' },
            { id: 2, label: '$ \\square B \\supset C $' },
            { id: 3, label: '$ (B \\supset \\square C) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.22',
          prompt: 'M is consistent with D',
          options: [
            { id: 0, label: '$ (M \\cdot D) $' },
            { id: 1, label: '$ (\\lozenge M \\cdot D) $' },
            { id: 2, label: '$ (\\lozenge M \\cdot \\lozenge D) $' },
            { id: 3, label: '$ \\lozenge (M \\cdot D) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.23',
          prompt: "If you're a convict, then it's necessary that you're bold",
          options: [
            { id: 0, label: '$ \\square (C \\supset B) $' },
            { id: 1, label: 'Ambiguous between 1 & 3' },
            { id: 2, label: '$ (C \\supset \\square B) $' },
            { id: 3, label: '$ \\square C \\supset B $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.24',
          prompt: "If D is true, then S couldn't be true",
          options: [
            { id: 0, label: '$ \\square (D \\supset \\sim S) $' },
            { id: 1, label: '$ \\square D \\supset \\sim S $' },
            { id: 2, label: 'Ambiguous between 1 & 4' },
            { id: 3, label: '$ (D \\supset \\square \\sim S) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.25',
          prompt: "Necessarily, if you're a dentist then you're tough",
          options: [
            { id: 0, label: '$ (D \\supset \\square T) $' },
            { id: 1, label: '$ \\square D \\supset T $' },
            { id: 2, label: 'Ambiguous between 1 & 4' },
            { id: 3, label: '$ \\square (D \\supset T) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.26',
          prompt: 'If C is necessary then S is necessary',
          options: [
            { id: 0, label: '$ \\square (C \\supset S) $' },
            { id: 1, label: '$ \\square (C \\supset \\square S) $' },
            { id: 2, label: '$ \\square C \\supset \\square S $' },
            { id: 3, label: '$ (\\square C \\supset \\square S) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.27',
          prompt: 'If Einstein is a foreigner, then Einstein must be clean',
          options: [
            { id: 0, label: 'Ambiguous between 2 & 4' },
            { id: 1, label: '$ (F \\supset \\square C) $' },
            { id: 2, label: '$ \\square F \\supset C $' },
            { id: 3, label: '$ \\square (F \\supset C) $' },
          ],
          correctId: [0],
          answer: '',
        },
      ],
    },
  ],
};

export { setJ };
