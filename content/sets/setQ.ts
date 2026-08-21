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
      // reconstructed rather than read off the DSL: Gensler's penalty was
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
        // Third slate, 2026-08-21, drawn from Malik's source list. Cersei's verbatim reply to Littlefinger — a circular definition shipped inside a scene students know by heart; the mottos principle arriving in Set Q. (The Silk Road and Europe-is-the-EU candidates are parked: Malik unsure, 2026-08-21.)
        {
          id: '3.71',
          prompt: 'Power is power.',
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
          answer:
            'This violates 3 (circular — Cersei defines the word with itself).',
        },
        // Merriam-Webster's 2022 Word of the Year, picked by the dictionary because of this exact drift — WOTY lists are now a standing instrument (see docs/lexicon-blog-material.md).
        {
          id: '3.72',
          prompt: 'Gaslighting is when someone disagrees with you.',
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
            'This violates 1 (too broad — the real thing is a sustained campaign to make someone doubt their own perception).',
        },
        {
          id: '3.73',
          prompt: 'A recession is two consecutive quarters of negative growth.',
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
            'This violates 5 (vagueness mismatch — a precise threshold for a judgment call; the NBER itself rejects this rule of thumb).',
        },
        {
          id: '3.74',
          prompt: '“Theory” means “an unproven guess.”',
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
            'This violates 1 (too broad — any hunch counts) and 2 (too narrow — it excludes gravity and germ theory).',
        },
        {
          id: '3.75',
          prompt: 'Civilization is a society that builds in stone.',
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
            'This violates 2 (too narrow — Benin City’s earthworks and Timbuktu’s libraries were not stone) and 7 (building material is not essential).',
        },
        {
          id: '3.76',
          prompt: 'An accent is what people from somewhere else have.',
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
            'This violates 2 (too narrow — everyone has an accent; yours is just the local one).',
        },
        {
          id: '3.77',
          prompt: 'GDP is how well a country is doing.',
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
            'This violates 1 (too broad — rebuilding after a disaster counts) and 2 (too narrow — unpaid care does not).',
        },
        {
          id: '3.78',
          prompt: 'A hero is someone with superpowers.',
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
            'This violates 1 (too broad — villains have powers too) and 2 (too narrow — Batman has none).',
        },
        {
          id: '3.79',
          prompt: '“Football” means “the sport you play with your feet.”',
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
            'This violates 2 (too narrow — goalkeepers use their hands, and Americans mean a different sport entirely).',
        },
        {
          id: '3.80',
          prompt: 'Trauma is anything that upsets you.',
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
            'This violates 1 (too broad — the clinical term names something narrower than everything upsetting).',
        },
        // Fourth slate, 2026-08-21 — aimed at the starved rules (3, 4, 7) and Malik's theme list. ("A ceasefire is peace" is parked: Malik unsure, 2026-08-21.)
        {
          id: '3.81',
          prompt: 'Water is dihydrogen monoxide.',
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
            'This violates 4 (obscure terms — chemically true, and still a bad definition; obscurity is how the famous dihydrogen-monoxide petition fooled people).',
        },
        {
          id: '3.82',
          prompt: 'A Frenchman is someone from France who wears a beret.',
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
          answer:
            'This violates 7 (non-essential properties — the beret is the stereotype, not the essence).',
        },
        {
          id: '3.83',
          prompt: 'A mother tongue is the language your mother speaks.',
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
            'This violates 2 (too narrow — many first languages aren’t the mother’s) and 7 (the mother is non-essential — the term names early exposure).',
        },
        {
          id: '3.84',
          prompt: 'A leader is someone who leads.',
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
          id: '3.85',
          prompt: 'Your nationality is where you were born.',
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
            'This violates 1 (too broad — being born somewhere doesn’t always confer it) and 2 (too narrow — naturalized citizens earned theirs elsewhere).',
        },
        {
          id: '3.86',
          prompt: '“Latino” means “someone who speaks Spanish.”',
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
            'This violates 1 (too broad — it lets in Spaniards) and 2 (too narrow — it shuts out Brazilians).',
        },
        {
          id: '3.87',
          prompt: 'A virus is a living thing that makes you sick.',
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
            'This violates 2 (too narrow — most viruses infect bacteria, and “living” is itself contested).',
        },
        {
          id: '3.88',
          prompt: 'A species is a group of animals that look alike.',
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
            'This violates 1 (too broad — lookalike species differ) and 2 (too narrow — males and females of one species can look nothing alike).',
        },
        {
          id: '3.89',
          prompt: '“Traditional” means “having always been done.”',
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
            'This violates 2 (too narrow — no tradition has always been done: cassava reached Africa in the 1500s, horses the Plains in the 1600s).',
        },
        {
          id: '3.90',
          prompt: '“Made in China” means “cheaply made.”',
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
            'This violates 2 (too narrow — the label also sits on high-speed rail and the phone in your pocket) and 6 (emotional tone).',
        },
        {
          id: '3.91',
          prompt: 'A refugee is someone who wants a better life.',
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
            'This violates 1 (too broad — that describes almost everyone; the legal term means fleeing persecution).',
        },
        {
          id: '3.92',
          prompt: 'Brain rot is any time spent on your phone.',
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
            'This violates 1 (too broad — Oxford’s 2024 word names a specific dulling, not all phone time).',
        },
        // Fifth slate, 2026-08-21 — engineered against the combination census: 15 of 21 rule-pairs had never appeared. This round fills 3+4, 6+7, 5+7 and 1+5, and feeds the starved rule 3. (The hot-dog item was retried at Malik's request; `superfood` replaced it.)
        {
          id: '3.93',
          prompt: 'Being is the presencing of what presences.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [2, 3],
          answer:
            'This violates 3 (circular — “presencing” restates “being”) and 4 (obscure terms).',
        },
        {
          id: '3.94',
          prompt: 'Time is what clocks measure.',
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
          answer:
            'This violates 3 (circular — a clock is exactly the thing defined by keeping time).',
        },
        {
          id: '3.95',
          prompt: 'Recursion: see recursion.',
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
          answer:
            'This violates 3 (circular — and yes, real programming glossaries have printed it).',
        },
        {
          id: '3.96',
          prompt:
            'A programmer is someone who codes in the dark drinking energy drinks.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [5, 6],
          answer:
            'This violates 6 (emotional tone) and 7 (every property named is non-essential).',
        },
        {
          id: '3.97',
          prompt: '“Big data” means “data too big for Excel.”',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [4, 6],
          answer:
            'This violates 5 (vagueness mismatch — “too big” is doing all the work) and 7 (Excel is non-essential).',
        },
        {
          id: '3.98',
          prompt: 'A continent is a large landmass.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 4],
          answer:
            'This violates 1 (too broad — Greenland walks in) and 5 (vagueness mismatch — “large” is why the continent count is a convention, not a discovery).',
        },
        {
          id: '3.99',
          prompt: 'A limit is what a function approaches but never reaches.',
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
            'This violates 2 (too narrow — a constant function reaches its limit everywhere).',
        },
        {
          id: '3.100',
          prompt: 'Sushi is raw fish.',
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
            'This violates 2 (too narrow — vegetable rolls are sushi) and 7 (the fish is non-essential — sushi names the vinegared rice; sashimi is the raw fish).',
        },
        {
          id: '3.101',
          prompt: 'Comfort food is food that comforts.',
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
        // AUTHORING PRINCIPLES for this drill, set by Malik 2026-08-21:
        //
        // 1. The best specimens are definitions that feel ALMOST RIGHT, or
        //    that students already know by heart — Gensler's five rules
        //    describe near-misses, so the drill should serve near-misses.
        //    "Power is power" and the NBER recession threshold are the
        //    models; a definition nobody would ever offer teaches nothing.
        //
        // 2. The book's own exercise items (3.2a) are deliberately NOT
        //    ported: Introduction to Logic is still sold and is this
        //    software's companion text — its exercises stay its own. We
        //    author passages that RHYME with them instead: same lesson,
        //    new sentence. (This boundary differs from the 2008 BINARY,
        //    which is the thing we port.)
        {
          id: '3.102',
          prompt: 'A superfood is any food that’s good for you.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 5],
          answer:
            'This violates 1 (too broad — that’s most food) and 6 (emotional tone — the glow is marketing; the EU restricts the term for exactly this reason).',
        },
        // The rhyme slate, 2026-08-21: same lessons as the book's 3.2a items, new sentences, per the companion-text boundary above. (true-means-trending and fair-means-Pareto-optimal were cut on review.)
        {
          id: '3.103',
          prompt: 'A good argument is one that changes minds.',
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
            'This violates 1 (too broad — bad arguments change minds every day, and valid ones often fail to).',
        },
        {
          id: '3.104',
          prompt:
            '“Influencer” means “someone with followers,” and “follower” means “someone who follows influencers.”',
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
          answer:
            'This violates 3 (circular — the two definitions lean on each other; neither ever touches ground).',
        },
        {
          id: '3.105',
          prompt: '“Misinformation” means “lying online.”',
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
            'This violates 2 (too narrow — misinformation needn’t be intended; the intentional kind is disinformation).',
        },
        {
          id: '3.106',
          prompt: '“Knowing” means “being sure.”',
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
            'This violates 1 (too broad — everyone has been sure and wrong).',
        },
        {
          id: '3.107',
          prompt: 'A wedding is an expensive party with a cake.',
          options: [
            { id: 0, label: 'Too broad' },
            { id: 1, label: 'Too narrow' },
            { id: 2, label: 'Circular' },
            { id: 3, label: 'Uses poorly understood terms' },
            { id: 4, label: 'Poor match in vagueness' },
            { id: 5, label: 'Poor match in emotional tone' },
            { id: 6, label: 'Has non-essential properties' },
          ],
          correctId: [0, 6],
          answer:
            'This violates 1 (too broad — birthdays qualify) and 7 (cost and cake are exactly what a wedding doesn’t need).',
        },
        // THE THIRD AUTHORING PRINCIPLE (Malik-confirmed, 2026-08-21): the flaw
        // must be findable from ordinary usage and common knowledge alone —
        // if the counterexample requires a doctrine, the item tests the
        // doctrine, not the skill. Gensler's own counterexamples (whales,
        // ostriches, kittens) all pass this test, and he left justified-true-
        // belief out of his own chapter despite knowing Gettier. Parked under
        // this principle, by name: prime-admits-1 (needs the mathematicians'
        // convention), planet-minus-clearing (needs the IAU), temperature-as-
        // speed (needs kinetic theory), knowledge-as-JTB (needs Gettier), and
        // cheating-as-rule-breaking (the counterexample turned out to be
        // contestable — a footballer diving in plain view breaks rules openly
        // and is still called a cheat).
        {
          id: '3.108',
          prompt: 'A living thing is anything that grows and reproduces.',
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
            'This violates 1 (too broad — crystals grow, fire spreads) and 2 (too narrow — mules don’t reproduce).',
        },
        {
          id: '3.109',
          prompt: 'A promise is saying you will do something.',
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
            'This violates 1 (too broad — “I’ll probably be late” says you’ll do something and promises nothing).',
        },
        {
          id: '3.110',
          prompt: 'Winning is beating your opponent.',
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
            'This violates 2 (too narrow — solitaire and lotteries are won with no opponent at all).',
        },
        {
          id: '3.111',
          prompt: 'A secret is something only you know.',
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
            'This violates 1 (too broad — last night’s dream is known only to you and is no secret) and 2 (too narrow — two people share secrets constantly).',
        },
        // The closing slate, 2026-08-21: art and AI, per Malik's themes; the campaign ends here at 115.
        {
          id: '3.112',
          prompt: 'Art is whatever hangs in a museum.',
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
            'This violates 1 (too broad — the fire extinguisher on the museum wall is not art) and 2 (too narrow — street murals never hang there).',
        },
        {
          id: '3.113',
          prompt: 'Art is anything beautiful.',
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
            'This violates 1 (too broad — sunsets are beautiful and nobody made them) and 2 (too narrow — plenty of great art is deliberately ugly).',
        },
        {
          id: '3.114',
          prompt: 'An AI is a program that thinks.',
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
            'This violates 4 (obscure terms — “thinks” is less understood than the term it defines).',
        },
        {
          id: '3.115',
          prompt: 'A follower is a fan.',
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
            'This violates 1 (too broad — bots and hate-follows follow) and 2 (too narrow — devoted offline fans follow nothing).',
        },
      ],
    },
  ],
};
export { setQ };
