const chapters = [
  {
    id: 6.1,
    title: 'Easier Translations',
    questions: [
      {
        id: '6.1a.1',
        prompt: 'Not both A and B',
        options: [
          { id: 0, label: '~(A V B)' },
          { id: 1, label: '~(A · B)' },
          { id: 2, label: '(~A · ~B)' },
          { id: 3, label: '(~A V ~B)' },
        ],
        correctId: 1,
      },
      {
        id: '6.1a.2',
        prompt: 'Both A and either B or C',
        options: [
          { id: 0, label: '(A · (B V C))' },
          { id: 1, label: '(A V (B · C))' },
          { id: 2, label: '~(A · (B V C))' },
          { id: 3, label: '(A · B) V (A · C)' },
        ],
        correctId: 0,
      },
      {
        id: '6.1a.3',
        prompt: 'Either both A and B or C',
        options: [
          { id: 0, label: '(A · (B V C))' },
          { id: 1, label: '~((A · B) V C)' },
          { id: 2, label: '((A · B) V C)' },
          { id: 3, label: '(A V B) · C' },
        ],
        correctId: 2,
      },
      {
        id: '6.1a.4',
        prompt: 'If A, then B or C',
        options: [
          { id: 0, label: '(A · (B V C))' },
          { id: 1, label: '(A → (B V C))' },
          { id: 2, label: '~(A → (B V C))' },
          { id: 3, label: '(A V B) → C' },
        ],
        correctId: 1,
      },
      {
        id: '6.1a.5',
        prompt: 'If A then B, or C',
        options: [
          { id: 0, label: '(A → (B V C))' },
          { id: 1, label: '~((A → B) V C)' },
          { id: 2, label: '(A V B) → C' },
          { id: 3, label: '(A → B) V C' },
        ],
        correctId: 3,
      },
      {
        id: '6.1a.6',
        prompt: 'If not A, then not either B or C',
        options: [
          { id: 0, label: '~A → ~(B V C)' },
          { id: 1, label: '~(A → (B V C))' },
          { id: 2, label: '~(~A → (~B V C))' },
          { id: 3, label: '~A → (B V ~C)' },
        ],
        correctId: 0,
      },
      {
        id: '6.1a.7',
        prompt: 'If not A, then either not B or C',
        options: [
          { id: 0, label: '~A → (~B V C)' },
          { id: 1, label: '(A → (B V C))' },
          { id: 2, label: '~(~A → (~B V C))' },
          { id: 3, label: '~A → (B V ~C)' },
        ],
        correctId: 0,
      },
      {
        id: '6.1a.8',
        prompt: 'Either A or B, and C',
        options: [
          { id: 0, label: '(A · (B V C))' },
          { id: 1, label: '((A V B) · C)' },
          { id: 2, label: '~((A V B) · C)' },
          { id: 3, label: '(A V B) → C' },
        ],
        correctId: 1,
      },
      {
        id: '6.1a.9',
        prompt: 'Either A, or B and C',
        options: [
          { id: 0, label: '(A · (B V C))' },
          { id: 1, label: '~(A V (B · C))' },
          { id: 2, label: '(A V B) · C' },
          { id: 3, label: '(A V (B · C))' },
        ],
        correctId: 3,
      },
      {
        id: '6.1a.10',
        prompt: 'If A then not both not B and not C',
        options: [
          { id: 0, label: '(A → ~(~B · ~C))' },
          { id: 1, label: '(A · (B V C))' },
          { id: 2, label: '~(A → ~(~B · ~C))' },
          { id: 3, label: '(A → (B · C))' },
        ],
        correctId: 0,
      },
      {
        id: '6.1a.11',
        prompt:
          'If you get an error message, then the disk is bad or it is a Macintosh disk.',
        options: [
          { id: 0, label: '(E · (B V M))' },
          { id: 1, label: '~(E → (B V M))' },
          { id: 2, label: 'E → (B V M)' },
          { id: 3, label: 'E → (B · M)' },
        ],
        correctId: 2,
      },
      {
        id: '6.1a.12',
        prompt:
          'If I bring my digital camera, then if my batteries don’t die then I’ll take pictures of my backpack trip and put the pictures on my Web site',
        options: [
          { id: 0, label: '(C → (~B → (T · W)))' },
          { id: 1, label: '(C · (B → (T V W)))' },
          { id: 2, label: '(C → ((~B) V (T · W)))' },
          { id: 3, label: '((C · B) → (T · W))' },
        ],
        correctId: 0,
      },
      {
        id: '6.1a.13',
        prompt:
          'If you both don’t exercise and eat too much then you’ll gain weight',
        options: [
          { id: 0, label: '(((~X) · M) → G)' },
          { id: 1, label: '((X V M) → G)' },
          { id: 2, label: '((~X V M) → G)' },
          { id: 3, label: '(((~X) · (~M)) → G)' },
        ],
        correctId: 0,
      },
      {
        id: '6.1a.14',
        prompt: 'The statue isn’t by either Cellini or Michelangelo',
        options: [
          { id: 0, label: '~(C V M)' },
          { id: 1, label: '(~C · ~M)' },
          { id: 2, label: '(C → ~M)' },
          { id: 3, label: '(~C → M)' },
        ],
        correctId: 0,
      },
      {
        id: '6.1a.15',
        prompt:
          'If I don’t have either $2 in exact change or a bus pass I won’t ride the bus',
        options: [
          { id: 0, label: '~((E V P) → R)' },
          { id: 1, label: '((~E · ~P) → ~R)' },
          { id: 2, label: '(~(E V P) → ~R)' },
          { id: 3, label: '((E V P) → ~R)' },
        ],
        correctId: 2,
      },
      {
        id: '6.1a.16',
        prompt:
          'If Michigan and Ohio State play each other then Michigan will win',
        options: [
          { id: 0, label: '((M · O) → W)' },
          { id: 1, label: '(M → (O V W))' },
          { id: 2, label: '(M V (O → W))' },
          { id: 3, label: '(P → M)' },
        ],
        correctId: 3,
      },
      {
        id: '6.1a.17',
        prompt:
          'Either you went through both Dayton and Cinci, or you went through Louisville',
        options: [
          { id: 0, label: '((D · C) V L)' },
          { id: 1, label: '(D → (C V L))' },
          { id: 2, label: '((D V C) · L)' },
          { id: 3, label: '(D · (C V L))' },
        ],
        correctId: 0,
      },
      {
        id: '6.1a.18',
        prompt:
          'If she had hamburgers then she ate junk food, and she ate French fries',
        options: [
          { id: 0, label: '(H → (J · F))' },
          { id: 1, label: '((H → J) · F)' },
          { id: 2, label: '(H → (J V F))' },
          { id: 3, label: '((H V J) → F)' },
        ],
        correctId: 1,
      },
      {
        id: '6.1a.19',
        prompt: 'I’m going to Rome or Florence and you’re going to London',
        options: [
          { id: 0, label: '((R V F) · L)' },
          { id: 1, label: '((R · F) V L)' },
          { id: 2, label: '(R → (F · L))' },
          { id: 3, label: '(R V (F · L))' },
        ],
        correctId: 0,
      },
      {
        id: '6.1a.20',
        prompt: 'Everyone is male or female',
        options: [
          { id: 0, label: '(M V F)' },
          { id: 1, label: '(M → F)' },
          { id: 2, label: '(M · F)' },
          { id: 3, label: 'E' },
        ],
        correctId: 3,
      },
    ],
  },
  {
    id: 6.8,
    title: 'Harder Translations',
    questions: [
      {
        id: '6.8a.1',
        prompt: 'If she goes, then you’ll be alone but I’ll be here.',
        options: [
          { id: 0, label: '(S → (A · I))' },
          { id: 1, label: '(~S → (A · I))' },
          { id: 2, label: '(S → (~A · ~I))' },
          { id: 3, label: '(S V (A · I))' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.2',
        prompt: 'Your car will start only if you have fuel.',
        options: [
          { id: 0, label: '(S → F)' },
          { id: 1, label: '(~S → F)' },
          { id: 2, label: '(S → ~F)' },
          { id: 3, label: '(S V F)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.3',
        prompt: 'I will quit unless you give me a raise.',
        options: [
          { id: 0, label: '(Q V R)' },
          { id: 1, label: '(~Q V R)' },
          { id: 2, label: '(Q V ~R)' },
          { id: 3, label: '(Q → R)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.4',
        prompt: 'Taking the final is a sufficient condition for passing.',
        options: [
          { id: 0, label: '(T → P)' },
          { id: 1, label: '(~T → P)' },
          { id: 2, label: '(T → ~P)' },
          { id: 3, label: '(T V P)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.5',
        prompt: 'Taking the final is necessary for you to pass.',
        options: [
          { id: 0, label: '(~T → ~P)' },
          { id: 1, label: '(T → ~P)' },
          { id: 2, label: '(~T → P)' },
          { id: 3, label: '(T V ~P)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.6',
        prompt: 'You’re a man just if you’re a rational animal.',
        options: [
          { id: 0, label: '(M ≡ R)' },
          { id: 1, label: '(M → R)' },
          { id: 2, label: '(~M ≡ R)' },
          { id: 3, label: '(M V R)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.7',
        prompt: 'Unless you have faith, you’ll die.',
        options: [
          { id: 0, label: '(F V D)' },
          { id: 1, label: '(~F V D)' },
          { id: 2, label: '(F V ~D)' },
          { id: 3, label: '(F → D)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.8',
        prompt: 'She neither asserted it nor hinted at it.',
        options: [
          { id: 0, label: '(~A · ~H)' },
          { id: 1, label: '(A · ~H)' },
          { id: 2, label: '(~A · H)' },
          { id: 3, label: '(A V ~H)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.9',
        prompt:
          'Getting at least 96 is a necessary and sufficient condition for getting an A.',
        options: [
          { id: 0, label: '(N ≡ A)' },
          { id: 1, label: '(N → A)' },
          { id: 2, label: '(~N ≡ A)' },
          { id: 3, label: '(N V A)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.10',
        prompt: 'Only if you exercise are you fully alive.',
        options: [
          { id: 0, label: '(A → E)' },
          { id: 1, label: '(~A → E)' },
          { id: 2, label: '(A → ~E)' },
          { id: 3, label: '(A V E)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.11',
        prompt: 'I’ll go, assuming that you go.',
        options: [
          { id: 0, label: '(Y → I)' },
          { id: 1, label: '(~Y → I)' },
          { id: 2, label: '(Y → ~I)' },
          { id: 3, label: '(Y V I)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.12',
        prompt: 'Assuming that your belief is false, you don’t know.',
        options: [
          { id: 0, label: '(F → ~K)' },
          { id: 1, label: '(~F → ~K)' },
          { id: 2, label: '(F → K)' },
          { id: 3, label: '(F V ~K)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.13',
        prompt:
          'Having a true belief is a necessary condition for having knowledge.',
        options: [
          { id: 0, label: '(~T → ~K)' },
          { id: 1, label: '(T → ~K)' },
          { id: 2, label: '(~T → K)' },
          { id: 3, label: '(T V ~K)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.14',
        prompt: 'You get mashed potatoes or French fries, but not both.',
        options: [
          { id: 0, label: '((M V F) · ~(M & F))' },
          { id: 1, label: '(M → F)' },
          { id: 2, label: '(~M V F)' },
          { id: 3, label: '(M V ~F)' },
        ],
        correctId: 0,
      },
      {
        id: '6.8a.15',
        prompt: 'You’re wrong if you say that.',
        options: [
          { id: 0, label: '(S → W)' },
          { id: 1, label: '(~S → W)' },
          { id: 2, label: '(S → ~W)' },
          { id: 3, label: '(S V W)' },
        ],
        correctId: 0,
      },
    ],
  },
];
const questions = [
  {
    id: '6.1a.1',
    prompt: 'Not both A and B',
    options: [
      { id: 0, label: '~(A V B)' },
      { id: 1, label: '~(A · B)' },
      { id: 2, label: '(~A · ~B)' },
      { id: 3, label: '(~A V ~B)' },
    ],
    correctId: 1,
  },
  {
    id: '6.1a.2',
    prompt: 'Both A and either B or C',
    options: [
      { id: 0, label: '(A · (B V C))' },
      { id: 1, label: '(A V (B · C))' },
      { id: 2, label: '~(A · (B V C))' },
      { id: 3, label: '(A · B) V (A · C)' },
    ],
    correctId: 0,
  },
  {
    id: '6.1a.3',
    prompt: 'Either both A and B or C',
    options: [
      { id: 0, label: '(A · (B V C))' },
      { id: 1, label: '~((A · B) V C)' },
      { id: 2, label: '((A · B) V C)' },
      { id: 3, label: '(A V B) · C' },
    ],
    correctId: 2,
  },
  {
    id: '6.1a.4',
    prompt: 'If A, then B or C',
    options: [
      { id: 0, label: '(A · (B V C))' },
      { id: 1, label: '(A → (B V C))' },
      { id: 2, label: '~(A → (B V C))' },
      { id: 3, label: '(A V B) → C' },
    ],
    correctId: 1,
  },
  {
    id: '6.1a.5',
    prompt: 'If A then B, or C',
    options: [
      { id: 0, label: '(A → (B V C))' },
      { id: 1, label: '~((A → B) V C)' },
      { id: 2, label: '(A V B) → C' },
      { id: 3, label: '(A → B) V C' },
    ],
    correctId: 3,
  },
  {
    id: '6.1a.6',
    prompt: 'If not A, then not either B or C',
    options: [
      { id: 0, label: '~A → ~(B V C)' },
      { id: 1, label: '~(A → (B V C))' },
      { id: 2, label: '~(~A → (~B V C))' },
      { id: 3, label: '~A → (B V ~C)' },
    ],
    correctId: 0,
  },
  {
    id: '6.1a.7',
    prompt: 'If not A, then either not B or C',
    options: [
      { id: 0, label: '~A → (~B V C)' },
      { id: 1, label: '(A → (B V C))' },
      { id: 2, label: '~(~A → (~B V C))' },
      { id: 3, label: '~A → (B V ~C)' },
    ],
    correctId: 0,
  },
  {
    id: '6.1a.8',
    prompt: 'Either A or B, and C',
    options: [
      { id: 0, label: '(A · (B V C))' },
      { id: 1, label: '((A V B) · C)' },
      { id: 2, label: '~((A V B) · C)' },
      { id: 3, label: '(A V B) → C' },
    ],
    correctId: 1,
  },
  {
    id: '6.1a.9',
    prompt: 'Either A, or B and C',
    options: [
      { id: 0, label: '(A · (B V C))' },
      { id: 1, label: '~(A V (B · C))' },
      { id: 2, label: '(A V B) · C' },
      { id: 3, label: '(A V (B · C))' },
    ],
    correctId: 3,
  },
  {
    id: '6.1a.10',
    prompt: 'If A then not both not B and not C',
    options: [
      { id: 0, label: '(A → ~(~B · ~C))' },
      { id: 1, label: '(A · (B V C))' },
      { id: 2, label: '~(A → ~(~B · ~C))' },
      { id: 3, label: '(A → (B · C))' },
    ],
    correctId: 0,
  },
  {
    id: '6.1a.11',
    prompt:
      'If you get an error message, then the disk is bad or it is a Macintosh disk.',
    options: [
      { id: 0, label: '(E · (B V M))' },
      { id: 1, label: '~(E → (B V M))' },
      { id: 2, label: 'E → (B V M)' },
      { id: 3, label: 'E → (B · M)' },
    ],
    correctId: 2,
  },
  {
    id: '6.1a.12',
    prompt:
      'If I bring my digital camera, then if my batteries don’t die then I’ll take pictures of my backpack trip and put the pictures on my Web site',
    options: [
      { id: 0, label: '(C → (~B → (T · W)))' },
      { id: 1, label: '(C · (B → (T V W)))' },
      { id: 2, label: '(C → ((~B) V (T · W)))' },
      { id: 3, label: '((C · B) → (T · W))' },
    ],
    correctId: 0,
  },
  {
    id: '6.1a.13',
    prompt:
      'If you both don’t exercise and eat too much then you’ll gain weight',
    options: [
      { id: 0, label: '(((~X) · M) → G)' },
      { id: 1, label: '((X V M) → G)' },
      { id: 2, label: '((~X V M) → G)' },
      { id: 3, label: '(((~X) · (~M)) → G)' },
    ],
    correctId: 0,
  },
  {
    id: '6.1a.14',
    prompt: 'The statue isn’t by either Cellini or Michelangelo',
    options: [
      { id: 0, label: '~(C V M)' },
      { id: 1, label: '(~C · ~M)' },
      { id: 2, label: '(C → ~M)' },
      { id: 3, label: '(~C → M)' },
    ],
    correctId: 0,
  },
  {
    id: '6.1a.15',
    prompt:
      'If I don’t have either $2 in exact change or a bus pass I won’t ride the bus',
    options: [
      { id: 0, label: '~((E V P) → R)' },
      { id: 1, label: '((~E · ~P) → ~R)' },
      { id: 2, label: '(~(E V P) → ~R)' },
      { id: 3, label: '((E V P) → ~R)' },
    ],
    correctId: 2,
  },
  {
    id: '6.1a.16',
    prompt: 'If Michigan and Ohio State play each other then Michigan will win',
    options: [
      { id: 0, label: '((M · O) → W)' },
      { id: 1, label: '(M → (O V W))' },
      { id: 2, label: '(M V (O → W))' },
      { id: 3, label: '(P → M)' },
    ],
    correctId: 3,
  },
  {
    id: '6.1a.17',
    prompt:
      'Either you went through both Dayton and Cinci, or you went through Louisville',
    options: [
      { id: 0, label: '((D · C) V L)' },
      { id: 1, label: '(D → (C V L))' },
      { id: 2, label: '((D V C) · L)' },
      { id: 3, label: '(D · (C V L))' },
    ],
    correctId: 0,
  },
  {
    id: '6.1a.18',
    prompt:
      'If she had hamburgers then she ate junk food, and she ate French fries',
    options: [
      { id: 0, label: '(H → (J · F))' },
      { id: 1, label: '((H → J) · F)' },
      { id: 2, label: '(H → (J V F))' },
      { id: 3, label: '((H V J) → F)' },
    ],
    correctId: 1,
  },
  {
    id: '6.1a.19',
    prompt: 'I’m going to Rome or Florence and you’re going to London',
    options: [
      { id: 0, label: '((R V F) · L)' },
      { id: 1, label: '((R · F) V L)' },
      { id: 2, label: '(R → (F · L))' },
      { id: 3, label: '(R V (F · L))' },
    ],
    correctId: 0,
  },
  {
    id: '6.1a.20',
    prompt: 'Everyone is male or female',
    options: [
      { id: 0, label: '(M V F)' },
      { id: 1, label: '(M → F)' },
      { id: 2, label: '(M · F)' },
      { id: 3, label: 'E' },
    ],
    correctId: 3,
  },
];

export { chapters, questions };
