import Link from 'next/link';
import { TimesIcon } from './pixelIcons';

/**
 * The way out of a full-screen quiz panel — the start screen and the end
 * screen both.
 *
 * ONE COMPONENT ON PURPOSE. These are the two screens the sticky question
 * header does not cover, and until 2026-08-23 neither had an exit at all
 * below `lg`: land on a drill from a shared link, or finish one, and the
 * browser's Back button was the only way out — which on the first page of a
 * session is no way out. Keeping them in one file is what stops the two
 * exits drifting into two different affordances, and it means the finish
 * below is changed once rather than twice.
 *
 * IT CARRIES ITS OWN GROUND, and that is the part that is easy to get
 * wrong. The QUESTION screen wears a bare ✕ quite happily, because its
 * pattern is a 112px band at the foot of the card and the top is clean
 * surface. These panels are different: the pattern frames a cleared centre,
 * so all four CORNERS are pattern, and the scatter reshuffles every visit.
 * A bare glyph in the set's ink therefore lands on an ink-coloured blob
 * about as often as not — found in the real app on Set A, where it rendered
 * plum on plum and was simply invisible. Not a contrast tier that needed
 * nudging; a control that disappeared.
 *
 * The opaque surface chip makes the pairing ink-on-surface whatever is
 * behind it: 7.04:1 on Set R, 12.67:1 on Set L. THE FINISH IS STILL OPEN
 * (Malik, 2026-08-23 — "not super sure about your current finish") and the
 * alternatives are in docs/endscreen-lab.html § 2 over both a dark blob and
 * clean surface, which is the only honest way to judge them.
 */
export function ScreenExit({ label }: { label: string }) {
  return (
    <Link
      href='/'
      aria-label={label}
      // `qexit` carries the hover/focus behaviour the question screen's
      // exit already defines; `qexit-chip` adds the ground. Both live in
      // globals.css. The top inset clears the status bar where the page
      // draws under it and resolves to 0 where it does not.
      className='qexit qexit-chip absolute left-2 top-[calc(0.5rem+env(safe-area-inset-top))] z-20 flex h-11 w-11 items-center justify-center'
    >
      <TimesIcon className='h-[18px] w-[18px]' />
    </Link>
  );
}
