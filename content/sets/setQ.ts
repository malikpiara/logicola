import { Set } from '../types';

/**
 * UNITS, 2026-08-19 (Malik). Four exercises carried imperial units — 86°F,
 * 20°F, 6 feet, 50 pounds — and now carry metric with the imperial value in
 * parentheses. Dual rather than metric-only was the reviewed decision: the
 * threshold has to be felt by BOTH audiences, and neither is worse off.
 * Conversions are exact where the numbers allow (30°C = 86°F, 183 cm = 6 ft)
 * and rounded where they do not (20 kg ≈ 44 lb).
 *
 * Safe because the unit is pedagogically inert in all four: three test rule 5
 * (a precise threshold for a vague word) and one tests rule 7 (a non-essential
 * property), and every one of those flaws is structural. The answer never
 * depended on the number, only on the FORM of the definition, so any threshold
 * in any unit teaches the identical lesson.
 *
 * Worth changing because the flaw still has to be FELT. Rule 5 works only if
 * the reader senses that the stated threshold is arbitrary for the word being
 * defined, and PostHog GeoIP puts most of the drilling population in the
 * Philippines, Ontario, Kenya and Singapore — all metric — where 86°F carries
 * no temperature intuition at all. But Gensler's textbook market is US
 * universities, where Fahrenheit is the felt unit, and instructors assigning
 * the book are the channel that brings those students here. Both audiences
 * are real, which is why both units ship.
 */
const setQ: Set = {
  name: 'Set Q',
  slugs: ['informal', 'definitions'],
  logicType: 'Informal',
  id: 3,
  title: 'Meanings and Definitions',
  header: 'What is wrong with this definition?',
  subSets: [
    {
      name: 'Set Q',
      logicType: 'Informal',
      slugs: ['informal', 'definitions'],
      id: 3,
      title: 'Meanings and Definitions',
      header: 'What is wrong with this definition?',
      // Two-column grid + multi-select, matching Set R: a definition can
      // have more than one flaw, and the subset rule accepts any genuine
      // flaw(s) the user names. `answer` still references the badge
      // numbers, so options stay unshuffled.
      //
      // BOTH of these diverge from the 2008 program, which was one pick
      // from seven (`c:^1234567`) graded ONCE — no retry loop exists in
      // set_Q.txt. The divergence is deliberate (a definition really can
      // have several flaws), but it is why Q's scoring decay had to be
      // reconstructed rather than read off the original program: Gensler's penalty was
      // a once-per-item price, and charging it three times made this — the
      // one set needing no notation, and so the likeliest entry point for
      // a casual user — the harshest in the app. See SCORING_PROFILES.Q.
      optionLayout: 'grid',
      multiSelect: true,
      maxWrongGuesses: 3,
      description:
        'Spot what is wrong with a definition — too broad, too narrow, circular, or worse.',
      questions: [
        {
          id: '3.1',
          prompt: 'Science is that cold and empty worship of experiments.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [3, 5],
          answer: 'This violates 4 (obscure terms) and 6 (emotional tone).',
        },
        {
          id: '3.2',
          prompt: 'A tent is a movable dwelling made of canvas.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1],
          answer:
            'This violates 2 (too narrow — tents might be made of nylon).',
        },
        {
          id: '3.3',
          prompt: 'Philosophy is the study of the human condition.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer: 'This violates 1 (too broad).',
        },
        {
          id: '3.4',
          prompt: 'Logic is that dreadful discipline that analyzes reasoning.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [5],
          answer: 'This violates 6 (emotional tone).',
        },
        {
          id: '3.5',
          prompt: 'An old person is anyone over seventy.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [4],
          answer: 'This violates 5 (vagueness mismatch).',
        },
        {
          id: '3.6',
          prompt: 'A game is an amusing competition between various players.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1],
          answer:
            'This violates 2 (solitary and many computer games can involve only a single player).',
        },
        {
          id: '3.7',
          prompt: 'A logician is an obnoxious hair-splitter.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [5],
          answer: 'This violates 6 (emotional tone).',
        },
        {
          id: '3.8',
          prompt: 'A fish is an animal that lives mainly in the water.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer: 'This violates 1 (too broad — whales are not fish).',
        },
        {
          id: '3.9',
          prompt: 'A male is whatever has male reproductive organs.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1, 2],
          answer:
            'This violates 3 (circular) — and 2 (too narrow), if we consider castration.',
        },
        {
          id: '3.10',
          prompt: 'A police officer is a mere cop.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [5],
          answer: 'This violates 6 (emotional tone).',
        },
        {
          id: '3.11',
          prompt: '"Uncle" means "brother of a parent".',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1],
          answer:
            'This violates 2 (an only child can be an uncle by being married to a sister of a parent).',
        },
        {
          id: '3.12',
          prompt: 'Knowledge is a true belief that is absolutely certain.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1],
          answer:
            'This violates 2 (too narrow — most knowledge is not absolutely certain).',
        },
        {
          id: '3.13',
          prompt:
            'A bachelor is an unmarried man who weighs over 20 kilograms (44 pounds).',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [6],
          answer: 'This violates 7 (non-essential properties).',
        },
        {
          id: '3.14',
          prompt: 'Triangles are what you study in geometry.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer: 'This violates 1 (too broad — you study other things too).',
        },
        {
          id: '3.15',
          prompt: 'Architecture is frozen music.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [3],
          answer: 'This violates 4 (obscure terms).',
        },
        {
          id: '3.16',
          prompt: 'An apple is a red fruit.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1],
          answer:
            'This violates 1 (consider strawberries) and 2 (consider green apples).',
        },
        {
          id: '3.17',
          prompt: 'A warm day is one that is over 30 degrees Celsius (86°F).',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [4],
          answer: 'This violates 5 (vagueness mismatch).',
        },
        {
          id: '3.18',
          prompt:
            'Religion is a way of life based on belief in a supreme being.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1],
          answer:
            'This violates 2 (too narrow — some religions believe in many gods).',
        },
        {
          id: '3.19',
          // 'egghead' was reviewed 2026-08-21 and KEPT on Malik's call, with
          // the instruments against it (Zipf 2.21, halved since 1950, 92.9%
          // of 18-23s know it vs 100% of over-60s). It stays as Gensler's
          // voice; recorded so nobody re-retires it from the figures alone.
          prompt: 'A university instructor is just an egghead.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [5],
          answer: 'This violates 6 (emotional tone).',
        },
        {
          id: '3.20',
          prompt: '"True" means "proved to be true".',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1, 2],
          answer: 'This violates 2 (too narrow) and especially 3 (circular).',
        },
        {
          id: '3.21',
          prompt: 'A chair is whatever is used as a chair.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [2],
          answer: 'This violates 3 (circular).',
        },
        {
          id: '3.22',
          prompt: 'A teacher is one who instructs children.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1],
          answer: 'This violates 2 (too narrow).',
        },
        {
          id: '3.23',
          prompt: 'A net is anything with interstitial vacuities.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [3],
          answer: 'This violates 4 (obscure terms).',
        },
        {
          id: '3.24',
          prompt: 'Cars are vehicles powered by gasoline.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1],
          answer:
            'This violates 1 (consider motorcycles) and 2 (some cars run on hydrogen, electricity, or ethanol).',
        },
        {
          id: '3.25',
          prompt: 'Bread is the staff of life.', // stuff? Not sure if it was a typo from Gensler.
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [3],
          answer: 'This violates 4 (obscure terms).',
        },
        {
          id: '3.26',
          prompt: '"God" means "object of ultimate concern".',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1],
          answer:
            'This violates 1 and 2 (one might have an ultimate concern for something other than God).',
        },
        {
          id: '3.27',
          prompt:
            'A piano is any musical instrument with keys to select notes.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer: 'This violates 1 (too broad — consider pipe organs).',
        },
        {
          id: '3.28',
          prompt:
            'A pro football player is someone who works for a pro football team.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer:
            'This violates 1 (too broad — coaches also work for such teams).',
        },
        {
          id: '3.29',
          prompt: 'A man is a featherless biped.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1, 6],
          answer:
            'This violates 7 (and maybe 1 and 2 — if you consider plucked chickens and humans with one leg).',
        },
        {
          id: '3.30',
          prompt: 'Punishment is anything unpleasant done to a person.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer:
            'This violates 1 (dentists drilling your teeth are not punishing you).',
        },
        {
          id: '3.31',
          prompt: 'A king is the ruler of a country.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer:
            'This violates 1 (too broad — consider presidents and dictators).',
        },
        {
          id: '3.32',
          prompt:
            'Backpacking is the enduring of misery by living out of doors.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1, 5],
          answer:
            'This violates 1 (too broad), 2 (too narrow) and 6 (emotional tone).',
        },
        {
          id: '3.33',
          prompt: 'Knowledge is true belief.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer:
            'This violates 1 (too broad — a true belief might be a lucky guess).',
        },
        {
          id: '3.34',
          prompt:
            'A belief is the closing of a phase of an intellectual symphony.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [3],
          answer: 'This violates 4 (obscure terms).',
        },
        {
          id: '3.35',
          prompt: 'A politician is a scoundrel involved in politics.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1, 5],
          answer:
            'This violates 2 (too narrow — some are honest) and 6 (emotional tone).',
        },
        {
          id: '3.36',
          prompt:
            'Philosophy is the attempt to transcend cognitive subjectivity.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [3],
          answer: 'This violates 4 (obscure terms).',
        },
        {
          id: '3.37',
          prompt: 'A doctor is a man who is licensed to practice medicine.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1],
          answer: 'This violates 2 (too narrow — many doctors are women).',
        },
        {
          id: '3.38',
          prompt:
            '"Human being" means "whatever is descended from human beings".',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [2],
          answer: 'This violates 3 (circular).',
        },
        {
          id: '3.39',
          prompt:
            // Brand emended from the 2008 text's 'Dell' (Malik, 2026-08-21):
            // the Kiev class of staleness — Dell was the everyman PC of 2008.
            // Apple keeps the lesson identical and adds a bonus wrongness:
            // they now make computers that are neither boxes nor keyboarded.
            'A computer is a box made by Apple that has a keyboard and a screen.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1, 6],
          answer:
            'This violates 2 and 7 — many other companies make computers.',
        },
        {
          id: '3.40',
          prompt: 'A lie is a falsehood that you assert to be true.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer:
            'This violates 1 (if you do not know that it is false, it is just a mistake and not a lie).',
        },
        {
          id: '3.41',
          prompt:
            'Philosophy is the discipline developed by Aristotle and Plato.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [6],
          answer: 'This violates 7 (non-essential properties).',
        },
        {
          id: '3.42',
          prompt: 'An adolescent is a person between 9 and 19 years old.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [4],
          answer: 'This violates 5 (vagueness mismatch).',
        },
        {
          id: '3.43',
          prompt: 'An adult is anyone over 17.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [4],
          answer: 'This violates 5 (vagueness mismatch).',
        },
        {
          id: '3.44',
          prompt: 'Philosophy is what you study in philosophy classes.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [2],
          answer: 'This violates 3 (circular).',
        },
        {
          id: '3.45',
          prompt: 'A cold day is one that is under 5 degrees Celsius (41°F).',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [4],
          answer: 'This violates 5 (vagueness mismatch).',
        },
        {
          id: '3.46',
          prompt: "An honest person is one who doesn't steal.",
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1],
          answer: "This violates 2 (consider liars who don't steal).",
        },
        {
          id: '3.47',
          prompt: '"Murder" means "killing of a human being."',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer: 'This violates 1 (too broad — consider accidental killing).',
        },
        {
          id: '3.48',
          prompt: 'A liberal is a permissive do-gooder who knows nothing.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1, 5],
          answer:
            'This violates 1 (too broad), 2 (too narrow) and especially 6 (emotional tone).',
        },
        {
          id: '3.49',
          prompt: 'Logic is that wonderful discipline that analyzes reasoning.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [5],
          answer: 'This violates 6 (emotional tone).',
        },
        {
          id: '3.50',
          prompt: '"Chair" means "what you sit on."',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1],
          answer:
            'This violates 1 (we sit on other things) and perhaps 2 (if there are decorative chairs that no one sits on).',
        },
        {
          id: '3.51',
          prompt: 'A conservative is an inflexible person who never thinks.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1, 5],
          answer:
            'This violates 1 (too broad), 2 (too narrow) and especially 6 (emotional tone).',
        },
        {
          id: '3.52',
          prompt: 'A wrong action is one that is against the law.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1],
          answer: 'This violates 1 (too broad) and 2 (too narrow).',
        },
        {
          id: '3.53',
          prompt: 'A child is anyone between 2 and 12 years old.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [4],
          answer: 'This violates 5 (vagueness mismatch).',
        },
        {
          id: '3.54',
          prompt:
            'A football game is whatever is played by the rules of football.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [2],
          answer: 'This violates 3 (circular).',
        },
        {
          id: '3.55',
          prompt: 'A kitten is a young female cat.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1],
          answer: 'This violates 2 (too narrow — kittens can be male).',
        },
        {
          id: '3.56',
          prompt:
            'Logic is defined as that subject that is treated by LogiCola.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [6],
          answer: 'This violates 7 (non-essential properties).',
        },
        {
          id: '3.57',
          prompt: 'Knowledge is the cognizance of a reality by an intellect.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [3],
          answer: 'This violates 4 (obscure terms).',
        },
        {
          id: '3.58',
          prompt: 'A bird is an animal that can fly.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1],
          answer:
            'This violates 1 (too broad — consider ostriches) and 2 (too narrow — consider bats).',
        },
        {
          id: '3.59',
          prompt: '"Metaphysics" means "any sleep-inducing subject".',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1, 5],
          answer:
            'This violates 1 (too broad), 2 (too narrow) and 6 (emotional tone).',
        },
        {
          id: '3.60',
          prompt:
            '"Tall person" means "person over 183 centimetres (6 feet) tall."',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [4],
          answer: 'This violates 5 (vagueness mismatch).',
        },
        // The 2026 specimens (Malik-approved slate, 2026-08-21). Gensler's
        // sixty are at canonical parity above and stay untouched; these
        // extend the drill into vocabulary the students own. Same seven
        // options, same grading, each authored around one named flaw.
        {
          id: '3.61',
          prompt: 'An influencer is a person who is famous for being famous.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [2],
          answer: 'This violates 3 (circular).',
        },
        {
          id: '3.62',
          // Larry Tesler's actual quip about AI, offered straight-faced as a
          // definition — which is exactly what makes it a specimen.
          prompt: "AI is whatever computers can't do yet.",
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1],
          answer:
            'This violates 2 (too narrow — the boundary moves: every solved problem stops counting as AI).',
        },
        {
          id: '3.63',
          prompt: 'A podcast is talk radio for the internet.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1],
          answer:
            'This violates 1 (too broad — it lets in live radio streamed online) and 2 (too narrow — it shuts out video and music podcasts).',
        },
        {
          id: '3.64',
          // Dawkins' own definition from The Selfish Gene, near verbatim —
          // a real definition by a careful writer can still fail rule 4.
          prompt:
            'A meme is a unit of cultural transmission propagating via imitation.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [3],
          answer:
            'This violates 4 (obscure terms — and it is Dawkins’ own definition, which is the point).',
        },
        // Second slate, 2026-08-21. The crypto pair ships together on the
        // house symmetry rule — Gensler's own liberal/conservative pair is
        // the precedent: neither side's tone gets the last word. ("The
        // cloud is someone else's computer" was considered and parked:
        // the quip is almost a good definition, which makes it ambiguous
        // as a specimen.)
        {
          id: '3.65',
          prompt: 'A friend is someone who follows you back.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 1],
          answer:
            'This violates 1 (too broad — strangers follow back) and 2 (too narrow — your oldest friend may not be on the platform).',
        },
        {
          id: '3.66',
          prompt: '“Viral” means “seen by more than a million people.”',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [4],
          answer:
            'This violates 5 (vagueness mismatch — a precise threshold for a vague word).',
        },
        {
          id: '3.67',
          prompt: 'A gamer is an antisocial teenager who plays video games.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1, 5],
          answer:
            'This violates 2 (too narrow — the average gamer is around thirty-five) and 6 (emotional tone).',
        },
        {
          id: '3.68',
          prompt: 'A startup is a small company.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0],
          answer:
            'This violates 1 (too broad — the corner bakery is small, and it is no startup).',
        },
        {
          id: '3.69',
          prompt: 'Crypto is money for criminals.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [1, 5],
          answer:
            'This violates 2 (too narrow — most use is not criminal) and 6 (emotional tone).',
        },
        {
          id: '3.70',
          prompt: 'Crypto is the future of money.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [4, 5],
          answer:
            'This violates 5 (vagueness mismatch — “the future of money” could mean almost anything) and 6 (emotional tone — boosterism is a tone too).',
        },
      ],
    },
  ],
};
export { setQ };
