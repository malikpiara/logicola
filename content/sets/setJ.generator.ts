/**
 * Set J — Modal Translations: live-random generator.
 *
 * Phase 1 / T1.4. Ports Gensler's 2008 LCEXE Set J as a procedural
 * drill engine. Coverage: all 31 procedural templates from
 * `notes/exercises/2008/decoded/set_J.txt`, split into Basic
 * (`*0`..`*21`) and Quantified (`*22`..`*30`) subsets matching
 * Gensler's chapter 10 / 11.2 boundary.
 *
 * Cross-checked against Gensler 3rd ed. §10.1 + §11.2 (see
 * `notes/textbook/setJ.md`). Idiom rules from the textbook drive
 * Layer-1 hints; per-mistake explanations from the 2008 `*42`–`*70`
 * feedback block drive Layer-2 hints.
 *
 * Operator rendering: Unicode in spec table (☐, ◇, ∼, ·, ∨, ⊃);
 * converted to KaTeX (`\square`, `\lozenge`, `\sim`, `\cdot`,
 * `\vee`, `\supset`) at Option.label render time. Quantified forms
 * use `(x)` for universal and `(\exists x)` for existential.
 *
 * Ambiguity handling (per Gensler §10.1):
 *   "If A, then it's necessary that B" — correct answer is the
 *   literal "Ambiguous between (A ⊃ ☐B) and ☐(A ⊃ B)" option.
 *   Disambiguators "by itself"/"intrinsically" force the simple
 *   form `(A ⊃ ☐B)`; "necessarily,"/"entails" forces the
 *   conditional form `☐(A ⊃ B)`. Templates *7, *8, *28 are the
 *   genuinely-ambiguous ones; *4, *6, *29 use the disambiguators.
 */

import type { Option, Question, Set } from '../types';
import { rngFromSeed, pickFresh, type Rng } from '@/lib/rng';
import { adjectives, names, nounsProfessions } from '../lexicons';
import { indefiniteArticle } from '@/lib/grammar';

// =============================================================
// KaTeX rendering of modal wffs
// =============================================================

/**
 * Operator-to-LaTeX mapping. Order matters: `(∃x)` must be matched
 * before bare `∃` so we don't double-replace.
 */
const KATEX_OPS: ReadonlyArray<readonly [string, string]> = [
  ['(∃x)', '(\\exists x)'],
  ['∃', '\\exists '],
  ['☐', '\\square '],
  ['◇', '\\lozenge '],
  ['∼', '\\sim '],
  ['·', '\\cdot '],
  ['∨', '\\vee '],
  ['⊃', '\\supset '],
  ['≡', '\\equiv '],
];

function toKatex(wff: string): string {
  let out = wff;
  for (const [unicode, latex] of KATEX_OPS) {
    out = out.split(unicode).join(latex);
  }
  return `$ ${out} $`;
}

// =============================================================
// Layer-1 idiom hints (per-template, from Gensler §10.1)
// =============================================================

const HINT_NECESSARY = '‘It’s necessary that …’ translates as ‘☐’.';
const HINT_POSSIBLE = '‘It’s possible that …’ translates as ‘◇’.';
const HINT_NOT_POSSIBLE = 'Translate ‘not possible’ / ‘couldn’t’ as ‘∼◇’.';
const HINT_IMPOSSIBLE =
  'Translate ‘impossible’ / ‘self-contradictory’ as ‘∼◇’ (i.e., ‘not possible’).';
const HINT_ENTAILS =
  '‘… entails …’ means ‘Necessarily if … then ….’ (Box-outside.)';
const HINT_ENTAILS_NOT =
  '‘… entails not-…’ means ‘Necessarily if … then not-….’';
const HINT_BY_ITSELF =
  'Here the necessity (or impossibility) applies to the second part by itself — use the box-inside form.';
const HINT_AMBIGUOUS =
  '‘If A, then it’s necessary (impossible) that B’ is ambiguous between the box-inside `(A ⊃ ☐B)` form and the box-outside `☐(A ⊃ B)` form. (Gensler §10.1.)';
const HINT_NOT_NECESSARY = 'Translate ‘not necessary’ as ‘∼☐’.';
const HINT_DOESNT_ENTAIL =
  '‘… doesn’t entail …’ means ‘It isn’t necessary that if … then ….’';
const HINT_IF_NEC_THEN_NEC =
  'Translate ‘if A is necessary’ as ‘(☐A’. Use a separate ‘☐’ for each English ‘necessary’.';
const HINT_EITHER_NEC =
  'Use a separate modal operator for each English modal word — ‘either A is necessary or B is necessary’ → ‘(☐A ∨ ☐B)’.';
const HINT_POSS_BOTH =
  '‘It’s possible that both A and B’ means ‘◇(’: one diamond outside, both conjuncts inside.';
const HINT_CONTINGENT_STMT =
  'A contingent statement is one that could have been true AND could have been false — `(◇A · ◇∼A)`.';
const HINT_CONTINGENT_TRUTH =
  'A contingent truth is something that IS true but could have been false — `(A · ◇∼A)`.';
const HINT_CONSISTENT =
  '‘… is consistent (compatible) with …’ means ‘It’s possible that … and … are both true’ — `◇(A · B)`.';
const HINT_INCOMPATIBLE =
  '‘… is incompatible (inconsistent) with …’ means ‘It isn’t possible that … and … are both true’ — `∼◇(A · B)`.';
const HINT_ITERATED =
  'Iterated modals: ‘It’s possible that A is necessary’ uses ‘◇’ outside ‘☐’ — `◇☐A`.';
const HINT_POSS_SOMEONE = 'Translate ‘possible some’ as ‘◇(∃x)’.';
const HINT_NEC_EVERYONE = 'Translate ‘necessary every’ as ‘☐(x)’.';
const HINT_ANYONE =
  '‘Anyone could be …’ uses ‘(x)◇’ — read ‘for any x, x could be …’. Different from ‘Everyone could be …’ which is ‘◇(x)’.';
const HINT_NEC_PROP =
  '‘F is a necessary property of x’ means ‘in all possible worlds, x would be F’ — `☐Fx`.';
const HINT_CONT_PROP =
  '‘F is a contingent property of x’ means ‘x is F but could have lacked F’ — `(Fx · ◇∼Fx)`.';
const HINT_ALL_NEC_AMBIG =
  '‘All A’s are necessarily B’s’ is ambiguous between simple necessity `(x)(Ax ⊃ ☐Bx)` (de re — each A inherently B) and conditional necessity `☐(x)(Ax ⊃ Bx)` (de dicto — the proposition is necessary).';
const HINT_NEC_THAT_ALL =
  '‘It’s necessary that all A’s are B’s’ uses the conditional (box-outside) form — `☐(x)(Ax ⊃ Bx)`. Not ambiguous: ‘necessary that …’ disambiguates.';
const HINT_HAVE_NEC_PROP =
  '‘All A’s have the property of being necessarily B’ uses the simple (box-inside) form — `(x)(Ax ⊃ ☐Bx)`. Not ambiguous: ‘property of being necessarily …’ disambiguates.';

// =============================================================
// Layer-2 hints (per-mistake from 2008 `*e` block)
// =============================================================

const HINT_GET_RID_BOX = 'Get rid of the box!';
const HINT_NEED_ANOTHER_MODAL = 'You need another modal operator.';
const HINT_TOO_MANY_BOXES = 'Your answer has too many boxes.';
const HINT_NOT_AMBIGUOUS = 'The sentence isn’t ambiguous.';
const HINT_NOT_WFF =
  'Your answer isn’t a wff — modal operators don’t take parentheses around their argument: write ‘☐A’, not ‘☐(A)’ or ‘(☐A)’.';
const HINT_CONTINGENT_VS_TRUTH =
  'You translated ‘contingent truth’ instead of ‘contingent statement’ (or vice versa). A statement could be either true or false; a truth IS true.';
// 2008 *56 `tb=y:` — aimed at the ◇-only mistake, which is NOT the
// truth-vs-statement mixup (◇J isn't the translation of either idiom).
const HINT_CONTINGENT_MORE_THAN_POSSIBLE =
  '‘Contingent’ means more than ‘possible.’ (Necessary statements are also possible.)';
const HINT_FORGOT_NOT = 'You forgot the ‘∼’.';
const HINT_BOX_INSIDE_VS_OUTSIDE =
  '‘By itself’ / ‘intrinsically’ disambiguates to the box-inside form `(A ⊃ ☐B)`.';

// =============================================================
// Letter / lexicon picking
// =============================================================

/**
 * Propositional-letter pool for $h, $j, $k. Excludes I (visually
 * confusable with 1 and the pronoun) and X/Y (reserved for
 * quantifier variables in the rendered formulas).
 */
const LETTER_POOL: readonly string[] = [
  'A',
  'B',
  'C',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'V',
  'W',
  'Z',
] as const;

function pickDistinctLetters(rng: Rng, n: 1 | 2 | 3): string[] {
  const pool = [...LETTER_POOL];
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool[idx]!);
    pool.splice(idx, 1);
  }
  return out;
}

// =============================================================
// Helpers
// =============================================================

function qid(num: number, n: number): string {
  return `gen.J.${num}.${n}`;
}

interface OptionPiece {
  /** Unicode wff string (or "Ambiguous between ..." text). */
  raw: string;
  /** True if the option is plain text (e.g. "Ambiguous between..."), not a wff. */
  plain?: boolean;
  layer2?: string;
}

function buildQuestion(
  num: number,
  counter: number,
  prompt: string,
  pieces: readonly OptionPiece[],
  correctIdx: number,
  layer1: string
): Question {
  const options: Option[] = pieces.map((p, i) => {
    const label = p.plain ? p.raw : toKatex(p.raw);
    if (i === correctIdx) return { id: i, label };
    const hint = p.layer2 ? `${layer1}\n${p.layer2}` : layer1;
    return { id: i, label, hint };
  });
  return {
    id: qid(num, counter),
    prompt,
    options,
    correctId: [correctIdx],
    answer: '',
  };
}

// =============================================================
// Per-template renderers
// =============================================================

/** *0 — "It's necessary that K" → ☐K */
function template0(rng: Rng, counter: number): Question {
  const useEnglish = rng() < 0.5;
  let prompt: string;
  let letter: string;
  if (useEnglish) {
    const adj = pickFresh(rng, adjectives);
    letter = adj[0]!.toUpperCase();
    prompt = `It’s a necessary truth that you’re ${adj}.`;
  } else {
    letter = pickDistinctLetters(rng, 1)[0]!;
    prompt = `It’s necessary that ${letter}.`;
  }
  return buildQuestion(
    0,
    counter,
    prompt,
    [
      { raw: `☐${letter}` },
      { raw: `◇${letter}`, layer2: HINT_NEED_ANOTHER_MODAL },
      { raw: `☐(${letter})`, layer2: HINT_NOT_WFF },
      { raw: `∼☐${letter}`, layer2: HINT_FORGOT_NOT },
    ],
    0,
    HINT_NECESSARY
  );
}

/** *1 — "It's possible that K" → ◇K */
function template1(rng: Rng, counter: number): Question {
  const useEnglish = rng() < 0.5;
  let prompt: string;
  let letter: string;
  if (useEnglish) {
    const name = pickFresh(rng, names);
    const adj = pickFresh(rng, adjectives);
    letter = adj[0]!.toUpperCase();
    prompt = `${name} could be ${adj}.`;
  } else {
    letter = pickDistinctLetters(rng, 1)[0]!;
    prompt = `It’s possible that ${letter}.`;
  }
  return buildQuestion(
    1,
    counter,
    prompt,
    [
      { raw: `◇${letter}` },
      { raw: `☐${letter}`, layer2: HINT_NEED_ANOTHER_MODAL },
      { raw: `◇(${letter})`, layer2: HINT_NOT_WFF },
      { raw: `∼◇${letter}`, layer2: HINT_FORGOT_NOT },
    ],
    0,
    HINT_POSSIBLE
  );
}

/** *2 — "It isn't possible that K" → ∼◇K */
function template2(rng: Rng, counter: number): Question {
  const useEnglish = rng() < 0.5;
  let prompt: string;
  let letter: string;
  if (useEnglish) {
    const name = pickFresh(rng, names);
    const adj = pickFresh(rng, adjectives);
    letter = adj[0]!.toUpperCase();
    prompt = `${name} couldn’t be ${adj}.`;
  } else {
    letter = pickDistinctLetters(rng, 1)[0]!;
    prompt = `It isn’t possible that ${letter}.`;
  }
  return buildQuestion(
    2,
    counter,
    prompt,
    [
      { raw: `∼◇${letter}` },
      { raw: `◇${letter}`, layer2: HINT_FORGOT_NOT },
      {
        raw: `◇∼${letter}`,
        layer2:
          'That means ‘possible that not-' + letter + '’ — different scope.',
      },
      { raw: `∼◇(${letter})`, layer2: HINT_NOT_WFF },
    ],
    0,
    HINT_NOT_POSSIBLE
  );
}

/** *3 — "K is impossible / self-contradictory" → ∼◇K (≡ ☐∼K) */
function template3(rng: Rng, counter: number): Question {
  const phrasings = [
    'is impossible',
    'is self-contradictory',
    'is inconsistent',
  ];
  const phrase = pickFresh(rng, phrasings);
  const letter = pickDistinctLetters(rng, 1)[0]!;
  return buildQuestion(
    3,
    counter,
    `${letter} ${phrase}.`,
    [
      { raw: `∼◇${letter}` },
      {
        raw: `◇∼${letter}`,
        layer2:
          'That means ‘possible that not-' + letter + '’ — different scope.',
      },
      { raw: `◇${letter}`, layer2: HINT_FORGOT_NOT },
      { raw: `∼${letter}`, layer2: HINT_NEED_ANOTHER_MODAL },
    ],
    0,
    HINT_IMPOSSIBLE
  );
}

/** *4 — "H entails J" → ☐(H ⊃ J) (NOT ambiguous; "entails" disambiguates per §10.1) */
function template4(rng: Rng, counter: number): Question {
  const [h, j] = pickDistinctLetters(rng, 2);
  const phrasings = [
    `${h} entails ${j}.`,
    `Necessarily, if ${h} then ${j}.`,
    `It’s necessary that if ${h} then ${j}.`,
  ];
  return buildQuestion(
    4,
    counter,
    pickFresh(rng, phrasings),
    [
      { raw: `☐(${h} ⊃ ${j})` },
      {
        raw: `(${h} ⊃ ☐${j})`,
        layer2:
          'That’s the box-inside form. ‘Entails’ disambiguates to box-outside.',
      },
      { raw: `(☐${h} ⊃ ☐${j})`, layer2: HINT_TOO_MANY_BOXES },
      {
        raw: `Ambiguous between (${h} ⊃ ☐${j}) and ☐(${h} ⊃ ${j})`,
        plain: true,
        layer2: HINT_NOT_AMBIGUOUS,
      },
    ],
    0,
    HINT_ENTAILS
  );
}

/** *5 — "H entails not-J" → ☐(H ⊃ ∼J) */
function template5(rng: Rng, counter: number): Question {
  const [h, j] = pickDistinctLetters(rng, 2);
  const phrasings = [
    `${h} entails that ${j} is false.`,
    `Necessarily, if ${h} then not-${j}.`,
    `It’s necessary that if ${h} then ${j} is false.`,
  ];
  return buildQuestion(
    5,
    counter,
    pickFresh(rng, phrasings),
    [
      { raw: `☐(${h} ⊃ ∼${j})` },
      { raw: `☐(${h} ⊃ ${j})`, layer2: HINT_FORGOT_NOT },
      {
        raw: `(${h} ⊃ ☐∼${j})`,
        layer2:
          'That’s the box-inside form — ‘entails’ disambiguates to box-outside.',
      },
      {
        raw: `∼☐(${h} ⊃ ${j})`,
        layer2:
          'That means ‘doesn’t entail ' + j + '’, not ‘entails not-' + j + '’.',
      },
    ],
    0,
    HINT_ENTAILS_NOT
  );
}

/** *6 — "If H, then J (by itself) is necessary" → (H ⊃ ☐J) */
function template6(rng: Rng, counter: number): Question {
  const [h, j] = pickDistinctLetters(rng, 2);
  const phrasings = [
    `If ${h}, then ${j} (by itself) is necessary.`,
    `If ${h}, then ${j} is intrinsically necessary.`,
  ];
  return buildQuestion(
    6,
    counter,
    pickFresh(rng, phrasings),
    [
      { raw: `(${h} ⊃ ☐${j})` },
      { raw: `☐(${h} ⊃ ${j})`, layer2: HINT_BOX_INSIDE_VS_OUTSIDE },
      { raw: `(☐${h} ⊃ ☐${j})`, layer2: HINT_TOO_MANY_BOXES },
      {
        raw: `Ambiguous between (${h} ⊃ ☐${j}) and ☐(${h} ⊃ ${j})`,
        plain: true,
        layer2: HINT_NOT_AMBIGUOUS + ' ‘By itself’ disambiguates.',
      },
    ],
    0,
    HINT_BY_ITSELF
  );
}

/** *7 — "If H, then it's necessary that J" → AMBIGUOUS */
function template7(rng: Rng, counter: number): Question {
  const [h, j] = pickDistinctLetters(rng, 2);
  const phrasings = [
    `If ${h}, then it’s necessary that ${j}.`,
    `If ${h} is true, then ${j} must be true.`,
    `If ${h}, then ${j} must be true.`,
  ];
  return buildQuestion(
    7,
    counter,
    pickFresh(rng, phrasings),
    [
      {
        raw: `Ambiguous between (${h} ⊃ ☐${j}) and ☐(${h} ⊃ ${j})`,
        plain: true,
      },
      {
        raw: `(${h} ⊃ ☐${j})`,
        layer2:
          'You missed the ambiguity — ☐(' +
          h +
          ' ⊃ ' +
          j +
          ') is also a valid reading.',
      },
      {
        raw: `☐(${h} ⊃ ${j})`,
        layer2:
          'You missed the ambiguity — (' +
          h +
          ' ⊃ ☐' +
          j +
          ') is also a valid reading.',
      },
      { raw: `(☐${h} ⊃ ☐${j})`, layer2: HINT_TOO_MANY_BOXES },
    ],
    0,
    HINT_AMBIGUOUS
  );
}

/** *8 — "If H, then it's impossible that J" → AMBIGUOUS */
function template8(rng: Rng, counter: number): Question {
  const [h, j] = pickDistinctLetters(rng, 2);
  const phrasings = [
    `If ${h}, then it’s impossible that ${j}.`,
    `If ${h} is true, then ${j} couldn’t be true.`,
    `If ${h}, then ${j} couldn’t be true.`,
  ];
  return buildQuestion(
    8,
    counter,
    pickFresh(rng, phrasings),
    [
      {
        raw: `Ambiguous between (${h} ⊃ ∼◇${j}) and ☐(${h} ⊃ ∼${j})`,
        plain: true,
      },
      {
        raw: `(${h} ⊃ ∼◇${j})`,
        layer2:
          'You missed the ambiguity — ☐(' +
          h +
          ' ⊃ ∼' +
          j +
          ') is also a valid reading.',
      },
      {
        raw: `☐(${h} ⊃ ∼${j})`,
        layer2:
          'You missed the ambiguity — (' +
          h +
          ' ⊃ ∼◇' +
          j +
          ') is also a valid reading.',
      },
      {
        raw: `∼◇(${h} ⊃ ${j})`,
        layer2:
          'Wrong scope — that means ‘the conditional itself is impossible’.',
      },
    ],
    0,
    HINT_AMBIGUOUS
  );
}

/** *9 — "K isn't necessary" → ∼☐K */
function template9(rng: Rng, counter: number): Question {
  const useEnglish = rng() < 0.5;
  let prompt: string;
  let letter: string;
  if (useEnglish) {
    const adj = pickFresh(rng, adjectives);
    letter = adj[0]!.toUpperCase();
    prompt = `It isn’t necessary that you’re ${adj}.`;
  } else {
    letter = pickDistinctLetters(rng, 1)[0]!;
    prompt = `It isn’t necessary that ${letter}.`;
  }
  return buildQuestion(
    9,
    counter,
    prompt,
    [
      { raw: `∼☐${letter}` },
      {
        raw: `☐∼${letter}`,
        layer2:
          'That means ‘necessary not-' + letter + '’ — wrong scope of ‘∼’.',
      },
      { raw: `☐${letter}`, layer2: HINT_FORGOT_NOT },
      { raw: `∼☐(${letter})`, layer2: HINT_NOT_WFF },
    ],
    0,
    HINT_NOT_NECESSARY
  );
}

/**
 * *10 — Variable-modal "It [could/must] be that you aren't W"
 * (or "It's [necessary/possible] that K is false") → modal ∼ letter.
 *
 * Bundles four paraphrases that each map to a specific modal:
 *   - "It could be that you aren't W"      → ◇∼W
 *   - "It must be that you aren't W"       → ☐∼W
 *   - "It's necessary that K is false"     → ☐∼K
 *   - "It's possible that K is false"      → ◇∼K
 *
 * Pedagogical point (per Gensler §10.1): "could" / "possible"
 * map to ◇; "must" / "necessary" map to ☐. Same logical form
 * across the four phrasings — modal applied to negation.
 */
function template10(rng: Rng, counter: number): Question {
  // Each paraphrase: [phrasing-template, modal-symbol, modal-word].
  // First two use $W (adjective + person); last two use a $K letter.
  const variants = [
    {
      phrasing: (w: string) => `It could be that you aren’t ${w}.`,
      modal: '◇',
      useAdj: true,
    },
    {
      phrasing: (w: string) => `It must be that you aren’t ${w}.`,
      modal: '☐',
      useAdj: true,
    },
    {
      phrasing: (k: string) => `It’s necessary that ${k} is false.`,
      modal: '☐',
      useAdj: false,
    },
    {
      phrasing: (k: string) => `It’s possible that ${k} is false.`,
      modal: '◇',
      useAdj: false,
    },
  ] as const;
  const v = pickFresh(rng, variants);
  let prompt: string;
  let letter: string;
  if (v.useAdj) {
    const adj = pickFresh(rng, adjectives);
    letter = adj[0]!.toUpperCase();
    prompt = v.phrasing(adj);
  } else {
    letter = pickDistinctLetters(rng, 1)[0]!;
    prompt = v.phrasing(letter);
  }
  const op = v.modal;
  const otherOp = op === '◇' ? '☐' : '◇';
  return buildQuestion(
    10,
    counter,
    prompt,
    [
      { raw: `${op}∼${letter}` },
      {
        raw: `∼${op}${letter}`,
        layer2:
          'Wrong scope — that means ‘not [' +
          (op === '☐' ? 'necessary' : 'possible') +
          ']’, not ‘[' +
          (op === '☐' ? 'necessary' : 'possible') +
          '] not’.',
      },
      {
        raw: `${otherOp}∼${letter}`,
        layer2:
          'Wrong modal — ‘' +
          (op === '☐' ? 'must / necessary' : 'could / possible') +
          '’ maps to ‘' +
          op +
          '’.',
      },
      { raw: `${op}∼(${letter})`, layer2: HINT_NOT_WFF },
    ],
    0,
    op === '☐'
      ? 'Translate ‘must’ / ‘necessary’ as ‘☐’ — the modal applies to the negation of the proposition.'
      : 'Translate ‘could’ / ‘possible’ as ‘◇’ — the modal applies to the negation of the proposition.'
  );
}

/**
 * *12 — Non-modal counterexamples: "If H then J" / "H is true" /
 * "If you're a U then you're V" / "You're a U".
 *
 * These prompts have **no modal content** — the correct answer is
 * just the propositional translation (no ☐ / ◇). The wrong options
 * inject spurious modals; pedagogical point is "don't over-apply
 * modal operators when the English doesn't claim necessity or
 * possibility."
 */
function template12(rng: Rng, counter: number): Question {
  // Two shapes: simple letter or letter-with-conditional.
  const useConditional = rng() < 0.5;
  const useNL = rng() < 0.5;
  let prompt: string;
  let correct: string;
  if (useConditional) {
    if (useNL) {
      const noun = pickFresh(rng, nounsProfessions);
      const adj = pickFresh(rng, adjectives);
      const [u, v] = [noun[0]!.toUpperCase(), adj[0]!.toUpperCase()];
      prompt = `If you’re ${indefiniteArticle(noun)} ${noun} then you’re ${adj}.`;
      correct = `(${u} ⊃ ${v})`;
    } else {
      const [h, j] = pickDistinctLetters(rng, 2);
      prompt = `If ${h} then ${j}.`;
      correct = `(${h} ⊃ ${j})`;
    }
    return buildQuestion(
      12,
      counter,
      prompt,
      [
        { raw: correct },
        {
          raw: `☐${correct}`,
          layer2: HINT_GET_RID_BOX + ' The English doesn’t claim ‘necessary’.',
        },
        {
          raw: correct.replace(' ⊃ ', ' ⊃ ☐'),
          layer2: HINT_GET_RID_BOX + ' The English doesn’t claim necessity.',
        },
        {
          raw: '(' + correct + ')',
          layer2: 'Extra outer parentheses make this a non-wff.',
        },
      ],
      0,
      'There’s no modal word in the English — translate without ‘☐’ or ‘◇’.'
    );
  } else {
    if (useNL) {
      const noun = pickFresh(rng, nounsProfessions);
      const u = noun[0]!.toUpperCase();
      prompt = `You’re ${indefiniteArticle(noun)} ${noun}.`;
      correct = u;
    } else {
      const h = pickDistinctLetters(rng, 1)[0]!;
      prompt = `${h} is true.`;
      correct = h;
    }
    return buildQuestion(
      12,
      counter,
      prompt,
      [
        { raw: correct },
        {
          raw: `☐${correct}`,
          layer2: HINT_GET_RID_BOX + ' The English doesn’t claim ‘necessary’.',
        },
        {
          raw: `◇${correct}`,
          layer2:
            'The English doesn’t claim ‘possible’ either — translate without a modal.',
        },
        {
          raw: `☐(${correct})`,
          layer2: HINT_NOT_WFF + ' (And there shouldn’t be a ‘☐’ at all.)',
        },
      ],
      0,
      'There’s no modal word in the English — translate without ‘☐’ or ‘◇’.'
    );
  }
}

/** *11 — "H doesn't entail J" → ∼☐(H ⊃ J) */
function template11(rng: Rng, counter: number): Question {
  const [h, j] = pickDistinctLetters(rng, 2);
  return buildQuestion(
    11,
    counter,
    `${h} doesn’t entail ${j}.`,
    [
      { raw: `∼☐(${h} ⊃ ${j})` },
      { raw: `☐(${h} ⊃ ${j})`, layer2: HINT_FORGOT_NOT },
      {
        raw: `☐(${h} ⊃ ∼${j})`,
        layer2: 'That means ‘entails not-' + j + '’ — different claim.',
      },
      { raw: `(${h} ⊃ ∼${j})`, layer2: HINT_NEED_ANOTHER_MODAL },
    ],
    0,
    HINT_DOESNT_ENTAIL
  );
}

/** *13 — "If J is necessary, then H is necessary" → (☐J ⊃ ☐H) */
function template13(rng: Rng, counter: number): Question {
  const [h, j] = pickDistinctLetters(rng, 2);
  const useNec = rng() < 0.5;
  const op = useNec ? '☐' : '◇';
  const word = useNec ? 'necessary' : 'possible';
  return buildQuestion(
    13,
    counter,
    `If ${j} is ${word} then ${h} is ${word}.`,
    [
      { raw: `(${op}${j} ⊃ ${op}${h})` },
      {
        raw: `${op}(${j} ⊃ ${h})`,
        layer2: 'Use a separate ‘' + op + '’ for each English ‘' + word + '’.',
      },
      {
        raw: `(${op}${h} ⊃ ${op}${j})`,
        layer2: 'You switched the antecedent and consequent.',
      },
      { raw: `${op}(${j}) ⊃ ${op}(${h})`, layer2: HINT_NOT_WFF },
    ],
    0,
    HINT_IF_NEC_THEN_NEC
  );
}

/** *14 — "Either H is necessary or J is necessary" → (☐H ∨ ☐J) */
function template14(rng: Rng, counter: number): Question {
  const [h, j] = pickDistinctLetters(rng, 2);
  return buildQuestion(
    14,
    counter,
    `Either ${h} is necessary or ${j} is necessary.`,
    [
      { raw: `(☐${h} ∨ ☐${j})` },
      {
        raw: `☐(${h} ∨ ${j})`,
        layer2: 'Use a separate ‘☐’ for each English ‘necessary’.',
      },
      { raw: `(☐${h} ∨ ${j})`, layer2: 'You forgot the second ‘☐’.' },
      { raw: `(${h} ∨ ☐${j})`, layer2: 'You forgot the first ‘☐’.' },
    ],
    0,
    HINT_EITHER_NEC
  );
}

/** *15 — "It's possible that both H and J" → ◇(H · J) */
function template15(rng: Rng, counter: number): Question {
  const [h, j] = pickDistinctLetters(rng, 2);
  return buildQuestion(
    15,
    counter,
    `It’s possible that both ${h} and ${j}.`,
    [
      { raw: `◇(${h} · ${j})` },
      {
        raw: `(◇${h} · ◇${j})`,
        layer2:
          'Use ONE diamond outside the conjunction, not one per conjunct.',
      },
      {
        raw: `(◇${h} · ${j})`,
        layer2: 'The diamond should scope over the whole conjunction.',
      },
      { raw: `◇${h} · ◇${j}`, layer2: HINT_NOT_WFF },
    ],
    0,
    HINT_POSS_BOTH
  );
}

/** *16 — "J is a contingent statement" → (◇J · ◇∼J) */
function template16(rng: Rng, counter: number): Question {
  const letter = pickDistinctLetters(rng, 1)[0]!;
  return buildQuestion(
    16,
    counter,
    `${letter} is a contingent statement.`,
    [
      { raw: `(◇${letter} · ◇∼${letter})` },
      { raw: `(${letter} · ◇∼${letter})`, layer2: HINT_CONTINGENT_VS_TRUTH },
      { raw: `◇${letter}`, layer2: HINT_CONTINGENT_MORE_THAN_POSSIBLE },
      {
        raw: `(☐${letter} · ☐∼${letter})`,
        layer2:
          'That’s contradictory — both necessary and impossible. A contingent statement is POSSIBLE both ways.',
      },
    ],
    0,
    HINT_CONTINGENT_STMT
  );
}

/** *17 — "J is a contingent truth" → (J · ◇∼J) */
function template17(rng: Rng, counter: number): Question {
  const letter = pickDistinctLetters(rng, 1)[0]!;
  return buildQuestion(
    17,
    counter,
    `${letter} is a contingent truth.`,
    [
      { raw: `(${letter} · ◇∼${letter})` },
      { raw: `(◇${letter} · ◇∼${letter})`, layer2: HINT_CONTINGENT_VS_TRUTH },
      {
        raw: `${letter}`,
        layer2: 'You forgot the ‘could have been false’ part.',
      },
      {
        raw: `(${letter} · ∼${letter})`,
        layer2:
          'That’s a self-contradiction. The second conjunct should be ‘◇∼’ — could have been false.',
      },
    ],
    0,
    HINT_CONTINGENT_TRUTH
  );
}

/** *18 — "J is consistent with K" → ◇(J · K) */
function template18(rng: Rng, counter: number): Question {
  const [j, k] = pickDistinctLetters(rng, 2);
  const word = rng() < 0.5 ? 'consistent' : 'compatible';
  return buildQuestion(
    18,
    counter,
    `${j} is ${word} with ${k}.`,
    [
      { raw: `◇(${j} · ${k})` },
      { raw: `(${j} · ${k})`, layer2: HINT_NEED_ANOTHER_MODAL },
      {
        raw: `(◇${j} · ◇${k})`,
        layer2: 'One diamond outside, not one per conjunct.',
      },
      {
        raw: `☐(${j} · ${k})`,
        layer2:
          'Wrong modal — ‘consistent with’ means ‘possibly both’, not ‘necessarily both’.',
      },
    ],
    0,
    HINT_CONSISTENT
  );
}

/** *19 — "J is incompatible with K" → ∼◇(J · K) */
function template19(rng: Rng, counter: number): Question {
  const [j, k] = pickDistinctLetters(rng, 2);
  const word = rng() < 0.5 ? 'incompatible' : 'inconsistent';
  return buildQuestion(
    19,
    counter,
    `${j} is ${word} with ${k}.`,
    [
      { raw: `∼◇(${j} · ${k})` },
      { raw: `◇(${j} · ${k})`, layer2: HINT_FORGOT_NOT },
      { raw: `∼(${j} · ${k})`, layer2: HINT_NEED_ANOTHER_MODAL },
      {
        raw: `(∼${j} · ∼${k})`,
        layer2:
          'That says both are false — different from ‘can’t both be true’.',
      },
    ],
    0,
    HINT_INCOMPATIBLE
  );
}

/** *20 — "K-and-J entails H" → ☐((K · J) ⊃ H) */
function template20(rng: Rng, counter: number): Question {
  const [h, j, k] = pickDistinctLetters(rng, 3);
  return buildQuestion(
    20,
    counter,
    `${k}-and-${j} entails ${h}.`,
    [
      { raw: `☐((${k} · ${j}) ⊃ ${h})` },
      {
        raw: `((${k} · ${j}) ⊃ ☐${h})`,
        layer2: 'Box-inside reading — ‘entails’ disambiguates to box-outside.',
      },
      {
        raw: `(☐(${k} ⊃ ${h}) · ☐(${j} ⊃ ${h}))`,
        layer2: 'Each conjunct alone needn’t entail ' + h + '; only the whole.',
      },
      { raw: `(${k} · ${j}) ⊃ ${h}`, layer2: HINT_NEED_ANOTHER_MODAL },
    ],
    0,
    HINT_ENTAILS
  );
}

/** *21 — "It's possible that H is necessary" → ◇☐H */
function template21(rng: Rng, counter: number): Question {
  const letter = pickDistinctLetters(rng, 1)[0]!;
  return buildQuestion(
    21,
    counter,
    `It’s possible that ${letter} is necessary.`,
    [
      { raw: `◇☐${letter}` },
      {
        raw: `☐◇${letter}`,
        layer2:
          'You swapped the modals — ‘possible that necessary’ has ◇ outside.',
      },
      { raw: `☐${letter}`, layer2: HINT_NEED_ANOTHER_MODAL },
      { raw: `◇${letter}`, layer2: HINT_NEED_ANOTHER_MODAL },
    ],
    0,
    HINT_ITERATED
  );
}

// =============================================================
// Quantified templates (*22..*30)
// =============================================================

/** *22 — "It's possible that someone is W" → ◇(∃x)Wx */
function template22(rng: Rng, counter: number): Question {
  const adj = pickFresh(rng, adjectives);
  const W = adj[0]!.toUpperCase();
  return buildQuestion(
    22,
    counter,
    `It’s possible that someone is ${adj}.`,
    [
      { raw: `◇(∃x)${W}x` },
      {
        raw: `(∃x)◇${W}x`,
        layer2:
          'Wrong scope — that means ‘there’s some x such that x could be ' +
          adj +
          '’ (anyone). Different claim.',
      },
      {
        raw: `◇(x)${W}x`,
        layer2: 'That means ‘possibly everyone’ — wrong quantifier.',
      },
      { raw: `∼◇(∃x)${W}x`, layer2: HINT_FORGOT_NOT + ' (You added a ‘not’.)' },
    ],
    0,
    HINT_POSS_SOMEONE
  );
}

/** *23 — "It's necessary that everyone is V" → ☐(x)Vx */
function template23(rng: Rng, counter: number): Question {
  const adj = pickFresh(rng, adjectives);
  const V = adj[0]!.toUpperCase();
  return buildQuestion(
    23,
    counter,
    `It’s necessary that everyone is ${adj}.`,
    [
      { raw: `☐(x)${V}x` },
      {
        raw: `(x)☐${V}x`,
        layer2:
          'Wrong scope — that means ‘each person is necessarily ' +
          adj +
          '’ (de re). Different claim.',
      },
      {
        raw: `☐(∃x)${V}x`,
        layer2:
          'That means ‘necessarily someone is ' + adj + '’ — wrong quantifier.',
      },
      { raw: `(x)${V}x`, layer2: HINT_NEED_ANOTHER_MODAL },
    ],
    0,
    HINT_NEC_EVERYONE
  );
}

/** *24 — "It's possible for anyone to be W" → (x)◇Wx */
function template24(rng: Rng, counter: number): Question {
  const adj = pickFresh(rng, adjectives);
  const W = adj[0]!.toUpperCase();
  return buildQuestion(
    24,
    counter,
    `It’s possible for anyone to be ${adj}.`,
    [
      { raw: `(x)◇${W}x` },
      {
        raw: `◇(x)${W}x`,
        layer2:
          '‘Anyone could be’ ≠ ‘Everyone could be’. Anyone → (x)◇; everyone-could-be → ◇(x).',
      },
      {
        raw: `(∃x)◇${W}x`,
        layer2: '‘Anyone’ takes a universal ‘(x)’, not an existential.',
      },
      { raw: `(x)${W}x`, layer2: HINT_NEED_ANOTHER_MODAL },
    ],
    0,
    HINT_ANYONE
  );
}

/** *25 — "Everyone is necessarily V" (de re) → (x)☐Vx */
function template25(rng: Rng, counter: number): Question {
  const adj = pickFresh(rng, adjectives);
  const V = adj[0]!.toUpperCase();
  // Only the disambiguated phrasing is used. Gensler §11.2 treats the
  // bare "Everyone is necessarily A" as AMBIGUOUS (de re (x)☐Vx vs de
  // dicto ☐(x)Vx — both valid), so keying one as correct would mark the
  // other wrong. The 2008 engine's *25 ships only this "has the property
  // of being necessarily" wording, which unambiguously means de re; the
  // ambiguous form is drilled separately by *28.
  return buildQuestion(
    25,
    counter,
    `Everyone has the property of being necessarily ${adj}.`,
    [
      { raw: `(x)☐${V}x` },
      {
        raw: `☐(x)${V}x`,
        layer2:
          'That’s the de dicto reading; ‘has the property of being necessarily ' +
          adj +
          '’ disambiguates to de re.',
      },
      { raw: `(x)${V}x`, layer2: HINT_NEED_ANOTHER_MODAL },
      { raw: `(∃x)☐${V}x`, layer2: 'Wrong quantifier — should be universal.' },
    ],
    0,
    HINT_NEC_PROP
  );
}

/** *26 — "Being V is a contingent property of X" → (Vn · ◇∼Vn) where n=name letter */
function template26(rng: Rng, counter: number): Question {
  const adj = pickFresh(rng, adjectives);
  const name = pickFresh(rng, names);
  const V = adj[0]!.toUpperCase();
  const n = name[0]!.toLowerCase();
  const word = rng() < 0.5 ? 'contingent' : 'accidental';
  return buildQuestion(
    26,
    counter,
    `Being ${adj} is ${indefiniteArticle(word)} ${word} property of ${name}.`,
    [
      { raw: `(${V}${n} · ◇∼${V}${n})` },
      {
        raw: `(◇${V}${n} · ◇∼${V}${n})`,
        layer2:
          'A contingent property of ' +
          name +
          ' means ' +
          name +
          ' actually has it — first conjunct should be ‘' +
          V +
          n +
          '’, not ‘◇' +
          V +
          n +
          '’.',
      },
      {
        raw: `☐${V}${n}`,
        layer2:
          'That’s the necessary-property form. Contingent means it actually has it but COULD have lacked it.',
      },
      {
        raw: `(${V}${n} · ∼${V}${n})`,
        layer2:
          'Self-contradiction. The second conjunct should say ‘could have lacked it’ — `◇∼' +
          V +
          n +
          '`.',
      },
    ],
    0,
    HINT_CONT_PROP
  );
}

/** *27 — "Being W is a necessary property of X" → ☐Wn */
function template27(rng: Rng, counter: number): Question {
  const adj = pickFresh(rng, adjectives);
  const name = pickFresh(rng, names);
  const W = adj[0]!.toUpperCase();
  const n = name[0]!.toLowerCase();
  const word = rng() < 0.5 ? 'necessary' : 'essential';
  return buildQuestion(
    27,
    counter,
    `Being ${adj} is ${indefiniteArticle(word)} ${word} property of ${name}.`,
    [
      { raw: `☐${W}${n}` },
      { raw: `${W}${n}`, layer2: HINT_NEED_ANOTHER_MODAL },
      { raw: `☐(${W}${n})`, layer2: HINT_NOT_WFF },
      {
        raw: `(${W}${n} · ◇∼${W}${n})`,
        layer2: 'That’s the contingent-property form, not necessary.',
      },
    ],
    0,
    HINT_NEC_PROP
  );
}

/** *28 — "All Us are necessarily W" → AMBIGUOUS */
function template28(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickFresh(rng, adjectives);
  const U = noun[0]!.toUpperCase();
  const W = adj[0]!.toUpperCase();
  const phrasings = [
    `All ${noun}s are necessarily ${adj}.`,
    `Every ${noun} is necessarily ${adj}.`,
  ];
  return buildQuestion(
    28,
    counter,
    pickFresh(rng, phrasings),
    [
      {
        raw: `Ambiguous between (x)(${U}x ⊃ ☐${W}x) and ☐(x)(${U}x ⊃ ${W}x)`,
        plain: true,
      },
      {
        raw: `(x)(${U}x ⊃ ☐${W}x)`,
        layer2:
          'You missed the ambiguity — ☐(x)(' +
          U +
          'x ⊃ ' +
          W +
          'x) is also a valid reading.',
      },
      {
        raw: `☐(x)(${U}x ⊃ ${W}x)`,
        layer2:
          'You missed the ambiguity — (x)(' +
          U +
          'x ⊃ ☐' +
          W +
          'x) is also a valid reading.',
      },
      { raw: `☐(x)(${U}x ⊃ ☐${W}x)`, layer2: HINT_TOO_MANY_BOXES },
    ],
    0,
    HINT_ALL_NEC_AMBIG
  );
}

/** *29 — "It's necessary that all Us are W" → ☐(x)(Ux ⊃ Wx) */
function template29(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickFresh(rng, adjectives);
  const U = noun[0]!.toUpperCase();
  const W = adj[0]!.toUpperCase();
  return buildQuestion(
    29,
    counter,
    `It’s necessary that all ${noun}s are ${adj}.`,
    [
      { raw: `☐(x)(${U}x ⊃ ${W}x)` },
      {
        raw: `(x)(${U}x ⊃ ☐${W}x)`,
        layer2:
          'That’s the de re (box-inside) reading. ‘Necessary that …’ disambiguates to box-outside.',
      },
      {
        raw: `Ambiguous between (x)(${U}x ⊃ ☐${W}x) and ☐(x)(${U}x ⊃ ${W}x)`,
        plain: true,
        layer2: HINT_NOT_AMBIGUOUS + ' ‘It’s necessary that …’ disambiguates.',
      },
      { raw: `☐(x)(${U}x ⊃ ☐${W}x)`, layer2: HINT_TOO_MANY_BOXES },
    ],
    0,
    HINT_NEC_THAT_ALL
  );
}

/** *30 — "All Us have the property of being necessarily W" → (x)(Ux ⊃ ☐Wx) */
function template30(rng: Rng, counter: number): Question {
  const noun = pickFresh(rng, nounsProfessions);
  const adj = pickFresh(rng, adjectives);
  const U = noun[0]!.toUpperCase();
  const W = adj[0]!.toUpperCase();
  const phrasings = [
    `All ${noun}s have the property of being necessarily ${adj}.`,
    `Every ${noun} has the property of being necessarily ${adj}.`,
  ];
  return buildQuestion(
    30,
    counter,
    pickFresh(rng, phrasings),
    [
      { raw: `(x)(${U}x ⊃ ☐${W}x)` },
      {
        raw: `☐(x)(${U}x ⊃ ${W}x)`,
        layer2:
          'That’s the de dicto (box-outside) reading. ‘Property of being necessarily …’ disambiguates to box-inside.',
      },
      {
        raw: `Ambiguous between (x)(${U}x ⊃ ☐${W}x) and ☐(x)(${U}x ⊃ ${W}x)`,
        plain: true,
        layer2:
          HINT_NOT_AMBIGUOUS +
          ' ‘Property of being necessarily …’ disambiguates.',
      },
      { raw: `☐(x)(${U}x ⊃ ☐${W}x)`, layer2: HINT_TOO_MANY_BOXES },
    ],
    0,
    HINT_HAVE_NEC_PROP
  );
}

// =============================================================
// Iterators
// =============================================================

const basicTemplates = [
  template0,
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
  template7,
  template8,
  template9,
  template10,
  template11,
  template12,
  template13,
  template14,
  template15,
  template16,
  template17,
  template18,
  template19,
  template20,
  template21,
] as const;

const quantifiedTemplates = [
  template22,
  template23,
  template24,
  template25,
  template26,
  template27,
  template28,
  template29,
  template30,
] as const;

export function* basicQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFresh(rng, basicTemplates);
    yield renderer(rng, counter++);
  }
}

export function* quantifiedQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFresh(rng, quantifiedTemplates);
    yield renderer(rng, counter++);
  }
}

// =============================================================
// Top-level Set generator
// =============================================================

function take<T>(it: Generator<T>, n: number): T[] {
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    const r = it.next();
    if (r.done) break;
    out.push(r.value);
  }
  return out;
}

export function generateSetJ(seed?: number, perSubset = 10): Set {
  const seedFor = (offset: number) =>
    seed != null ? seed + offset : undefined;
  return {
    name: 'Set J',
    logicType: 'Modal',
    slugs: ['modal', 'translations', 'basic'],
    id: 4,
    title: 'Modal Translations: Basic',
    header: 'Translates into logic as:',
    subSets: [
      {
        name: 'Set J',
        logicType: 'Modal',
        isNew: true,
        shuffleOptions: true,
        slugs: ['modal', 'translations', 'basic'],
        id: 4,
        title: 'Modal Translations: Basic',
        header: 'Translates into logic as:',
        description:
          'Translate claims about what is necessary, possible, and contingent into the box and diamond of modal logic.',
        questions: take(basicQuestions(seedFor(1)), perSubset),
      },
      {
        name: 'Set J',
        logicType: 'Modal',
        isNew: true,
        shuffleOptions: true,
        slugs: ['modal', 'translations', 'quantified'],
        id: 4,
        title: 'Modal Translations: Quantified',
        header: 'Translates into logic as:',
        description:
          'Mix modality with quantifiers, where the order of box, diamond, and “all” changes what a claim says.',
        questions: take(quantifiedQuestions(seedFor(2)), perSubset),
      },
    ],
  };
}
