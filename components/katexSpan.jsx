import katex from 'katex';
import 'katex/dist/katex.min.css';
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
];

/**
 * Rewrite backtick-delimited regions to inline KaTeX with operator
 * glyphs replaced by macros and `{X}` expanded to `\underline{X}`.
 * Idempotent on text without backticks.
 */
function rewriteBacktickedMath(text) {
  return text.replace(/`([^`]+)`/g, (_, raw) => {
    let math = raw;
    for (const [glyph, latex] of INLINE_MATH_OPS) {
      math = math.split(glyph).join(latex);
    }
    math = math.replace(/\{([A-Za-z])\}/g, '\\underline{$1}');
    return `$${math}$`;
  });
}

function escapeRegex(value) {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function findEndOfMath(delimiter, text, startIndex) {
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

function splitAtDelimiters(text) {
  const segments = [];
  const leftDelimiterRegex = new RegExp(
    `(${DELIMITERS.map((delimiter) => escapeRegex(delimiter.left)).join('|')})`
  );

  let remainingText = text;

  while (remainingText.length > 0) {
    const startIndex = remainingText.search(leftDelimiterRegex);

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

function renderKatex(text) {
  if (typeof text !== 'string') {
    return text;
  }

  const segments = splitAtDelimiters(rewriteBacktickedMath(text));

  return segments.map((segment, index) => {
    if (segment.type === 'text') {
      return formatTextTypography(segment.data);
    }

    try {
      const html = katex.renderToString(segment.data, {
        displayMode: segment.display,
        throwOnError: false,
      });

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
}

export default function KatexSpan({
  as: Component = 'span',
  text,
  ...delegated
}) {
  return <Component {...delegated}>{renderKatex(text)}</Component>;
}
