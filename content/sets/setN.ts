import { Set } from '../types';

const setN: Set = {
  name: 'Set N',
  slugs: ['belief', 'translations'],
  logicType: 'Belief',
  id: 14,
  title: 'Belief',
  header: 'What is wrong with this definition?',
  subSets: [
    {
      name: 'Set N',
      logicType: 'Belief',
      slugs: ['belief', 'translations', 'basic'],
      shuffleOptions: true,
      id: 14,
      title: 'Belief Translations: Believing',
      header: 'Translates into logic as: ',
      isNew: true,
      questions: [
        {
          id: '14.1',
          prompt: 'Believe that you are frivolous',
          options: [
            { id: 0, label: '$ \\underline{}u :Fu $' },
            { id: 1, label: '$ u:F\\underline{u} $' },
            { id: 2, label: '$ u:F\\underline{u} $' },
            { id: 3, label: '$ \\underline{u} :F\\underline{u} $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '14.2',
          prompt: 'Believe that P is false',
          options: [
            { id: 0, label: '$ u:\\sim \\underline{P} $' },
            { id: 1, label: '$ \\underline{u} :\\sim \\underline{P} $' },
            { id: 2, label: '$ \\underline{u} :\\sim P $' },
            { id: 3, label: '$ u:\\sim P $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.3',
          prompt: 'If you believe S, then believe C',
          options: [
            {
              id: 0,
              label: '$ (\\underline{}u :S\\supset \\underline{u} :C) $',
            },
            { id: 1, label: '$ (u:S\\supset u:C) $' },
            { id: 2, label: '$ (\\underline{u} :S\\supset u:C) $' },
            { id: 3, label: '$ (u:S\\supset \\underline{u}C ) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '14.4',
          prompt: 'Believe that C is true',
          options: [
            { id: 0, label: '$ u:C $' },
            { id: 1, label: '$ u:\\underline{C} $' },
            { id: 2, label: '$ \\underline{u} :C $' },
            { id: 3, label: '$ \\underline{u} :\\underline{C} $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.5',
          prompt: "Don't believe that C is false",
          options: [
            { id: 0, label: '$ \\sim u:\\sim \\underline{C} $' },
            { id: 1, label: '$ \\sim \\underline{u} :\\sim C $' },
            { id: 2, label: '$ \\sim u:\\sim C $' },
            { id: 3, label: '$ \\sim \\underline{u} :\\sim \\underline{C} $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '14.6',
          prompt: 'If you believe B, then believe F',
          options: [
            {
              id: 0,
              label: '$ (\\underline{u} :B\\supset \\underline{u}:F) $',
            },
            { id: 1, label: '$ (u:B\\supset u:F) $' },
            { id: 2, label: '$ (u:B\\supset \\underline{u}:F) $' },
            { id: 3, label: '$ (\\underline{u}:B\\supset u:F) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.7',
          prompt: 'Believe that C is true',
          options: [
            { id: 0, label: '$ u:C $' },
            { id: 1, label: '$ \\underline{u} :\\underline{C} $' },
            { id: 2, label: '$ u:C $' },
            { id: 3, label: '$ \\underline{u} :C $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '14.8',
          prompt: "Don't believe that F is false",
          options: [
            { id: 0, label: '$ \\sim \\underline{u} :\\sim \\underline{F} $' },
            { id: 1, label: '$ \\sim u:\\sim \\underline{F} $' },
            { id: 2, label: '$ \\sim \\underline{u}:\\sim F $' },
            { id: 3, label: '$ \\sim u:\\sim F $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.9',
          prompt: 'If you believe F, then you believe C',
          options: [
            { id: 0, label: '$ (u:F\\supset u:C) $' },
            { id: 1, label: '$ (\\underline{u}:F\\supset \\underline{u}:C) $' },
            { id: 2, label: '$ (u:F\\supset \\underline{u}:C) $' },
            { id: 3, label: '$ (\\underline{u}:F\\supset u:C) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '14.10',
          prompt: "Don't believe that you are confident",
          options: [
            { id: 0, label: '$ \\sim u:Cu $' },
            { id: 1, label: '$ \\sim u:C\\underline{u} $' },
            { id: 2, label: '$ \\sim \\underline{u}:C\\underline{u} $' },
            { id: 3, label: '$ \\sim \\underline{u}:Cu $' },
          ],
          correctId: [3],
          answer: '',
        },
      ],
    },
    {
      name: 'Set N',
      logicType: 'Belief',
      slugs: ['belief', 'translations', 'willing'],
      shuffleOptions: true,
      id: 14,
      title: 'Belief Translations: Willing',
      header: 'Translates into logic as: ',
      isNew: true,
      questions: [
        {
          id: '14.1',
          prompt: 'You want Carol to harm you',
          options: [
            { id: 0, label: '$ \\underline{u}:Hcu $' },
            { id: 1, label: '$ u:Hcu $' },
            { id: 2, label: '$ u:H\\underline{c} u $' },
            { id: 3, label: '$ \\underline{u}:H\\underline{c} u $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.2',
          prompt: 'You want everyone to despair',
          options: [
            { id: 0, label: '$ u:(x)D\\underline{x} $' },
            { id: 1, label: '$ \\underline{u}:(x)D\\underline{u} $' },
            { id: 2, label: '$ u:(x)Dx $' },
            { id: 3, label: '$ (x)x:D\\underline{u} $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '14.3',
          prompt:
            "Don't combine believe that Harry ought not to fail with wanting Harry to fail",
          options: [
            {
              id: 0,
              label:
                '$ (u:O\\sim F\\underline{h}\\supset \\sim u:F\\underline{h} ) $',
            },
            {
              id: 1,
              label:
                '$ \\sim (\\underline{u} :O\\sim F\\underline{h}\\cdot u:F\\underline{h}) $',
            },
            {
              id: 2,
              label:
                '$ (u:O\\sim F\\underline{h} \\supset \\sim \\underline{u} :F\\underline{h}) $',
            },
            {
              id: 3,
              label:
                '$ \\sim (\\underline{u} :O\\sim F\\underline{h} \\cdot \\underline{u} :F\\underline{h}) $',
            },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '14.4',
          prompt: "If you believe S, Then don't believe C",
          options: [
            {
              id: 0,
              label: '$ (\\underline{u} :S\\supset \\sim \\underline{u} :C) $',
            },
            { id: 1, label: '$ (u:S\\supset \\sim u:C) $' },
            { id: 2, label: '$ (u:S\\supset \\sim \\underline{u} :C) $' },
            { id: 3, label: '$ (\\underline{u} :S\\supset \\sim u:C) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.5',
          prompt: 'You want everyone to laugh',
          options: [
            { id: 0, label: '$ \\underline{u} :(x)L\\underline{x} $' },
            { id: 1, label: '$ (x)x:L\\underline{u} $' },
            { id: 2, label: '$ u:(x)Lx $' },
            { id: 3, label: '$ u:(x)L\\underline{x} $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '14.6',
          prompt:
            "Don't combine believingthat you ought not to bluff with acting(with the intention) to bluff",
          options: [
            {
              id: 0,
              label:
                '$ (u:O\\sim B\\underline{u}\\supset \\sim \\underline{u}:B\\underline{u} ) $',
            },
            {
              id: 1,
              label:
                '$ (u:O\\sim B\\underline{u}\\supset \\sim B\\underline{u}) $',
            },
            {
              id: 2,
              label:
                '$ \\sim (\\underline{u}:O\\sim B\\underline{u}\\cdot \\underline{u}:B\\underline{u}) $',
            },
            {
              id: 3,
              label:
                '$ \\sim (\\underline{u}:O\\sim B\\underline{u}\\cdot B\\underline{u}) $',
            },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.7',
          prompt: "Don't want Keith to defraud you",
          options: [
            { id: 0, label: '$ \\sim \\underline{u} :D\\underline{k} u $' },
            { id: 1, label: '$ \\sim \\underline{u} :Dku $' },
            { id: 2, label: '$ \\sim u:Dku $' },
            { id: 3, label: '$ \\sim u:D\\underline{k} u $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '14.8',
          prompt: 'You want everyone to boast',
          options: [
            { id: 0, label: '$ u:(x)B\\underline{x} $' },
            { id: 1, label: '$ u:(x)Bx $' },
            { id: 2, label: '$ (x)x:B\\underline{u} $' },
            { id: 3, label: '$ \\underline{u} :(x)B\\underline{x} $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '14.9',
          prompt:
            "Don't combine believe that you ought not to stay with acting (with the intention) to stay",
          options: [
            {
              id: 0,
              label:
                '$ (u:O\\sim S\\underline{u} \\supset \\sim S\\underline{u}) $',
            },
            {
              id: 1,
              label:
                '$ \\sim (\\underline{u}:O\\sim S\\underline{u}\\cdot S\\underline{u}) $',
            },
            {
              id: 2,
              label:
                '$ \\sim (\\underline{u}:O\\sim S\\underline{u}\\cdot \\underline{u}:S\\underline{u}) $',
            },
            {
              id: 3,
              label:
                '$ (u:O\\sim S\\underline{u}\\supset \\sim \\underline{u}:S\\underline{u}) $',
            },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.10',
          prompt: 'If you believe that you ought to invest, then invest',
          options: [
            {
              id: 0,
              label:
                '$ (\\underline{u} :Ol\\underline{u} \\supset I\\underline{u} ) $',
            },
            {
              id: 1,
              label: '$ (u:Ol\\underline{u} \\supset I\\underline{u} ) $',
            },
            {
              id: 2,
              label:
                '$ (u:Ol\\underline{u} \\supset \\underline{u} :I\\underline{u} ) $',
            },
            {
              id: 3,
              label:
                '$ (\\underline{u} :OI\\underline{u} \\supset \\underline{u} :I\\underline{u} ) $',
            },
          ],
          correctId: [1],
          answer: '',
        },
      ],
    },
    {
      name: 'Set N',
      logicType: 'Belief',
      slugs: ['belief', 'translations', 'rationality'],
      shuffleOptions: true,
      id: 14,
      title: 'Belief Translations: Rationality',
      header: 'Translates into logic as: ',
      isNew: true,
      questions: [
        {
          id: '14.1',
          prompt: "It's evident that L and E are both true",
          options: [
            { id: 0, label: '$ (O\\underline{u}L\\cdot O\\underline{u}:E ) $' },
            { id: 1, label: '$ (Ou:L\\cdot Ou:E) $' },
            { id: 2, label: '$ Ou:(L\\cdot E) $' },
            { id: 3, label: '$ O\\underline{u}:(L\\cdot E) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '14.2',
          prompt:
            "It's evident that S is true if and only if it's evident that D is true",
          options: [
            { id: 0, label: '$ O\\underline{u} :(S\\equiv D) $' },
            {
              id: 1,
              label: '$ (O\\underline{u} :S\\equiv O\\underline{u} :D) $',
            },
            { id: 2, label: '$ Ou:(S\\equiv D) $' },
            { id: 3, label: '$ (Ou:S\\equiv Ou:D) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '14.3',
          prompt: "It ins't evident to you that you're charitable",
          options: [
            { id: 0, label: '$ \\sim Ou:Cu $' },
            { id: 1, label: '$ \\sim Ou:C\\underline{u} $' },
            { id: 2, label: '$ \\sim O\\underline{u} :Cu $' },
            { id: 3, label: '$ \\sim OCu $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.4',
          prompt: "It's evident that L and A are both true",
          options: [
            { id: 0, label: '$ Ou:(L\\cdot A) $' },
            { id: 1, label: '$ O\\underline{u} :(L\\cdot A) $' },
            { id: 2, label: '$ (Ou:L\\cdot Ou:A) $' },
            {
              id: 3,
              label: '$ (O\\underline{u} :L\\cdot O\\underline{u} :A) $',
            },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '14.5',
          prompt:
            "It's evident to you that S is true or it's evident to you that A is true",
          options: [
            { id: 0, label: '$ O\\underline{u} :(S\\vee A) $' },
            { id: 1, label: '$ (Ou:S\\vee Ou:A) $' },
            { id: 2, label: '$ Ou:(S\\vee A) $' },
            { id: 3, label: '$ (O\\underline{u} \\vee O\\underline{u} :A) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '14.6',
          prompt:
            'If you ought to believe that S is true then you ought to believe that F is true',
          options: [
            { id: 0, label: '$ O\\underline{u} :(S\\supset F) $' },
            { id: 1, label: '$ Ou:(S\\supset F) $' },
            {
              id: 2,
              label: '$ (O\\underline{u} :S\\supset O\\underline{u} :F) $',
            },
            { id: 3, label: '$ (Ou:S\\supset Ou:F) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.7',
          prompt: "It's evident to you that if B is true then H is true",
          options: [
            {
              id: 0,
              label: '$ (O\\underline{u} :B\\supset O\\underline{u}:H) $',
            },
            { id: 1, label: '$ (Ou:B\\supset Ou:H) $' },
            { id: 2, label: '$ O\\underline{u}:(B\\supset H) $' },
            { id: 3, label: '$ Ou:(B\\supset H) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.8',
          prompt:
            "It's evident that C is true if and only if it's evident that B is true",
          options: [
            {
              id: 0,
              label: '$ (O\\underline{u} :C\\equiv O\\underline{u}:B) $',
            },
            { id: 1, label: '$ O\\underline{u}:(C\\equiv B) $' },
            { id: 2, label: '$ (Ou:C\\equiv Ou:B) $' },
            { id: 3, label: '$ Ou:(C\\equiv B) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '14.9',
          prompt:
            "If it's evident that I is true then it's evident that A is true",
          options: [
            { id: 0, label: '$ (Ou:I\\supset Ou:A) $' },
            { id: 1, label: '$ O\\underline{u} :(I\\supset A) $' },
            {
              id: 2,
              label: '$ (O\\underline{u} :I\\supset O\\underline{u} :A) $',
            },
            { id: 3, label: '$ Ou:(I\\supset A) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '14.10',
          prompt:
            "It's evident to you that D is true and it's evident to you that F is true",
          options: [
            {
              id: 0,
              label: '$ (O\\underline{u}:D\\cdot O\\underline{u}:F ) $',
            },
            { id: 1, label: '$ Ou:(F\\cdot F) $' },
            { id: 2, label: '$ O\\underline{u}:(D\\cdot F) $' },
            { id: 3, label: '$ (Ou:D\\cdot Ou:F) $' },
          ],
          correctId: [0],
          answer: '',
        },
      ],
    },
  ],
};
export { setN };
