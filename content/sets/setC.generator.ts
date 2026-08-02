/**
 * Set C — Propositional Translations: live-random generator.
 *
 * Phase 1 / T1.6. Ports Gensler's 2008 LCEXE Set C as a procedural
 * drill engine. Coverage: all 34 templates (`*0`..`*33`) plus the
 * two layers of 2008 hints — per-template "translates into '('"
 * Layer-1 hint, plus per-mistake `*e`-block explanations attached
 * to specific wrong options via `Option.hint`.
 *
 * Each template defines two paired prompt forms:
 *   - **Natural-language**: "You aren't both careful and dangerous"
 *   - **Abstract**: "Not both C and D"
 *
 * The runtime randomly picks one form per draw (50/50). Letter
 * variables ($j, $k, $q) are bound to the uppercase first letters
 * of the chosen adjectives ($B, $C, $D), so the abstract form's
 * letters always trace back to a concrete English term — same
 * convention as 2008.
 *
 * Operator rendering: Unicode in the spec table below (·, ∨, ⊃, ≡,
 * ∼); converted to KaTeX (\cdot, \vee, \supset, \equiv, \sim) at
 * Option.label render time.
 */

import type { Option, Question, Set } from '../types';
import { rngFromSeed, pickFrom, type Rng } from '@/lib/rng';
import { adjectives } from '../lexicons';

// =============================================================
// KaTeX rendering of propositional wffs
// =============================================================

const KATEX_OPS: ReadonlyArray<readonly [string, string]> = [
  ['∼', '\\sim '],
  ['·', '\\cdot '],
  ['∨', '\\vee '],
  ['⊃', '\\supset '],
  ['≡', '\\equiv '],
];

/** Convert a Unicode-operator wff string to KaTeX inline-math markup. */
function toKatex(wff: string): string {
  let out = wff;
  for (const [unicode, latex] of KATEX_OPS) {
    out = out.split(unicode).join(latex);
  }
  return `$ ${out} $`;
}

// =============================================================
// Layer-2 hints — per-mistake explanations from 2008 `*e` block
// =============================================================

// The 2008 `*e` block (decoded set_C.txt) attaches these two by explicit
// per-template-per-option conditions, not as a reusable pair:
//   extra-∼:  r=1&y=c | r=3&y=c | r=4&y=b
//   forgot-∼: r=7&y=c | r=9&y=b | r=10&y=b
// (r = template number, y = option letter, option a = correct.) The
// anatomy behind the conditions: "extra" always sits on the option with
// MORE ‘∼’ than the answer, "forgot" on the option missing the second ‘∼’
// of a two-negation answer — the invariant the generator test pins.
// Everywhere else in the negation cluster, 2008 shows the Layer-1 line
// alone.
const HINT_EXTRA_NEG = 'Why did you put in an extra ‘∼’?';
const HINT_FORGOT_SECOND_NEG = 'You forgot the second ‘∼’!';
const HINT_PARENS_PREVENT_CANCEL =
  'The ‘(’ keeps the negations from canceling out.';
const HINT_DROP_NEG_BUT = 'Get rid of the ‘∼’!';
const HINT_NECESSARY_NOT_IFF = '‘Necessary for’ is NOT an ‘if and only if.’';
const HINT_SUFFICIENT_NOT_IFF = '‘Sufficient for’ is NOT an ‘if and only if.’';
const HINT_PROVIDED_NOT_IFF = '‘Provided that’ is NOT an ‘if and only if.’';
const HINT_ONLY_IF_NOT_IFF = '‘Only if’ is NOT an ‘if and only if.’';
const HINT_IF_NOT_IFF = '‘If’ is NOT an ‘if and only if.’';
const HINT_PEOPLE_COMMON_MISTAKE = 'People often get this one wrong.';

// =============================================================
// Template spec — declarative description of one *N template
// =============================================================

type Var = 'j' | 'k' | 'q';

interface TemplateSpec {
  /** Template number (`*0`..`*33`). */
  num: number;
  /** Which abstract letter variables this template uses. */
  vars: readonly Var[];
  /**
   * Natural-language prompt template. Substitutions:
   *   `$B` ← adjective for `j`, `$C` ← adjective for `k`,
   *   `$D` ← adjective for `q`.
   */
  promptNL: string;
  /**
   * Abstract-form prompt template. Substitutions: `$j`, `$k`, `$q`
   * are uppercase first-letters of the adjectives.
   */
  promptAbs: string;
  /**
   * Four option wff templates with `$j`/`$k`/`$q` substitution
   * placeholders. **Index 0 is always the correct answer** (the
   * 2008 DSL puts option `a` first in every template).
   *
   * Operators in Unicode (·, ∨, ⊃, ≡, ∼); KaTeX conversion happens
   * at render time.
   */
  options: readonly [string, string, string, string];
  /** Per-template universal hint shown on any wrong answer. */
  layer1: string;
  /**
   * Optional per-option Layer-2 explanation. Length-4 array;
   * `undefined` entries get only Layer-1.
   */
  layer2?: readonly (string | undefined)[];
}

// =============================================================
// Template specs — all 34 from 2008 source set_C.txt
// =============================================================

const HINT_NOT_BOTH =
  '‘Both’ translates into ‘(’; so ‘not both’ translates into ‘∼(’.';
const HINT_BOTH_NOT =
  '‘Both’ translates into ‘(’; so ‘both not’ translates into ‘(∼’.';
const HINT_NOT_EITHER =
  '‘Either’ translates into ‘(’; so ‘not either’ translates into ‘∼(’.';
const HINT_EITHER_NOT =
  '‘Either’ translates into ‘(’; so ‘either not’ translates into ‘(∼’.';
const HINT_IF_NOT =
  '‘If’ translates into ‘(’; so ‘if not’ translates into ‘(∼’.';
const HINT_NOT_IF =
  '‘If’ translates into ‘(’; so ‘not if’ translates into ‘∼(’.';
const HINT_NOT_BOTH_NOT =
  '‘Both’ translates into ‘(’; so ‘not both not’ translates into ‘∼(∼’.';
const HINT_NOT_EITHER_NOT =
  '‘Either’ translates into ‘(’; so ‘not either not’ translates into ‘∼(∼’.';
const HINT_NOT_IF_NOT =
  '‘If’ translates into ‘(’; so ‘not if not’ translates into ‘∼(∼’.';
const HINT_EITHER_BOTH =
  '‘Either’ and ‘both’ translate into ‘(’; so ‘either both’ translates into ‘((’.';
const HINT_AND_EITHER =
  '‘Either’ and ‘both’ translate into ‘(’; so ‘and either’ translates into ‘· (’.';
const HINT_COMMA_GROUP =
  'The comma indicates that the parts on either side glob together as units.';
const HINT_ONLY_IF_CONSEQUENT =
  'The part after ‘only if’ is the consequent (the then-part, the part after the horseshoe).';
const HINT_UNLESS_OR = '‘Unless’ means ‘or.’';
const HINT_IF_ANTECEDENT =
  'The part after ‘if’ is the antecedent (the if-part, the part before the horseshoe).';
const HINT_BUT_AND = '‘But’ means ‘and.’';
const HINT_JUST_IF_IFF = '‘Just if’ means ‘if and only if.’';
const HINT_IFF_IFF = '‘Iff’ means ‘if and only if.’';
const HINT_PROVIDED_ANTECEDENT =
  'The part after ‘provided that’ is the antecedent (the if-part, the part before the horseshoe).';
const HINT_NEC_SUFF_IFF = '‘Necessary and sufficient’ means ‘if and only if.’';
const HINT_SUFFICIENT_IF_THEN = '‘Sufficient for’ is just an ‘if-then.’';

const SPECS: readonly TemplateSpec[] = [
  // --- Easy: combinatorial forms with explicit "both/either/if" ---
  {
    num: 0,
    vars: ['k', 'q'],
    promptNL: "You aren't both $C and $D.",
    promptAbs: 'Not both $k and $q.',
    options: ['∼($k · $q)', '(∼$k · ∼$q)', '(∼$k · $q)', '∼$k · $q'],
    layer1: HINT_NOT_BOTH,
    // 2008: Layer-1 alone for every wrong option (`i\r:`); the port had
    // invented a both-not Layer-2 here.
  },
  {
    num: 1,
    vars: ['k', 'q'],
    promptNL: "You're both not $C and $D.",
    promptAbs: 'Both not $k and $q.',
    options: ['(∼$k · $q)', '∼($k · $q)', '(∼$k · ∼$q)', '∼$k · $q'],
    layer1: HINT_BOTH_NOT,
    // r=1&y=c: the ∼ on $q is the extra one. b/d get Layer-1 alone.
    layer2: [undefined, undefined, HINT_EXTRA_NEG, undefined],
  },
  {
    num: 2,
    vars: ['j', 'k'],
    promptNL: "You aren't either $B or $C.",
    promptAbs: 'Not either $j or $k.',
    options: ['∼($j ∨ $k)', '(∼$j ∨ $k)', '(∼$j ∨ ∼$k)', '∼$j ∨ $k'],
    layer1: HINT_NOT_EITHER,
    // 2008 `ir=2:` — Layer-1 alone for every wrong option.
  },
  {
    num: 3,
    vars: ['j', 'k'],
    promptNL: "You're either not $B or else $C.",
    promptAbs: 'Either not $j or $k.',
    options: ['(∼$j ∨ $k)', '∼($j ∨ $k)', '(∼$j ∨ ∼$k)', '∼$j ∨ $k'],
    layer1: HINT_EITHER_NOT,
    // r=3&y=c: the ∼ on $k is the extra one. b/d get Layer-1 alone.
    layer2: [undefined, undefined, HINT_EXTRA_NEG, undefined],
  },
  {
    num: 4,
    vars: ['j', 'q'],
    promptNL: "If you aren't $B then you're $D.",
    promptAbs: 'If not $j then $q.',
    options: ['(∼$j ⊃ $q)', '(∼$j ⊃ ∼$q)', '∼($j ⊃ $q)', '∼$j ⊃ $q'],
    layer1: HINT_IF_NOT,
    // r=4&y=b: the ∼ on $q is the extra one. c/d get Layer-1 alone.
    layer2: [undefined, HINT_EXTRA_NEG, undefined, undefined],
  },
  {
    num: 5,
    vars: ['j', 'q'],
    promptNL: "It's false that if you're $B then you're $D.",
    promptAbs: 'Not if $j then $q.',
    options: ['∼($j ⊃ $q)', '(∼$j ⊃ ∼$q)', '(∼$j ⊃ $q)', '∼$j ⊃ $q'],
    layer1: HINT_NOT_IF,
    // 2008 `ir=5:` — Layer-1 alone for every wrong option.
  },
  {
    num: 6,
    vars: ['k', 'q'],
    promptNL: "You aren't both not $C and $D.",
    promptAbs: 'Not both not $k and $q.',
    options: ['∼(∼$k · $q)', '$k · $q', '($k · $q)', '∼∼$k · $q'],
    layer1: HINT_NOT_BOTH_NOT,
    layer2: [
      undefined,
      HINT_PARENS_PREVENT_CANCEL,
      HINT_PARENS_PREVENT_CANCEL,
      HINT_PARENS_PREVENT_CANCEL,
    ],
  },
  {
    num: 7,
    vars: ['k', 'q'],
    promptNL: "You're both not $C and not $D.",
    promptAbs: 'Both not $k and not $q.',
    options: ['(∼$k · ∼$q)', '∼($k · ∼$q)', '(∼$k · $q)', '∼$k · ∼$q'],
    layer1: HINT_BOTH_NOT,
    // r=7&y=c: dropped the answer's second ∼. b/d get Layer-1 alone.
    layer2: [undefined, undefined, HINT_FORGOT_SECOND_NEG, undefined],
  },
  {
    num: 8,
    vars: ['j', 'k'],
    promptNL: "You aren't either not $B or $C.",
    promptAbs: 'Not either not $j or $k.',
    options: ['∼(∼$j ∨ $k)', '$j ∨ $k', '($j ∨ $k)', '∼∼$j ∨ $k'],
    layer1: HINT_NOT_EITHER_NOT,
    layer2: [
      undefined,
      HINT_PARENS_PREVENT_CANCEL,
      HINT_PARENS_PREVENT_CANCEL,
      HINT_PARENS_PREVENT_CANCEL,
    ],
  },
  {
    num: 9,
    vars: ['j', 'k'],
    promptNL: "You're either not $B or not $C.",
    promptAbs: 'Either not $j or not $k.',
    options: ['(∼$j ∨ ∼$k)', '(∼$j ∨ $k)', '∼($j ∨ ∼$k)', '∼$j ∨ ∼$k'],
    layer1: HINT_EITHER_NOT,
    // r=9&y=b: dropped the answer's second ∼. c/d get Layer-1 alone.
    layer2: [undefined, HINT_FORGOT_SECOND_NEG, undefined, undefined],
  },
  {
    num: 10,
    vars: ['j', 'q'],
    promptNL: "If you aren't $B then you aren't $D.",
    promptAbs: 'If not $j then not $q.',
    options: ['(∼$j ⊃ ∼$q)', '(∼$j ⊃ $q)', '∼($j ⊃ ∼$q)', '∼$j ⊃ ∼$q'],
    layer1: HINT_IF_NOT,
    // r=10&y=b: dropped the answer's second ∼. c/d get Layer-1 alone
    // (2008 routes y=c through r=50 back to the if-not Layer-1 line).
    layer2: [undefined, HINT_FORGOT_SECOND_NEG, undefined, undefined],
  },
  {
    num: 11,
    vars: ['j', 'q'],
    promptNL: "It is false that if you aren't $B then you're $D.",
    promptAbs: 'Not if not $j then $q.',
    options: ['∼(∼$j ⊃ $q)', '$j ⊃ $q', '($j ⊃ $q)', '∼∼$j ⊃ $q'],
    layer1: HINT_NOT_IF_NOT,
    layer2: [
      undefined,
      HINT_PARENS_PREVENT_CANCEL,
      HINT_PARENS_PREVENT_CANCEL,
      HINT_PARENS_PREVENT_CANCEL,
    ],
  },
  {
    num: 12,
    vars: ['j', 'k', 'q'],
    promptNL: "You're either both $B and $C or else $D.",
    promptAbs: 'Either both $j and $k or $q.',
    options: [
      '(($j · $k) ∨ $q)',
      '$j · $k ∨ $q',
      '($j · ($k ∨ $q))',
      '($j · $k) ∨ $q',
    ],
    layer1: HINT_EITHER_BOTH,
  },
  {
    num: 13,
    vars: ['j', 'k', 'q'],
    promptNL: "You're both $B and either $C or $D.",
    promptAbs: 'Both $j and either $k or $q.',
    options: [
      '($j · ($k ∨ $q))',
      '$j · $k ∨ $q',
      '($j · $k) ∨ $q',
      '(($j · $k) ∨ $q)',
    ],
    layer1: HINT_AND_EITHER,
  },
  {
    num: 14,
    vars: ['j', 'k', 'q'],
    promptNL: "You're $B and $C, or else $D.",
    promptAbs: '$j and $k, or $q.',
    options: [
      '(($j · $k) ∨ $q)',
      '$j · $k ∨ $q',
      '($j · ($k ∨ $q))',
      '($j · $k) ∨ $q',
    ],
    layer1: HINT_COMMA_GROUP,
  },
  {
    num: 15,
    vars: ['j', 'k', 'q'],
    promptNL: "You're $B, and $C or $D.",
    promptAbs: '$j, and $k or $q.',
    options: [
      '($j · ($k ∨ $q))',
      '$j · $k ∨ $q',
      '($j · $k) ∨ $q',
      '(($j · $k) ∨ $q)',
    ],
    layer1: HINT_COMMA_GROUP,
  },
  {
    num: 16,
    vars: ['j', 'k', 'q'],
    promptNL: "If you're $B and $C, then you're $D.",
    promptAbs: 'If $j and $k, then $q.',
    options: [
      '(($j · $k) ⊃ $q)',
      '$j · $k ⊃ $q',
      '($j · ($k ⊃ $q))',
      '($j · $k) ⊃ $q',
    ],
    layer1: HINT_COMMA_GROUP,
  },
  {
    num: 17,
    vars: ['j', 'k', 'q'],
    promptNL: "If you're $B, then you're $C and $D.",
    promptAbs: 'If $j, then $k and $q.',
    options: [
      '($j ⊃ ($k · $q))',
      '$j ⊃ $k · $q',
      '($j ⊃ $k) · $q',
      '(($j ⊃ $k) · $q)',
    ],
    layer1: HINT_COMMA_GROUP,
  },
  {
    num: 18,
    vars: ['j', 'k', 'q'],
    promptNL: "If you're $B then you're $C, and you're $D.",
    promptAbs: 'If $j then $k, and $q.',
    options: [
      '(($j ⊃ $k) · $q)',
      '$j ⊃ $k · $q',
      '($j ⊃ ($k · $q))',
      '($j ⊃ $k) · $q',
    ],
    layer1: HINT_COMMA_GROUP,
  },
  {
    num: 19,
    vars: ['j', 'k', 'q'],
    promptNL: "If you're $B, then you're $C or $D.",
    promptAbs: 'If $j, then $k or $q.',
    options: [
      '($j ⊃ ($k ∨ $q))',
      '$j ⊃ $k ∨ $q',
      '($j ⊃ $k) ∨ $q',
      '(($j ⊃ $k) ∨ $q)',
    ],
    layer1: HINT_COMMA_GROUP,
  },
  {
    num: 20,
    vars: ['j', 'k', 'q'],
    promptNL: "If you're $B then you're $C, or you're $D.",
    promptAbs: 'If $j then $k, or $q.',
    options: [
      '(($j ⊃ $k) ∨ $q)',
      '$j ⊃ $k ∨ $q',
      '($j ⊃ ($k ∨ $q))',
      '($j ⊃ $k) ∨ $q',
    ],
    layer1: HINT_COMMA_GROUP,
  },
  // --- Hard: idiomatic English phrasings ---
  {
    num: 21,
    vars: ['j', 'q'],
    promptNL: "Only if you're $B are you $D.",
    promptAbs: 'Only if $j, $q.',
    // Option order here is [a, b, d, c] relative to the DSL letters —
    // index 2 is the bare-wff letter d, index 3 the wrong-direction c.
    options: ['($q ⊃ $j)', '($j ≡ $q)', '$j ⊃ $q', '($j ⊃ $q)'],
    layer1: HINT_ONLY_IF_NOT_IFF,
    // 2008 `Cr=22:r21` + `Cr=21:r21+y=c`: only y=c (the wrong-direction
    // conditional) gets the consequent hint; b and the bare d stay on
    // the not-iff line — which Layer-1 already supplies, so a Layer-2
    // repeat would print the same sentence twice.
    layer2: [undefined, undefined, undefined, HINT_ONLY_IF_CONSEQUENT],
  },
  {
    num: 22,
    vars: ['j', 'q'],
    promptNL: "You're $B only if you're $D.",
    promptAbs: '$j only if $q.',
    options: ['($j ⊃ $q)', '($j ≡ $q)', '($q ⊃ $j)', '$j ⊃ $q'],
    layer1: HINT_ONLY_IF_CONSEQUENT,
    // 2008 routes b AND the bare d to the not-iff line (`Cr=22:r21`,
    // then only y=c comes back to r22's consequent hint).
    layer2: [undefined, HINT_ONLY_IF_NOT_IFF, undefined, HINT_ONLY_IF_NOT_IFF],
  },
  {
    num: 23,
    vars: ['j', 'k'],
    promptNL: "You're $C unless you're $B.",
    promptAbs: '$k unless $j.',
    options: ['($k ∨ $j)', '($k ≡ $j)', '($k ⊃ ∼$j)', '$k ≡ $j'],
    layer1: HINT_UNLESS_OR,
  },
  {
    num: 24,
    vars: ['j', 'k'],
    promptNL: "Unless you're $C, you're $B.",
    promptAbs: 'Unless $k, $j.',
    options: ['($k ∨ $j)', '($k ≡ $j)', '($k ⊃ ∼$j)', '$k ≡ $j'],
    layer1: HINT_UNLESS_OR,
  },
  {
    num: 25,
    vars: ['j', 'k'],
    promptNL: "You're $B if you're $C.",
    promptAbs: '$j if $k.',
    options: ['($k ⊃ $j)', '($j ⊃ $k)', '($j ≡ $k)', '$j ⊃ $k'],
    layer1: HINT_IF_ANTECEDENT,
    layer2: [undefined, undefined, HINT_IF_NOT_IFF, undefined],
  },
  {
    num: 26,
    vars: ['j', 'k'],
    promptNL: "You're $B but you're also $C.",
    promptAbs: '$j but $k.',
    options: ['($j · $k)', '($j · ∼$k)', '$j · $k', '$j · ∼$k'],
    layer1: HINT_BUT_AND,
    layer2: [undefined, HINT_DROP_NEG_BUT, undefined, HINT_DROP_NEG_BUT],
  },
  {
    num: 27,
    vars: ['j', 'q'],
    promptNL: "You're $B just if you're $D.",
    promptAbs: '$j just if $q.',
    options: ['($j ≡ $q)', '($j ⊃ $q)', '($q ⊃ $j)', '$j ≡ $q'],
    layer1: HINT_JUST_IF_IFF,
  },
  {
    num: 28,
    vars: ['k', 'q'],
    promptNL: "You're $D iff you're $C.",
    promptAbs: '$q iff $k.',
    options: ['($q ≡ $k)', '($q ⊃ $k)', '($k ⊃ $q)', '$q ≡ $k'],
    layer1: HINT_IFF_IFF,
  },
  {
    num: 29,
    vars: ['k', 'q'],
    promptNL: "You're $D provided that you're $C.",
    promptAbs: '$q provided that $k.',
    // DSL letter d is the BARE WRONG-DIRECTION wff (`d$q ⊃ $k`, which
    // letter b wraps as `b($d)`) — not an unparenthesized copy of the
    // correct answer. The port originally wrote `$k ⊃ $q` here.
    options: ['($k ⊃ $q)', '($q ⊃ $k)', '($q ≡ $k)', '$q ⊃ $k'],
    layer1: HINT_PROVIDED_ANTECEDENT,
    layer2: [undefined, undefined, HINT_PROVIDED_NOT_IFF, undefined],
  },
  {
    /**
     * *30 has a peculiar prompt structure: the 2008 DSL writes the
     * NL form as " you're $D, you're $C" (note leading space) and
     * prefixes "Provided that" at runtime, yielding "Provided that
     * you're $D, you're $C" — i.e., $D is the antecedent and $C
     * the consequent. So the canonical translation is `($q ⊃ $k)`,
     * not `($k ⊃ $q)`. Trace: "Provided that q, k" reads as "if q
     * then k".
     */
    num: 30,
    vars: ['k', 'q'],
    promptNL: "Provided that you're $D, you're $C.",
    promptAbs: 'Provided that $q, $k.',
    options: ['($q ⊃ $k)', '($k ⊃ $q)', '($q ≡ $k)', '$q ⊃ $k'],
    layer1: HINT_PROVIDED_ANTECEDENT,
    layer2: [undefined, undefined, HINT_PROVIDED_NOT_IFF, undefined],
  },
  {
    num: 31,
    vars: ['j', 'k'],
    promptNL: 'Being $C is necessary and sufficient for your being $B.',
    promptAbs: '$k is necessary and sufficient for $j.',
    options: ['($k ≡ $j)', '($k ⊃ $j)', '($j ⊃ $k)', '$k ≡ $j'],
    layer1: HINT_NEC_SUFF_IFF,
  },
  {
    num: 32,
    vars: ['j', 'k'],
    promptNL: 'Being $B is necessary for you to be $C.',
    promptAbs: '$j is necessary for $k.',
    options: ['(∼$j ⊃ ∼$k)', '($j ⊃ $k)', '($j ≡ $k)', '$j ⊃ $k'],
    layer1: HINT_NECESSARY_NOT_IFF,
    // 2008 `Cr=32:r32+8+y=c`: y=c → the not-iff line (Layer-1 already
    // says it — repeating it in Layer-2 printed the sentence twice);
    // b/d → "People … often get this one wrong." (2008 personalizes
    // it with the user's place, `$p`; the port drops the place.)
    layer2: [
      undefined,
      HINT_PEOPLE_COMMON_MISTAKE,
      undefined,
      HINT_PEOPLE_COMMON_MISTAKE,
    ],
  },
  {
    num: 33,
    vars: ['j', 'k'],
    promptNL: 'Being $B is sufficient for you to be $C.',
    promptAbs: '$j is sufficient for $k.',
    options: ['($j ⊃ $k)', '($j ≡ $k)', '(∼$j ⊃ ∼$k)', '$j ⊃ $k'],
    layer1: HINT_SUFFICIENT_IF_THEN,
    layer2: [undefined, HINT_SUFFICIENT_NOT_IFF, undefined, undefined],
  },
];

// =============================================================
// Helpers — substitution + adjective picking
// =============================================================

/**
 * Substitute `$X` placeholders in `template` with values from
 * `vars`. Iterates in key order (sorted longest-first inside this
 * function so that `$As` would be substituted before `$A` if both
 * existed — not currently relevant for Set C but kept for safety).
 */
function subst(
  template: string,
  vars: Readonly<Record<string, string>>
): string {
  let out = template;
  const keys = Object.keys(vars).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    out = out.split(`$${k}`).join(vars[k]!);
  }
  return out;
}

/**
 * Pick `count` distinct adjectives such that all first letters are
 * mutually distinct. Falls back to non-distinct picks if the lexicon
 * runs out (shouldn't happen for `count` ≤ 3 with 87 adjectives).
 */
function pickDistinctLetterAdj(rng: Rng, count: 1 | 2 | 3): string[] {
  const out: string[] = [];
  const seenLetters = new Set<string>();
  let attempts = 0;
  while (out.length < count && attempts < 500) {
    attempts++;
    const a = pickFrom(rng, adjectives);
    const letter = a[0]!.toLowerCase();
    if (seenLetters.has(letter) || out.includes(a)) continue;
    out.push(a);
    seenLetters.add(letter);
  }
  while (out.length < count) {
    out.push(pickFrom(rng, adjectives));
  }
  return out;
}

interface OptionPiece {
  label: string;
  hint?: string;
}

function buildOptions(
  pieces: readonly OptionPiece[],
  correctIdx: number
): { options: Option[]; correctId: number[] } {
  const options: Option[] = pieces.map((p, i) =>
    i === correctIdx
      ? { id: i, label: p.label }
      : { id: i, label: p.label, hint: p.hint }
  );
  return { options, correctId: [correctIdx] };
}

function qid(num: number, n: number): string {
  return `gen.C.${num}.${n}`;
}

// =============================================================
// Render — turn one TemplateSpec into one concrete Question
// =============================================================

function renderTemplate(
  spec: TemplateSpec,
  rng: Rng,
  counter: number
): Question {
  // Pick adjectives — one per var the template uses
  const adjs = pickDistinctLetterAdj(rng, spec.vars.length as 1 | 2 | 3);

  // Map var → adjective → letter
  const VAR_TO_ADJ_KEY: Record<Var, 'B' | 'C' | 'D'> = {
    j: 'B',
    k: 'C',
    q: 'D',
  };
  const adjVars: Record<string, string> = {};
  const letterVars: Record<string, string> = {};
  spec.vars.forEach((v, i) => {
    const adj = adjs[i]!;
    adjVars[VAR_TO_ADJ_KEY[v]] = adj;
    letterVars[v] = adj[0]!.toUpperCase();
  });

  // Choose presentation: NL or abstract (50/50)
  const useNL = rng() < 0.5;
  const prompt = useNL
    ? subst(spec.promptNL, adjVars)
    : subst(spec.promptAbs, letterVars);

  // Render options: substitute letters into wff strings, then KaTeX
  const renderedOptions: OptionPiece[] = spec.options.map((wffTpl, i) => {
    const wff = subst(wffTpl, letterVars);
    const layer2 = spec.layer2?.[i];
    const hint = layer2 ? `${spec.layer1}\n${layer2}` : spec.layer1;
    return { label: toKatex(wff), hint };
  });

  return {
    id: qid(spec.num, counter),
    prompt,
    ...buildOptions(renderedOptions, 0),
    answer: '',
  };
}

// =============================================================
// Iterators
// =============================================================

const easySpecs = SPECS.filter((s) => s.num <= 20);
const hardSpecs = SPECS.filter((s) => s.num >= 21);

export function* easyQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const spec = pickFrom(rng, easySpecs);
    yield renderTemplate(spec, rng, counter++);
  }
}

export function* hardQuestions(seed?: number): Generator<Question> {
  const rng = rngFromSeed(seed);
  let counter = 0;
  while (true) {
    const spec = pickFrom(rng, hardSpecs);
    yield renderTemplate(spec, rng, counter++);
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

export function generateSetC(seed?: number, perSubset = 10): Set {
  const seedFor = (offset: number) =>
    seed != null ? seed + offset : undefined;
  return {
    name: 'Set C',
    logicType: 'Propositional Translations',
    slugs: ['propositional', 'translations'],
    id: 6,
    title: 'Propositional Translations: Easy',
    header: 'Translates into logic as:',
    subSets: [
      {
        name: 'Set C',
        shuffleOptions: true,
        logicType: 'Propositional Translations',
        slugs: ['propositional', 'translations'],
        id: 6,
        title: 'Propositional Translations: Easy',
        header: 'Translates into logic as:',
        description:
          'Translate ordinary language into symbols — and, or, if-then — without losing the structure of the argument.',
        questions: take(easyQuestions(seedFor(1)), perSubset),
      },
      {
        name: 'Set C',
        shuffleOptions: true,
        logicType: 'Propositional Translations',
        slugs: ['propositional', 'translations', 'hard'],
        isNew: true,
        id: 6,
        title: 'Propositional Translations: Hard',
        header: 'Translates into logic as:',
        description:
          'Handle the connectives that trip people up — unless, only if, and necessary versus sufficient conditions.',
        questions: take(hardQuestions(seedFor(2)), perSubset),
      },
    ],
  };
}
