/**
 * The marketing label chip — the square "abbreviation box" from
 * pixel-ui.md. The gem silhouette (NewBadge) is reserved for flagging
 * new features IN THE APP and never appears on marketing surfaces
 * (Malik, 2026-08-13). Emphasis comes from fill weight only: `solid`
 * for New Feature, the 14% ink tint otherwise. Colour arrives via the
 * --mk-* variables from the marketing layout.
 */
export function Chip({
  children,
  solid = false,
}: {
  children: React.ReactNode;
  solid?: boolean;
}) {
  return (
    <span className={solid ? 'mk-chip mk-chip--solid' : 'mk-chip'}>
      {children}
    </span>
  );
}
