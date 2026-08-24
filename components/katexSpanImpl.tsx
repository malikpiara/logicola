import katex from 'katex';
import 'katex/dist/katex.min.css';
import React from 'react';
import { formatTextTypography } from '@/lib/typography';

const DELIMITERS = [
  { left: '$$', right: '$$', display: true },
  { left: '$', right: '$', display: false },
];

/**
 * Operator-glyph → LaTeX conversion table for backtick-delimited
 * inline-math regions. The generators write hint strings with
 * Unicode operator glyphs and a `{X}` shorthand for underlines (so
 * the TS code stays readable); this rewriter converts those
 * regions into `$…$` KaTeX delimiters with proper macros.
 *
 * Outside backticks, the same Unicode glyphs render as plain
 * Unicode — that's fine in prose context.
 */
const INLINE_MATH_OPS = [
  ['☐', '\\square '],
  ['◇', '\\lozenge '],
  ['∼', '\\sim '],
  ['·', '\\cdot '],
  ['∨', '\\vee '],
  ['⊃', '\\supset '],
  ['≡', '\\equiv '],
  ['∃', '\\exists '],
] as const;

interface TextSegment {
  type: 'text';
  data: string;
}

interface MathSegment {
  type: 'math';
  data: string;
  display: boolean;
  raw: string;
}

type Segment = TextSegment | MathSegment;

/**
 * Rewrite backtick-delimited regions to inline KaTeX with operator
 * glyphs replaced by macros and `{X}` expanded to `\underline{X}`.
 * Idempotent on text without backticks.
 */
function rewriteBacktickedMath(text: string): string {
  return text.replace(/`([^`]+)`/g, (_, raw: string) => {
    let math = raw;
    for (const [glyph, latex] of INLINE_MATH_OPS) {
      math = math.split(glyph).join(latex);
    }
    math = math.replace(/\{([A-Za-z])\}/g, '\\underline{$1}');
    return `$${math}$`;
  });
}

function escapeRegex(value: string): string {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function findEndOfMath(
  delimiter: string,
  text: string,
  startIndex: number
): number {
  let index = startIndex;
  let braceLevel = 0;
  const delimiterLength = delimiter.length;

  while (index < text.length) {
    const character = text[index];

    if (
      braceLevel <= 0 &&
      text.slice(index, index + delimiterLength) === delimiter
    ) {
      return index;
    }

    if (character === '\\') {
      index += 1;
    } else if (character === '{') {
      braceLevel += 1;
    } else if (character === '}') {
      braceLevel -= 1;
    }

    index += 1;
  }

  return -1;
}

// DELIMITERS is a module constant, so the search regex is too — it was
// being rebuilt on every splitAtDelimiters call (once per KatexSpan per
// render; 19× per Set R paint).
const LEFT_DELIMITER_REGEX = new RegExp(
  `(${DELIMITERS.map((delimiter) => escapeRegex(delimiter.left)).join('|')})`
);

function splitAtDelimiters(text: string): Segment[] {
  const segments: Segment[] = [];

  let remainingText = text;

  while (remainingText.length > 0) {
    const startIndex = remainingText.search(LEFT_DELIMITER_REGEX);

    if (startIndex === -1) {
      segments.push({ type: 'text', data: remainingText });
      break;
    }

    if (startIndex > 0) {
      segments.push({
        type: 'text',
        data: remainingText.slice(0, startIndex),
      });
      remainingText = remainingText.slice(startIndex);
    }

    const delimiter = DELIMITERS.find((candidate) =>
      remainingText.startsWith(candidate.left)
    );

    if (!delimiter) {
      segments.push({ type: 'text', data: remainingText });
      break;
    }

    const endIndex = findEndOfMath(
      delimiter.right,
      remainingText,
      delimiter.left.length
    );

    if (endIndex === -1) {
      segments.push({ type: 'text', data: remainingText });
      break;
    }

    segments.push({
      type: 'math',
      data: remainingText.slice(delimiter.left.length, endIndex),
      display: delimiter.display,
      raw: remainingText.slice(0, endIndex + delimiter.right.length),
    });

    remainingText = remainingText.slice(endIndex + delimiter.right.length);
  }

  return segments;
}

/**
 * Rendered-HTML cache. The quiz re-renders every option on each
 * selection or arrow-key move, and KaTeX parsing is the expensive part
 * of that render — but the label strings themselves are a small, fixed
 * pool per session, so each formula only ever needs to be parsed once.
 */
const katexHtmlCache = new Map<string, string>();

function katexToHtml(data: string, display: boolean): string {
  const key = `${display ? 'D' : 'I'}:${data}`;
  const cached = katexHtmlCache.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const html = katex.renderToString(data, {
    displayMode: display,
    throwOnError: false,
  });
  katexHtmlCache.set(key, html);
  return html;
}

/**
 * Full-result cache, in front of the per-formula HTML cache above: the
 * backtick rewrite, delimiter split and typography passes also re-ran
 * on every render of every option, and the rendered nodes are pure
 * functions of the input string. The pool of strings per session is
 * small and fixed, so this never grows past a few hundred entries.
 */
const renderedNodesCache = new Map<string, React.ReactNode>();

function renderKatex(text: React.ReactNode): React.ReactNode {
  if (typeof text !== 'string') {
    return text;
  }

  const cached = renderedNodesCache.get(text);
  if (cached !== undefined) {
    return cached;
  }

  const segments = splitAtDelimiters(rewriteBacktickedMath(text));

  const nodes = segments.map((segment, index) => {
    if (segment.type === 'text') {
      return formatTextTypography(segment.data);
    }

    try {
      const html = katexToHtml(segment.data, segment.display);

      return (
        <span
          key={`${segment.data}-${index}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch {
      return segment.raw;
    }
  });

  renderedNodesCache.set(text, nodes);
  return nodes;
}

export interface KatexSpanProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'children'
> {
  /** Element (or component) to render as. Defaults to `span`. */
  as?: React.ElementType;
  /** The text to render; non-string nodes pass through untouched. */
  text: React.ReactNode;
}

export default function KatexSpan({
  as: Component = 'span',
  text,
  ...delegated
}: KatexSpanProps) {
  return <Component {...delegated}>{renderKatex(text)}</Component>;
}
