import React from 'react';
import KatexSpan from '../katexSpan';
import { SubSet } from '@/content/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Gensler's seven canonical flaws-of-a-definition, with one worked
 * example each. Lifted from the 2008 LCEXE Set Q `*H` ("Info"
 * button) block, which itself follows the textbook §3.2. Shown in
 * the right column of the Set Q quiz guide.
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
    example: '“Bachelor” means “man.”',
    why: 'There are men who aren’t bachelors.',
  },
  {
    num: 2,
    name: 'Too narrow',
    example: '“Bachelor” means “unmarried male astronaut.”',
    why: 'There are bachelors who aren’t astronauts.',
  },
  {
    num: 3,
    name: 'Circular',
    example: '“True” means “known to be true.”',
    why: 'This defines “true” using “true.”',
  },
  {
    num: 4,
    name: 'Uses poorly understood terms',
    example: '“Good” means “having positive aretaic value.”',
    why: 'The latter is less clear than “good.”',
  },
  {
    num: 5,
    name: 'Poor match in vagueness',
    example: '“Bachelor” means “unmarried male over 18 years old.”',
    why: 'The latter is much more precise than “bachelor.”',
  },
  {
    num: 6,
    name: 'Poor match in emotional tone',
    example: '“Bachelor” means “fortunate man who hasn’t married.”',
    why: 'The latter has a different emotional tone.',
  },
  {
    num: 7,
    name: 'Has non-essential properties',
    example: '“Bachelor” means “unmarried man living on earth.”',
    why: 'We could imagine a bachelor who lives on the moon.',
  },
];

interface WffGuideProps {
  subSet: SubSet;
}

const GUIDE_SUBSET_IDS = new Set([1, 2, 3, 4, 6, 12]);

const guideHeadingClassName =
  'text-xl md:text-2xl font-semibold leading-7 md:leading-8 text-gray-800';
const guideColumnsClassName = 'flex flex-col gap-8 lg:flex-row lg:gap-10';
const guideCodeClassName =
  'rounded bg-muted px-1.5 py-0.5 text-lg leading-none text-gray-900';
const capsLabelClassName =
  'text-xs font-semibold tracking-[0.08em] text-gray-500';

export function hasWffGuide(subSet: SubSet) {
  return GUIDE_SUBSET_IDS.has(subSet.id);
}

export const WffGuide: React.FC<WffGuideProps> = ({ subSet }) => {
  if (!hasWffGuide(subSet)) {
    return null;
  }

  return (
    <>
      {[1, 2].includes(subSet.id) && (
        <>
          <div>
            <h3 className={guideHeadingClassName}>
              What makes a well-formed formula (wff)?
            </h3>
            <p className='mt-2'>
              A wff must have one of these eight forms (where other capitals can
              replace “A” and “B” and other small letters “c” and “d”):
            </p>
          </div>
          <div className='rounded-md border border-gray-200'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class statements</TableHead>
                  <TableHead>Individual statements</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className='font-mono text-gray-800'>
                    all A is B
                  </TableCell>
                  <TableCell className='font-mono text-gray-800'>
                    c is A
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-mono text-gray-800'>
                    no A is B
                  </TableCell>
                  <TableCell className='font-mono text-gray-800'>
                    c is not A
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-mono text-gray-800'>
                    some A is B
                  </TableCell>
                  <TableCell className='font-mono text-gray-800'>
                    c is d
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='font-mono text-gray-800'>
                    some A is not B
                  </TableCell>
                  <TableCell className='font-mono text-gray-800'>
                    c is not d
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {subSet.id === 6 && (
        <div className='p-4 pb-0'>
          <h3 className={guideHeadingClassName}>
            What makes a well-formed formula (wff)?
          </h3>
          <div className={guideColumnsClassName}>
            <div className='space-y-4'>
              <h4 className='font-medium'>
                Use a pair of parentheses for each:
              </h4>
              <div className='grid gap-2'>
                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\cdot $'} />
                  </code>
                  <span className={capsLabelClassName}>AND</span>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$(P \\cdot Q)$'} />
                  </code>
                </div>

                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\vee $'} />
                  </code>
                  <span className={capsLabelClassName}>OR</span>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$(P \\vee Q)$'} />
                  </code>
                </div>

                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\supset $'} />
                  </code>
                  <span className={capsLabelClassName}>IF-THEN</span>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$(P \\supset Q)$'} />
                  </code>
                </div>

                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\equiv $'} />
                  </code>
                  <span className={capsLabelClassName}>IFF</span>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$(P \\equiv Q)$'} />
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {subSet.id === 4 && (
        <div className='p-4 pb-0'>
          <div className={guideColumnsClassName}>
            <div className='space-y-4'>
              <h4 className='font-medium'>
                Use a pair of parentheses for each:
              </h4>
              <div className='grid gap-2'>
                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\cdot $'} />
                  </code>
                  <span className={capsLabelClassName}>AND</span>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ (P \\cdot Q) $'} />
                  </code>
                </div>
                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\vee $'} />
                  </code>
                  <span className={capsLabelClassName}>OR</span>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ (P \\vee Q) $'} />
                  </code>
                </div>
                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\supset $'} />
                  </code>
                  <span className={capsLabelClassName}>IF-THEN</span>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ (P \\supset Q) $'} />
                  </code>
                </div>
                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\equiv $'} />
                  </code>
                  <span className={capsLabelClassName}>IFF</span>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$( P \\equiv Q) $'} />
                  </code>
                </div>
              </div>
            </div>
            <div className='space-y-4'>
              <h4 className='font-medium'>
                Do not use additional grouping parentheses for:
              </h4>
              <div className='grid gap-2'>
                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\sim $'} />
                  </code>
                  <span className={capsLabelClassName}>NOT</span>
                </div>
                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\square $'} />
                  </code>
                  <span className={capsLabelClassName}>NECESSARY</span>
                </div>
                <div className='flex items-center gap-2'>
                  <code className={guideCodeClassName}>
                    <KatexSpan className='inline' text={'$ \\lozenge $'} />
                  </code>
                  <span className={capsLabelClassName}>POSSIBLE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {subSet.id === 3 && (
        <div className={guideColumnsClassName}>
          <div className='lg:flex-1'>
            <h3 className={guideHeadingClassName}>What is a definition?</h3>
            <p className='mt-2 max-w-prose'>
              A definition is a rule of paraphrase designed to explain meaning.
              More precisely, a definition of a word or phrase is a rule saying
              how to eliminate this word or phrase in any sentence using it and
              produce a second sentence that means the same thing—the purpose of
              this being to explain or clarify the meaning of the word or
              phrase.
            </p>
            <p className='mt-3 max-w-prose'>
              Definitions may be stipulative (specifying your own usage) or
              lexical (explaining current usage). A good lexical definition
              should allow us to “paraphrase out” a term—to produce a second
              sentence that means the same thing but doesn’t use the defined
              term. A good lexical definition should: be neither too broad nor
              too narrow, avoid circularity and poorly understood terms, match
              in vagueness the term defined, match, as far as possible, the
              emotional tone (positive or negative or neutral) of the term
              defined, and include only properties essential to the term.
            </p>
          </div>
          <div className='lg:flex-1'>
            <h4 className='text-lg font-semibold text-gray-800'>
              Ways a definition can be flawed
            </h4>
            <p className='mt-1 text-sm text-gray-500'>
              One worked example per flaw, from Gensler §3.2.
            </p>
            <div className='mt-3 rounded-md border border-gray-200'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-10 text-center'>#</TableHead>
                    <TableHead>Flaw</TableHead>
                    <TableHead>Example &amp; why</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SET_Q_FLAW_EXAMPLES.map((flaw) => (
                    <TableRow key={flaw.num}>
                      <TableCell className='text-center font-medium tabular-nums text-gray-500'>
                        {flaw.num}
                      </TableCell>
                      <TableCell className='font-medium text-gray-800'>
                        {flaw.name}
                      </TableCell>
                      <TableCell className='text-gray-700'>
                        <div>{flaw.example}</div>
                        <div className='mt-1 text-sm text-gray-500'>
                          {flaw.why}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {subSet.id === 12 && (
        <div className='p-4 pb-0'>
          <div className={guideColumnsClassName}>
            {/* Left column: Basic formation rules */}
            <div className='space-y-4'>
              <h4 className='font-medium'>How to form an imperative wff:</h4>
              <div className='grid gap-2'>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold tabular-nums'>1.</span>
                  <span>
                    Any <u>underlined capital letter</u> is an imperative wff.
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold tabular-nums'>2.</span>
                  <span>
                    A capital letter followed by one or more small letters (with
                    exactly one small letter underlined) is also an imperative
                    wff.
                    <br />
                    <em>Example:</em> <code>A</code>,{' '}
                    <code>
                      A<u>x</u>
                    </code>
                    ,
                    <code>
                      A<u>x</u>y
                    </code>
                    , etc.
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold tabular-nums'>3.</span>
                  <span>
                    If <em>A</em> is an imperative wff, then <code>∼A</code> (do
                    not do A) is also an imperative wff.
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold tabular-nums'>4.</span>
                  <span>
                    If <em>A</em> and <em>B</em> are imperative wffs, then
                    <code>(A • B)</code> (“Do A and B”) is an imperative wff.
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold tabular-nums'>5.</span>
                  <span>
                    Similarly, <code>(A ⊃ B)</code> can be imperative if both
                    <em>A</em> and <em>B</em> are imperative parts (e.g., “If
                    you do A, then do B”).
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold tabular-nums'>6.</span>
                  <span>
                    We can also combine imperative forms with quantifiers.
                    <code>(x)A</code> (“Let everyone do A”) or
                    <code>(∃x)A</code> (“Let someone do A”) are imperative wffs
                    if A is imperative (the underlined letter references the
                    agent x).
                  </span>
                </div>
              </div>
            </div>

            {/* Right column: Additional notes / examples */}
            <div className='space-y-4'>
              <h4 className='font-medium'>Additional notes:</h4>
              <div className='grid gap-2'>
                <div className='flex items-center gap-2'>
                  <span>
                    Underline <em>only</em> the imperative part(s). For
                    instance, if
                    <code>A</code> is factual and <code>B</code> is imperative,
                    you might underline <code>B</code> but <em>not</em>{' '}
                    <code>A</code>.
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span>
                    Deontic logic adds “ought,” “permissible,” and “forbidden”—
                    but at this imperative level, we focus on “Do A,” “Don’t do
                    A,” etc. You can treat them similarly, using underlined
                    letters to indicate what must or must not be done.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
