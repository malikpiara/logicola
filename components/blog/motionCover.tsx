'use client';

import { useEffect, useRef } from 'react';

/**
 * A blog card's animated cover, inlined (2026-09-23).
 *
 * Malik asked for the cover to replay "whenever the user hovers out and
 * again in that article". An SVG in an <img> can't do that: it is a
 * sealed document that plays once when it loads, and nothing on the page
 * can rewind it. Inline, its animations are ordinary page CSS, so a
 * replay is just re-adding the class that runs them (`cover-play`, on
 * the SVG's root; see the file's own comment).
 *
 * The hover region is the whole post, not only the picture: the nearest
 * `[data-cover-hover]` ancestor. `pointerenter` fires once per entrance
 * and not again while moving between the post's children, so each new
 * entrance is one replay. Three details worth keeping:
 *   - A play in progress is never restarted. It finishes, and the next
 *     entrance plays it again. Snapping the glass back mid-step reads
 *     as a glitch, not a replay.
 *   - Touch never replays: a tap enters the post only to leave it for
 *     the article.
 *   - Reduced motion needs nothing here. The SVG only animates under
 *     no-preference, so a replay finds no motion to run.
 */
export function MotionCover({ svg }: { svg: string }) {
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const art = boxRef.current?.querySelector('svg');
    const region = boxRef.current?.closest<HTMLElement>('[data-cover-hover]');
    if (!art || !region) return;

    const replay = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      if (art.getAnimations({ subtree: true }).length > 0) return;
      art.classList.remove('cover-play');
      // Flush styles between the two, or the browser never sees the
      // animations go away and has nothing to restart.
      void art.getBoundingClientRect();
      art.classList.add('cover-play');
    };

    region.addEventListener('pointerenter', replay);
    return () => region.removeEventListener('pointerenter', replay);
  }, []);

  return (
    <div
      ref={boxRef}
      aria-hidden='true'
      className='h-full w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full'
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
