import { Set } from '../types';

const setC: Set = {
  name: 'Set C',
  logicType: 'Propositional Translations',
  slugs: ['propositional', 'translations'],
  id: 6,
  title: 'Propositional Translations: Easy',
  header: 'Translates into logic as:',
  subSets: [
    {
      name: 'Set Ce',
      logicType: 'Propositional Translations',
      slugs: ['propositional', 'translations'],
      id: 6,
      title: 'Propositional Translations: Easy',
      header: 'Translates into logic as:',
      questions: [
        {
          id: '6.1',
          prompt: 'Both P and either L or D',
          options: [
            { id: 0, label: '$ (P \\cdot (L \\vee D)) $' },
            { id: 1, label: '$ (P \\cdot L) \\vee D $' },
            { id: 2, label: '$ P \\cdot L \\vee D $' },
            { id: 3, label: '$ ((P \\cdot L) \\vee D) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.2',
          prompt: 'Not either not B or N',
          options: [
            { id: 0, label: '$ (B \\vee N) $' },
            { id: 1, label: '$ B \\vee N $' },
            { id: 2, label: '$ \\sim\\sim B \\vee N $' },
            { id: 3, label: '$ \\sim(\\sim B \\vee N) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.3',
          prompt: "You aren't either smart or filthy",
          options: [
            { id: 0, label: '$ \\sim(S \\vee F) $' },
            { id: 1, label: '$ \\sim S \\vee F $' },
            { id: 2, label: '$ (\\sim S \\vee \\sim F) $' },
            { id: 3, label: '$ (\\sim S \\vee F) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.4',
          prompt: "You aren't both not forgetful and confident",
          options: [
            { id: 0, label: '$ (F \\cdot C) $' },
            { id: 1, label: '$ F \\cdot C $' },
            { id: 2, label: '$ \\sim(\\sim F \\cdot C) $' },
            { id: 3, label: '$ \\sim\\sim F \\cdot C $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.5',
          prompt: 'Not if not S then L',
          options: [
            { id: 0, label: '$ \\sim(\\sim S \\rightarrow L) $' },
            { id: 1, label: '$ \\sim\\sim S \\rightarrow L $' },
            { id: 2, label: '$ S \\rightarrow L $' },
            { id: 3, label: '$ (S \\rightarrow L) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.6',
          prompt: 'Not either not C or L',
          options: [
            { id: 0, label: '$ \\sim\\sim C \\vee L $' },
            { id: 1, label: '$ (C \\vee L) $' },
            { id: 2, label: '$ C \\vee L $' },
            { id: 3, label: '$ \\sim(\\sim C \\vee L) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.7',
          prompt: "If you're dull then you're logical, and you're persistent",
          options: [
            { id: 0, label: '$ (D \\rightarrow L) \\cdot P $' },
            { id: 1, label: '$ (D \\rightarrow (L \\cdot P)) $' },
            { id: 2, label: '$ ((D \\rightarrow L) \\cdot P) $' },
            { id: 3, label: '$ D \\rightarrow L \\cdot P $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.8',
          prompt: "You're either not mean or not curious",
          options: [
            { id: 0, label: '$ (\\sim M \\vee C) $' },
            { id: 1, label: '$ \\sim M \\vee \\sim C $' },
            { id: 2, label: '$ (\\sim M \\vee \\sim C) $' },
            { id: 3, label: '$ \\sim(M \\vee \\sim C) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.9',
          prompt: "You're both not bashful and not careful",
          options: [
            { id: 0, label: '$ (\\sim B \\cdot C) $' },
            { id: 1, label: '$ \\sim(B \\cdot \\sim C) $' },
            { id: 2, label: '$ \\sim B \\cdot \\sim C $' },
            { id: 3, label: '$ (\\sim B \\cdot \\sim C) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.10',
          prompt: "You aren't both charitable and frightened",
          options: [
            { id: 0, label: '$ (\\sim C \\cdot F) $' },
            { id: 1, label: '$ \\sim C \\cdot F $' },
            { id: 2, label: '$ (\\sim C \\cdot \\sim F) $' },
            { id: 3, label: '$ \\sim(C \\cdot F) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.11',
          prompt: "If you're bright then you're cheerful, or you're powerful",
          options: [
            { id: 0, label: '$ (B \\rightarrow (C \\vee P)) $' },
            { id: 1, label: '$ ((B \\rightarrow C) \\vee P) $' },
            { id: 2, label: '$ B \\rightarrow C \\vee P $' },
            { id: 3, label: '$ (B \\rightarrow C) \\vee P $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.12',
          prompt: 'Either both W and C or D',
          options: [
            { id: 0, label: '$ ((W \\cdot C) \\vee D) $' },
            { id: 1, label: '$ (W \\cdot (C \\vee D)) $' },
            { id: 2, label: '$ (W \\cdot C) \\vee D $' },
            { id: 3, label: '$ W \\cdot C \\cdot D $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.13',
          prompt: "If you're strong, then you're famous or courageous",
          options: [
            { id: 0, label: '$ S \\rightarrow F \\vee C $' },
            { id: 1, label: '$ ((S \\rightarrow F) \\vee C) $' },
            { id: 2, label: '$ (S \\rightarrow (F \\vee C)) $' },
            { id: 3, label: '$ (S \\rightarrow F) \\vee C $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.14',
          prompt: 'Not if C then F',
          options: [
            { id: 0, label: '$ (\\sim C \\rightarrow F) $' },
            { id: 1, label: '$ (\\sim C \\rightarrow \\sim F) $' },
            { id: 2, label: '$ \\sim(C \\rightarrow F) $' },
            { id: 3, label: '$ \\sim C \\rightarrow F $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.15',
          prompt: "If you're short then you're greedy, or you're hideous",
          options: [
            { id: 0, label: '$ S \\rightarrow G \\vee H $' },
            { id: 1, label: '$ (S \\rightarrow G) \\vee H $' },
            { id: 2, label: '$ (S \\rightarrow (G \\vee H)) $' },
            { id: 3, label: '$ ((S \\rightarrow G) \\vee H) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.16',
          prompt: "If you aren't poor then you aren't beautiful",
          options: [
            { id: 0, label: '$ \\sim(P \\rightarrow \\sim B) $' },
            { id: 1, label: '$ \\sim P \\rightarrow \\sim B $' },
            { id: 2, label: '$ (\\sim P \\rightarrow \\sim B) $' },
            { id: 3, label: '$ (\\sim P \\vee B) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.17',
          prompt: 'Either not B or L',
          options: [
            { id: 0, label: '$ (\\sim B \\vee \\sim L) $' },
            { id: 1, label: '$ \\sim B \\vee L $' },
            { id: 2, label: '$ \\sim(B \\vee L) $' },
            { id: 3, label: '$ (\\sim B \\vee L) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.18',
          prompt: 'If S, then H and L',
          options: [
            { id: 0, label: '$ (S \\rightarrow (H \\cdot L)) $' },
            { id: 1, label: '$ S \\rightarrow H \\cdot L $' },
            { id: 2, label: '$ ((S \\rightarrow H) \\cdot L) $' },
            { id: 3, label: '$ (S \\rightarrow H) \\cdot L $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.19',
          prompt: "You're tall and naive, or else dangerous",
          options: [
            { id: 0, label: '$ ((T \\vee N) \\vee D) $' },
            { id: 1, label: '$ T \\cdot N \\vee D $' },
            { id: 2, label: '$ (T \\cdot N) \\vee D $' },
            { id: 3, label: '$ (T \\cdot (N \\vee D)) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.20',
          prompt: 'W, and D or S',
          options: [
            { id: 0, label: '$ ((W \\cdot D) \\vee S) $' },
            { id: 1, label: '$ (W \\cdot (D \\vee S)) $' },
            { id: 2, label: '$ (W \\cdot D) \\vee S $' },
            { id: 3, label: '$ W \\cdot D \\vee S $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.21',
          prompt: 'Either not M or B',
          options: [
            { id: 0, label: '$ (\\sim M \\vee \\sim B) $' },
            { id: 1, label: '$ (\\sim M \\vee B) $' },
            { id: 2, label: '$ \\sim(M \\vee B) $' },
            { id: 3, label: '$ \\sim M \\vee B $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.22',
          prompt: 'Either not B or not C',
          options: [
            { id: 0, label: '$ (\\sim B \\vee C) $' },
            { id: 1, label: '$ \\sim(B \\vee \\sim C) $' },
            { id: 2, label: '$ (\\sim B \\vee \\sim C) $' },
            { id: 3, label: '$ \\sim B \\vee \\sim C $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.23',
          prompt: 'If R then P, and C',
          options: [
            { id: 0, label: '$ ((R \\rightarrow P) \\cdot C) $' },
            { id: 1, label: '$ R \\rightarrow P \\cdot C $' },
            { id: 2, label: '$ (R \\rightarrow (P \\cdot C)) $' },
            { id: 3, label: '$ (R \\rightarrow P) \\cdot C $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.24',
          prompt: 'Not both R and C',
          options: [
            { id: 0, label: '$ \\sim R \\cdot C $' },
            { id: 1, label: '$ (\\sim R \\cdot \\sim C) $' },
            { id: 2, label: '$ \\sim(R \\cdot C) $' },
            { id: 3, label: '$ (\\sim R \\cdot C) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.25',
          prompt: 'Either not C or N',
          options: [
            { id: 0, label: '$ \\sim C \\vee N $' },
            { id: 1, label: '$ \\sim(C \\vee N) $' },
            { id: 2, label: '$ (\\sim C \\vee \\sim N) $' },
            { id: 3, label: '$ (\\sim C \\vee N) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.26',
          prompt: 'If not C then H',
          options: [
            { id: 0, label: '$ \\sim C \\rightarrow H $' },
            { id: 1, label: '$ (\\sim C \\rightarrow H) $' },
            { id: 2, label: '$ (\\sim C \\rightarrow \\sim H) $' },
            { id: 3, label: '$ \\sim(C \\rightarrow H) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.27',
          prompt: 'Not either not W or C',
          options: [
            { id: 0, label: '$ \\sim\\sim W \\vee C $' },
            { id: 1, label: '$ W \\vee C $' },
            { id: 2, label: '$ (W \\vee C) $' },
            { id: 3, label: '$ \\sim(\\sim W \\vee C) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.28',
          prompt: 'Both not M and L',
          options: [
            { id: 0, label: '$ (\\sim M \\cdot L) $' },
            { id: 1, label: '$ (\\sim M \\cdot \\sim L) $' },
            { id: 2, label: '$ \\sim(M \\cdot L) $' },
            { id: 3, label: '$ \\sim M \\cdot L $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.29',
          prompt: "You're both not miserable and not comical",
          options: [
            { id: 0, label: '$ (\\sim M \\cdot C) $' },
            { id: 1, label: '$ \\sim M \\cdot \\sim C $' },
            { id: 2, label: '$ (\\sim M \\cdot \\sim C) $' },
            { id: 3, label: '$ \\sim(M \\cdot \\sim C) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.30',
          prompt: 'Either both R and L or N',
          options: [
            { id: 0, label: '$ (R \\cdot (L \\vee N)) $' },
            { id: 1, label: '$ (R \\cdot L) \\vee N $' },
            { id: 2, label: '$ R \\cdot L \\vee N $' },
            { id: 3, label: '$ ((R \\cdot L) \\vee N) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.31',
          prompt: "If you're bright, then you're polite or demented",
          options: [
            { id: 0, label: '$ (B \\rightarrow P) \\vee D $' },
            { id: 1, label: '$ B \\rightarrow P \\vee D $' },
            { id: 2, label: '$ ((B \\rightarrow P) \\vee D) $' },
            { id: 3, label: '$ (B \\rightarrow (P \\vee D)) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.32',
          prompt: "If you're smart, then you're bashful and careful",
          options: [
            { id: 0, label: '$ (S \\rightarrow (B \\cdot C)) $' },
            { id: 1, label: '$ ((S \\rightarrow B) \\cdot C) $' },
            { id: 2, label: '$ (S \\rightarrow B) \\cdot C $' },
            { id: 3, label: '$ S \\rightarrow B \\cdot C $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.33',
          prompt: "You're cheap and frivolous, or else generous",
          options: [
            { id: 0, label: '$ ((C \\cdot F) \\vee G) $' },
            { id: 1, label: '$ C \\cdot F \\vee G $' },
            { id: 2, label: '$ (C \\cdot (F \\vee G)) $' },
            { id: 3, label: '$ (C \\cdot F) \\vee G $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.34',
          prompt: "You're either both wild and gentle or else cheerful",
          options: [
            { id: 0, label: '$ W \\cdot G \\vee C $' },
            { id: 1, label: '$ (W \\cdot (G \\vee C)) $' },
            { id: 2, label: '$ (W \\cdot G) \\vee C $' },
            { id: 3, label: '$ ((W \\cdot G) \\vee C) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.35',
          prompt: "You aren't either dull or boastful",
          options: [
            { id: 0, label: '$ (\\sim D \\vee \\sim B) $' },
            { id: 1, label: '$ (\\sim D \\vee B) $' },
            { id: 2, label: '$ \\sim D \\vee B $' },
            { id: 3, label: '$ \\sim(D \\vee B) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.36',
          prompt: "You aren't both not creative and notorious",
          options: [
            { id: 0, label: '$ \\sim(\\sim C \\cdot N) $' },
            { id: 1, label: '$ (C \\cdot N) $' },
            { id: 2, label: '$ \\sim\\sim C \\cdot N $' },
            { id: 3, label: '$ C \\cdot N $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.37',
          prompt: 'Not if not B then C',
          options: [
            { id: 0, label: '$ \\sim\\sim B \\rightarrow C $' },
            { id: 1, label: '$ B \\rightarrow C $' },
            { id: 2, label: '$ \\sim(\\sim B \\rightarrow C) $' },
            { id: 3, label: '$ (B \\rightarrow C) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.38',
          prompt: "You're both bright and either forgetful or confident",
          options: [
            { id: 0, label: '$ ((B \\cdot F) \\vee C) $' },
            { id: 1, label: '$ (B \\cdot F) \\vee C $' },
            { id: 2, label: '$ B \\cdot F \\vee C $' },
            { id: 3, label: '$ (B \\cdot (F \\vee C)) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.39',
          prompt: 'Not either W or C',
          options: [
            { id: 0, label: '$ (\\sim W \\vee \\sim C) $' },
            { id: 1, label: '$ \\sim W \\vee C $' },
            { id: 2, label: '$ (\\sim W \\vee C) $' },
            { id: 3, label: '$ \\sim(W \\vee C) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.40',
          prompt: "You're tall, and mediocre or colorful",
          options: [
            { id: 0, label: '$ (T \\cdot M) \\vee C $' },
            { id: 1, label: '$ (T \\cdot (M \\vee C)) $' },
            { id: 2, label: '$ ((T \\cdot M) \\vee C) $' },
            { id: 3, label: '$ T \\cdot M \\vee C $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.41',
          prompt: 'If D then M, and L',
          options: [
            { id: 0, label: '$ D \\rightarrow M \\cdot L $' },
            { id: 1, label: '$ (D \\rightarrow M) \\cdot L $' },
            { id: 2, label: '$ (D \\rightarrow (M \\cdot L)) $' },
            { id: 3, label: '$ ((D \\rightarrow M) \\cdot L) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.42',
          prompt: 'Not both L and N',
          options: [
            { id: 0, label: '$ (\\sim L \\cdot \\sim N) $' },
            { id: 1, label: '$ \\sim L \\cdot N $' },
            { id: 2, label: '$ \\sim(L \\cdot N) $' },
            { id: 3, label: '$ (\\sim L \\cdot N) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.43',
          prompt: 'Either not B or P',
          options: [
            { id: 0, label: '$ \\sim(B \\vee P) $' },
            { id: 1, label: '$ \\sim B \\vee P $' },
            { id: 2, label: '$ (\\sim B \\vee P) $' },
            { id: 3, label: '$ (\\sim B \\vee \\sim P) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.44',
          prompt: "You're both not sarcastic and not bashful",
          options: [
            { id: 0, label: '$ (\\sim S \\cdot B) $' },
            { id: 1, label: '$ (\\sim S \\cdot \\sim B) $' },
            { id: 2, label: '$ \\sim(S \\cdot \\sim B) $' },
            { id: 3, label: '$ \\sim S \\cdot \\sim B $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.45',
          prompt: 'If C then S, and B',
          options: [
            { id: 0, label: '$ (C \\rightarrow S) \\cdot B $' },
            { id: 1, label: '$ (C \\rightarrow (S \\cdot B)) $' },
            { id: 2, label: '$ C \\rightarrow S \\cdot B $' },
            { id: 3, label: '$ ((C \\rightarrow S) \\cdot B) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.46',
          prompt: "If you're strong then you're talented, or you're cautious",
          options: [
            { id: 0, label: '$ (S \\rightarrow T) \\vee C $' },
            { id: 1, label: '$ (S \\rightarrow (T \\vee C)) $' },
            { id: 2, label: '$ S \\rightarrow T \\vee C $' },
            { id: 3, label: '$ ((S \\rightarrow T) \\vee C) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.47',
          prompt: "If you aren't tall then you aren't frightened",
          options: [
            { id: 0, label: '$ (\\sim T \\rightarrow \\sim F) $' },
            { id: 1, label: '$ \\sim(T \\rightarrow \\sim F) $' },
            { id: 2, label: '$ \\sim T \\rightarrow \\sim F $' },
            { id: 3, label: '$ (\\sim T \\rightarrow F) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.48',
          prompt: 'Both not P and not B',
          options: [
            { id: 0, label: '$ \\sim P \\cdot \\sim B $' },
            { id: 1, label: '$ \\sim(P \\cdot \\sim B) $' },
            { id: 2, label: '$ (\\sim P \\cdot \\sim B) $' },
            { id: 3, label: '$ (\\sim P \\cdot B) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.49',
          prompt: 'If P, then C or D',
          options: [
            { id: 0, label: '$ (P \\rightarrow (C \\vee D)) $' },
            { id: 1, label: '$ ((P \\rightarrow C) \\vee D) $' },
            { id: 2, label: '$ P \\rightarrow C \\vee D $' },
            { id: 3, label: '$ (P \\rightarrow C) \\vee D $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.50',
          prompt: 'Both not C and F',
          options: [
            { id: 0, label: '$ \\sim C \\cdot F $' },
            { id: 1, label: '$ (\\sim C \\cdot \\sim F) $' },
            { id: 2, label: '$ \\sim(C \\cdot F) $' },
            { id: 3, label: '$ (\\sim C \\cdot F) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.51',
          prompt: "If you aren't tough then you're greedy",
          options: [
            { id: 0, label: '$ (\\sim T \\rightarrow G) $' },
            { id: 1, label: '$ \\sim T \\rightarrow G $' },
            { id: 2, label: '$ (\\sim T \\rightarrow \\sim G) $' },
            { id: 3, label: '$ \\sim(T \\rightarrow G) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.52',
          prompt: "If you're weak and hideous, then you're candid",
          options: [
            { id: 0, label: '$ W \\cdot H \\rightarrow C $' },
            { id: 1, label: '$ (W \\cdot (H \\rightarrow C)) $' },
            { id: 2, label: '$ ((W \\cdot H) \\rightarrow C) $' },
            { id: 3, label: '$ (W \\cdot H) \\rightarrow C $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.53',
          prompt: "You aren't both not fortunate and loveable",
          options: [
            { id: 0, label: '$ F \\cdot L $' },
            { id: 1, label: '$ (F \\cdot L) $' },
            { id: 2, label: '$ \\sim(\\sim F \\cdot L) $' },
            { id: 3, label: '$ \\sim\\sim F \\cdot L $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.54',
          prompt: "You're cruel and lonely, or else humorous",
          options: [
            { id: 0, label: '$ ((C \\cdot L) \\vee H) $' },
            { id: 1, label: '$ (C \\cdot L) \\vee H $' },
            { id: 2, label: '$ C \\cdot L \\vee H $' },
            { id: 3, label: '$ (C \\cdot (L \\vee H)) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.55',
          prompt: 'If P, then D and N',
          options: [
            { id: 0, label: '$ P \\rightarrow D \\cdot N $' },
            { id: 1, label: '$ ((P \\rightarrow D) \\cdot N) $' },
            { id: 2, label: '$ (P \\rightarrow D) \\cdot N $' },
            { id: 3, label: '$ (P \\rightarrow (D \\cdot N)) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.56',
          prompt: 'Not if R then C',
          options: [
            { id: 0, label: '$ (\\sim R \\rightarrow \\sim C) $' },
            { id: 1, label: '$ \\sim R \\rightarrow C $' },
            { id: 2, label: '$ \\sim(R \\rightarrow C) $' },
            { id: 3, label: '$ (\\sim R \\rightarrow C) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.57',
          prompt: "It is false that if you aren't bright then you're careful",
          options: [
            { id: 0, label: '$ B \\rightarrow C $' },
            { id: 1, label: '$ \\sim(\\sim B \\rightarrow C) $' },
            { id: 2, label: '$ (B \\rightarrow C) $' },
            { id: 3, label: '$ \\sim\\sim B \\rightarrow C $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.58',
          prompt: "You're either tough and cautious or else frivolous",
          options: [
            { id: 0, label: '$ (T \\cdot C) \\vee F $' },
            { id: 1, label: '$ (T \\cdot (C \\vee F)) $' },
            { id: 2, label: '$ T \\cdot C \\vee F $' },
            { id: 3, label: '$ ((T \\cdot C) \\vee F) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.59',
          prompt: "You're both weak and either charming or prosperous",
          options: [
            { id: 0, label: '$ (W \\cdot (C \\vee P)) $' },
            { id: 1, label: '$ (W \\cdot C) \\vee P $' },
            { id: 2, label: '$ W \\cdot C \\vee P $' },
            { id: 3, label: '$ ((W \\cdot C) \\vee P) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.60',
          prompt: "If you're tall then you're realistic, and you're boastful",
          options: [
            { id: 0, label: '$ T \\rightarrow R \\cdot B $' },
            { id: 1, label: '$ (T \\rightarrow (R \\cdot B)) $' },
            { id: 2, label: '$ (T \\rightarrow R) \\cdot B $' },
            { id: 3, label: '$ ((T \\rightarrow R) \\cdot B) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.61',
          prompt: "If you're clean then you're powerful, or you're lively",
          options: [
            { id: 0, label: '$ ((C \\rightarrow P) \\vee L) $' },
            { id: 1, label: '$ C \\rightarrow P \\vee L $' },
            { id: 2, label: '$ (C \\rightarrow P) \\vee L $' },
            { id: 3, label: '$ (C \\rightarrow (P \\vee L)) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.62',
          prompt: "You're short, and creative or dishonest",
          options: [
            { id: 0, label: '$ (S \\cdot C) \\vee D $' },
            { id: 1, label: '$ (S \\cdot (C \\vee D)) $' },
            { id: 2, label: '$ S \\cdot C \\vee D $' },
            { id: 3, label: '$ ((S \\cdot C) \\vee D) $' },
          ],
          correctId: [1],
          answer: '',
        },
      ],
    },
    {
      name: 'Set Ce',
      logicType: 'Propositional Translations',
      slugs: ['propositional', 'translations', 'hard'],
      isNew: true,
      id: 6,
      title: 'Propositional Translations: Hard',
      header: 'Translates into logic as:',
      questions: [
        {
          id: '6.1',
          prompt: 'Only if S, B',
          options: [
            { id: 0, label: '$ (B \\supset S) $' },
            { id: 1, label: '$ (S \\equiv B) $' },
            { id: 2, label: '$ (S \\supset B) $' },
            { id: 3, label: '$ S \\supset B $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.2',
          prompt: 'S is necessary and sufficient for C',
          options: [
            { id: 0, label: '$ S \\equiv C $' },
            { id: 1, label: '$ (C \\supset S) $' },
            { id: 2, label: '$ (S \\equiv C) $' },
            { id: 3, label: '$ (S \\supset B) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.3',
          prompt: 'S is sufficient for G',
          options: [
            { id: 0, label: '$ (\\sim S \\supset \\, \\sim G) $' },
            { id: 1, label: '$ (S \\equiv G) $' },
            { id: 2, label: '$ (S \\supset G) $' },
            { id: 3, label: '$ S \\supset G $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.4',
          prompt: 'B just if G',
          options: [
            { id: 0, label: '$ (G \\supset B) $' },
            { id: 1, label: '$ (B \\equiv G) $' },
            { id: 2, label: '$ B \\equiv G $' },
            { id: 3, label: '$ (B \\supset G) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.5',
          prompt: 'Not both C and P',
          options: [
            { id: 0, label: '$ (\\sim C \\cdot \\sim P) $' },
            { id: 1, label: '$ \\sim C \\cdot P $' },
            { id: 2, label: '$ \\sim(C \\cdot P) $' },
            { id: 3, label: '$ (\\sim C \\cdot P) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.6',
          prompt: 'D is necessary and sufficient for C',
          options: [
            { id: 0, label: '$ (C \\supset D) $' },
            { id: 1, label: '$ (D \\equiv C) $' },
            { id: 2, label: '$ (D \\supset C) $' },
            { id: 3, label: '$ D \\equiv C $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.7',
          prompt: 'Being wild is sufficient for you to be childish',
          options: [
            { id: 0, label: '$ (W \\supset C) $' },
            { id: 1, label: '$ W \\supset C $' },
            { id: 2, label: '$ (W \\equiv C) $' },
            { id: 3, label: '$ (\\sim W \\supset \\, \\sim C) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.8',
          prompt: "You're short just if you're bitter",
          options: [
            { id: 0, label: '$ S \\equiv B $' },
            { id: 1, label: '$ (S \\supset B) $' },
            { id: 2, label: '$ (S \\equiv B) $' },
            { id: 3, label: '$ (B \\supset S) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.9',
          prompt: 'Not both H and F',
          options: [
            { id: 0, label: '$ \\sim H \\cdot F $' },
            { id: 1, label: '$ (\\sim H \\cdot \\, \\sim F) $' },
            { id: 2, label: '$ \\sim(H \\cdot F) $' },
            { id: 3, label: '$ (\\sim H \\cdot F) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.10',
          prompt: 'Both not C and B',
          options: [
            { id: 0, label: '$ \\sim(C \\cdot B) $' },
            { id: 1, label: '$ (\\sim C \\cdot \\, \\sim B) $' },
            { id: 2, label: '$ \\sim C \\cdot B $' },
            { id: 3, label: '$ (\\sim C \\cdot B) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.11',
          prompt: 'Being slow is sufficient for you to be frantic',
          options: [
            { id: 0, label: '$ S \\supset F $' },
            { id: 1, label: '$ (S \\equiv F) $' },
            { id: 2, label: '$ (S \\supset F) B $' },
            { id: 3, label: '$ (\\sim S \\supset \\, \\sim F) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.12',
          prompt: 'S just if M',
          options: [
            { id: 0, label: '$ (S \\equiv M) $' },
            { id: 1, label: '$ S \\equiv M $' },
            { id: 2, label: '$ (M \\supset S) $' },
            { id: 3, label: '$ (S \\supset M) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.13',
          prompt: 'Not both L and D',
          options: [
            { id: 0, label: '$ \\sim (L \\cdot D) $' },
            { id: 1, label: '$ \\sim L \\cdot D $' },
            { id: 2, label: '$ (\\sim L \\cdot \\, \\sim D) $' },
            { id: 3, label: '$ (\\sim L \\cdot D) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.14',
          prompt: 'Both not N and P',
          options: [
            { id: 0, label: '$ (\\sim N \\cdot P) $' },
            { id: 1, label: '$ \\sim N \\cdot P $' },
            { id: 2, label: '$ (\\sim N \\cdot \\, \\sim P) $' },
            { id: 3, label: '$ \\sim (N \\cdot P) $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.15',
          prompt: 'Being wild is sufficient for you to be dangerous',
          options: [
            { id: 0, label: '$ (W \\equiv D) $' },
            { id: 1, label: '$ (\\sim W \\supset \\, \\sim D) $' },
            { id: 2, label: '$ (W \\supset D) $' },
            { id: 3, label: '$ W \\supset D $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.16',
          prompt: "You're curious unless you're mean",
          options: [
            { id: 0, label: '$ (C \\supset \\, \\sim M) $' },
            { id: 1, label: '$ (C \\vee M) $' },
            { id: 2, label: '$ C \\equiv M $' },
            { id: 3, label: '$ (C \\equiv M) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.17',
          prompt: 'Not both S and C',
          options: [
            { id: 0, label: '$ \\sim (S \\cdot C) $' },
            { id: 1, label: '$ (\\sim S \\cdot C) $' },
            { id: 2, label: '$ (\\sim S \\cdot \\, \\sim C) $' },
            { id: 3, label: '$ \\sim S \\cdot C $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.18',
          prompt: "You're rough if you're scholarly",
          options: [
            { id: 0, label: '$ (R \\equiv S) $' },
            { id: 1, label: '$ (S \\supset R) $' },
            { id: 2, label: '$ R \\supset S $' },
            { id: 3, label: '$ (R \\supset S) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.19',
          prompt: 'B is sufficient for G',
          options: [
            { id: 0, label: '$ B \\supset G $' },
            { id: 1, label: '$ (B \\equiv G) $' },
            { id: 2, label: '$ (B \\supset G) $' },
            { id: 3, label: '$ (\\sim B \\supset \\, \\sim G) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.20',
          prompt: "You're frightened unless you're slow",
          options: [
            { id: 0, label: '$ (F \\equiv S) $' },
            { id: 1, label: '$ (F \\supset \\, \\sim S) $' },
            { id: 2, label: '$ F \\equiv S $' },
            { id: 3, label: '$ (F \\vee S) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.21',
          prompt: 'T only if C',
          options: [
            { id: 0, label: '$ (T \\equiv C) $' },
            { id: 1, label: '$ (T \\supset C) $' },
            { id: 2, label: '$ T \\supset C $' },
            { id: 3, label: '$ (C \\supset T) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.22',
          prompt: 'D if C',
          options: [
            { id: 0, label: '$ (D \\supset C) $' },
            { id: 1, label: '$ D \\supset C $' },
            { id: 2, label: '$ (D \\equiv C) $' },
            { id: 3, label: '$ (C \\supset D) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.23',
          prompt: 'M is sufficient for F',
          options: [
            { id: 0, label: '$ M \\supset F $' },
            { id: 1, label: '$ (M \\supset F) $' },
            { id: 2, label: '$ (M \\equiv F) $' },
            { id: 3, label: '$ (\\sim M \\supset \\, \\sim F) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.24',
          prompt: 'G iff F',
          options: [
            { id: 0, label: '$ (F \\supset G) $' },
            { id: 1, label: '$ (G \\supset F) $' },
            { id: 2, label: '$ G \\equiv F $' },
            { id: 3, label: '$ (G \\equiv F) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.25',
          prompt: "You're rough only if you're selfish",
          options: [
            { id: 0, label: '$ (R \\equiv S) $' },
            { id: 1, label: '$ R \\supset S $' },
            { id: 2, label: '$ (R \\supset S) $' },
            { id: 3, label: '$ (S \\supset R) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.26',
          prompt: "You're bright if you're mediocre",
          options: [
            { id: 0, label: '$ (M \\supset B) $' },
            { id: 1, label: '$ (B \\equiv M) $' },
            { id: 2, label: '$ (B \\supset M) $' },
            { id: 3, label: '$ B \\supset M $' },
          ],
          correctId: [0],
          answer: '',
        },
        {
          id: '6.27',
          prompt: 'T is necessary for C',
          options: [
            { id: 0, label: '$ (T \\equiv C) $' },
            { id: 1, label: '$ (T \\supset C) $' },
            { id: 2, label: '$ T \\supset C $' },
            { id: 3, label: '$ (\\sim T \\supset \\, \\sim C) $' },
          ],
          correctId: [3],
          answer: '',
        },
        {
          id: '6.28',
          prompt: "You're polite iff you're nervous",
          options: [
            { id: 0, label: '$ P \\equiv N $' },
            { id: 1, label: '$ (P \\equiv N) $' },
            { id: 2, label: '$ (P \\supset N ) $' },
            { id: 3, label: '$ (N \\supset P) $' },
          ],
          correctId: [1],
          answer: '',
        },
        {
          id: '6.29',
          prompt: 'C only if D',
          options: [
            { id: 0, label: '$ C \\supset D $' },
            { id: 1, label: '$ (D \\supset C) $' },
            { id: 2, label: '$ (C \\supset D) $' },
            { id: 3, label: '$ (C \\equiv D) $' },
          ],
          correctId: [2],
          answer: '',
        },
        {
          id: '6.30',
          prompt: "You're cruel if you're terrified",
          options: [
            { id: 0, label: '$ (T \\supset C) $' },
            { id: 1, label: '$ (C \\equiv T) $' },
            { id: 2, label: '$ C \\supset T $' },
            { id: 3, label: '$ (C \\supset T) $' },
          ],
          correctId: [0],
          answer: '',
        },
      ],
    },
  ],
};

export { setC };
