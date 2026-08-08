import React from 'react';
import type { Option, OptionHint } from '@/content/types';
import { spriteClip } from '@/lib/pixel';
import { FeedbackText } from './feedbackText';
import { LampIcon } from './pixelIcons';

/**
 * The hint block — a wrong pick's explanation, in the hierarchy decided in
 * the pattern lab (docs/redesign-handoff.md, decision 5):
 *
 *   - The identifier is the fallacy's FULL NAME, run into the sentence
 *     (`Appeal to authority. This is fallacious if:`) — the 2008 source's
 *     own form. Never the two-letter code: ruling an option replaces its
 *     badge with ✕, so at the moment the hint appears the code it points
 *     at is nowhere on screen. (`Heading` remains the open alternative.)
 *   - TWO TONES, and only the lamp is the loud one. The lamp says a wrong
 *     answer prompted this; everything else — the name included — is ink,
 *     because it is teaching material rather than a reprimand.
 *   - Clauses render as the list they are in the data, with hanging
 *     numbers — never flex; mixed inline content must stay in one inline
 *     formatting context (see the audit's own regression).
 */

/** Notation chips wear the keycaps' own clip — Sprite 4px, decided 2026-08-06. */
export const NOTATION_CHIP_CLIP = spriteClip(0, 8);

type ProseSegment =
  | { type: 'prose'; text: string }
  | { type: 'chip'; text: string }
  | { type: 'em'; text: string };

/**
 * Split hint prose into renderable segments. Two markups, each restoring
 * something the 2008 port flattened:
 *
 *   `∴ …`  an INFERENCE, chipped to the end of its sentence. The glosses
 *          are half logic ("Most people believe A. ∴ A is true.") and the
 *          app sets notation apart everywhere else — FeedbackText only
 *          catches quoted tokens, and ∴ isn't in its glyph set.
 *   `*x*`  EMPHASIS (the source's 0xBD byte), rendered as the decided
 *          `Rule` mark: weight + a hard 2px accent underline.
 */
export function proseSegments(text: string): ProseSegment[] {
  const out: ProseSegment[] = [];
  const re = /∴\s*([^.]*)|\*([^*]+)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      out.push({ type: 'prose', text: text.slice(last, match.index) });
    }
    if (match[1] !== undefined) {
      out.push({ type: 'chip', text: `∴ ${match[1].trim()}` });
    } else {
      out.push({ type: 'em', text: match[2]! });
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    out.push({ type: 'prose', text: text.slice(last) });
  }
  return out;
}

/**
 * Hint/answer prose with the markup grammar applied; plain runs still
 * flow through FeedbackText (quoted-notation chips, KaTeX).
 */
export function HintProse({ text }: { text: string }) {
  const segments = proseSegments(text);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'chip') {
          return (
            <code
              key={i}
              className='qchip'
              style={{ clipPath: NOTATION_CHIP_CLIP }}
            >
              {seg.text}
            </code>
          );
        }
        if (seg.type === 'em') {
          return <em key={i}>{seg.text}</em>;
        }
        return <FeedbackText key={i} text={seg.text} />;
      })}
    </>
  );
}

/** Resolve an option's structured hint, falling back to the flat string. */
export function hintPartsOf(option: Option): OptionHint | undefined {
  if (option.hintParts) return option.hintParts;
  return option.hint ? { lead: option.hint } : undefined;
}

export function HintBlock({ hint }: { hint: OptionHint }) {
  const { term, lead, clauses } = hint;
  // The 2008 source's own run-in: `Appeal to authority. This is
  // fallacious if:`. A description that opens on a parenthetical
  // ('(“personal attack”). This is …') runs straight on instead.
  const joiner = /^\(/.test(lead) ? ' ' : '. ';
  return (
    <div>
      <p className='qhint-head'>
        <LampIcon className='qhint-lamp' />
        {term && (
          <>
            <b className='qhint-term'>{term}</b>
            {joiner}
          </>
        )}
        <HintProse text={lead} />
      </p>
      {clauses && clauses.length > 0 && (
        <ol className='qhint-clauses'>
          {clauses.map((clause, i) => (
            <li key={i}>
              <HintProse text={clause} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
