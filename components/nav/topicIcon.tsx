/**
 * Logic-symbol topic icons on the 4px pixel grid — ∴ syllogistic,
 * ⊃ propositional, ◇ modal, the O ring deontic, a thought bubble for
 * belief, ? for informal. Sketched in the nav lab (docs/nav-lab.html
 * § 3d, 2026-08-14); drawn as rects rather than font glyphs so the
 * marks are deterministic across platforms and obey the pixel grammar
 * (straight edges stay straight). A proper icon pass may redraw them —
 * the lab's D13 rider.
 */
const RECTS: Record<string, Array<[number, number, number, number]>> = {
  syllogistic: [
    [10, 4, 4, 4],
    [4, 14, 4, 4],
    [16, 14, 4, 4],
  ],
  propositional: [
    [6, 5, 12, 4],
    [14, 9, 4, 6],
    [6, 15, 12, 4],
  ],
  modal: [
    [10, 2, 4, 4],
    [6, 6, 12, 4],
    [2, 10, 20, 4],
    [6, 14, 12, 4],
    [10, 18, 4, 4],
  ],
  deontic: [
    [8, 4, 8, 4],
    [16, 8, 4, 8],
    [8, 16, 8, 4],
    [4, 8, 4, 8],
  ],
  belief: [
    [4, 4, 16, 12],
    [8, 16, 4, 4],
  ],
  informal: [
    [6, 4, 12, 4],
    [14, 8, 4, 4],
    [10, 12, 4, 4],
    [10, 20, 4, 4],
  ],
};

export function TopicIcon({
  topicId,
  color,
  size = 20,
  className,
}: {
  topicId: string;
  color: string;
  size?: number;
  className?: string;
}) {
  const rects = RECTS[topicId] ?? [];
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={className}
    >
      {rects.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={color} />
      ))}
    </svg>
  );
}
