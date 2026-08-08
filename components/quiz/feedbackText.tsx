import React from 'react';
import KatexSpan from '../katexSpan';
import { spriteClip } from '@/lib/pixel';

/**
 * Notation chips wear the keycaps' own clip — Sprite 4px (R=8/u=4),
 * decided 2026-08-06. Computed once; a clip-path string is far past the
 * readable length for a Tailwind arbitrary value.
 */
const CHIP_CLIP = spriteClip(0, 8);

/**
 * Glyphs that mark a quoted token as logical notation rather than an
 * English word-mention. ‘Either’ stays a quoted word; ‘∼(’ is notation.
 * Parens count: hints quote bare ‘(’ when teaching grouping.
 */
const NOTATION_GLYPHS = /[∼~·∨⊃≡☐◇∃()]/;

/**
 * Curly ‘…’ (what the generators write) or straight '…' quoting. The
 * bounded length keeps a stray unpaired quote from swallowing a
 * sentence; prose apostrophes (don’t) never match — U+2019 without an
 * opening U+2018 isn’t a pair. Built per call site: a `/g` regex is
 * stateful (`lastIndex`), so sharing one instance across renders would
 * be a mutation hazard.
 */
function quotedTokenPattern(): RegExp {
  return /‘([^’]{1,40})’|'([^']{1,40})'/g;
}

interface FeedbackTextProps {
  text: string;
}

/**
 * Hint/answer prose with notation set apart typographically instead of
 * punctuationally. Quoted tokens that contain notation glyphs lose
 * their quotes and render as KaTeX on a tinted chip — the same serif
 * voice as the option pills, so symbols in the explanation visibly
 * match the symbols being explained. Quoted word-mentions pass through
 * untouched. Everything else flows through KatexSpan as before (so
 * `$…$` and backticked math in content still work).
 */
export function FeedbackText({ text }: FeedbackTextProps) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  const quotedToken = quotedTokenPattern();
  while ((match = quotedToken.exec(text)) !== null) {
    const token = match[1] ?? match[2] ?? '';
    // Word-mention: don't advance `last`, so the quoted text simply
    // flows into the surrounding prose slice.
    if (!NOTATION_GLYPHS.test(token)) continue;

    if (match.index > last) {
      nodes.push(
        <KatexSpan
          key={key++}
          className='inline'
          text={text.slice(last, match.index)}
        />
      );
    }
    nodes.push(
      <code
        key={key++}
        // Start margin only: following punctuation (‘∼(’; → chip + ;)
        // should hug the chip, and a following word already brings its
        // own space from the source text.
        className='qchip ms-0.5'
        style={{ clipPath: CHIP_CLIP }}
      >
        {/* Backticks route through KatexSpan's glyph→macro rewriter.
            ASCII ~ would be KaTeX's non-breaking space, so normalize
            it to the real tilde operator first. */}
        <KatexSpan
          className='inline'
          text={`\`${token.replace(/~/g, '∼')}\``}
        />
      </code>
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(
      <KatexSpan key={key++} className='inline' text={text.slice(last)} />
    );
  }

  return <>{nodes}</>;
}
