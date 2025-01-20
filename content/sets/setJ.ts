import {
  HINT_AMBIGUOUS,
  HINT_DOESNT_ENTAIL,
  HINT_ONLY_SECOND_PART_IMPOSSIBLE,
  HINT_ONLY_SECOND_PART_NECESSARY,
  HINT_TRANSLATE_NECESSARY_NOT,
} from '../constants';
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
        {
          id: '4.28',
          prompt: "If D is true, then C couldn't be true",
          options: [
            { id: 0, label: 'Ambiguous between 2 & 3' },
            { id: 1, label: '$ (D \\supset \\square \\sim C) $' },
            { id: 2, label: '$ \\square (D \\supset \\sim C) $' },
            { id: 3, label: '$ \\square D \\supset \\sim C $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.29',
          prompt: 'C entails M',
          options: [
            { id: 0, label: '$ (C \\supset \\square M) $' },
            { id: 1, label: '$ \\square (C \\supset M) $' },
            { id: 2, label: 'Ambiguous between 1 & 2' },
            { id: 3, label: '$ \\square C \\supset M $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.30',
          prompt: 'If F is necessary then P is necessary',
          options: [
            { id: 0, label: '$ (\\square F \\supset \\square P) $' },
            { id: 1, label: '$ \\square (F \\supset \\square P) $' },
            { id: 2, label: '$ \\square F \\supset \\square P $' },
            { id: 3, label: '$ \\square (F \\supset P) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.31',
          prompt: "It must be that you aren't cowardly",
          options: [
            { id: 0, label: '$ \\sim \\square (C) $' },
            { id: 1, label: '$ \\square \\sim C $' },
            { id: 2, label: '$ (\\square \\sim C) $' },
            { id: 3, label: '$ \\sim \\square C $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.32',
          prompt:
            "It's necessary that if P is true then P (by itself) is necessary",
          options: [
            { id: 0, label: '$ \\square (P \\supset P) $' },
            { id: 1, label: '$ \\square (P \\supset \\square (P)) $' },
            { id: 2, label: '$ \\square (P \\supset \\square P) $' },
            { id: 3, label: '$ (\\square (P \\supset \\square P)) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.33',
          prompt: "Necessarily, if you're a customer then you're strong",
          options: [
            { id: 0, label: '$ \\square (C \\supset S) $' },
            { id: 1, label: '$ \\square C \\supset S $' },
            { id: 2, label: 'Ambiguous between 1 & 4' },
            { id: 3, label: '$ (C \\supset \\square S) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.34',
          prompt: 'Either P is necessary or C is necessary',
          options: [
            { id: 0, label: '$ \\square (P \\vee \\square C) $' },
            { id: 1, label: '$ (\\square P \\vee \\square C) $' },
            { id: 2, label: '$ \\square P \\vee \\square C $' },
            { id: 3, label: '$ \\square (P \\vee C) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.35',
          prompt: "It must be that you aren't filthy",
          options: [
            { id: 0, label: '$ \\square \\sim F $' },
            { id: 1, label: '$ \\sim \\square F $' },
            { id: 2, label: '$ (\\square \\sim F) $' },
            { id: 3, label: '$ \\sim \\square (F) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.36',
          prompt:
            "It's necessary that if M is true then M (by itself) is necessary",
          options: [
            { id: 0, label: '$ \\square (M \\supset \\square (M)) $' },
            { id: 1, label: '$ (\\square (M \\supset \\square M)) $' },
            {
              id: 2,
              label: '$ \\square (M \\supset M) $',
              hint: '$ You need another "\\square" $',
            },
            { id: 3, label: '$ \\square (M \\supset \\square M) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.37',
          prompt: 'If P, then S (by itself) is impossible',
          options: [
            { id: 0, label: '$ (P \\supset \\square \\sim S) $' },
            {
              id: 1,
              label: 'Ambiguous between 1 & 4',
              hint: `${HINT_ONLY_SECOND_PART_IMPOSSIBLE}\n\n${HINT_AMBIGUOUS}`,
            },
            { id: 2, label: '$ \\square P \\supset \\sim S $' },
            {
              id: 3,
              label: '$ \\square (P \\supset \\sim S) $',
              hint: HINT_ONLY_SECOND_PART_IMPOSSIBLE,
            },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.38',
          prompt: 'P is true',
          options: [
            { id: 0, label: '$ \\square P $' },
            { id: 1, label: '$ \\square (P) $' },
            { id: 2, label: '$ P $' },
            { id: 3, label: '$ (\\square (P)) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.39',
          prompt: "It's necessary that M is false",
          options: [
            {
              id: 0,
              label: '$ \\sim \\square M $',
              hint: HINT_TRANSLATE_NECESSARY_NOT,
            },
            { id: 1, label: '$ \\square \\sim M $' },
            { id: 2, label: '$ (\\square \\sim M) $' },
            { id: 3, label: '$ \\sim \\square (M) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.40',
          prompt:
            "It's necessary that if C is true then C (by itself) is necessary",
          options: [
            { id: 0, label: '$ \\square (C \\supset \\square C) $' },
            { id: 1, label: '$ \\square (C \\supset C) $' },
            { id: 2, label: '$ (\\square (C \\supset \\square C)) $' },
            { id: 3, label: '$ \\square (C \\supset \\square (C)) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.41',
          prompt: 'If S, then M (by itself) is necessary',
          options: [
            {
              id: 0,
              label: 'Ambiguous between 2 & 4',
              hint: `${HINT_ONLY_SECOND_PART_NECESSARY}\n\n${HINT_AMBIGUOUS}`,
            },
            { id: 1, label: '$ (S \\supset \\square M) $' },
            { id: 2, label: '$ \\square S \\supset M $' },
            { id: 3, label: '$ \\square (S \\supset M) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.42',
          prompt: "'You're a teacher' doesn't entail 'You're poor'",
          options: [
            { id: 0, label: '$ \\square (T \\supset \\sim P) $' },
            { id: 1, label: '$ (T \\supset \\square \\sim P) $' },
            {
              id: 2,
              label: 'Ambiguous between 1 & 2',
              hint: HINT_AMBIGUOUS,
            },
            { id: 3, label: '$ \\sim \\square (T \\supset P) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.43',
          prompt: "It's necessary that H is false",
          options: [
            { id: 0, label: '$ (\\square \\sim H) $' },
            { id: 1, label: '$ \\square \\sim H $' },
            { id: 2, label: '$ \\sim \\square (H) $' },
            { id: 3, label: '$ \\sim \\square H $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.44',
          prompt: 'N is self-contradictory',
          options: [
            { id: 0, label: '$ \\sim \\lozenge (N) $' },
            { id: 1, label: '$ \\sim (\\lozenge N) $' },
            {
              id: 2,
              label: '$ \\lozenge \\sim N $',
              hint: '$ Your translation means "It\'s possible that N is false." \n Translate "self-contradictory" as "\\sim \\lozenge" ("not possible"). $',
            },
            { id: 3, label: '$ \\sim \\lozenge N $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.45',
          prompt: 'If C, then S (by itself) is necessary',
          options: [
            { id: 0, label: '$ (C \\supset \\square S) $' },
            { id: 1, label: '$ \\square C \\supset S $' },
            { id: 2, label: '$ \\square (C \\supset S) $' },
            {
              id: 3,
              label: 'Ambiguous between 1 & 3',
              hint: `${HINT_ONLY_SECOND_PART_NECESSARY}\n\n${HINT_AMBIGUOUS}`,
            },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.46',
          prompt: "C doesn't entail not-T",
          options: [
            {
              id: 0,
              label: '$ \\square (C \\supset T) $',
              hint: HINT_DOESNT_ENTAIL,
            },
            {
              id: 1,
              label: 'Ambiguous between 1 & 3',
              hint: HINT_AMBIGUOUS,
            },
            {
              id: 2,
              label: '$ (C \\supset T) $',
              hint: HINT_DOESNT_ENTAIL,
            },
            { id: 3, label: '$ \\sim \\square (C \\supset \\sim T) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.47',
          prompt: "It must be that you aren't dangerous",
          options: [
            {
              id: 0,
              label: '$ \\sim \\square D $',
              hint: HINT_TRANSLATE_NECESSARY_NOT,
            },
            { id: 1, label: '$ \\sim \\square (D) $' },
            { id: 2, label: '$ (\\square \\sim D) $' },
            { id: 3, label: '$ \\square \\sim D $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.48',
          prompt: 'T is self-contradictory',
          options: [
            {
              id: 0,
              label: '$ \\lozenge \\sim T $',
              hint: '$ Your translation means "It\'s possible that T is false." \n Translate "self-contradictory" as "\\sim \\lozenge" ("not possible"). $',
            },
            { id: 1, label: '$ \\sim \\lozenge (T) $' },
            { id: 2, label: '$ \\sim \\lozenge T $' },
            { id: 3, label: '$ \\sim (\\lozenge T) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.49',
          prompt: "If C, then M (by itself) can't be true",
          options: [
            { id: 0, label: '$ \\square \\supset \\sim M $' },
            { id: 1, label: '$ \\square (C \\supset \\sim M) $' },
            { id: 2, label: '$ (C \\supset \\square \\sim M) $' },
            {
              id: 3,
              label: 'Ambiguous between 2 & 3',
              hint: `${HINT_ONLY_SECOND_PART_IMPOSSIBLE}\n\n${HINT_AMBIGUOUS}`,
            },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.50',
          prompt: "'You're a fugitive' doesn't entail 'You're bright'",
          options: [
            { id: 0, label: '$ \\sim \\square (F \\supset B) $' },
            {
              id: 1,
              label: '$ (F \\supset \\square \\sim B) $',
              hint: HINT_DOESNT_ENTAIL,
            },
            {
              id: 2,
              label: '$ \\square (F \\supset \\sim B) $',
              hint: HINT_DOESNT_ENTAIL,
            },
            {
              id: 3,
              label: 'Ambiguous between 2 & 3',
              hint: HINT_AMBIGUOUS,
            },
          ],
          correctId: [0],
          answer: '',
        },
      ],
    },
    {
      name: 'Set Jq',
      logicType: 'Modal',
      isNew: true,
      slugs: ['modal', 'translations', 'quantified'],
      id: 4,
      title: 'Modal Translations: Quantified',
      header: 'Translates into logic as:',
      questions: [
        {
          id: '4.1',
          prompt: "It's necessary that all guitarists are frightened",
          options: [
            {
              id: 0,
              label: 'Ambiguous between 2 & 4',
              hint: 'The sentence isn\'t ambiguous. \n You need to say that the whole statement "All guitarists are frightened" is necessary.',
            },
            { id: 1, label: '$ \\square (x)(Gx \\supset Fx) $' },
            { id: 2, label: '$ \\square (x)(Gx \\supset \\square Fx) $' },
            { id: 3, label: '$ (x)(Gx \\supset \\square Fx) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.2',
          prompt: 'Someone has the property of being necessarily C',
          options: [
            { id: 0, label: '$ (\\exists x)(\\square Cx) $' },
            {
              id: 1,
              label: '$ \\square (\\exists x)Cx $',
              hint: 'Your translation means "It\'s necessary that someone is C.',
            },
            { id: 2, label: '$ (\\exists x)\\square Cx $' },
            { id: 3, label: '$ \\square ((\\exists x) Cx) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.3',
          prompt: "It's necessary that someone is B",
          options: [
            { id: 0, label: '$ \\square ((\\exists x)Bx) $' },
            { id: 1, label: '$ (\\exists x)(\\square Bx) $' },
            { id: 2, label: '$ \\square (\\exists x)Bx $' },
            { id: 3, label: '$ (\\exists x)\\square Bx $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.4',
          prompt: 'Every dentist is necessarily corteous',
          options: [
            {
              id: 0,
              label: '$ (x)(Dx \\supset \\square Cx) $',
              hint: 'The sentence could mean either of these two: \n "It\'s necessary that all dentists are courteous" or "Each dentist has the property of being-necessarily-courteous."',
            },
            { id: 1, label: 'Ambiguous between 1 & 4' },
            { id: 2, label: '$ \\square (x)(Dx \\supset \\square Cx) $' },
            { id: 3, label: '$ \\square (x)(Dx \\supset Cx) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.5',
          prompt: "It's necessary that all prisioners are creative",
          options: [
            {
              id: 0,
              label: '$ \\square (x)(Px \\supset \\square Cx) $',
              hint: 'Your translation has too many boxes',
            },
            {
              id: 1,
              label: '$ (x)(Px \\supset \\square Cx) $',
              hint: 'You need to say that the whole statement "All prisioners are creative" is necessary',
            },
            { id: 2, label: '$ \\square (x)(Px \\supset Cx) $' },
            {
              id: 3,
              label: 'Ambiguous between 2 & 3',
              hint: 'The sentence isn\'t ambiguous. \n You need to say that the whole statement "All prisioners are creative" is necessary.',
            },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.6',
          prompt: "It's necessary that all prisioners are creative",
          options: [
            { id: 0, label: '$ \\square (x)(Px \\supset \\square Cx) $' },
            { id: 1, label: '$ (x)(Px \\supset \\square Cx) $' },
            { id: 2, label: '$ \\square (x)(Px \\supset Cx) $' },
            { id: 3, label: 'Ambiguous between 2 & 3' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '4.7',
          prompt: 'Someone has the property of being necessarily strong',
          options: [
            { id: 0, label: '$ (\\exists x)\\square Sx $' },
            { id: 1, label: '$ \\square (\\exists x)Sx $' },
            { id: 2, label: '$ \\square ((\\exists x)Sx) $' },
            { id: 3, label: '$ (\\exists x)(\\square Sx) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '4.8',
          prompt: "It's necessary that everyone is clean",
          options: [
            {
              id: 0,
              label: '$ (x)\\square Cx $',
              hint: 'Translate "necessary every" as "$ \\square(x) $."',
            },
            { id: 1, label: '$ (x)(\\square Cx) $' },
            { id: 2, label: '$ \\square ((x)Cx) $' },
            { id: 3, label: '$ \\square (x)Cx $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '4.9',
          prompt: 'All politicians are necessarily courageous',
          options: [
            {
              id: 0,
              label: '$ \\square (x)(Px \\supset \\square Cx) $',
              hint: 'The sentence could mean either of these two: \n "It\'s necessary that all politicians are courageous," or "Each politician has the property of being-necessarily-courageous."',
            },
            { id: 1, label: 'Ambiguous between 3 & 4' },
            { id: 2, label: '$ (x)(Px \\supset \\square Cx) $' },
            { id: 3, label: '$ \\square (x)(Px \\supset Cx) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '4.10',
          prompt: "It's necessary that every Canadian is greedy",
          options: [
            { id: 0, label: '$ \\square (x)(Cx \\supset Gx) $' },
            {
              id: 1,
              label: '$ (x)(Cx \\supset \\square Gx) $',
              hint: 'You need to say that the whole statement "Every Canadian is greedy" is necessary.',
            },
            {
              id: 2,
              label: '$ \\square (x)(Cx \\supset \\square Gx) $',
              hint: 'Your translation has too many boxes.',
            },
            {
              id: 3,
              label: 'Ambiguous between 1 & 2',
              hint: 'The sentence isn\'t ambguous. \n You need to say that the whole statement "Every Canadian is greedy" is necessary.',
            },
          ],
          correctId: [0],
          answer: '',
        },
      ],
    },
  ],
};

export { setJ };
