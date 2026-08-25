import { gemClip } from '@/lib/pixel';

/**
 * The "NEW" tag in the pixel treatment's gem silhouette — an elongated
 * octagon whose corners are cut by two-step stair chamfers. Decided in the
 * pattern lab against pill / pixel-pill / sprite variants; the construction
 * and its rules live in docs/pixel-ui.md.
 *
 * Fill is the colour system's own magenta #BD00AD (Set C and L's accent)
 * rather than a Tailwind palette colour, so the badge is a citizen of the
 * catalogue. Slimmed 24px → 20px in the nav lab (Malik, 2026-08-14 —
 * "a little bit smaller everywhere"); the gem's 4px stairs read fine at
 * 20px (8px of corner per side against a 20px height).
 */
const GEM_CLIP = gemClip();

export function NewBadge({ label = 'NEW' }: { label?: string }) {
  return (
    <span
      className='inline-flex h-5 shrink-0 items-center justify-center bg-[#BD00AD] px-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-white'
      style={{ clipPath: GEM_CLIP }}
    >
      {label}
    </span>
  );
}
