/**
 * Set L — Imperative & Deontic Translations: live-random generator.
 *
 * Phase 1 / T1.3. Ports Gensler's 2008 LCEXE Set L as a procedural
 * drill engine. Coverage: all 11 translation templates from
 * the original program for Set L, split into Imperative
 * (`*0`, `*1`, `*3`, `*6`, `*9`) and Deontic (`*7`, `*8`, `*11`,
 * `*12`, `*13`, `*14`) subsets — matching Gensler's chapter 12
 * §12.1 / §12.3 boundary.
 *
 * Cross-checked against Gensler 3rd ed. §12.1 + §12.3 (see
 * Gensler's textbook). Idiom rules from the textbook drive
 * Layer-1 hints; per-mistake explanations in `*2`/`*4`/`*5`/`*10`/
 * `*13` (the auxiliary feedback labels in 2008's source) inform
 * Layer-2 hints.
 *
 * Underline convention: imperative-marker letters are written
 * `{X}` in the spec table; `toKatex` converts these to
 * `\underline{X}` at render time. Examples:
 *
 *   `S{u}`     → `S\underline{u}`     "you, sing!" (sing addressed to you)
 *   `Su`       → `Su`                  "you sing" (descriptive)
 *   `D{u}t`    → `D\underline{u}t`    "you, defeat Tom" (imperative)
 *   `Dut`      → `Dut`                "you defeat Tom" (descriptive)
 *
 * Operators: Unicode in spec (·, ∨, ⊃, ≡, ∼, ☐, ◇), KaTeX at
 * render. Deontic operators `O` and `R` render as plain capitals.
 */

import type { Option, Question, Set } from '../types';
import { rngFromSeed, pickFresh, type Rng } from '@/lib/rng';
import { gerund } from '@/lib/grammar';
import { names, verbsB, verbsTransitive } from '../lexicons';

// =============================================================
// KaTeX rendering
// =============================================================

const KATEX_OPS: ReadonlyArray<readonly [string, string]> = [
  ['(∃x)', '(\\exists x)'],
  ['(∃y)', '(\\exists y)'],
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
 * Convert a Unicode-operator wff string to KaTeX inline-math
 * markup. `{X}` (single letter inside braces) renders as
 * `\underline{X}` — the imperative-marker convention.
 */
function toKatex(wff: string): string {
  let out = wff;
  for (const [unicode, latex] of KATEX_OPS) {
    out = out.split(unicode).join(latex);
  }
  // {X} → \underline{X}. Single alpha char only — won't match
  // multi-char braces (none in our specs).
  out = out.replace(/\{([A-Za-z])\}/g, '\\underline{$1}');
  return `$ ${out} $`;
}

// =============================================================
// Layer-1 idiom hints (from Gensler §12.1 + §12.3)
// =============================================================

const HINT_BARE_IMP =
  'Imperatives: underline the agent letter — ‘sing!’ is `S{u}`, not `Su`. The underlined `u` marks the imperative addressed to ‘you’.';
const HINT_COND_IMP =
  'Conditional with imperative consequent: only the consequent letter is underlined — `(Su ⊃ L{u})` reads ‘if you’re sleeping, then leave’.';
const HINT_DONT_COMBINE =
  '‘Don’t combine doing A with doing B’ → `∼(A{u} · B{u})` — both action letters are imperative (underlined).';
const HINT_QUANT_IMP =
  '‘Let everyone do A’ uses an imperative inside the quantifier — `(x)A{x}`. The underlined x marks the predicate as imperative.';
const HINT_CROSS_PERSON =
  'Cross-person imperative: in `(Hmu ⊃ H{u}m)` the `m` is Madonna and the `u` is you. The consequent `H{u}m` is the imperative ‘help Madonna’.';
const HINT_OUGHT_BASIC =
  '‘O’ attaches to an imperative wff: `OS{u}` = ‘you ought to sing’. `O` followed by an underlined letter, not by a plain capital.';
const HINT_OUGHT_NOT_COMBINE =
  '‘You ought not to combine A with B’ → `O∼(A{u} · B{u})` — the negation is INSIDE the `O` operator.';
const HINT_QUANT_DEONTIC =
  'Quantified deontic: ‘It’s obligatory that everyone do A’ → `O(x)A{x}`. The `O` scopes over the whole quantified imperative.';
const HINT_OBLIG_SOMEONE =
  '‘It’s obligatory that someone do A’ is `O(∃x)Ax` (group obligation); ‘there’s someone who has the obligation to do A’ is `(∃x)OAx` (specific person’s obligation). Different claims!';
const HINT_PERMISSIBLE =
  '‘It’s all right (permissible) that you do A’ → `RA{u}`. ‘It’s wrong that you do A’ → `O∼A{u}` (= `∼RA{u}`).';
const HINT_OUGHT_IMPLIES =
  '‘If you ought to do A, then A is possible’ — bridges deontic and modal: `(OA{u} ⊃ ◇Au)`. Often shortened as ‘ought implies can’.';

// =============================================================
// Layer-2 hints (per-mistake)
// =============================================================

const HINT_FORGOT_UNDERLINE =
  'You forgot to underline the imperative agent letter — descriptive `Au` and imperative `A{u}` are different wffs.';
const HINT_O_ON_DESCRIPTIVE =
  '‘O’ must attach to an imperative wff — write `OA{u}`, not `OAu`.';
const HINT_GROUP_VS_INDIVIDUAL =
  'Group obligation `O(∃x)Ax` ≠ individual obligation `(∃x)OAx`. Quantifier scope matters here.';
const HINT_DROP_O = 'There’s no ‘ought’ in the prompt — drop the `O`.';
const HINT_R_VS_O =
  '‘R’ (permissible) and `O` (obligatory) aren’t interchangeable — `RA` says A is allowed; `OA` says A is required.';

// =============================================================
// Helpers
// =============================================================

function pickDistinctLetterPair<T extends string>(
  rng: Rng,
  pool: readonly T[]
): [T, T] {
  // Reject predicates, not filtered copies — see pickFresh in lib/rng.ts.
  const a = pickFresh(rng, pool);
  const b = pickFresh(rng, pool, {
    reject: (x) => x === a || x[0]!.toLowerCase() === a[0]!.toLowerCase(),
  });
  return [a, b];
}

function qid(num: number, n: number): string {
  return `gen.L.${num}.${n}`;
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
// Imperative templates (*0, *1, *3, *6, *9)
// =============================================================

/**
 * *0 — Bare imperatives.
 *   "Sing, Tom"             → S{t}
 *   "Defeat Tom"            → D{u}t
 *   "Don't defeat Tom"      → ∼D{u}t
 */
function template0(rng: Rng, counter: number): Question {
  const variants = [
    'sing-tom', // intransitive verb addressed to named agent
    'transitive', // transitive verb (you imperative on object)
    'transitive-not', // negated transitive
    'addressed', // intransitive addressed to you ("Sleep!")
  ] as const;
  const v = pickFresh(rng, variants);
  if (v === 'sing-tom') {
    const verb = pickFresh(rng, verbsB);
    const name = pickFresh(rng, names);
    const V = verb[0]!.toUpperCase();
    const n = name[0]!.toLowerCase();
    return buildQuestion(
      0,
      counter,
      `${name}, ${verb}.`,
      [
        { raw: `${V}{${n}}` },
        { raw: `${V}${n}`, layer2: HINT_FORGOT_UNDERLINE },
        {
          raw: `${V}{u}${n}`,
          layer2:
            'The agent is ' + name + ', not you — underline ' + n + ', not u.',
        },
        { raw: `${V}{u}`, layer2: 'You dropped the agent ' + name + '.' },
      ],
      0,
      HINT_BARE_IMP
    );
  }
  if (v === 'addressed') {
    const verb = pickFresh(rng, verbsB);
    const V = verb[0]!.toUpperCase();
    const cap = verb[0]!.toUpperCase() + verb.slice(1);
    return buildQuestion(
      0,
      counter,
      `${cap}.`,
      [
        { raw: `${V}{u}` },
        { raw: `${V}u`, layer2: HINT_FORGOT_UNDERLINE },
        {
          raw: `${V}`,
          layer2:
            'You dropped the agent — bare imperative addressed to you needs the underlined u.',
        },
        { raw: `O${V}{u}`, layer2: HINT_DROP_O },
      ],
      0,
      HINT_BARE_IMP
    );
  }
  if (v === 'transitive-not') {
    const verb = pickFresh(rng, verbsTransitive);
    const name = pickFresh(rng, names);
    const V = verb[0]!.toUpperCase();
    const n = name[0]!.toLowerCase();
    return buildQuestion(
      0,
      counter,
      `Don’t ${verb} ${name}.`,
      [
        { raw: `∼${V}{u}${n}` },
        {
          raw: `${V}{u}${n}`,
          layer2: 'You forgot the ‘∼’ — the prompt says DON’T ' + verb + '.',
        },
        { raw: `∼${V}u${n}`, layer2: HINT_FORGOT_UNDERLINE },
        {
          raw: `∼${V}{n}u`,
          layer2:
            'Argument order matters — ' +
            V +
            '{u}' +
            n +
            ' means ‘you, ' +
            verb +
            ' ' +
            name +
            '’.',
        },
      ],
      0,
      HINT_BARE_IMP
    );
  }
  // transitive: "Defeat Tom"
  const verb = pickFresh(rng, verbsTransitive);
  const name = pickFresh(rng, names);
  const V = verb[0]!.toUpperCase();
  const n = name[0]!.toLowerCase();
  const cap = verb[0]!.toUpperCase() + verb.slice(1);
  return buildQuestion(
    0,
    counter,
    `${cap} ${name}.`,
    [
      { raw: `${V}{u}${n}` },
      { raw: `${V}u${n}`, layer2: HINT_FORGOT_UNDERLINE },
      {
        raw: `${V}{${n}}`,
        layer2:
          'The agent is you (the addressee), not ' +
          name +
          '. Underline u, not ' +
          n +
          '.',
      },
      { raw: `O${V}{u}${n}`, layer2: HINT_DROP_O },
    ],
    0,
    HINT_BARE_IMP
  );
}

/**
 * *1 — Conditional imperatives.
 *   "If you're sleeping, then leave"   → (Su ⊃ L{u})
 *   "If you sleep, then don't leave"   → (Su ⊃ ∼L{u})
 */
function template1(rng: Rng, counter: number): Question {
  const [eVerb, fVerb] = pickDistinctLetterPair(rng, verbsB);
  const E = eVerb[0]!.toUpperCase();
  const F = fVerb[0]!.toUpperCase();
  const negate = rng() < 0.5;
  // Per Gensler §12.1: 2008 lists 4 paraphrases for *1; the
  // first three share the "(Eu ⊃ ±Fu)" form.
  const prompt = negate
    ? pickFresh(rng, [
        `If you’re ${gerund(eVerb)}, then don’t ${fVerb}.`,
        `If you ${eVerb}, then don’t ${fVerb}.`,
        `Don’t ${fVerb}, if you ${eVerb}.`,
      ])
    : pickFresh(rng, [
        `If you’re ${gerund(eVerb)}, then ${fVerb}.`,
        `If you ${eVerb}, then ${fVerb}.`,
        `Do ${fVerb}, only if you ${eVerb}.`,
      ]);
  const correct = negate ? `(${E}u ⊃ ∼${F}{u})` : `(${E}u ⊃ ${F}{u})`;
  return buildQuestion(
    1,
    counter,
    prompt,
    [
      { raw: correct },
      {
        raw: negate ? `(${E}{u} ⊃ ∼${F}{u})` : `(${E}{u} ⊃ ${F}{u})`,
        layer2:
          'The antecedent is descriptive (‘you’re ' +
          gerund(eVerb) +
          '’), not imperative — don’t underline the u in ' +
          E +
          'u.',
      },
      {
        raw: negate ? `(${E}u ⊃ ∼${F}u)` : `(${E}u ⊃ ${F}u)`,
        layer2: HINT_FORGOT_UNDERLINE + ' (The consequent is the imperative.)',
      },
      {
        raw: negate ? `(${E}u · ∼${F}{u})` : `(${E}u · ${F}{u})`,
        layer2: '‘If A then B’ is `(A ⊃ B)`, not `(A · B)`.',
      },
    ],
    0,
    HINT_COND_IMP
  );
}

/**
 * *3 — Don't-combine + conjunctive imperatives.
 *   "Don't combine doing A with doing B"  → ∼(A{u} · B{u})
 *   "Don't combine doing A with not doing B"  → ∼(A{u} · ∼B{u})
 *   "Do A and B" → (A{u} · B{u})
 */
function template3(rng: Rng, counter: number): Question {
  const variant = pickFresh(rng, [
    'combine',
    'combine-not',
    'and',
    'or',
    'either-not',
  ]);
  const [eVerb, fVerb] = pickDistinctLetterPair(rng, verbsB);
  const E = eVerb[0]!.toUpperCase();
  const F = fVerb[0]!.toUpperCase();
  const capE = eVerb[0]!.toUpperCase() + eVerb.slice(1);
  if (variant === 'combine') {
    const prompt = pickFresh(rng, [
      `Don’t combine ${gerund(eVerb)} with ${gerund(fVerb)}.`,
      `Don’t both ${eVerb} and ${fVerb}.`,
    ]);
    return buildQuestion(
      3,
      counter,
      prompt,
      [
        { raw: `∼(${E}{u} · ${F}{u})` },
        {
          raw: `(∼${E}{u} · ∼${F}{u})`,
          layer2:
            'Wrong scope — that says ‘both don’t-do-' +
            eVerb +
            ' and don’t-do-' +
            fVerb +
            '’ separately.',
        },
        {
          raw: `(${E}{u} ⊃ ∼${F}{u})`,
          layer2:
            '‘Don’t combine A with B’ ≠ ‘If A then don’t B’ — the first forbids the conjunction, the second is conditional.',
        },
        {
          raw: `∼(${E}u · ${F}u)`,
          layer2:
            HINT_FORGOT_UNDERLINE + ' (Both action letters need underlines.)',
        },
      ],
      0,
      HINT_DONT_COMBINE
    );
  }
  if (variant === 'combine-not') {
    return buildQuestion(
      3,
      counter,
      `Don’t combine ${gerund(eVerb)} with not ${gerund(fVerb)}.`,
      [
        { raw: `∼(${E}{u} · ∼${F}{u})` },
        {
          raw: `(${E}{u} ⊃ ${F}{u})`,
          layer2:
            '‘Don’t combine A with not-B’ is the don’t-combine form, not the if-then form (subtly different — see Gensler §12.1).',
        },
        {
          raw: `∼(${E}{u} · ${F}{u})`,
          layer2:
            'You dropped the inner ‘∼’ — ‘not ' + gerund(fVerb) + '’ stays.',
        },
        {
          raw: `∼${E}{u} · ∼${F}{u}`,
          layer2:
            'Not a wff — a conjunction needs outer parentheses: ‘(A · B)’.',
        },
      ],
      0,
      HINT_DONT_COMBINE
    );
  }
  if (variant === 'and') {
    const prompt = pickFresh(rng, [
      `${capE} and ${fVerb}.`,
      `Do ${eVerb} and ${fVerb}.`,
      `${capE}, and also ${fVerb}.`,
    ]);
    return buildQuestion(
      3,
      counter,
      prompt,
      [
        { raw: `(${E}{u} · ${F}{u})` },
        {
          raw: `(${E}u · ${F}u)`,
          layer2: HINT_FORGOT_UNDERLINE + ' (Both verbs are imperative.)',
        },
        { raw: `(${E}{u} ∨ ${F}{u})`, layer2: '‘And’ is ‘·’, not ‘∨’.' },
        { raw: `O(${E}{u} · ${F}{u})`, layer2: HINT_DROP_O },
      ],
      0,
      HINT_DONT_COMBINE
    );
  }
  if (variant === 'or') {
    const prompt = pickFresh(rng, [
      `${capE} or ${fVerb}.`,
      `Do ${eVerb} or ${fVerb}.`,
      `Either ${eVerb} or ${fVerb}.`,
    ]);
    return buildQuestion(
      3,
      counter,
      prompt,
      [
        { raw: `(${E}{u} ∨ ${F}{u})` },
        {
          raw: `(${E}u ∨ ${F}u)`,
          layer2: HINT_FORGOT_UNDERLINE + ' (Both verbs are imperative.)',
        },
        {
          raw: `(${E}{u} · ${F}{u})`,
          layer2: '‘Or’ is ‘∨’, not ‘·’ — that’s ‘and’.',
        },
        {
          raw: `∼(${E}{u} · ${F}{u})`,
          layer2:
            '‘Or’ isn’t the don’t-combine form. ‘Either E or F’ is just `(E ∨ F)`.',
        },
      ],
      0,
      HINT_DONT_COMBINE
    );
  }
  // 'either-not': "Either don't E or don't F"
  return buildQuestion(
    3,
    counter,
    `Either don’t ${eVerb} or don’t ${fVerb}.`,
    [
      { raw: `(∼${E}{u} ∨ ∼${F}{u})` },
      {
        raw: `(∼${E}u ∨ ∼${F}{u})`,
        layer2:
          HINT_FORGOT_UNDERLINE +
          ' Both parts are imperatives here — underline both u’s.',
      },
      { raw: `(∼${E}{u} · ∼${F}{u})`, layer2: '‘Or’ is ‘∨’, not ‘·’.' },
      {
        raw: `∼(${E}{u} ∨ ${F}{u})`,
        layer2:
          'Wrong scope — that says ‘not (E or F)’, i.e., neither. The original says ‘either not-E or not-F’.',
      },
    ],
    0,
    HINT_DONT_COMBINE
  );
}

/**
 * *6 — Quantified imperatives.
 *   "Let everyone who is sleeping leave"  → (x)(Sx ⊃ L{x})
 *   "Let everyone do A"                    → (x)A{x}
 */
function template6(rng: Rng, counter: number): Question {
  // 2008's *6 has 4 paraphrases × 2 lead-ins ("Let "/"Would that ").
  const variant = pickFresh(rng, [
    'simple',
    'conditional',
    'predicate-of',
    'both-and',
  ]);
  if (variant === 'simple') {
    const verb = pickFresh(rng, verbsB);
    const V = verb[0]!.toUpperCase();
    const prompt = pickFresh(rng, [
      `Let everyone ${verb}.`,
      `Would that everyone ${verb}.`,
    ]);
    return buildQuestion(
      6,
      counter,
      prompt,
      [
        { raw: `(x)${V}{x}` },
        {
          raw: `(x)${V}x`,
          layer2: HINT_FORGOT_UNDERLINE + ' (The predicate is imperative.)',
        },
        {
          raw: `(∃x)${V}{x}`,
          layer2: '‘Let everyone’ is universal `(x)`, not existential `(∃x)`.',
        },
        {
          raw: `O(x)${V}{x}`,
          layer2:
            HINT_DROP_O +
            ' Imperatives don’t need O — only ‘ought’ statements do.',
        },
      ],
      0,
      HINT_QUANT_IMP
    );
  }
  if (variant === 'conditional') {
    const [eVerb, fVerb] = pickDistinctLetterPair(rng, verbsB);
    const E = eVerb[0]!.toUpperCase();
    const F = fVerb[0]!.toUpperCase();
    const prompt = pickFresh(rng, [
      `Let everyone who is ${gerund(eVerb)} ${fVerb}.`,
      `Would that everyone who is ${gerund(eVerb)} ${fVerb}.`,
      `Let everyone who ${eVerb}s ${fVerb}.`,
    ]);
    return buildQuestion(
      6,
      counter,
      prompt,
      [
        { raw: `(x)(${E}x ⊃ ${F}{x})` },
        {
          raw: `(x)(${E}{x} ⊃ ${F}{x})`,
          layer2:
            'The antecedent ‘who is ' +
            gerund(eVerb) +
            '’ is descriptive — don’t underline ' +
            E +
            '.',
        },
        {
          raw: `(x)(${E}x ⊃ ${F}x)`,
          layer2: HINT_FORGOT_UNDERLINE + ' (The consequent is imperative.)',
        },
        {
          raw: `(∃x)(${E}x · ${F}{x})`,
          layer2:
            '‘Let everyone who…’ is universal-conditional `(x)(… ⊃ …)`, not existential-conjunction.',
        },
      ],
      0,
      HINT_QUANT_IMP
    );
  }
  if (variant === 'predicate-of') {
    // "$o $F who is $Eing" → "Let everyone F who is Eing" → (x)(Ex ⊃ Fx̲)
    // Same logical content as conditional; different surface order.
    const [eVerb, fVerb] = pickDistinctLetterPair(rng, verbsB);
    const E = eVerb[0]!.toUpperCase();
    const F = fVerb[0]!.toUpperCase();
    return buildQuestion(
      6,
      counter,
      `Let everyone ${fVerb} who is ${gerund(eVerb)}.`,
      [
        { raw: `(x)(${E}x ⊃ ${F}{x})` },
        {
          raw: `(x)(${F}x ⊃ ${E}{x})`,
          layer2:
            'You swapped the antecedent and consequent — ‘Let everyone F who is Eing’ has E as antecedent.',
        },
        {
          raw: `(x)(${E}{x} ⊃ ${F}{x})`,
          layer2:
            '‘Who is ' +
            gerund(eVerb) +
            '’ is descriptive — don’t underline ' +
            E +
            '.',
        },
        {
          raw: `(x)(${E}x · ${F}{x})`,
          layer2:
            '‘Let everyone X who Y’ is universal-conditional, not universal-conjunction.',
        },
      ],
      0,
      HINT_QUANT_IMP
    );
  }
  // 'both-and': "Let everyone both E and F"
  const [eVerb, fVerb] = pickDistinctLetterPair(rng, verbsB);
  const E = eVerb[0]!.toUpperCase();
  const F = fVerb[0]!.toUpperCase();
  return buildQuestion(
    6,
    counter,
    `Let everyone both ${eVerb} and ${fVerb}.`,
    [
      { raw: `(x)(${E}{x} · ${F}{x})` },
      {
        raw: `(x)(${E}x · ${F}x)`,
        layer2: HINT_FORGOT_UNDERLINE + ' (Both predicates are imperative.)',
      },
      {
        raw: `(∃x)(${E}{x} · ${F}{x})`,
        layer2:
          '‘Everyone’ is the universal `(x)`, not the existential `(∃x)`.',
      },
      {
        raw: `(x)(${E}{x} ∨ ${F}{x})`,
        layer2: '‘Both E and F’ uses ‘·’, not ‘∨’.',
      },
    ],
    0,
    HINT_QUANT_IMP
  );
}

/**
 * *9 — Cross-person imperatives.
 *   "If Madonna is helping you, then help her"  → (Hmu ⊃ H{u}m)
 */
function template9(rng: Rng, counter: number): Question {
  const verb = pickFresh(rng, verbsTransitive);
  const name = pickFresh(rng, names);
  const V = verb[0]!.toUpperCase();
  const n = name[0]!.toLowerCase();
  const prompt = pickFresh(rng, [
    `If ${name} is ${gerund(verb)} you, then ${verb} ${name}.`,
    `If ${name} ${verb}s you, then ${verb} ${name} back.`,
    `${verb[0]!.toUpperCase() + verb.slice(1)} ${name} if ${name} is ${gerund(verb)} you.`,
  ]);
  return buildQuestion(
    9,
    counter,
    prompt,
    [
      { raw: `(${V}${n}u ⊃ ${V}{u}${n})` },
      {
        raw: `(${V}u${n} ⊃ ${V}{u}${n})`,
        layer2:
          'Argument order — ' +
          name +
          ' is the agent in the antecedent, so ' +
          V +
          n +
          'u (= ‘' +
          name +
          ' ' +
          verb +
          's you’).',
      },
      {
        raw: `(${V}${n}u ⊃ ${V}u${n})`,
        layer2:
          HINT_FORGOT_UNDERLINE +
          ' (The consequent is imperative — underline the u.)',
      },
      {
        raw: `(${V}${n}{u} ⊃ ${V}{u}${n})`,
        layer2:
          'The antecedent is descriptive — don’t underline u in ' +
          V +
          n +
          'u.',
      },
    ],
    0,
    HINT_CROSS_PERSON
  );
}

// =============================================================
// Deontic templates (*7, *8, *11, *12, *13, *14)
// =============================================================

/**
 * *7 — Basic ought.
 *   "You ought to sing"             → OS{u}
 *   "You ought not to sing"         → O∼S{u}
 *   "You ought to defeat Tom"       → OD{u}t
 *   "You ought not to defeat Tom"   → O∼D{u}t
 */
function template7(rng: Rng, counter: number): Question {
  const variant = pickFresh(rng, [
    'intrans',
    'intrans-not',
    'trans',
    'trans-not',
  ]);
  if (variant === 'intrans' || variant === 'intrans-not') {
    const verb = pickFresh(rng, verbsB);
    const V = verb[0]!.toUpperCase();
    const negate = variant === 'intrans-not';
    const prompt = negate
      ? pickFresh(rng, [
          `You ought not to ${verb}.`,
          `It’s your duty not to ${verb}.`,
          `${((g) => g[0]!.toUpperCase() + g.slice(1))(gerund(verb))} is wrong for you.`,
        ])
      : pickFresh(rng, [
          `You ought to ${verb}.`,
          `It’s your duty to ${verb}.`,
          `${((g) => g[0]!.toUpperCase() + g.slice(1))(gerund(verb))} is required of you.`,
        ]);
    const correct = negate ? `O∼${V}{u}` : `O${V}{u}`;
    return buildQuestion(
      7,
      counter,
      prompt,
      [
        { raw: correct },
        {
          raw: negate ? `O${V}{u}` : `O∼${V}{u}`,
          layer2:
            'You ' + (negate ? 'dropped the ‘∼’' : 'added an extra ‘∼’') + '.',
        },
        { raw: negate ? `O∼${V}u` : `O${V}u`, layer2: HINT_O_ON_DESCRIPTIVE },
        {
          raw: negate ? `∼O${V}{u}` : `${V}{u}`,
          layer2: negate
            ? 'Wrong scope — ‘ought not’ is `O∼`, not `∼O`.'
            : HINT_O_ON_DESCRIPTIVE.replace('OA{u}', 'O' + V + '{u}'),
        },
      ],
      0,
      HINT_OUGHT_BASIC
    );
  }
  const verb = pickFresh(rng, verbsTransitive);
  const name = pickFresh(rng, names);
  const V = verb[0]!.toUpperCase();
  const n = name[0]!.toLowerCase();
  const negate = variant === 'trans-not';
  const prompt = negate
    ? pickFresh(rng, [
        `You ought not to ${verb} ${name}.`,
        `It’s your duty not to ${verb} ${name}.`,
        `It would be wrong for you to ${verb} ${name}.`,
      ])
    : pickFresh(rng, [
        `You ought to ${verb} ${name}.`,
        `It’s your duty to ${verb} ${name}.`,
        `It would be obligatory for you to ${verb} ${name}.`,
      ]);
  const correct = negate ? `O∼${V}{u}${n}` : `O${V}{u}${n}`;
  return buildQuestion(
    7,
    counter,
    prompt,
    [
      { raw: correct },
      {
        raw: negate ? `O${V}{u}${n}` : `O∼${V}{u}${n}`,
        layer2:
          'You ' + (negate ? 'dropped the ‘∼’' : 'added an extra ‘∼’') + '.',
      },
      {
        raw: negate ? `O∼${V}u${n}` : `O${V}u${n}`,
        layer2: HINT_O_ON_DESCRIPTIVE,
      },
      {
        raw: negate ? `∼O${V}{u}${n}` : `${V}{u}${n}`,
        layer2: negate
          ? 'Wrong scope — ‘ought not’ is `O∼`, not `∼O`.'
          : 'You dropped the ‘O’ — this is a deontic claim.',
      },
    ],
    0,
    HINT_OUGHT_BASIC
  );
}

/**
 * *8 — Ought-not-to-combine.
 *   "You ought not to combine A with B"      → O∼(A{u} · B{u})
 *   "You ought not to combine A with not B"  → O∼(A{u} · ∼B{u})
 */
function template8(rng: Rng, counter: number): Question {
  const negSecond = rng() < 0.5;
  const [eVerb, fVerb] = pickDistinctLetterPair(rng, verbsB);
  const E = eVerb[0]!.toUpperCase();
  const F = fVerb[0]!.toUpperCase();
  const prompt = negSecond
    ? pickFresh(rng, [
        `You ought not to combine ${gerund(eVerb)} with not ${gerund(fVerb)}.`,
        `It’s wrong to combine ${gerund(eVerb)} with not ${gerund(fVerb)}.`,
        `You ought not to ${eVerb} without also ${gerund(fVerb)}.`,
      ])
    : pickFresh(rng, [
        `You ought not to combine ${gerund(eVerb)} with ${gerund(fVerb)}.`,
        `It’s wrong to combine ${gerund(eVerb)} with ${gerund(fVerb)}.`,
        `You ought not to both ${eVerb} and ${fVerb}.`,
      ]);
  const correct = negSecond
    ? `O∼(${E}{u} · ∼${F}{u})`
    : `O∼(${E}{u} · ${F}{u})`;
  return buildQuestion(
    8,
    counter,
    prompt,
    [
      { raw: correct },
      {
        raw: negSecond ? `(${E}{u} ⊃ O${F}{u})` : `(${E}{u} ⊃ O∼${F}{u})`,
        layer2:
          '‘Ought not to combine’ is the don’t-combine form `O∼(… · …)`, not a conditional `(… ⊃ O∼…)`.',
      },
      {
        raw: negSecond ? `∼(${E}{u} · ∼${F}{u})` : `∼(${E}{u} · ${F}{u})`,
        layer2:
          'You dropped the ‘O’ — this is an obligation claim, not just a prohibition.',
      },
      {
        raw: negSecond ? `O∼(${E}u · ∼${F}u)` : `O∼(${E}u · ${F}u)`,
        layer2:
          HINT_FORGOT_UNDERLINE + ' (Both action letters are imperative.)',
      },
    ],
    0,
    HINT_OUGHT_NOT_COMBINE
  );
}

/**
 * *11 — Quantified deontic.
 *   "It's obligatory that everyone who is sleeping leave"
 *     → O(x)(Sx ⊃ L{x})
 *   "It's obligatory that everyone do A"  → O(x)A{x}
 */
function template11(rng: Rng, counter: number): Question {
  const variant = pickFresh(rng, ['simple', 'conditional']);
  if (variant === 'simple') {
    const verb = pickFresh(rng, verbsB);
    const V = verb[0]!.toUpperCase();
    const prompt = pickFresh(rng, [
      `It’s obligatory that everyone ${verb}.`,
      `It ought to be that everyone ${verb}.`,
      `Everyone is required to ${verb}.`,
    ]);
    return buildQuestion(
      11,
      counter,
      prompt,
      [
        { raw: `O(x)${V}{x}` },
        {
          raw: `(x)O${V}{x}`,
          layer2:
            'Wrong scope — group obligation `O(x)…` ≠ each-individual obligation `(x)O…`.',
        },
        { raw: `O(x)${V}x`, layer2: HINT_O_ON_DESCRIPTIVE },
        {
          raw: `O(∃x)${V}{x}`,
          layer2: '‘Everyone’ is universal `(x)`, not existential `(∃x)`.',
        },
      ],
      0,
      HINT_QUANT_DEONTIC
    );
  }
  const [eVerb, fVerb] = pickDistinctLetterPair(rng, verbsB);
  const E = eVerb[0]!.toUpperCase();
  const F = fVerb[0]!.toUpperCase();
  const prompt = pickFresh(rng, [
    `It’s obligatory that everyone who is ${gerund(eVerb)} ${fVerb}.`,
    `It ought to be that everyone who is ${gerund(eVerb)} ${fVerb}.`,
    `It’s obligatory that everyone ${fVerb} who is ${gerund(eVerb)}.`,
  ]);
  return buildQuestion(
    11,
    counter,
    prompt,
    [
      { raw: `O(x)(${E}x ⊃ ${F}{x})` },
      {
        raw: `(x)(${E}x ⊃ O${F}{x})`,
        layer2:
          'Wrong scope — `O` should attach to the whole quantified imperative, not the consequent.',
      },
      {
        raw: `O(x)(${E}{x} ⊃ ${F}{x})`,
        layer2:
          'Antecedent ‘who is ' +
          gerund(eVerb) +
          '’ is descriptive — don’t underline ' +
          E +
          '.',
      },
      {
        raw: `O(∃x)(${E}x · ${F}{x})`,
        layer2:
          '‘Everyone who…’ is universal-conditional, not existential-conjunction.',
      },
    ],
    0,
    HINT_QUANT_DEONTIC
  );
}

/**
 * *12 — Group vs individual obligation.
 *   "It's obligatory that someone help"        → O(∃x)H{x}
 *   "There is someone who has a duty to help"  → (∃x)OH{x}
 */
function template12(rng: Rng, counter: number): Question {
  const verb = pickFresh(rng, verbsB);
  const V = verb[0]!.toUpperCase();
  const variant = pickFresh(rng, ['group', 'individual']);
  if (variant === 'group') {
    const prompt = pickFresh(rng, [
      `It’s obligatory that someone ${verb}.`,
      `It’s required that someone (or other) ${verb}.`,
      `It ought to be that someone ${verb}.`,
    ]);
    return buildQuestion(
      12,
      counter,
      prompt,
      [
        { raw: `O(∃x)${V}{x}` },
        {
          raw: `(∃x)O${V}{x}`,
          layer2:
            HINT_GROUP_VS_INDIVIDUAL +
            ' This prompt asserts the GROUP’s obligation.',
        },
        { raw: `O(∃x)${V}x`, layer2: HINT_O_ON_DESCRIPTIVE },
        {
          raw: `O(x)${V}{x}`,
          layer2: '‘Someone’ is existential `(∃x)`, not universal `(x)`.',
        },
      ],
      0,
      HINT_OBLIG_SOMEONE
    );
  }
  const prompt = pickFresh(rng, [
    `There is someone who has a duty to ${verb}.`,
    `Someone has the obligation to ${verb}.`,
    `There’s a specific person whose duty it is to ${verb}.`,
  ]);
  return buildQuestion(
    12,
    counter,
    prompt,
    [
      { raw: `(∃x)O${V}{x}` },
      {
        raw: `O(∃x)${V}{x}`,
        layer2:
          HINT_GROUP_VS_INDIVIDUAL +
          ' This prompt asserts a SPECIFIC person’s obligation.',
      },
      { raw: `(∃x)O${V}x`, layer2: HINT_O_ON_DESCRIPTIVE },
      {
        raw: `(x)O${V}{x}`,
        layer2: '‘Someone’ is existential `(∃x)`, not universal `(x)`.',
      },
    ],
    0,
    HINT_OBLIG_SOMEONE
  );
}

/**
 * *13 — Deontic operator words.
 *   "It's all right for you to A"      → RA{u}
 *   "It's permissible for you to A"    → RA{u}
 *   "It's wrong for you to A"          → O∼A{u}
 *   "It's required that you A"         → OA{u}
 */
function template13(rng: Rng, counter: number): Question {
  const verb = pickFresh(rng, verbsB);
  const V = verb[0]!.toUpperCase();
  const variant = pickFresh(rng, [
    'allright',
    'permissible',
    'wrong',
    'required',
  ]);
  if (variant === 'allright' || variant === 'permissible') {
    const word = variant === 'allright' ? 'all right' : 'permissible';
    return buildQuestion(
      13,
      counter,
      `It’s ${word} for you to ${verb}.`,
      [
        { raw: `R${V}{u}` },
        { raw: `O${V}{u}`, layer2: HINT_R_VS_O },
        { raw: `R${V}u`, layer2: HINT_O_ON_DESCRIPTIVE.replace('O', 'R') },
        {
          raw: `∼O${V}{u}`,
          layer2:
            '`R` and `∼O∼` are equivalent, but `R` and `∼O` aren’t. ‘All right’ ≠ ‘not required’.',
        },
      ],
      0,
      HINT_PERMISSIBLE
    );
  }
  if (variant === 'wrong') {
    return buildQuestion(
      13,
      counter,
      `It’s wrong for you to ${verb}.`,
      [
        { raw: `O∼${V}{u}` },
        {
          raw: `∼O${V}{u}`,
          layer2:
            'Wrong scope — ‘wrong to do A’ is `O∼A` (obligated not to), not `∼OA` (not obligated to).',
        },
        {
          raw: `R∼${V}{u}`,
          layer2:
            '‘Wrong’ means it’s NOT permissible — `∼R` or equivalently `O∼`. Not `R∼`.',
        },
        { raw: `O∼${V}u`, layer2: HINT_O_ON_DESCRIPTIVE },
      ],
      0,
      HINT_PERMISSIBLE
    );
  }
  return buildQuestion(
    13,
    counter,
    `It’s required that you ${verb}.`,
    [
      { raw: `O${V}{u}` },
      { raw: `R${V}{u}`, layer2: HINT_R_VS_O + ' ‘Required’ is `O`, not `R`.' },
      { raw: `O${V}u`, layer2: HINT_O_ON_DESCRIPTIVE },
      {
        raw: `R∼${V}{u}`,
        layer2:
          '`R∼' +
          V +
          '{u}` says you’re *permitted to refrain*. ‘Required’ is `O` (obligated to do), not `R∼`.',
      },
    ],
    0,
    HINT_PERMISSIBLE
  );
}

/**
 * *14 — Deontic-modal interaction (ought-implies-can).
 *   "If you ought to do A, then A is possible"  → (OA{u} ⊃ ◇Au)
 *   "‘You ought to do A’ entails ‘A is permissible’"  → ☐(OA{u} ⊃ RA{u})
 */
function template14(rng: Rng, counter: number): Question {
  const verb = pickFresh(rng, verbsB);
  const V = verb[0]!.toUpperCase();
  const variant = pickFresh(rng, [
    'ought-implies-can',
    'ought-implies-permissible',
    'permissible-only-if',
  ]);
  if (variant === 'ought-implies-can') {
    const prompt = pickFresh(rng, [
      `If you ought to ${verb}, then your ${gerund(verb)} is possible.`,
      `If you ought to ${verb}, then it’s possible for you to ${verb}.`,
    ]);
    return buildQuestion(
      14,
      counter,
      prompt,
      [
        { raw: `(O${V}{u} ⊃ ◇${V}u)` },
        {
          raw: `(O${V}{u} ⊃ ◇${V}{u})`,
          layer2:
            '‘Your ' +
            gerund(verb) +
            ' is possible’ is descriptive (the act IS possible) — don’t underline u in ' +
            V +
            'u.',
        },
        {
          raw: `☐(O${V}{u} ⊃ ◇${V}u)`,
          layer2:
            'The prompt is plain if-then, not entailment — drop the outer ‘☐’.',
        },
        { raw: `(O${V}u ⊃ ◇${V}u)`, layer2: HINT_O_ON_DESCRIPTIVE },
      ],
      0,
      HINT_OUGHT_IMPLIES
    );
  }
  if (variant === 'ought-implies-permissible') {
    return buildQuestion(
      14,
      counter,
      `“You ought to ${verb}” entails “It’s permissible for you to ${verb}.”`,
      [
        { raw: `☐(O${V}{u} ⊃ R${V}{u})` },
        {
          raw: `(O${V}{u} ⊃ R${V}{u})`,
          layer2: '‘Entails’ wraps the conditional in `☐` — see Gensler §10.1.',
        },
        {
          raw: `☐(O${V}{u} ⊃ ${V}{u})`,
          layer2:
            'The consequent is ‘permissible’, not the bare action — use `R` not raw ' +
            V +
            '{u}.',
        },
        { raw: `☐(O${V}u ⊃ R${V}u)`, layer2: HINT_O_ON_DESCRIPTIVE },
      ],
      0,
      HINT_OUGHT_IMPLIES
    );
  }
  // 'permissible-only-if': "You may F only if it's all right for you to F"
  return buildQuestion(
    14,
    counter,
    `It’s your duty to ${verb}, only if it’s possible for you to ${verb}.`,
    [
      { raw: `(O${V}{u} ⊃ ◇${V}u)` },
      {
        raw: `(◇${V}u ⊃ O${V}{u})`,
        layer2:
          'You swapped antecedent and consequent — ‘A only if B’ is `(A ⊃ B)`.',
      },
      {
        raw: `☐(O${V}{u} ⊃ ◇${V}u)`,
        layer2:
          '‘Only if’ is plain if-then, not entailment — drop the outer ‘☐’.',
      },
      { raw: `(O${V}u ⊃ ◇${V}u)`, layer2: HINT_O_ON_DESCRIPTIVE },
    ],
    0,
    HINT_OUGHT_IMPLIES
  );
}

// =============================================================
// Iterators
// =============================================================

const imperativeTemplates = [
  template0,
  template1,
  template3,
  template6,
  template9,
] as const;

const deonticTemplates = [
  template7,
  template8,
  template11,
  template12,
  template13,
  template14,
] as const;

export function* imperativeQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFresh(rng, imperativeTemplates);
    yield renderer(rng, counter++);
  }
}

export function* deonticQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const renderer = pickFresh(rng, deonticTemplates);
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

export function generateSetL(seed?: number, perSubset = 10): Set {
  const seedFor = (offset: number) =>
    seed != null ? seed + offset : undefined;
  return {
    name: 'Set L',
    logicType: 'Deontic',
    slugs: ['Deontic', 'translations'],
    id: 12,
    title: 'Deontic Translations: Imperative',
    header: 'Translates into logic as:',
    subSets: [
      {
        name: 'Set L',
        logicType: 'Basic Translations',
        isNew: true,
        shuffleOptions: true,
        slugs: ['Deontic', 'translations', 'Imperative'],
        id: 12,
        title: 'Deontic Translations: Imperative',
        header: 'Translates into logic as:',
        description:
          'Translate commands and requests into imperative logic, underlining what is to be done.',
        questions: take(imperativeQuestions(seedFor(1)), perSubset),
      },
      {
        name: 'Set L',
        logicType: 'Deontic',
        isNew: true,
        shuffleOptions: true,
        slugs: ['Deontic', 'translations', 'Deontic'],
        id: 12,
        title: 'Deontic Translations: Deontic',
        header: 'Translates into logic as:',
        description:
          'Translate ought, permissible, and forbidden into deontic logic.',
        questions: take(deonticQuestions(seedFor(2)), perSubset),
      },
    ],
  };
}
