import React from 'react';
import KatexSpan from '../katexSpan';
import { SubSet } from '@/content/types';

interface WffGuideProps {
  subSet: SubSet;
}

export const WffGuide: React.FC<WffGuideProps> = ({ subSet }) => {
  return (
    <>
      {subSet.id === 1 && (
        <>
          <div>
            <h3 className='text-xl md:text-2xl font-semibold text-gray-800'>
              What makes a well-formed formula (wff)?
            </h3>
            <p>
              {`A wff must have one of these eight forms (where other capitals can replace "A" and "B" and other small letters "c" and "d"):`}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>All A is B</div>
            <div>No A is B</div>
            <div>Some A is B</div>
            <div>Some A is not B</div>
            <div>c is A</div>
            <div>c is A</div>
            <div>c is not A</div>
            <div>c is not D</div>
          </div>
        </>
      )}

      {subSet.id === 6 && (
        <div className='p-4 pb-0'>
          <h3 className='text-xl md:text-2xl font-semibold text-gray-800'>
            What makes a well-formed formula (wff)?
          </h3>
          <div className='inline-flex gap-10'>
            <div className='space-y-4'>
              <h4 className='font-medium'>
                Use a pair of parentheses for each:
              </h4>
              <div className='grid gap-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\cdot $'} />
                  </code>
                  <span>AND</span>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$(P \\cdot Q)$'} />
                  </code>
                </div>

                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\vee $'} />
                  </code>
                  <span>OR</span>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$(P \\vee Q)$'} />
                  </code>
                </div>

                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\supset $'} />
                  </code>
                  <span>IF-THEN</span>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$(P \\supset Q)$'} />
                  </code>
                </div>

                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\equiv $'} />
                  </code>
                  <span>IFF</span>
                  <code className='rounded bg-muted px-1 text-lg'>
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
          <div className='inline-flex gap-10'>
            <div className='space-y-4'>
              <h4 className='font-medium'>
                Use a pair of parentheses for each:
              </h4>
              <div className='grid gap-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\cdot $'} />
                  </code>
                  <span>AND</span>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ (P \\cdot Q) $'} />
                  </code>
                </div>
                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\vee $'} />
                  </code>
                  <span>OR</span>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ (P \\vee Q) $'} />
                  </code>
                </div>
                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\supset $'} />
                  </code>
                  <span>IF-THEN</span>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ (P \\supset Q) $'} />
                  </code>
                </div>
                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\equiv $'} />
                  </code>
                  <span>IFF</span>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$( P \\equiv Q) $'} />
                  </code>
                </div>
              </div>
            </div>
            <div className='space-y-4'>
              <h4 className='font-medium'>
                Do not use additional grouping parentheses for:
              </h4>
              <div className='grid gap-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\sim $'} />
                  </code>
                  <span>NOT</span>
                </div>
                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\square $'} />
                  </code>
                  <span>NECESSARY</span>
                </div>
                <div className='flex items-center gap-2'>
                  <code className='rounded bg-muted px-1 text-lg'>
                    <KatexSpan className='inline' text={'$ \\lozenge $'} />
                  </code>
                  <span>POSSIBLE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {subSet.id === 3 && (
        <>
          <h3 className='text-xl md:text-2xl font-semibold text-gray-800'>
            What is a definition?
          </h3>
          <p>
            A definition is a rule of paraphrase designed to explain meaning.
            More precisely, a definition of a word or phrase is a rule saying
            how to eliminate this word or phrase in any sentence using it and
            produce a second sentence that means the same thing – the purpose of
            this being to explain or clarify the meaning of the word or phrase.
          </p>
          <p>
            Definitions may be stipulative (specifying your own usage) or
            lexical (explaining current usage). A good lexical definition should
            allow us to &quot;paraphrase out&quot; a term – to produce a second
            sentence that means the same thing but doesn&apos;t use the defined
            term. A good lexical definition should: be neither too broad nor too
            narrow, avoid circularity and poorly understood terms, match in
            vagueness the term defined, match, as far as possible, the emotional
            tone (positive or negative or neutral) of the term defined, and
            include only properties essential to the term.
          </p>
        </>
      )}

      {subSet.id === 12 && (
        <div className='p-4 pb-0'>
          <div className='inline-flex gap-10'>
            {/* Left column: Basic formation rules */}
            <div className='space-y-4'>
              <h4 className='font-medium'>How to form an imperative wff:</h4>
              <div className='grid gap-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold'>1.</span>
                  <span>
                    Any <u>underlined capital letter</u> is an imperative wff.
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold'>2.</span>
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
                  <span className='font-semibold'>3.</span>
                  <span>
                    If <em>A</em> is an imperative wff, then <code>∼A</code> (do
                    not do A) is also an imperative wff.
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold'>4.</span>
                  <span>
                    If <em>A</em> and <em>B</em> are imperative wffs, then
                    <code>(A • B)</code> (“Do A and B”) is an imperative wff.
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold'>5.</span>
                  <span>
                    Similarly, <code>(A ⊃ B)</code> can be imperative if both
                    <em>A</em> and <em>B</em> are imperative parts (e.g., “If
                    you do A, then do B”).
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='font-semibold'>6.</span>
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
              <div className='grid gap-2 text-sm'>
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
                    Deontic logic adds “ought,” “permissible,” and “forbidden” –
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
