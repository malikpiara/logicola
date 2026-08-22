import React from 'react';
import dynamic from 'next/dynamic';
import KatexSpan from '../katexSpan';
import { SubSet } from '@/content/types';
import { spriteClip } from '@/lib/pixel';

// Loaded on demand: the fallacy table drags the whole Set R corpus with
// it (see setRGuide.tsx). Only mounts on Set R, so only Set R pays.
const SetRGuide = dynamic(() => import('./setRGuide'));

/**
 * The reference guide, in the lab panel's information hierarchy
 * (docs/pattern-lab.html SET_GUIDES; styles in globals.css § Reference
 * guide): 15px/600 headings, 13px body, chip rows for notation, dense
 * tables with mono small-caps headers, hanging-numeral rule lists. Set
 * R's eighteen fallacies read as the same structure as the hints — code
 * chip, weighted name, ink gloss, numbered clause list — one hierarchy
 * on the card and in the reference.
 *
 * Notation renders in KaTeX (the lab used plain text — its decisions on
 * size and weight carry, the optical result was re-judged here), and
 * every notation chip wears the keycaps' clip (Sprite 4px, decided
 * 2026-08-06).
 */

/**
 * Gensler's seven canonical flaw CATEGORIES with ORIGINAL worked
 * examples (Malik approved 2026-08-22, guide-lab). The shipped set was
 * lifted verbatim from the 2008 LCEXE Set Q `*H` block / textbook §3.2
 * — replaced so the software stops reproducing Routledge's text. The
 * framework and NUMBERING stay: the numbers mirror the answer options.
 */
const SET_Q_FLAW_EXAMPLES: ReadonlyArray<{
  num: number;
  name: string;
  example: string;
  why: string;
}> = [
  {
    num: 1,
    name: 'Too broad',
    example: '“Chair” means “furniture.”',
    why: 'There is furniture that isn’t a chair.',
  },
  {
    num: 2,
    name: 'Too narrow',
    example: '“Book” means “hardcover volume.”',
    why: 'There are books that aren’t hardcover.',
  },
  {
    num: 3,
    name: 'Circular',
    example: '“Art” means “whatever artists create.”',
    why: '“Artist” is itself defined by “art.”',
  },
  {
    num: 4,
    name: 'Uses poorly understood terms',
    example: '“Sleep” means “periodic suspension of sensorimotor engagement.”',
    why: 'The latter is less clear than “sleep.”',
  },
  {
    num: 5,
    name: 'Poor match in vagueness',
    example: '“Tall” means “at least 190.5 cm.”',
    why: 'Far more precise than “tall” ever is.',
  },
  {
    num: 6,
    name: 'Poor match in emotional tone',
    example: '“Politician” means “self-serving schemer seeking office.”',
    why: 'Smuggles in a sneer that “politician” doesn’t have.',
  },
  {
    num: 7,
    name: 'Has non-essential properties',
    example: '“Human” means “animal that cooks its food.”',
    why: 'Maybe true of all and only humans — but cooking isn’t what makes someone human.',
  },
];

interface WffGuideProps {
  subSet: SubSet;
}

// Keyed by subSet.id — every registered subset needs a unique id for
// this gating to stay sound (18 = Set R, Informal Fallacies).
const GUIDE_SUBSET_IDS = new Set([1, 2, 3, 4, 6, 12, 18]);
const SET_R_SUBSET_ID = 18;

// Container-query driven (`@3xl` ≈ 768px) rather than viewport `lg:` so the
// guide's two-column layouts follow the width of whatever slot they sit in —
// the full-width bottom sheet vs. the ~430px desktop side pane — instead of
// the screen. In the narrow rail the container never reaches `@3xl`, so the
// columns stay stacked; the wide bottom sheet still gets two columns.
const guideColumnsClassName = 'flex flex-col gap-8 @3xl:flex-row @3xl:gap-10';
// Sprite 4px corners (the keycaps' clip) on every notation chip — decided
// 2026-08-06, docs/pixel-ui.md § Notation chips.
const CHIP_CLIP_STYLE: React.CSSProperties = { clipPath: spriteClip(0, 8) };

export function hasWffGuide(subSet: SubSet) {
  return GUIDE_SUBSET_IDS.has(subSet.id);
}

/** A `symbol · caps label · example` notation row (the lab's guideRow). */
function GuideRow({
  symbol,
  cap,
  example,
}: {
  symbol: string;
  cap: string;
  example?: string;
}) {
  return (
    <div className='qguide-row'>
      <code className='qguide-chip' style={CHIP_CLIP_STYLE}>
        <KatexSpan className='inline' text={symbol} />
      </code>
      <span className='qguide-cap'>{cap}</span>
      {example && (
        <code className='qguide-chip' style={CHIP_CLIP_STYLE}>
          <KatexSpan className='inline' text={example} />
        </code>
      )}
    </div>
  );
}

/** The four binary connectives — shared by the C and J guides. */
function ParenGroup() {
  return (
    <div>
      <h3 className='qguide-h'>Use a pair of parentheses for each:</h3>
      <GuideRow symbol={'$ \\cdot $'} cap='and' example={'$(P \\cdot Q)$'} />
      <GuideRow symbol={'$ \\vee $'} cap='or' example={'$(P \\vee Q)$'} />
      <GuideRow
        symbol={'$ \\supset $'}
        cap='if-then'
        example={'$(P \\supset Q)$'}
      />
      <GuideRow symbol={'$ \\equiv $'} cap='iff' example={'$(P \\equiv Q)$'} />
    </div>
  );
}

/** An inline notation chip in guide prose (L's rules). */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <code className='qchip' style={CHIP_CLIP_STYLE}>
      {children}
    </code>
  );
}

export const WffGuide: React.FC<WffGuideProps> = ({ subSet }) => {
  if (!hasWffGuide(subSet)) {
    return null;
  }

  return (
    <div className='wff-guide flex flex-col gap-10'>
      {[1, 2].includes(subSet.id) && (
        <div>
          <h3 className='qguide-h'>What makes a well-formed formula (wff)?</h3>
          <p className='qguide-p'>
            A wff must have one of these eight forms (where other capitals can
            replace “A” and “B” and other small letters “c” and “d”):
          </p>
          <table className='qguide-table'>
            <thead>
              <tr>
                <th>Class statements</th>
                <th>Individual statements</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ['all A is B', 'c is A'],
                  ['no A is B', 'c is not A'],
                  ['some A is B', 'c is d'],
                  ['some A is not B', 'c is not d'],
                ] as const
              ).map(([cls, ind]) => (
                <tr key={cls}>
                  <td className='qguide-mono'>{cls}</td>
                  <td className='qguide-mono'>{ind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {subSet.id === 6 && (
        <div>
          <h3 className='qguide-h'>What makes a well-formed formula (wff)?</h3>
          <div className='qguide-group'>
            <ParenGroup />
          </div>
        </div>
      )}

      {subSet.id === 4 && (
        <div className={guideColumnsClassName}>
          <ParenGroup />
          <div>
            <h3 className='qguide-h'>
              Do not use additional grouping parentheses for:
            </h3>
            <GuideRow symbol={'$ \\sim $'} cap='not' />
            <GuideRow symbol={'$ \\square $'} cap='necessary' />
            <GuideRow symbol={'$ \\lozenge $'} cap='possible' />
          </div>
        </div>
      )}

      {/* Table FIRST, and the "What is a definition?" prose is GONE from
          the sheet (Malik, 2026-08-22, guide-lab): the sheet is a
          mid-question reference and the prose was a lesson — that
          teaching now belongs to the start screen or the companion book.
          Single column on every width: with the prose removed there is
          nothing left to columnize. */}
      {subSet.id === 3 && (
        <div>
          <h3 className='qguide-h'>Ways a definition can be flawed</h3>
          <p className='qguide-p'>
            One worked example per flaw — the numbers match the answer options.
          </p>
          <table className='qguide-table'>
            <tbody>
              {SET_Q_FLAW_EXAMPLES.map((flaw) => (
                <tr key={flaw.num}>
                  <td className='qguide-code'>{flaw.num}</td>
                  <td>
                    <span className='qguide-name'>{flaw.name}</span>
                    <div className='qguide-p' style={{ margin: '2px 0 0' }}>
                      {flaw.example}
                    </div>
                    <div className='qguide-why'>{flaw.why}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className='qguide-src'>
            Original examples; framework after Gensler §3.2.
          </p>
        </div>
      )}

      {subSet.id === 12 && (
        <div>
          <h3 className='qguide-h'>How to form an imperative wff:</h3>
          {/* <i>, not <em>, for the presentational italics ("Example:") —
              the guide styles every <em> as the Rule emphasis mark, and
              these are not the must/probably emphasis it exists for. */}
          <ol className='qguide-rules'>
            <li>
              Any <u>underlined capital letter</u> is an imperative wff.
            </li>
            <li>
              A capital letter followed by one or more small letters (with
              exactly one small letter underlined) is also an imperative wff.{' '}
              <i>Example:</i> <Chip>A</Chip>,{' '}
              <Chip>
                A<u>x</u>
              </Chip>
              ,{' '}
              <Chip>
                A<u>x</u>y
              </Chip>
              , etc.
            </li>
            <li>
              If A is an imperative wff, then <Chip>∼A</Chip> (do not do A) is
              also an imperative wff.
            </li>
            <li>
              If A and B are imperative wffs, then <Chip>(A • B)</Chip> (“Do A
              and B”) is an imperative wff.
            </li>
            <li>
              Similarly, <Chip>(A ⊃ B)</Chip> can be imperative if both A and B
              are imperative parts (e.g., “If you do A, then do B”).
            </li>
            <li>
              We can also combine imperative forms with quantifiers.{' '}
              <Chip>(x)A</Chip> (“Let everyone do A”) or <Chip>(∃x)A</Chip>{' '}
              (“Let someone do A”) are imperative wffs if A is imperative (the
              underlined letter references the agent x).
            </li>
          </ol>
          <div className='qguide-group'>
            <h3 className='qguide-h'>Additional notes:</h3>
            <p className='qguide-p'>
              Underline <i>only</i> the imperative part(s). For instance, if{' '}
              <Chip>A</Chip> is factual and <Chip>B</Chip> is imperative, you
              might underline <Chip>B</Chip> but <i>not</i> <Chip>A</Chip>.
            </p>
            <p className='qguide-p'>
              Deontic logic adds “ought,” “permissible,” and “forbidden” — but
              at this imperative level, we focus on “Do A,” “Don’t do A,” etc.
              You can treat them similarly, using underlined letters to indicate
              what must or must not be done.
            </p>
          </div>
        </div>
      )}

      {subSet.id === SET_R_SUBSET_ID && <SetRGuide />}
    </div>
  );
};
