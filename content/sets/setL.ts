import { Set } from '../types';

const setL: Set = {
  name: 'Set L',
  slugs: ['informal', 'definitions'],
  logicType: 'Deontic',
  id: 12,
  title: 'Deontic Translations: Imperative',
  header: 'What is wrong with this definition?',
  subSets: [
    {
      name: 'Set L',
      logicType: 'Basic Translations',
      slugs: ['Deontic', 'translations', 'Imperative'],
      shuffleOptions: true,
      id: 12,
      title: 'Deontic Translations: Imperative',
      header: 'Translates into logic as:',
      isNew: true,
      questions: [
        {
          id: '12.1',
          prompt: "Don't conform without despairing",
          options: [
            { id: 0, label: '$ (Cu\\supset \\sim D\\underline{u} ) $' },
            {
              id: 1,
              label:
                '$ \\sim (C\\underline{u} \\cdot \\sim D\\underline{u} ) $',
            },
            { id: 2, label: '$ \\sim (C\\underline{u}\\cdot \\sim Du ) $' },
            { id: 3, label: '$ \\sim (Cu\\cdot \\sim D\\underline{u} ) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.2',
          prompt: "Sing and don'tsing is inconsistent",
          options: [
            { id: 0, label: '$ \\sim \\lozenge (Su\\cdot \\sim Su) $' },
            {
              id: 1,
              label:
                '$ \\sim (S\\underline{u}\\cdot \\sim S\\underline{u}  ) $',
            },
            {
              id: 2,
              label:
                '$ (\\sim \\lozenge (S\\underline{u}\\cdot \\sim S\\underline{u}  )) $',
            },
            {
              id: 3,
              label:
                '$ \\sim \\lozenge (S\\underline{u}\\cdot \\sim S\\underline{u}  ) $',
            },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.3',
          prompt: 'Defeat Tom',
          options: [
            { id: 0, label: '$ D\\underline{t} $' },
            { id: 1, label: '$ OD\\underline{u}t $' },
            { id: 2, label: '$ D\\underline{u} t $' },
            { id: 3, label: '$ Dut $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.4',
          prompt: 'Don\t comçine selling with forfeiting',
          options: [
            {
              id: 0,
              label: '$ \\sim (S\\underline{u} \\cdot F\\underline{u} ) $',
            },
            { id: 1, label: '$ (Su\\supset \\sim F\\underline{u} ) $' },
            { id: 2, label: '$ \\sim (Su\\cdot F\\underline{u} ) $' },
            { id: 3, label: '$ \\sim (S\\underline{u}\\cdot Fu ) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.5',
          prompt: "Talk and don't talk",
          options: [
            { id: 0, label: '$ \\sim \\lozenge (Tu\\cdot \\sim Tu) $' },
            {
              id: 1,
              label:
                '$ (\\sim \\lozenge (T\\underline{u}\\cdot \\sim T\\underline{u}  )) $',
            },
            {
              id: 2,
              label:
                '$ \\sim (T\\underline{u} \\cdot \\sim T\\underline{u} ) $',
            },
            {
              id: 3,
              label:
                '$ \\sim \\lozenge (T\\underline{u} \\cdot \\sim T\\underline{u} ) $',
            },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.6',
          prompt: 'Sing, Tom',
          options: [
            { id: 0, label: '$ OS\\underline{t} $' },
            { id: 1, label: '$ S\\underline{t} $' },
            { id: 2, label: '$ St $' },
            { id: 3, label: '$ S\\underline{u}t $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.7',
          prompt: 'Don\t combine sleeping with parking',
          options: [
            { id: 0, label: '$ (Su\\supset \\sim P\\underline{u} ) $' },
            {
              id: 1,
              label: '$ \\sim (S\\underline{u} \\cdot P\\underline{u} ) $',
            },
            { id: 2, label: '$ \\sim (Su\\cdot P\\underline{u} ) $' },
            { id: 3, label: '$ \\sim (S\\underline{u} \\cdot Pu) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.8',
          prompt: "You're praying but don't pray",
          options: [
            { id: 0, label: '$ \\lozenge (Pu\\cdot \\sim Pu) $' },
            { id: 1, label: '$ \\lozenge (Pu\\cdot \\sim P\\underline{u} ) $' },
            { id: 2, label: '$ (\\lozenge Pu\\cdot \\sim P\\underline{u} ) $' },
            { id: 3, label: '$ (Pu\\cdot \\sim P\\underline{u} ) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.9',
          prompt: "Don't distrub Tom",
          options: [
            { id: 0, label: '$ \\sim D\\underline{t} $' },
            { id: 1, label: '$ \\sim Dut $' },
            { id: 2, label: '$ \\sim D\\underline{u} t $' },
            { id: 3, label: '$ O\\sim D\\underline{u} t $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.10',
          prompt: 'Don\t combine complaing with not looking',
          options: [
            { id: 0, label: '$ \\sim (Cu\\cdot \\sim L\\underline{u} ) $' },
            { id: 1, label: '$ \\sim (C\\underline{u} \\cdot \\sim Lu) $' },
            {
              id: 2,
              label:
                '$ \\sim (C\\underline{u} \\cdot \\sim L\\underline{u} ) $',
            },
            { id: 3, label: '$ (Cu\\supset \\sim L\\underline{u} ) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.11',
          prompt: 'If you cry, then don\t sing',
          options: [
            { id: 0, label: '$ (Cu\\supset \\sim S\\underline{u} ) $' },
            {
              id: 1,
              label: '$ (C\\underline{u}\\supset \\sim S\\underline{u} ) $',
            },
            { id: 2, label: '$ (Cu\\supset \\sim Su) $' },
            { id: 3, label: '$ (Cu\\supset O\\sim S\\underline{u} ) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.12',
          prompt: 'Insult Donna',
          options: [
            { id: 0, label: '$ Iud $' },
            { id: 1, label: '$ Oi\\underline{u} d $' },
            { id: 2, label: '$ I\\underline{u} d $' },
            { id: 3, label: '$ I\\underline{d} $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.13',
          prompt: 'Let someone who is selling bluff',
          options: [
            { id: 0, label: '$ (exists x)(Sx\\cdot Bx) $' },
            { id: 1, label: '$ (exists x)(S\\underline{x} \\cdot Bx) $' },
            {
              id: 2,
              label: '$ (exists x)(S\\underline{x} \\cdot B\\underline{x} ) $',
            },
            { id: 3, label: '$ (exists x)(Sx\\cdot B\\underline{x} ) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.14',
          prompt: 'If C is attacking you, then attack C',
          options: [
            { id: 0, label: '$ (Acu\\supset Auc) $' },
            { id: 1, label: '$ (Acu\\supset A\\underline{u}c ) $' },
            { id: 2, label: '$ (Acu\\supset OA\\underline{u} c) $' },
            {
              id: 3,
              label: '$ (A\\underline{c}u\\supset A\\underline{u} c ) $',
            },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.15',
          prompt: 'Harm Donna',
          options: [
            { id: 0, label: '$ H\\underline{u} d $' },
            { id: 1, label: '$ OH\\underline{u} d $' },
            { id: 2, label: '$ Hud $' },
            { id: 3, label: '$ H\\underline{d} $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.16',
          prompt: 'Would that everyone who is fortunate sing',
          options: [
            { id: 0, label: '$ (x)(Fx\\supset S\\underline{x} ) $' },
            { id: 1, label: '$ (x)(Fx\\supset Sx) $' },
            { id: 2, label: '$ (x)(F\\underline{x} \\supset Sx) $' },
            {
              id: 3,
              label: '$ (x)(F\\underline{x} \\supset S\\underline{x} ) $',
            },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.17',
          prompt: 'Flirt only if you laugh',
          options: [
            { id: 0, label: '$ (F\\underline{u} \\supset Lu) $' },
            { id: 1, label: '$ (F\\underline{u} \\supset L\\underline{u} ) $' },
            { id: 2, label: '$ (OF\\underline{y} \\supset Lu ) $' },
            { id: 3, label: '$ (Fu\\supset Lu) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.18',
          prompt: "Don't appoint Donna",
          options: [
            { id: 0, label: '$ \\sim A\\underline{d} $' },
            { id: 1, label: '$ \\sim Aud $' },
            { id: 2, label: '$ \\sim A\\underline{u} d $' },
            { id: 3, label: '$ O\\sim A\\underline{u} d $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.19',
          prompt: 'Would that no one cheat',
          options: [
            { id: 0, label: '$ \\sim (exists x)C\\underline{x} $' },
            { id: 1, label: '$ O\\sim (exists x)C\\underline{x} $' },
            { id: 2, label: '$ (\\exists\\underline{x}) Cx $' },
            { id: 3, label: '$ \\sim (exists x)Cx $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.20',
          prompt: 'Invest only if you look',
          options: [
            { id: 0, label: '$ (Iu\\supset Lu) $' },
            { id: 1, label: '$ (Ol\\underline{u}\\supset Lu) $' },
            { id: 2, label: '$ (I\\underline{u}\\supset Lu ) $' },
            { id: 3, label: '$ (I\\underline{u} \\supset L\\underline{u} ) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.21',
          prompt: "Don't insult Donna",
          options: [
            { id: 0, label: '$ \\sim I\\underline{u} d $' },
            { id: 1, label: '$ \\sim I\\underline{d} $' },
            { id: 2, label: '$ \\sim Iud $' },
            { id: 3, label: '$ O\\sim I\\underline{u} d $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.22',
          prompt: "Don't laughm and don't sleep",
          options: [
            {
              id: 0,
              label:
                '$ (\\sim L\\underline{u} \\cdot \\sim S\\underline{u} ) $',
            },
            { id: 1, label: '$ (\\sim Lu\\cdot \\sim Su) $' },
            { id: 2, label: '$ (\\sim Lu\\cdot \\sim S\\underline{u} ) $' },
            { id: 3, label: '$ (\\sim L\\underline{u}\\cdot \\sim Su ) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.23',
          prompt: "If you pray, then don't cheer",
          options: [
            { id: 0, label: '$ (Pu\\supset O\\sim C\\underline{u} ) $' },
            { id: 1, label: '$ (Pu\\supset \\sim Cu) $' },
            {
              id: 2,
              label: '$ (P\\underline{u}\\supset \\sim C\\underline{u}  ) $',
            },
            { id: 3, label: '$ (Pu\\supset \\sim C\\underline{u} ) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.24',
          prompt: 'I allowed someone to cheat',
          options: [
            { id: 0, label: '$ (\\exists x)(Ix\\cdot C\\underline{x} ) $' },
            { id: 1, label: '$ (\\exists x)(Ix\\cdot Cx) $' },
            { id: 2, label: '$ (\\exists x)(Ix\\cdot C\\underline{x} ) $' },
            { id: 3, label: '$ (\\exists x)(I\\underline{x} \\cdot Cx) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.25',
          prompt: 'Sing and despair',
          options: [
            { id: 0, label: '$ (S\\underline{u}\\cdot Du ) $' },
            { id: 1, label: '$ (Su\\cdot D\\underline{u} ) $' },
            { id: 2, label: '$ (S\\underline{u}\\cdot D\\underline{u}  ) $' },
            { id: 3, label: '$ (Su\\cdot Du) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.26',
          prompt: 'Look and conform',
          options: [
            { id: 0, label: '$ (Lu\\cdot Cu) $' },
            { id: 1, label: '$ (L\\underline{u}\\cdot C\\underline{u}  ) $' },
            { id: 2, label: '$ (Lu\\cdot C\\underline{u} ) $' },
            { id: 3, label: '$ (L\\underline{u}\\cdot Cu  ) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.27',
          prompt: "If you're crying, then sing",
          options: [
            { id: 0, label: '$ (Cu\\supset OS\\underline{u} ) $' },
            { id: 1, label: '$ (Cu\\supset S\\underline{u} ) $' },
            { id: 2, label: '$ (C\\underline{u}\\supset S\\underline{u}  ) $' },
            { id: 3, label: '$ (Cu\\supset Su) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.28',
          prompt: 'Let someone park who is sleeping',
          options: [
            { id: 0, label: '$ (\\exists x)(Px\\cdot Sx) $' },
            { id: 1, label: '$ (\\exists x)(P\\underline{x}\\cdot Sx ) $' },
            {
              id: 2,
              label:
                '$ (\\exists x)(P\\underline{x}\\cdot S\\underline{x}  ) $',
            },
            { id: 3, label: '$ (\\exists x)(Px\\cdot S\\underline{x} ) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.29',
          prompt: "Don't speak, and don't pray",
          options: [
            {
              id: 0,
              label:
                '$ (\\sim S\\underline{u}\\cdot \\sim P\\underline{u}  ) $',
            },
            { id: 1, label: '$ (\\sim Su\\cdot \\sim P\\underline{u} ) $' },
            { id: 2, label: '$ (\\sim Su\\cdot \\sim Pu) $' },
            { id: 3, label: '$ (\\sim S\\underline{u}\\cdot \\sim Pu ) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.30',
          prompt: "If you stay, then don't invest",
          options: [
            { id: 0, label: '$ (Su\\supset O\\sim I\\underline{u} ) $' },
            { id: 1, label: '$ (Su\\supset \\sim I\\underline{u} ) $' },
            {
              id: 2,
              label: '$ (S\\underline{u}\\supset \\sim I\\underline{u}  ) $',
            },
            { id: 3, label: '$ (Su\\supset \\sim Iu) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.31',
          prompt: 'Would that someone who is looking conform',
          options: [
            { id: 0, label: '$ (\\exists x)(L\\underline{x} \\cdot Cx) $' },
            { id: 1, label: '$ (\\exists x)(Lx\\cdot C\\underline{x} ) $' },
            { id: 2, label: '$ (\\exists x)(Lx\\cdot Cx) $' },
            {
              id: 3,
              label:
                '$ (\\exists x)(L\\underline{x}\\cdot C\\underline{x}  ) $',
            },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.32',
          prompt: 'Would that someone sing',
          options: [
            { id: 0, label: '$ O(\\exists x)S\\underline{x} $' },
            { id: 1, label: '$ (\\exists x)Sx $' },
            { id: 2, label: '$ (\\exists x)S\\underline{x} $' },
            { id: 3, label: '$ (\\exists x)Sx $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.33',
          prompt: 'Steal only if you pray',
          options: [
            { id: 0, label: '$ (OS\\underline{u}\\supset Pu ) $' },
            { id: 1, label: '$ (Su\\supset Pu) $' },
            { id: 2, label: '$ (S\\underline{u}\\supset P\\underline{u}  ) $' },
            { id: 3, label: '$ (S\\underline{u}\\supset Pu ) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.34',
          prompt: "'Let everyone cheer'is consistent",
          options: [
            { id: 0, label: '$ \\lozenge (x)C\\underline{x} $' },
            { id: 1, label: '$ (x)C\\underline{x} $' },
            { id: 2, label: '$ (\\lozenge (x)C\\underline{x} ) $' },
            { id: 3, label: '$ \\lozenge (x)Cx $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.35',
          prompt: 'Let no one boast',
          options: [
            { id: 0, label: '$ O\\sim (\\exists x)B\\underline{x} $' },
            { id: 1, label: '$ (\\exists x)Bx $' },
            { id: 2, label: '$ \\sim (\\exists x)Bx $' },
            { id: 3, label: '$ \\sim (\\exists x)B\\underline{x} $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.36',
          prompt: 'If Madonna is arresting you, then arrest Madonna',
          options: [
            { id: 0, label: '$ (Amu\\supset Aum) $' },
            {
              id: 1,
              label: '$ (A\\underline{m} u\\supset A\\underline{u}m ) $',
            },
            { id: 2, label: '$ (Amu\\supset OA\\underline{u}m ) $' },
            { id: 3, label: '$ (Amu \\supset A\\underline{u} m) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.37',
          prompt: "Either don't fail, or don't sing",
          options: [
            { id: 0, label: '$ (\\sim Fu\\vee \\sim Su) $' },
            { id: 1, label: '$ (\\sim F\\underline{u}\\vee \\sim Su ) $' },
            { id: 2, label: '$ (\\sim Fu\\vee \\sim S\\underline{u} ) $' },
            {
              id: 3,
              label: '$ (\\sim F\\underline{u}\\vee \\sim S\\underline{u}  ) $',
            },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.38',
          prompt: 'Would that someone fly',
          options: [
            { id: 0, label: '$ (\\exists x)Fx $' },
            { id: 1, label: '$ (\\exists x)F\\underline{x} $' },
            { id: 2, label: '$ O(\\exists x)F\\underline{x} $' },
            { id: 3, label: '$ (\\exists \\underline{x} )Fx $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.39',
          prompt: 'Bluff only if you cheer',
          options: [
            { id: 0, label: '$ (B\\underline{u}\\supset C\\underline{u}  ) $' },
            { id: 1, label: '$ (B\\underline{u}\\supset Cu ) $' },
            { id: 2, label: '$ (OB\\underline{u}\\supset Cu ) $' },
            { id: 3, label: '$ (Bu\\supset Cu) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.40',
          prompt: 'Forfeit and speak',
          options: [
            { id: 0, label: '$ (F\\underline{u}\\cdot S\\underline{u}  ) $' },
            { id: 1, label: '$ (Fu\\cdot S\\underline{u} ) $' },
            { id: 2, label: '$ (Fu\\cdot Su) $' },
            { id: 3, label: '$ (F\\underline{u}\\cdot Su ) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.41',
          prompt: 'Would that everyone boast',
          options: [
            { id: 0, label: '$ O(x)B\\underline{x} $' },
            { id: 1, label: '$ (x)Bx $' },
            { id: 2, label: '$ (\\underline{x} )Bx $' },
            { id: 3, label: '$ (x)B\\underline{x} $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.42',
          prompt: "If you invest, then don't despair",
          options: [
            {
              id: 0,
              label: '$ (I\\underline{u}\\supset \\sim D\\underline{u}  ) $',
            },
            { id: 1, label: '$ (Iu\\supset \\sim Du) $' },
            { id: 2, label: '$ (Iu\\supset \\sim D\\underline{u} ) $' },
            { id: 3, label: '$ (Iu\\supset O\\sim D\\underline{u} ) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.43',
          prompt: 'Sleep, Donna',
          options: [
            { id: 0, label: '$ S\\underline{d} $' },
            { id: 1, label: '$ S\\underline{u} d $' },
            { id: 2, label: '$ OS\\underline{d} $' },
            { id: 3, label: '$ Sd $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.44',
          prompt: 'Would that no one steal',
          options: [
            { id: 0, label: '$ (\\exists x)Sx $' },
            { id: 1, label: '$ O\\sim (\\exists x)S\\underline{x} $' },
            { id: 2, label: '$ \\sim (\\exists x)Sx $' },
            { id: 3, label: '$ \\sim (\\exists x)S\\underline{x} $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.45',
          prompt: "If you're sellin, then cheer",
          options: [
            { id: 0, label: '$ (Su\\supset OC\\underline{u} ) $' },
            { id: 1, label: '$ (Su\\supset Cu) $' },
            { id: 2, label: '$ (S\\underline{u}\\supset C\\underline{u}  ) $' },
            { id: 3, label: '$ (Su\\supset C\\underline{u} ) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.46',
          prompt: "You're logical but don't be logical",
          options: [
            { id: 0, label: '$ (Lu\\cdot \\sim Lu) $' },
            { id: 1, label: '$ (Lu\\cdot O\\sim L\\underline{u} ) $' },
            { id: 2, label: '$ (Lu\\cdot \\sim L\\underline{u} ) $' },
            {
              id: 3,
              label: '$ (L\\underline{u}\\cdot \\sim L\\underline{u}  ) $',
            },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.47',
          prompt: 'Let someone despair',
          options: [
            { id: 0, label: '$ O(\\exists x)D\\underline{x} $' },
            { id: 1, label: '$ (\\exists x)Dx $' },
            { id: 2, label: '$ (\\exists x)D\\underline{x} $' },
            { id: 3, label: '$ (\\exists \\underline{x} )Dx $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.48',
          prompt: 'Sleep only if you laugh',
          options: [
            { id: 0, label: '$ (S\\underline{u}\\supset L\\underline{u}  ) $' },
            { id: 1, label: '$ (S\\underline{u}\\supset Lu ) $' },
            { id: 2, label: '$ (OS\\underline{u}\\supset Lu ) $' },
            { id: 3, label: '$ (Su\\supset Lu) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.49',
          prompt: 'Hurt Donna',
          options: [
            { id: 0, label: '$ Hud $' },
            { id: 1, label: '$ H\\underline{d} $' },
            { id: 2, label: '$ OH\\underline{u} d $' },
            { id: 3, label: '$ H\\underline{u} d $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.50',
          prompt: 'Boast and speak',
          options: [
            { id: 0, label: '$ (Bu\\cdot S\\underline{u} ) $' },
            { id: 1, label: '$ (B\\underline{u}\\cdot S\\underline{u}  ) $' },
            { id: 2, label: '$ (Bu\\cdot Su) $' },
            { id: 3, label: '$ (B\\underline{u}\\cdot Su ) $' },
          ],
          correctId: [1],
          answer: '',
        },
      ],
    },
    {
      name: 'Set L',
      logicType: 'Basic Translations',
      slugs: ['Deontic', 'translations', 'Deontic'],
      shuffleOptions: true,
      id: 12,
      title: 'Deontic Translations: Deontic',
      header: 'Translates into logic as:',
      isNew: true,
      questions: [
        {
          id: '12.1',
          prompt: 'You ought not to help Madonna',
          options: [
            { id: 0, label: '$ O\\sim Hum $' },
            { id: 1, label: '$ \\sim H\\underline{u} m $' },
            { id: 2, label: '$ O\\sim H\\underline{u} m $' },
            { id: 3, label: '$ O\\sim Hu\\underline{m} $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.2',
          prompt: "'You're crying but don't cry' is consistent",
          options: [
            { id: 0, label: '$ (\\lozenge Cu\\cdot \\sim C\\underline{u} ) $' },
            { id: 1, label: '$ \\lozenge (Cu\\cdot \\sim C\\underline{u} ) $' },
            { id: 2, label: '$ (Cu\\cdot \\sim C\\underline{u} ) $' },
            { id: 3, label: '$ \\lozenge (Cu\\cdot \\sim Cu) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.3',
          prompt: 'Let someone sleep',
          options: [
            { id: 0, label: '$ (\\exists x)Sx $' },
            { id: 1, label: '$ O(\\exists x)S\\underline{x} $' },
            { id: 2, label: '$ (\\exists \\underline{x} )Sx $' },
            { id: 3, label: '$ (\\exists x)S\\underline{x} $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.4',
          prompt: 'Tom ought to pray',
          options: [
            { id: 0, label: '$ OPt $' },
            { id: 1, label: '$ OP\\underline{t} $' },
            { id: 2, label: '$ O\\underline{t} $' },
            { id: 3, label: '$ P\\underline{t} $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.5',
          prompt: "'You're selling but don't sell' is consistent",
          options: [
            { id: 0, label: '$ (Su\\cdot 1,S\\underline{u} ) $' },
            { id: 1, label: '$ \\lozenge (Su\\cdot \\sim S\\underline{u} ) $' },
            { id: 2, label: '$ \\lozenge (Su\\cdot \\sim Su) $' },
            { id: 3, label: '$ (\\lozenge Su\\cdot \\sim S\\underline{u} ) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '12.6',
          prompt: 'Let no one talk',
          options: [
            { id: 0, label: '$ \\sim (\\exists x)T\\underline{x} $' },
            { id: 1, label: '$ O\\sim (\\exists x)T\\underline{x} $' },
            { id: 2, label: '$ (\\exists \\underline{x} )Tx $' },
            { id: 3, label: '$ \\sim (\\exists x)Tx $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '12.7',
          prompt: "It's required that you cry",
          options: [
            { id: 0, label: '$ RC\\underline{u} $' },
            { id: 1, label: '$ OCu $' },
            { id: 2, label: '$ RCu $' },
            { id: 3, label: '$ OC\\underline{u} $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.8',
          prompt: "'Sing and don't sing' is inconsistent",
          options: [
            { id: 0, label: '$ \\sim \\lozenge (Su\\cdot \\sim Su) $' },
            {
              id: 1,
              label:
                '$ (\\sim \\lozenge (S\\underline{u}\\cdot \\sim S\\underline{u}  )) $',
            },
            {
              id: 2,
              label:
                '$ \\sim (S\\underline{u}\\cdot \\sim S\\underline{u}  ) $',
            },
            {
              id: 3,
              label:
                '$ \\sim \\lozenge (S\\underline{u}\\cdot 1S\\underline{u}  ) $',
            },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '12.9',
          prompt: "'You ought to steal' doesn't entail'You actually do steal'",
          options: [
            {
              id: 0,
              label: '$ \\sim \\square (OSu\\supset S\\underline{u} ) $',
            },
            { id: 1, label: '$ \\sim \\square (OSu\\supset Su) $' },
            {
              id: 2,
              label: '$ \\sim \\square (S\\underline{u}\\supset Su ) $',
            },
            {
              id: 3,
              label:
                '$ \\sim \\square (OS\\underline{u}\\supset S\\underline{u}  ) $',
            },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '12.10',
          prompt: "It's permissible for you to sell",
          options: [
            { id: 0, label: '$ OS\\underline{u} $' },
            { id: 1, label: '$ RSu $' },
            { id: 2, label: '$ OSu $' },
            { id: 3, label: '$ RS\\underline{u} $' },
          ],
          correctId: [3],
          answer: '',
        },
      ],
    },
  ],
};

export { setL };
