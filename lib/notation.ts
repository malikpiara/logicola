/**
 * Gensler's operator notation, in the two directions the app needs
 * (Malik, 2026-08-25).
 *
 * This module deliberately imports NOTHING. It sits on the shared side
 * of the KaTeX split (components/katexSpan.tsx), so anything imported
 * here would be dragged onto the critical path of every quiz page —
 * which is the exact cost that split was made to avoid.
 */

/**
 * The glyph ↔ command table. Generators author with the Unicode glyph
 * so the TypeScript stays readable; KaTeX needs the command.
 *
 * Commands carry NO trailing space here — callers add their own, since
 * `\simS` would tokenise as a single unknown macro.
 *
 * Each operator also declares whether it takes one operand or sits
 * between two. That is the same distinction the spacing fix turns on:
 * a PREFIX operator belongs against its operand, an INFIX one belongs
 * between its operands. Getting it wrong is what made `∼ S· ∼ B` read
 * as though the dot bound to the S.
 */
export const NOTATION_OPS = [
  ['☐', '\\square', 'prefix'],
  ['◇', '\\lozenge', 'prefix'],
  ['∼', '\\sim', 'prefix'],
  ['∃', '\\exists', 'prefix'],
  ['·', '\\cdot', 'infix'],
  ['∨', '\\vee', 'infix'],
  ['⊃', '\\supset', 'infix'],
  ['≡', '\\equiv', 'infix'],
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/** Glyphs → LaTeX, for the backtick-delimited regions in hint strings. */
export function glyphsToLatex(math: string): string {
  let out = math;
  for (const [glyph, command] of NOTATION_OPS) {
    out = out.split(glyph).join(`${command} `);
  }
  return out;
}

/**
 * Make negation hug its operand (Malik's call, 2026-08-25, variant B of
 * docs/notation-spacing-lab.html).
 *
 * LaTeX classes `\sim` as a RELATION — it means "is similar to" there,
 * not "not". So TeX gives it thickspace (5/18 em) on both sides and it
 * floats off the letter it negates. Worse, TeX demotes a binary
 * operator that sits next to a relation to an ordinary atom, so the
 * `\cdot` in `\sim S \cdot \sim B` lost its spacing entirely and
 * collapsed onto the S: measured 6.4px around the negation against
 * 1.3px around the conjunction, at the quiz's real 23px.
 *
 * The spacing was therefore arguing against the grouping — negation
 * binds tightest but was drawn loosest. Wrapping in braces makes it
 * `\mathord`, so it takes no space on either side and the conjunction
 * gets its medspace back.
 *
 * The general lesson, worth keeping: TeX derives spacing from an atom's
 * CLASS, never from what the symbol means in your notation. Ours is
 * Gensler's, not LaTeX's.
 */
export function hugNegation(latex: string): string {
  // Unwrap first so this is idempotent. The tidy way to skip an
  // already-braced negation would be a lookbehind, but that is ES2018
  // and Safari only shipped it in 16.4 — an unsupported lookbehind is a
  // SyntaxError when the REGEX IS PARSED, so it would take this whole
  // module down on an older iPad rather than degrade. Not a trade worth
  // making for a string this small.
  const flat = latex.replace(/\{\\sim\}/g, '\\sim ');

  // `(?![a-zA-Z])` so this never eats a longer macro name; the trailing
  // whitespace goes with it, since braces already delimit the atom.
  return flat.replace(/\\sim(?![a-zA-Z])[ \t]*/g, '{\\sim}');
}

/**
 * LaTeX → glyphs, for the lazy boundary's fallback.
 *
 * KaTeX is a 265 KB chunk, and until it lands the Suspense fallback is
 * all the reader has. Rendering the source verbatim put
 * `$ (C \cdot (S \vee M)) $` on screen for up to ~1.9s on a phone
 * (measured on production over Fast 3G, 2026-08-25). The same table
 * that builds the LaTeX can undo it, so the fallback reads as
 * `(C · (S ∨ M))` and the swap to KaTeX becomes a change of typeface
 * rather than a change of content.
 *
 * Best-effort by design: this is a bridge of a few hundred
 * milliseconds, not a second renderer.
 */
export function latexToGlyphs(text: string): string {
  // Hint strings mark inline math with backticks and already hold
  // glyphs; the delimiters themselves are noise to a reader.
  let out = text.replace(/`([^`]*)`/g, '$1');

  // `$…$` and `$$…$$` regions are LaTeX; everything outside is prose
  // and must survive untouched.
  out = out.replace(/\$\$?([^$]*)\$\$?/g, (_, inner: string) =>
    convertMath(inner)
  );

  return out;
}

function convertMath(math: string): string {
  let out = math;

  // Underlining (Set A's distributed terms) has no plain-text form
  // worth faking — keep the letter, drop the macro.
  out = out.replace(/\\underline\s*\{([^}]*)\}/g, '$1');

  // A command's trailing space is tokenisation, never typography, so it
  // is consumed here and re-added only where the operator wants it: a
  // prefix operator hugs what follows, an infix one keeps its gap. That
  // mirrors what KaTeX will do a moment later, so the swap is a change
  // of typeface and not a reflow.
  for (const [glyph, command, arity] of NOTATION_OPS) {
    out = out.replace(
      new RegExp(`${escapeRegExp(command)}(?![a-zA-Z])[ \\t]*`, 'g'),
      arity === 'prefix' ? glyph : `${glyph} `
    );
  }

  // Grouping braces only ever came from the macros above (and from
  // hugNegation); they are not content.
  out = out.replace(/[{}]/g, '');

  // A command's trailing space is tokenisation, not typography.
  return out.replace(/\s+/g, ' ').trim();
}
