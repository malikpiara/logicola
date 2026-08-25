/**
 * Set N — Belief Translations: live-random generator.
 *
 * Phase 1 / T1.2 (carries P0). Ports Gensler's 2008 LCEXE Set N
 * as a procedural drill engine. Coverage: belief-logic
 * translations across three subsets matching Gensler's chapter 13
 * structure:
 *
 *   - **Believing** (§13.1): descriptive vs imperative belief,
 *     conditional belief, don't-combine, quantified believe.
 *   - **Willing** (§13.5 wanting/resolving forms): wanting
 *     someone to do A, wanting everyone to do A, resolution
 *     forms, don't-want patterns.
 *   - **Rationality** (§13.5): ought-to-believe, evident,
 *     reasonable, take-no-position, knowledge.
 *
 * Cross-checked against Gensler 3rd ed. §13.1 + §13.5 (see
 * `notes/textbook/setN.md`). The 2008 source has 30 conditional
 * feedback messages (`*30`–`*54` — the largest hint catalog of
 * any set); their pedagogical content is distilled into
 * Layer-1 + Layer-2 hints below.
 *
 * **Note on the prompt-truncation bug** (audit notes Tier 1
 * priority): the static `setN.ts` has all 6 Rationality
 * questions sharing the same prompt with 6 different correct
 * answers. The generator can't reproduce that bug — every prompt
 * here is freshly generated to match its formula. Once the live
 * runtime serves the generator, the bug is invisible to users.
 *
 * Underline convention: same as Set L — spec strings use `{X}`
 * shorthand to mark underlined letters; `toKatex` converts these
 * to `\underline{X}` at render time.
 *
 * Belief-operator notation:
 *   `u:A`     = "you believe A" (descriptive)
 *   `{u}:A`   = "Believe A!" (imperative — underlined u)
 *   `O{u}:A`  = "you ought to believe A" / "A is evident to you"
 *   `R{u}:A`  = "A is reasonable for you to believe"
 */

import type { Option, Question, Set } from '../types';
import { rngFromSeed, pickFresh, type Rng } from '@/lib/rng';
import { names, verbsB, verbsTransitive } from '../lexicons';

// =============================================================
// KaTeX rendering
// =============================================================

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

/**
 * Convert a Unicode-operator wff to KaTeX inline-math markup.
 * `{X}` (single letter inside braces) renders as `\underline{X}`.
 */
function toKatex(wff: string): string {
  let out = wff;
  for (const [unicode, latex] of KATEX_OPS) {
    out = out.split(unicode).join(latex);
  }
  out = out.replace(/\{([A-Za-z])\}/g, '\\underline{$1}');
  return `$ ${out} $`;
}

// =============================================================
// Layer-1 idiom hints (per Gensler §13.1 + §13.5)
// =============================================================

const HINT_DESC_BELIEF =
  'Descriptive belief: ‘You believe that A’ → `u:A`. The lowercase u (NOT underlined) plus colon plus the wff.';
const HINT_IMP_BELIEF =
  'Imperative belief: ‘Believe A!’ → `{u}:A`. The u is UNDERLINED — the underline marks the imperative addressed to you.';
const HINT_NEG_BELIEF =
  '‘You don’t believe A’ → `∼u:A`. Negation outside the colon. Different from ‘You believe not-A’ → `u:∼A`.';
const HINT_BELIEVE_FALSE =
  '‘Believe that A is false’ → `{u}:∼A`. Underlined u (imperative) plus colon plus negated wff.';
const HINT_NO_POSITION =
  '‘You take no position on A’ → `(∼u:A · ∼u:∼A)`: you don’t believe A AND you don’t believe not-A.';
const HINT_COND_BELIEF =
  '‘If you believe A, then don’t believe B’ → `(u:A ⊃ ∼{u}:B)`. The antecedent is descriptive (you do believe), the consequent is imperative (don’t-believe-it!).';
const HINT_DONT_COMBINE_BELIEF =
  '‘Don’t combine believing A with believing B’ → `∼({u}:A · {u}:B)`. Forbids the conjunction; both inner u’s are imperative.';
const HINT_DONT_COMBINE_WILL =
  '‘Don’t combine believing that you ought to do A with not acting to do A’ → `∼({u}:OA{u} · ∼{u}:A{u})`. Forbid the combination and underline both parts — believing and acting are both accepted with an imperative ‘u’.';
const HINT_QUANT_BELIEVE =
  '‘Everyone believes that they ought to do A’ → `(x)x:OA{x}`. The outer (x) binds the believer, and the inner OA{x} says ‘you ought to do A’ for each x.';
const HINT_WANT_SOMEONE =
  '‘You want X to do A’ → `u:A{X}`. Outer u: is descriptive (you do want this); inner A{X} is the imperative ‘X, do A!’ (X is the agent told to do A — so X gets underlined).';
const HINT_WANT_EVERYONE =
  '‘You want everyone to do A’ → `u:(x)A{x}`. Outer u: is descriptive (you do want this); inner (x)A{x} is the universal imperative ‘let everyone do A’.';
const HINT_RESOLVE =
  '‘You resolve to do A’ = ‘You accept the imperative for you to do A’ → `u:A{u}`. The outer u: is your accepting the imperative; the inner A{u} is the imperative addressed to you.';
const HINT_OUGHT_BELIEVE =
  '‘You ought to believe A’ / ‘A is evident to you’ → `O{u}:A`. The O attaches to the imperative-believe wff; cannot attach to descriptive `u:A`.';
const HINT_REASONABLE =
  '‘A is reasonable for you to believe’ → `R{u}:A`. R is the deontic permission operator; like O, it attaches only to imperative wffs.';
const HINT_UNREASONABLE =
  '‘It would be unreasonable for you to believe A’ → `∼R{u}:A` (= `O∼{u}:A`). Saying it’s NOT permissible to believe.';
const HINT_TNP_REASONABLE =
  '‘It would be reasonable for you to take no position on A’ → `R(∼{u}:A · ∼{u}:∼A)`. R wraps the don’t-believe-A AND don’t-believe-not-A imperative conjunction.';
const HINT_EVIDENT_TRANSITIVE =
  '‘If it’s evident to you that A, then it’s evident to you that B’ → `(O{u}:A ⊃ O{u}:B)`. Each side has its own imperative-believe operator.';
const HINT_OUGHT_NOT_COMBINE_BELIEF =
  '‘You ought not to combine believing A with believing not-A’ → `O∼({u}:A · {u}:∼A)`. The O wraps the negation of the conjunction.';
const HINT_KNOWLEDGE =
  'Gensler’s knowledge-as-evident-true-belief: “you know A” ≈ `(O{u}:A · A · u:A)` — A is evident to you, A is true, AND you actually believe A.';

// =============================================================
// Layer-2 hints (per-mistake)
// =============================================================

const HINT_FORGOT_UNDERLINE_U =
  'You forgot to underline the u — descriptive `u:A` and imperative `{u}:A` are different wffs.';
const HINT_O_ON_DESCRIPTIVE =
  '‘O’ must attach to an imperative wff — write `O{u}:A`, not `Ou:A`.';
const HINT_R_ON_DESCRIPTIVE =
  '‘R’ must attach to an imperative wff — write `R{u}:A`, not `Ru:A`.';
const HINT_NEG_SCOPE =
  'Negation scope: `∼u:A` (you don’t believe A) ≠ `u:∼A` (you believe not-A). Different positions of ‘∼’ mean different things.';
const HINT_USE_O_FOR_OUGHT = '‘Ought’ uses `O`. Don’t drop it.';
const HINT_DESCRIBES_VS_TELLS_DESC =
  'Since the sentence DESCRIBES what you believe, the letter before ‘:’ should NOT be underlined.';
const HINT_DESCRIBES_VS_TELLS_IMP =
  'Since the sentence TELLS what to believe, the letter before ‘:’ SHOULD be underlined.';

// =============================================================
// Helpers
// =============================================================

/**
 * Pool of single-letter atomic propositions for Set N. We avoid
 * I/O/R/U/X/Y because: I is confusable with 1 / pronoun, O and R
 * are operators, U/X/Y are typically agent or quantifier letters.
 */
const PROP_LETTERS: readonly string[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
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
  'S',
  'T',
  'V',
  'W',
  'Z',
] as const;

function pickDistinctLetters(rng: Rng, n: 1 | 2 | 3): string[] {
  const pool = [...PROP_LETTERS];
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool[idx]!);
    pool.splice(idx, 1);
  }
  return out;
}

function pickDifferentLetter<T extends string>(
  rng: Rng,
  pool: readonly T[],
  avoid: string
): T {
  // Reject predicate, not a filtered copy — see pickFresh in lib/rng.ts.
  const initial = avoid[0]!.toLowerCase();
  return pickFresh(rng, pool, {
    reject: (x) => x[0]!.toLowerCase() === initial,
  });
}

function qid(num: number, n: number): string {
  return `gen.N.${num}.${n}`;
}

interface OptionPiece {
  raw: string;
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
    const label = toKatex(p.raw);
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
// Believing subset
// =============================================================

/** Descriptive: "You believe that A is true" → u:A */
function believingDescriptive(rng: Rng, counter: number): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const prompt = pickFresh(rng, [
    `You believe that ${A} is true.`,
    `You believe ${A}.`,
    `You take ${A} to be true.`,
    `You hold that ${A} is true.`,
  ]);
  return buildQuestion(
    0,
    counter,
    prompt,
    [
      { raw: `u:${A}` },
      { raw: `{u}:${A}`, layer2: HINT_DESCRIBES_VS_TELLS_DESC },
      {
        raw: `u:∼${A}`,
        layer2: 'That means ‘you believe ' + A + ' is FALSE’ — wrong polarity.',
      },
      {
        raw: `∼u:${A}`,
        layer2: 'That means ‘you DON’T believe ' + A + '’ — wrong polarity.',
      },
    ],
    0,
    HINT_DESC_BELIEF
  );
}

/** Imperative: "Believe that A is true" → {u}:A */
function believingImperative(rng: Rng, counter: number): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const prompt = pickFresh(rng, [
    `Believe that ${A} is true.`,
    `Believe ${A}.`,
    `Take ${A} to be true.`,
  ]);
  return buildQuestion(
    1,
    counter,
    prompt,
    [
      { raw: `{u}:${A}` },
      { raw: `u:${A}`, layer2: HINT_DESCRIBES_VS_TELLS_IMP },
      {
        raw: `{u}:∼${A}`,
        layer2: 'That commands believing ' + A + ' is FALSE — wrong polarity.',
      },
      { raw: `O{u}:${A}`, layer2: USE_O_REMOVE_O('imperative-believe') },
    ],
    0,
    HINT_IMP_BELIEF
  );
}

/** Negated descriptive: "You don't believe that A is true" → ∼u:A */
function believingNegated(rng: Rng, counter: number): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const variant = pickFresh(rng, ['descriptive-not', 'imperative-not']);
  if (variant === 'descriptive-not') {
    const prompt = pickFresh(rng, [
      `You don’t believe that ${A} is true.`,
      `You don’t believe ${A}.`,
      `You don’t take ${A} to be true.`,
    ]);
    return buildQuestion(
      2,
      counter,
      prompt,
      [
        { raw: `∼u:${A}` },
        { raw: `u:∼${A}`, layer2: HINT_NEG_SCOPE },
        { raw: `∼{u}:${A}`, layer2: HINT_DESCRIBES_VS_TELLS_DESC },
        {
          raw: `{u}:∼${A}`,
          layer2:
            'That commands believing not-' +
            A +
            ' — wrong on two counts: imperative + scope.',
        },
      ],
      0,
      HINT_NEG_BELIEF
    );
  }
  const prompt = pickFresh(rng, [
    `Don’t believe that ${A} is true.`,
    `Don’t believe ${A}.`,
    `Refuse to believe ${A}.`,
  ]);
  return buildQuestion(
    2,
    counter,
    prompt,
    [
      { raw: `∼{u}:${A}` },
      {
        raw: `{u}:∼${A}`,
        layer2: HINT_NEG_SCOPE + ' Here it’s the IMPERATIVE form.',
      },
      { raw: `∼u:${A}`, layer2: HINT_DESCRIBES_VS_TELLS_IMP },
      {
        raw: `u:∼${A}`,
        layer2:
          'That describes (you believe not-A) instead of telling (don’t believe A).',
      },
    ],
    0,
    HINT_NEG_BELIEF
  );
}

/** Believe that A is false: "Believe that A is false" → {u}:∼A */
function believingFalse(rng: Rng, counter: number): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const prompt = pickFresh(rng, [
    `Believe that ${A} is false.`,
    `Believe not-${A}.`,
    `Take ${A} to be false.`,
  ]);
  return buildQuestion(
    3,
    counter,
    prompt,
    [
      { raw: `{u}:∼${A}` },
      { raw: `u:∼${A}`, layer2: HINT_DESCRIBES_VS_TELLS_IMP },
      {
        raw: `∼{u}:${A}`,
        layer2:
          HINT_NEG_SCOPE +
          ' This commands DON’T-believe rather than believe-not.',
      },
      { raw: `{u}:${A}`, layer2: 'You forgot the negation.' },
    ],
    0,
    HINT_BELIEVE_FALSE
  );
}

/** Take no position: "You take no position on A" → (∼u:A · ∼u:∼A) */
function believingNoPosition(rng: Rng, counter: number): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const prompt = pickFresh(rng, [
    `You don’t believe ${A} and you don’t believe not-${A}.`,
    `You take no position on ${A}.`,
    `You’re agnostic about ${A}.`,
  ]);
  return buildQuestion(
    4,
    counter,
    prompt,
    [
      { raw: `(∼u:${A} · ∼u:∼${A})` },
      {
        raw: `∼u:(${A} · ∼${A})`,
        layer2:
          'That says ‘you don’t believe a contradiction’ — different claim. The original says you don’t believe ' +
          A +
          ' AND don’t believe not-' +
          A +
          ', as separate beliefs.',
      },
      { raw: `(∼{u}:${A} · ∼{u}:∼${A})`, layer2: HINT_DESCRIBES_VS_TELLS_DESC },
      {
        raw: `(u:${A} · u:∼${A})`,
        layer2:
          'You inverted the negations — the prompt says you DON’T believe both.',
      },
    ],
    0,
    HINT_NO_POSITION
  );
}

/** Conditional belief: "If you believe A, then don't believe B" → (u:A ⊃ ∼{u}:B) */
function believingConditional(rng: Rng, counter: number): Question {
  const [A, B] = pickDistinctLetters(rng, 2);
  const prompt = pickFresh(rng, [
    `If you believe ${A}, then don’t believe ${B}.`,
    `Don’t believe ${B}, if you believe ${A}.`,
    `Refuse to believe ${B} if you believe ${A}.`,
  ]);
  return buildQuestion(
    5,
    counter,
    prompt,
    [
      { raw: `(u:${A} ⊃ ∼{u}:${B})` },
      {
        raw: `(u:${A} ⊃ ∼u:${B})`,
        layer2:
          HINT_DESCRIBES_VS_TELLS_IMP + ' (The consequent is imperative.)',
      },
      {
        raw: `({u}:${A} ⊃ ∼{u}:${B})`,
        layer2:
          HINT_DESCRIBES_VS_TELLS_DESC +
          ' (The antecedent ‘if you believe A’ describes — don’t underline.)',
      },
      {
        raw: `∼(u:${A} · {u}:${B})`,
        layer2:
          '‘If A then B’ is `(A ⊃ B)`, not `∼(A · B)`. The latter is the don’t-combine form.',
      },
    ],
    0,
    HINT_COND_BELIEF
  );
}

/** Don't combine: "Don't combine believing A with believing B" → ∼({u}:A · {u}:B) */
function believingDontCombine(rng: Rng, counter: number): Question {
  const [A, B] = pickDistinctLetters(rng, 2);
  const negSecond = rng() < 0.5;
  if (negSecond) {
    const prompt = pickFresh(rng, [
      `Don’t combine believing ${A} with believing not-${A}.`,
      `Don’t both believe ${A} and believe not-${A}.`,
      `Refuse to combine belief in ${A} with belief in not-${A}.`,
    ]);
    return buildQuestion(
      6,
      counter,
      prompt,
      [
        { raw: `∼({u}:${A} · {u}:∼${A})` },
        {
          raw: `({u}:${A} ⊃ ∼{u}:∼${A})`,
          layer2:
            '‘Don’t combine A with B’ ≠ ‘If A then ∼B’ — the don’t-combine form forbids the conjunction.',
        },
        {
          raw: `∼(u:${A} · u:∼${A})`,
          layer2:
            HINT_DESCRIBES_VS_TELLS_IMP +
            ' (Both inner u’s are imperative-believe.)',
        },
        {
          raw: `(∼{u}:${A} · ∼{u}:∼${A})`,
          layer2:
            'That says ‘don’t believe A AND don’t believe not-A’ (take-no-position) — different from forbidding their combination.',
        },
      ],
      0,
      HINT_DONT_COMBINE_BELIEF
    );
  }
  const prompt = pickFresh(rng, [
    `Don’t combine believing ${A} with believing ${B}.`,
    `Don’t both believe ${A} and believe ${B}.`,
    `Don’t hold both ${A} and ${B} as true.`,
  ]);
  return buildQuestion(
    6,
    counter,
    prompt,
    [
      { raw: `∼({u}:${A} · {u}:${B})` },
      {
        raw: `({u}:${A} ⊃ ∼{u}:${B})`,
        layer2:
          '‘Don’t combine A with B’ ≠ ‘If A then ∼B’ — the don’t-combine form forbids the conjunction.',
      },
      {
        raw: `∼(u:${A} · u:${B})`,
        layer2:
          HINT_DESCRIBES_VS_TELLS_IMP +
          ' (Both inner u’s are imperative-believe.)',
      },
      {
        raw: `(∼{u}:${A} · ∼{u}:${B})`,
        layer2:
          'That says ‘don’t believe A AND don’t believe B’ separately — different from forbidding their combination.',
      },
    ],
    0,
    HINT_DONT_COMBINE_BELIEF
  );
}

/** Quantified believe: "Everyone believes that they ought to do A" → (x)x:OA{x} */
function believingQuantified(rng: Rng, counter: number): Question {
  const verb = pickFresh(rng, verbsB);
  const V = verb[0]!.toUpperCase();
  const prompt = pickFresh(rng, [
    `Everyone believes that they ought to ${verb}.`,
    `Each person believes that they ought to ${verb}.`,
    `Everyone holds that they ought to ${verb}.`,
  ]);
  return buildQuestion(
    7,
    counter,
    prompt,
    [
      { raw: `(x)x:O${V}{x}` },
      {
        raw: `(x){x}:O${V}{x}`,
        layer2:
          'The outer believer is descriptive (each person ' +
          verb +
          's), don’t underline the first x.',
      },
      {
        raw: `O(x)x:${V}{x}`,
        layer2:
          'O scopes over a single imperative-believe wff, not the whole quantifier.',
      },
      {
        raw: `(x)x:${V}{x}`,
        layer2:
          HINT_USE_O_FOR_OUGHT + ' The prompt says ‘ought to ' + verb + '’.',
      },
    ],
    0,
    HINT_QUANT_BELIEVE
  );
}

// =============================================================
// Willing subset
// =============================================================

/** Want-someone-to: "You want X to harm you" → u:H{X}u */
function willingWantSomeone(rng: Rng, counter: number): Question {
  const verb = pickFresh(rng, verbsTransitive);
  const name = pickFresh(rng, names);
  const V = verb[0]!.toUpperCase();
  const n = name[0]!.toLowerCase();
  const prompt = pickFresh(rng, [
    `You want ${name} to ${verb} you.`,
    `You wish ${name} would ${verb} you.`,
    `You’d like ${name} to ${verb} you.`,
  ]);
  return buildQuestion(
    0,
    counter,
    prompt,
    [
      { raw: `u:${V}{${n}}u` },
      {
        raw: `u:${V}${n}u`,
        layer2:
          HINT_FORGOT_UNDERLINE_U.replace('the u', name + '’s letter ' + n) +
          ' (' +
          name +
          ' is the imperative agent.)',
      },
      {
        raw: `{u}:${V}{${n}}u`,
        layer2:
          HINT_DESCRIBES_VS_TELLS_DESC +
          ' (The outer u: describes you DOING the wanting.)',
      },
      {
        raw: `u:${V}${n}{u}`,
        layer2:
          'You underlined u (yourself) instead of ' +
          n +
          ' (' +
          name +
          '). The agent told to ' +
          verb +
          ' is ' +
          name +
          ', not you.',
      },
    ],
    0,
    HINT_WANT_SOMEONE
  );
}

/** Want-everyone-to: "You want everyone to laugh" → u:(x)L{x} */
function willingWantEveryone(rng: Rng, counter: number): Question {
  const verb = pickFresh(rng, verbsB);
  const V = verb[0]!.toUpperCase();
  const prompt = pickFresh(rng, [
    `You want everyone to ${verb}.`,
    `You wish everyone would ${verb}.`,
    `You’d like everyone to ${verb}.`,
  ]);
  return buildQuestion(
    1,
    counter,
    prompt,
    [
      { raw: `u:(x)${V}{x}` },
      {
        raw: `u:(x)${V}x`,
        layer2:
          HINT_FORGOT_UNDERLINE_U.replace('the u', 'the x') +
          ' (The inner ' +
          V +
          'x is imperative.)',
      },
      {
        raw: `{u}:(x)${V}{x}`,
        layer2:
          HINT_DESCRIBES_VS_TELLS_DESC +
          ' (The outer u: describes you DOING the wanting.)',
      },
      {
        raw: `u:(∃x)${V}{x}`,
        layer2: '‘Everyone’ is universal `(x)`, not existential `(∃x)`.',
      },
    ],
    0,
    HINT_WANT_EVERYONE
  );
}

/** Imperative-want: "Want everyone to laugh" → {u}:(x)L{x} */
function willingImperative(rng: Rng, counter: number): Question {
  const verb = pickFresh(rng, verbsB);
  const V = verb[0]!.toUpperCase();
  const prompt = pickFresh(rng, [
    `Want everyone to ${verb}.`,
    `Would that everyone ${verb}.`,
    `Wish that everyone would ${verb}.`,
  ]);
  return buildQuestion(
    2,
    counter,
    prompt,
    [
      { raw: `{u}:(x)${V}{x}` },
      {
        raw: `u:(x)${V}{x}`,
        layer2:
          HINT_DESCRIBES_VS_TELLS_IMP +
          ' (Outer u: is imperative — the prompt is a command to want.)',
      },
      {
        raw: `{u}:(x)${V}x`,
        layer2:
          HINT_FORGOT_UNDERLINE_U.replace('the u', 'the x') +
          ' (The inner ' +
          V +
          'x is also imperative.)',
      },
      {
        raw: `O{u}:(x)${V}{x}`,
        layer2:
          HINT_USE_O_FOR_OUGHT +
          ' — wait, the prompt doesn’t say ‘ought’, just ‘want’. Drop the O.',
      },
    ],
    0,
    HINT_WANT_EVERYONE
  );
}

/** Resolve-conditional: "If you are J, then you resolve to A" → (Ju ⊃ u:A{u}) */
function willingResolve(rng: Rng, counter: number): Question {
  const verb = pickFresh(rng, verbsB);
  const V = verb[0]!.toUpperCase();
  // Use a single-letter J for state, distinct from V
  const J = pickDifferentLetter(rng, PROP_LETTERS, V);
  const prompt = pickFresh(rng, [
    `If you are ${J}, then you resolve to ${verb}.`,
    `You’re resolved that if you are ${J} then you’ll ${verb}.`,
    `If you are ${J}, you commit yourself to ${verb}.`,
  ]);
  return buildQuestion(
    3,
    counter,
    prompt,
    [
      { raw: `(${J}u ⊃ u:${V}{u})` },
      {
        raw: `(${J}u ⊃ u:${V}u)`,
        layer2:
          HINT_FORGOT_UNDERLINE_U +
          ' (The inner ' +
          V +
          'u is the imperative ‘' +
          verb +
          '!’.)',
      },
      {
        raw: `(${J}{u} ⊃ u:${V}{u})`,
        layer2:
          HINT_DESCRIBES_VS_TELLS_DESC +
          ' (The antecedent ‘you ARE ' +
          J +
          '’ describes — don’t underline.)',
      },
      {
        raw: `(${J}u ⊃ {u}:${V}{u})`,
        layer2:
          HINT_DESCRIBES_VS_TELLS_DESC +
          ' (Outer u: is descriptive — you DO resolve, you’re not commanded to.)',
      },
    ],
    0,
    HINT_RESOLVE
  );
}

/**
 * Don't combine willing — Gensler's conscientiousness drill (2008 *15):
 * "Don't combine believing that you ought to A with not acting to A"
 *   → ∼({u}:OA{u} · ∼{u}:A{u})
 *
 * Both conjuncts are willing formulas with the u before the colon
 * underlined (2008 feedback: "Underline both parts."); "acting to
 * do A" is `u̲:Au̲`, never bare descriptive `Au`. Options mirror
 * 2008's grid: a `∼(u̲:OAu̲ · ∼u̲:Au̲)`, b `∼(u̲:OAu̲ · ∼Au̲)`,
 * c `(u:OAu̲ · ∼u̲:Au̲)`, d `(u:OAu̲ · ∼Au̲)`.
 */
function willingDontCombine(rng: Rng, counter: number): Question {
  const verb = pickFresh(rng, verbsB);
  const V = verb[0]!.toUpperCase();
  // Wording ported from main's e5c4a5e at the 2026-08-24 merge: the
  // earlier "wanting yourself to" prompts described a different mental
  // state than the ought-formula they were keyed to.
  const prompt = pickFresh(rng, [
    `Don’t combine believing that you ought to ${verb} with not acting to ${verb}.`,
    `Don’t believe that you ought to ${verb} without acting to ${verb}.`,
  ]);
  return buildQuestion(
    4,
    counter,
    prompt,
    [
      { raw: `∼({u}:O${V}{u} · ∼{u}:${V}{u})` },
      {
        raw: `∼({u}:O${V}{u} · ∼${V}{u})`,
        layer2:
          '‘Acting to ' +
          verb +
          '’ is itself a willing formula — `{u}:' +
          V +
          '{u}`, not bare `' +
          V +
          '{u}`. Underline both parts, including the u before the second colon.',
      },
      {
        raw: `(u:O${V}{u} · ∼{u}:${V}{u})`,
        layer2:
          'Use a formula that forbids a combination — the don’t-combine imperative is `∼( · )` with the u’s before the colons underlined.',
      },
      {
        raw: `(u:O${V}{u} · ∼${V}{u})`,
        layer2:
          'This describes you (a statement), it doesn’t forbid anything — the imperative is `∼( · )` with both parts underlined.',
      },
    ],
    0,
    HINT_DONT_COMBINE_WILL
  );
}

// =============================================================
// Rationality subset
// =============================================================

/** Ought-to-believe / evident: "You ought to believe A" → O{u}:A */
function rationalityOughtBelieve(rng: Rng, counter: number): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const prompt = pickFresh(rng, [
    `You ought to believe that ${A} is true.`,
    `You ought to believe ${A}.`,
    `It’s evident to you that ${A} is true.`,
    `${A} is evident to you.`,
    `It’s rationally required that you believe ${A}.`,
  ]);
  return buildQuestion(
    0,
    counter,
    prompt,
    [
      { raw: `O{u}:${A}` },
      { raw: `Ou:${A}`, layer2: HINT_O_ON_DESCRIPTIVE },
      {
        raw: `{u}:O${A}`,
        layer2:
          'Wrong scope — O attaches to the BELIEF wff, not to the inner proposition.',
      },
      {
        raw: `O${A}`,
        layer2:
          'You dropped the believer — `O' +
          A +
          '` is ‘' +
          A +
          ' is obligatory’, not ‘you ought to believe ' +
          A +
          '’.',
      },
    ],
    0,
    HINT_OUGHT_BELIEVE
  );
}

/** Reasonable-to-believe: "It's reasonable for you to believe A" → R{u}:A */
function rationalityReasonable(rng: Rng, counter: number): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const prompt = pickFresh(rng, [
    `It’s reasonable for you to believe that ${A} is true.`,
    `${A} is reasonable for you to believe.`,
    `Believing ${A} is reasonable for you.`,
    `It’s rationally permissible for you to believe ${A}.`,
  ]);
  return buildQuestion(
    1,
    counter,
    prompt,
    [
      { raw: `R{u}:${A}` },
      { raw: `Ru:${A}`, layer2: HINT_R_ON_DESCRIPTIVE },
      {
        raw: `O{u}:${A}`,
        layer2:
          'Wrong operator — ‘reasonable’ is `R`, ‘ought’ is `O`. ‘Reasonable’ is weaker.',
      },
      {
        raw: `{u}:R${A}`,
        layer2:
          'Wrong scope — R attaches to the BELIEF wff, not to the inner proposition.',
      },
    ],
    0,
    HINT_REASONABLE
  );
}

/** Unreasonable: "It would be unreasonable for you to believe A" → ∼R{u}:A */
function rationalityUnreasonable(rng: Rng, counter: number): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const prompt = pickFresh(rng, [
    `It would be unreasonable for you to believe that ${A} is true.`,
    `It’s unreasonable for you to believe ${A}.`,
    `Believing ${A} is unreasonable for you.`,
    `It’s rationally impermissible for you to believe ${A}.`,
  ]);
  return buildQuestion(
    2,
    counter,
    prompt,
    [
      { raw: `∼R{u}:${A}` },
      {
        raw: `R∼{u}:${A}`,
        layer2:
          'Wrong scope — ‘unreasonable’ negates R (NOT permissible to believe), not the believing.',
      },
      { raw: `∼Ru:${A}`, layer2: HINT_R_ON_DESCRIPTIVE },
      {
        raw: `O{u}:∼${A}`,
        layer2:
          'That says ‘you ought to believe NOT-A’ — different claim. ‘Unreasonable to believe A’ doesn’t entail ‘ought to believe not-A’.',
      },
    ],
    0,
    HINT_UNREASONABLE
  );
}

/** Take-no-position-reasonable: "It would be reasonable to take no position on A" → R(∼{u}:A · ∼{u}:∼A) */
function rationalityTakeNoPositionReasonable(
  rng: Rng,
  counter: number
): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const prompt = pickFresh(rng, [
    `It would be reasonable for you to take no position on ${A}.`,
    `Agnosticism about ${A} is reasonable for you.`,
    `It’s permissible for you to take no position on ${A}.`,
  ]);
  return buildQuestion(
    3,
    counter,
    prompt,
    [
      { raw: `R(∼{u}:${A} · ∼{u}:∼${A})` },
      {
        raw: `(R∼{u}:${A} · R∼{u}:∼${A})`,
        layer2:
          'Use ONE R outside the conjunction; ‘reasonable to (X and Y)’, not ‘(reasonable X) and (reasonable Y)’.',
      },
      {
        raw: `R(∼u:${A} · ∼u:∼${A})`,
        layer2:
          HINT_DESCRIBES_VS_TELLS_IMP +
          ' (R applies to imperative believing, so both inner u’s are underlined.)',
      },
      {
        raw: `∼R({u}:${A} · {u}:∼${A})`,
        layer2:
          'That says ‘not permissible to (believe A AND believe not-A)’ — about combining beliefs, not taking no position.',
      },
    ],
    0,
    HINT_TNP_REASONABLE
  );
}

/** Evident-transitive: "If A is evident to you, then B is evident to you" → (O{u}:A ⊃ O{u}:B) */
function rationalityEvidentTransitive(rng: Rng, counter: number): Question {
  const [A, B] = pickDistinctLetters(rng, 2);
  const prompt = pickFresh(rng, [
    `If ${A} is evident to you, then ${B} is evident to you.`,
    `If you ought to believe ${A}, then you ought to believe ${B}.`,
    `If it’s evident to you that ${A}, then it’s evident to you that ${B}.`,
  ]);
  return buildQuestion(
    4,
    counter,
    prompt,
    [
      { raw: `(O{u}:${A} ⊃ O{u}:${B})` },
      {
        raw: `O{u}:(${A} ⊃ ${B})`,
        layer2:
          'Wrong scope — that says ‘the conditional A⊃B is evident to you’, different from ‘if-A-evident then B-evident’.',
      },
      {
        raw: `(O{u}:${A} ⊃ {u}:${B})`,
        layer2:
          'You dropped the second O — both sides are about evidence/ought-to-believe.',
      },
      { raw: `(Ou:${A} ⊃ Ou:${B})`, layer2: HINT_O_ON_DESCRIPTIVE },
    ],
    0,
    HINT_EVIDENT_TRANSITIVE
  );
}

/** Ought-not-combine-belief: "You ought not to combine believing A with believing not-A" → O∼({u}:A · {u}:∼A) */
function rationalityOughtNotCombine(rng: Rng, counter: number): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const prompt = pickFresh(rng, [
    `You ought not to combine believing ${A} with believing not-${A}.`,
    `You ought not to both believe ${A} and believe not-${A}.`,
    `It’s wrong to combine believing ${A} with believing not-${A}.`,
  ]);
  return buildQuestion(
    5,
    counter,
    prompt,
    [
      { raw: `O∼({u}:${A} · {u}:∼${A})` },
      {
        raw: `(O∼{u}:${A} · O∼{u}:∼${A})`,
        layer2:
          'Use ONE O outside the negated conjunction; ‘ought not to (do both)’, not ‘ought not to do A AND ought not to do not-A’.',
      },
      {
        raw: `∼O({u}:${A} · {u}:∼${A})`,
        layer2:
          'Wrong scope — `∼O…` says ‘not obligatory to combine’; the prompt says ‘ought not to combine’ which is `O∼…`.',
      },
      {
        raw: `O∼(u:${A} · u:∼${A})`,
        layer2:
          HINT_O_ON_DESCRIPTIVE +
          ' (The inner believing here is what you’re obligated NOT to do — imperative.)',
      },
    ],
    0,
    HINT_OUGHT_NOT_COMBINE_BELIEF
  );
}

/** Knowledge: "You know that A" → (O{u}:A · A · u:A) */
function rationalityKnowledge(rng: Rng, counter: number): Question {
  const A = pickDistinctLetters(rng, 1)[0]!;
  const prompt = pickFresh(rng, [
    `You know that ${A} is true.`,
    `You know ${A}.`,
    `You have knowledge that ${A} is true.`,
  ]);
  return buildQuestion(
    6,
    counter,
    prompt,
    [
      { raw: `(O{u}:${A} · ${A} · u:${A})` },
      {
        raw: `(O{u}:${A} · u:${A})`,
        layer2:
          'You dropped the truth condition — knowledge requires that ' +
          A +
          ' actually be true.',
      },
      {
        raw: `(${A} · u:${A})`,
        layer2:
          'You dropped the evidence condition — true belief alone isn’t knowledge per Gensler §13.5.',
      },
      {
        raw: `O{u}:${A}`,
        layer2:
          'Evidence alone isn’t knowledge — you also need ' +
          A +
          ' to be true and you to actually believe ' +
          A +
          '.',
      },
    ],
    0,
    HINT_KNOWLEDGE
  );
}

// =============================================================
// Helper for the imperative-believe explanation (used in
// builders above before declaration).
// =============================================================

function USE_O_REMOVE_O(reason: string): string {
  return `The prompt doesn’t use ‘ought’ — drop the O. (Right now you’ve added an O to an ${reason} wff.)`;
}

// =============================================================
// Iterators
// =============================================================

const believingTemplates = [
  believingDescriptive,
  believingImperative,
  believingNegated,
  believingFalse,
  believingNoPosition,
  believingConditional,
  believingDontCombine,
  believingQuantified,
] as const;

const willingTemplates = [
  willingWantSomeone,
  willingWantEveryone,
  willingImperative,
  willingResolve,
  willingDontCombine,
] as const;

const rationalityTemplates = [
  rationalityOughtBelieve,
  rationalityReasonable,
  rationalityUnreasonable,
  rationalityTakeNoPositionReasonable,
  rationalityEvidentTransitive,
  rationalityOughtNotCombine,
  rationalityKnowledge,
] as const;

export function* believingQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFresh(rng, believingTemplates);
    yield renderer(rng, counter++);
  }
}

export function* willingQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFresh(rng, willingTemplates);
    yield renderer(rng, counter++);
  }
}

export function* rationalityQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFresh(rng, rationalityTemplates);
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

export function generateSetN(seed?: number, perSubset = 10): Set {
  const seedFor = (offset: number) =>
    seed != null ? seed + offset : undefined;
  return {
    name: 'Set N',
    logicType: 'Belief',
    slugs: ['belief', 'translations'],
    id: 14,
    title: 'Belief',
    header: 'Translates into logic as:',
    subSets: [
      {
        name: 'Set N',
        logicType: 'Belief',
        isNew: true,
        shuffleOptions: true,
        slugs: ['belief', 'translations', 'basic'],
        id: 14,
        title: 'Belief Translations: Believing',
        header: 'Translates into logic as:',
        description:
          'Translate claims about believing, not believing, and withholding belief into belief logic.',
        questions: take(believingQuestions(seedFor(1)), perSubset),
      },
      {
        name: 'Set N',
        logicType: 'Belief',
        isNew: true,
        shuffleOptions: true,
        slugs: ['belief', 'translations', 'willing'],
        id: 14,
        title: 'Belief Translations: Willing',
        header: 'Translates into logic as:',
        description:
          'Translate wanting, resolving, and acting — the willing side of belief logic — into formulas.',
        questions: take(willingQuestions(seedFor(2)), perSubset),
      },
      {
        name: 'Set N',
        logicType: 'Belief',
        isNew: true,
        shuffleOptions: true,
        slugs: ['belief', 'translations', 'rationality'],
        id: 14,
        title: 'Belief Translations: Rationality',
        header: 'Translates into logic as:',
        description:
          'Translate what is evident, reasonable, and rational to believe into belief-logic formulas.',
        questions: take(rationalityQuestions(seedFor(3)), perSubset),
      },
    ],
  };
}
