/**
 * The "NEW" tag in the pixel treatment's gem silhouette — an elongated
 * octagon whose corners are cut by two-step stair chamfers. Decided in the
 * pattern lab against pill / pixel-pill / sprite variants; the construction
 * and its rules live in docs/pixel-ui.md.
 *
 * Fill is the colour system's own magenta #BD00AD (Set C and L's accent)
 * rather than a Tailwind palette colour, so the badge is a citizen of the
 * catalogue. The clip's px values assume the fixed 24px height (h-6).
 */
const GEM_CLIP =
  'polygon(8px 0, calc(100% - 8px) 0, calc(100% - 8px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), calc(100% - 4px) calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 4px), 4px calc(100% - 4px), 4px calc(100% - 8px), 0 calc(100% - 8px), 0 8px, 4px 8px, 4px 4px, 8px 4px)';

export function NewBadge({ label = 'NEW' }: { label?: string }) {
  return (
    <span
      className='inline-flex h-6 shrink-0 items-center justify-center bg-[#BD00AD] px-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white'
      style={{ clipPath: GEM_CLIP }}
    >
      {label}
    </span>
  );
}
