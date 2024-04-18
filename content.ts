type Content = {
  chapters: {
    [key: string]: Chapter;
  };
};

type Chapter = {
  title: string;
  index: number;
  subChapters: {
    [key: string]: SubChapter;
  };
};

type SubChapter = {
  title: string;
  index: number;
  exercises: Exercise[];
};

type Exercise = {
  prompt: string;
  options: string[];
  correctIndices: number[];
  answer: string;
};

export const content: Content = {
  chapters: {
    definitions: {
      title: 'Definitions',
      index: 3,
      subChapters: {
        definitions: {
          title: 'Definitions',
          index: 0,
          exercises: [
            {
              prompt: 'Science is that cold and empty worship of experiments.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [3, 5],
              answer: 'This violates 4 and 6',
            },
            {
              prompt: 'A tent is a movable dwelling made of canvas.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1],
              answer: 'This violates 2 (tents might be made of nylon)',
            },
            {
              prompt: 'Philosophy is the study of the human condition.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0],
              answer: 'This violates 1.',
            },
            {
              prompt:
                'Logic is that dreadful discipline that analyses reasoning.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [5],
              answer: 'This violates 6.',
            },
            {
              prompt: 'An old person is anyone over seventy.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [4],
              answer: 'This violates 5.',
            },
            {
              prompt:
                'A game is an amusing competition between various players.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1],
              answer:
                'This violates 2 (solitary and many computer games can involve only a single player).',
            },
            {
              prompt: 'A logician is an obnoxious hair-splitter.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [5],
              answer: 'This violates 6.',
            },
            {
              prompt: 'A fish is an animal that lives mainly in the water.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0],
              answer: 'This violates 1 (whales are not fish).',
            },
            {
              prompt: 'A male is whatever has male reproductive organs.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1, 2],
              answer: 'This violates 3 (and 2, if we consider castration).',
            },
            {
              prompt: 'A police officer is a mere cop.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [5],
              answer: 'This violates 6.',
            },
            {
              prompt: '"Uncle" means "brother of a parent".',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1],
              answer:
                'This violates 2 (an only child can be an uncle by being married to a sister of a parent).',
            },
            {
              prompt: 'Knowledge is a true belief that is absolutely certain.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1],
              answer:
                'This violates 2 (most knowledge is not absolutely certain).',
            },
            {
              prompt:
                'A bachelor is an unmarried man who weighs over 50 pounds.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [6],
              answer: 'This violates 7.',
            },
            {
              prompt: 'Triangles are what you study in geometry.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0],
              answer: 'This violates 1 (you study other things too).',
            },
            {
              prompt: 'Architecture is frozen music.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [3],
              answer: 'This violates 4.',
            },
            {
              prompt: 'An apple is a red fruit.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1],
              answer:
                'This violates 1 (consider strawberries) and 2 (consider green apples).',
            },
            {
              prompt: 'A warm day is one that is over 86 degrees Fahrenheit.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [4],
              answer: 'This violates 5.',
            },
            {
              prompt:
                'Religion is a way of life based on belief in a supreme being.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1],
              answer: 'This violates 2 (some religions believe in many gods).',
            },
            {
              prompt: 'A university instructor is just an egghead.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [5],
              answer: 'This violates 6.',
            },
            {
              prompt: '"True" means "proved to be true".',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1, 2],
              answer: 'This violates 2 and especially 3.',
            },
            {
              prompt: 'A chair is whatever is used as a chair.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [2],
              answer: 'This violates 3.',
            },
            {
              prompt: 'A teacher is one who instructs children.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1],
              answer: 'This violates 2.',
            },
            {
              prompt: 'A net is anything with interstitial vaculties.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [3],
              answer: 'This violates 4.',
            },
            {
              prompt: 'Cars are vehicles powered by gasoline.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1],
              answer:
                'This violates 1 (consider motorcycles) and 2 (some cars run on hydrogen, electricity, or ethanol).',
            },
            {
              prompt: 'Bread is the staff (stuff?) of life.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [3],
              answer: 'This violates 4.',
            },
            {
              prompt: '"God" means "object of ultimate concern".',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1],
              answer:
                'This violates 1 and 2 (one might have an ultimate concern for something other than God).',
            },
            {
              prompt:
                'A piano is any musical instrument with keys to select notes.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0],
              answer: 'This violates 1 (consider pipe organs).',
            },
            {
              prompt:
                'A pro football player is someone who works for a pro football team.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0],
              answer: 'This violates 1 (coaches also work for such teams).',
            },
            {
              prompt: 'A man is a featherless biped.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1, 6],
              answer:
                'This violates 7 (and maybe 1 and 2 — if you consider plucked chickens and humans with one leg).',
            },
            {
              prompt: 'Punishment is anything unpleasant done to a person.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0],
              answer:
                'This violates 1 (dentists drilling your teeth are not punishing you).',
            },
            {
              prompt: 'A king is the ruler of a country.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0],
              answer: 'This violates 1 (consider presidents and dictators).',
            },
            {
              prompt:
                'Backpacking is the enduring of misery by living out of doors.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1, 5],
              answer: 'This violates 1, 2 and 6.',
            },
            {
              prompt: 'Knowledge is true belief.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0],
              answer: 'This violates 1 (a true belief might be a lucky guess).',
            },
            {
              prompt:
                'A belief is the closing of a phase of an intellectual symphony.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [3],
              answer: 'This violates 4.',
            },
            {
              prompt: 'A politician is a scoundrel involved in politics.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1, 5],
              answer: 'This violates 2 (some are honest) and 6.',
            },
            {
              prompt:
                'Philosophy is the attempt to transcend cognitive subjectivity.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [3],
              answer: 'This violates 4.',
            },
            {
              prompt: 'A doctor is a man who is licensed to practice medicine.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1],
              answer: 'This violates 2 (many doctors are women).',
            },
            {
              prompt:
                '"Human being" means "whatever is descended from human beings".',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [2],
              answer: 'This violates 3.',
            },
            {
              prompt:
                'A computer is a box made by Dell that has a keyboard and a screen.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1, 6],
              answer:
                'This violates 2 and 7 — many other companies make computers.',
            },
            {
              prompt: 'A lie is a falsehood that you assert to be true.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0],
              answer:
                'This violates 1 (if you do not know that it is false, it is just a mistake and not a lie).',
            },
            {
              prompt:
                'Philosophy is the discipline developed by Aristotle and Plato.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [6],
              answer: 'This violates 7.',
            },
            {
              prompt: 'An adolescent is a person between 9 and 19 years-old.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [4],
              answer: 'This violates 5.',
            },
            {
              prompt: 'An adult is anyone over 17.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [4],
              answer: 'This violates 5.',
            },
            {
              prompt: 'Philosophy is what you study in philosophy classes.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [2],
              answer: 'This violates 3.',
            },
            {
              prompt: 'A cold day is one that is under 20 degrees Fahrenheit.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [4],
              answer: 'This violates 5.',
            },
            {
              prompt: "An honest person is one who doesn't steal.",
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1],
              answer: "This violates 2 (consider liars who don't steal).",
            },
            {
              prompt: '"Murder" means "killing of a human being."',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0],
              answer: 'This violates 1 (consider accidental killing).',
            },
            {
              prompt: 'A liberal is a permissive do-gooder who knows nothing.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1, 5],
              answer: 'This violates 1, 2 and especially 6.',
            },
            {
              prompt:
                'Logic is that wonderful discipline that analyses reasoning.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [5],
              answer: 'This violates 6.',
            },
            {
              prompt: '"Chair" means "what you sit on."',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1],
              answer:
                'This violates 1 (we sit on other things) and perhaps 2 (if there are decorative chairs that no one sits on).',
            },
            {
              prompt:
                'A conservative is an inflexible person who never thinks.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1, 5],
              answer: 'This violates 1, 2 and especially 6.',
            },
            {
              prompt: 'A wrong action is one that is against the law.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1],
              answer: 'This violates 1 and 2.',
            },
            {
              prompt: 'A child is anyone between 2 and 12 years old.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [4],
              answer: 'This violates 5.',
            },
            {
              prompt:
                'A football game is whatever is played by the rules of football.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [2],
              answer: 'This violates 3.',
            },
            {
              prompt: 'A kitten is a young female cat.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [1],
              answer: 'This violates 2 (kittens can be male).',
            },
            {
              prompt:
                'Logic is defined as that subject that is treated by LogiCola.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [6],
              answer: 'This violates 7.',
            },
            {
              prompt:
                'Knowledge is the cognizance of a reality by an intellect.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [3],
              answer: 'This violates 4.',
            },
            {
              prompt: 'A bird is an animal that can fly.',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1],
              answer:
                'This violates 1 (consider ostriches) and 2 (consider bats).',
            },
            {
              prompt: '"Metaphysics" means "any sleep-inducing subject".',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [0, 1, 5],
              answer: 'This violates 1, 2 and 6.',
            },
            {
              prompt: '"Tall person" means "person over 6 feet tall."',
              options: [
                'Too broad',
                'Too narrow',
                'Circular',
                'Uses poorly understood terms',
                'Poor match in vagueness',
                'Poor match in emotional tone',
                'Has non-essential properties',
              ],
              correctIndices: [4],
              answer: 'This violates 5.',
            },
          ],
        },
      },
    },
    'easier-translations': {
      title: 'Easier Translations',
      index: 6.1,
      subChapters: {
        definitions: {
          title: 'Definitions',
          index: 0,
          exercises: [
            {
              prompt: 'Not both A and B',
              options: ['~(A V B)', '~(A · B)', '(~A · ~B)', '(~A V ~B)'],
              correctIndices: [1],
              answer: '',
            },
            {
              prompt: 'Both A and either B or C',
              options: [
                '(A · (B V C))',
                '(A V (B · C))',
                '~(A · (B V C))',
                '(A · B) V (A · C)',
              ],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'Either both A and B or C',
              options: [
                '(A · (B V C))',
                '~((A · B) V C)',
                '((A · B) V C)',
                '(A V B) · C',
              ],
              correctIndices: [2],
              answer: '',
            },
            {
              prompt: 'If A, then B or C',
              options: [
                '(A · (B V C))',
                '(A → (B V C))',
                '~(A → (B V C))',
                '(A V B) → C',
              ],
              correctIndices: [1],
              answer: '',
            },
            {
              prompt: 'If A then B, or C',
              options: [
                '(A → (B V C))',
                '~((A → B) V C)',
                '(A V B) → C',
                '(A → B) V C',
              ],
              correctIndices: [3],
              answer: '',
            },
            {
              prompt: 'If not A, then not either B or C',
              options: [
                '~A → ~(B V C)',
                '~(A → (B V C))',
                '~(~A → (~B V C))',
                '~A → (B V ~C)',
              ],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'If not A, then either not B or C',
              options: [
                '~A → (~B V C)',
                '(A → (B V C))',
                '~(~A → (~B V C))',
                '~A → (B V ~C)',
              ],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'Either A or B, and C',
              options: [
                '(A · (B V C))',
                '((A V B) · C)',
                '~((A V B) · C)',
                '(A V B) → C',
              ],
              correctIndices: [1],
              answer: '',
            },
            {
              prompt: 'Either A, or B and C',
              options: [
                '(A · (B V C))',
                '~(A V (B · C))',
                '(A V B) · C',
                '(A V (B · C))',
              ],
              correctIndices: [3],
              answer: '',
            },
            {
              prompt: 'If A then not both not B and not C',
              options: [
                '(A → ~(~B · ~C))',
                '(A · (B V C))',
                '~(A → ~(~B · ~C))',
                '(A → (B · C))',
              ],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt:
                'If you get an error message, then the disk is bad or it is a Macintosh disk.',
              options: [
                '(E · (B V M))',
                '~(E → (B V M))',
                'E → (B V M)',
                'E → (B · M)',
              ],
              correctIndices: [2],
              answer: '',
            },
            {
              prompt:
                'If I bring my digital camera, then if my batteries don’t die then I’ll take pictures of my backpack trip and put the pictures on my Web site',
              options: [
                '(C → (~B → (T · W)))',
                '(C · (B → (T V W)))',
                '(C → ((~B) V (T · W)))',
                '((C · B) → (T · W))',
              ],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt:
                'If you both don’t exercise and eat too much then you’ll gain weight',
              options: [
                '(((~X) · M) → G)',
                '((X V M) → G)',
                '((~X V M) → G)',
                '(((~X) · (~M)) → G)',
              ],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'The statue isn’t by either Cellini or Michelangelo',
              options: ['~(C V M)', '(~C · ~M)', '(C → ~M)', '(~C → M)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt:
                'If I don’t have either $2 in exact change or a bus pass I won’t ride the bus',
              options: [
                '~((E V P) → R)',
                '((~E · ~P) → ~R)',
                '(~(E V P) → ~R)',
                '((E V P) → ~R)',
              ],
              correctIndices: [2],
              answer: '',
            },
            {
              prompt:
                'If Michigan and Ohio State play each other then Michigan will win',
              options: [
                '((M · O) → W)',
                '(M → (O V W))',
                '(M V (O → W))',
                '(P → M)',
              ],
              correctIndices: [3],
              answer: '',
            },
            {
              prompt:
                'Either you went through both Dayton and Cinci, or you went through Louisville',
              options: [
                '((D · C) V L)',
                '(D → (C V L))',
                '((D V C) · L)',
                '(D · (C V L))',
              ],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt:
                'If she had hamburgers then she ate junk food, and she ate French fries',
              options: [
                '(H → (J · F))',
                '((H → J) · F)',
                '(H → (J V F))',
                '((H V J) → F)',
              ],
              correctIndices: [1],
              answer: '',
            },
            {
              prompt:
                'I’m going to Rome or Florence and you’re going to London',
              options: [
                '((R V F) · L)',
                '((R · F) V L)',
                '(R → (F · L))',
                '(R V (F · L))',
              ],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'Everyone is male or female',
              options: ['(M V F)', '(M → F)', '(M · F)', 'E'],
              correctIndices: [3],
              answer: '',
            },
          ],
        },
      },
    },
    'harder-translations': {
      title: 'Harder Translations',
      index: 6.8,
      subChapters: {
        definitions: {
          title: 'Definitions',
          index: 0,
          exercises: [
            {
              prompt: 'If she goes, then you’ll be alone but I’ll be here.',
              options: [
                '(S → (A · I))',
                '(~S → (A · I))',
                '(S → (~A · ~I))',
                '(S V (A · I))',
              ],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'Your car will start only if you have fuel.',
              options: ['(S → F)', '(~S → F)', '(S → ~F)', '(S V F)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'I will quit unless you give me a raise.',
              options: ['(Q V R)', '(~Q V R)', '(Q V ~R)', '(Q → R)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'Taking the final is a sufficient condition for passing.',
              options: ['(T → P)', '(~T → P)', '(T → ~P)', '(T V P)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'Taking the final is necessary for you to pass.',
              options: ['(~T → ~P)', '(T → ~P)', '(~T → P)', '(T V ~P)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'You’re a man just if you’re a rational animal.',
              options: ['(M ≡ R)', '(M → R)', '(~M ≡ R)', '(M V R)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'Unless you have faith, you’ll die.',
              options: ['(F V D)', '(~F V D)', '(F V ~D)', '(F → D)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'She neither asserted it nor hinted at it.',
              options: ['(~A · ~H)', '(A · ~H)', '(~A · H)', '(A V ~H)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt:
                'Getting at least 96 is a necessary and sufficient condition for getting an A.',
              options: ['(N ≡ A)', '(N → A)', '(~N ≡ A)', '(N V A)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'Only if you exercise are you fully alive.',
              options: ['(A → E)', '(~A → E)', '(A → ~E)', '(A V E)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'I’ll go, assuming that you go.',
              options: ['(Y → I)', '(~Y → I)', '(Y → ~I)', '(Y V I)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'Assuming that your belief is false, you don’t know.',
              options: ['(F → ~K)', '(~F → ~K)', '(F → K)', '(F V ~K)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt:
                'Having a true belief is a necessary condition for having knowledge.',
              options: ['(~T → ~K)', '(T → ~K)', '(~T → K)', '(T V ~K)'],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'You get mashed potatoes or French fries, but not both.',
              options: [
                '((M V F) · ~(M & F))',
                '(M → F)',
                '(~M V F)',
                '(M V ~F)',
              ],
              correctIndices: [0],
              answer: '',
            },
            {
              prompt: 'You’re wrong if you say that.',
              options: ['(S → W)', '(~S → W)', '(S → ~W)', '(S V W)'],
              correctIndices: [0],
              answer: '',
            },
          ],
        },
      },
    },
  },
};
