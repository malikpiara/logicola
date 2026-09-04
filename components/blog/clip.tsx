'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { PauseIcon, PlayIcon } from '@/components/quiz/pixelIcons';

/**
 * A clip (Malik, 2026-09-02): a short screen recording of the real
 * product where a still would have to stand in for motion — the
 * verdict choreography on a phone, the Guide sliding open. Recorded by
 * Malik on the real interface, never synthesised, which is the point:
 * the article's argument is that the product animates these moments,
 * so the figure should be the product doing it.
 *
 * Playback rules, per the motion contract: muted, inline, looping;
 * auto-plays only while on screen and never under reduced motion (the
 * poster shows and the reader presses Play); always pausable (a loop
 * longer than five seconds with no stop is a WCAG failure, not a
 * style choice). Marker:
 *
 *   <div data-island="clip" data-src="/blog/x/guide-open.mp4"
 *        data-poster="/blog/x/guide-open.png" data-alt="…"
 *        data-width="1440" data-height="900" data-max="720"></div>
 *
 * `data-max` caps the width in px (a phone recording wants ~320); omit
 * it for the full column. The marker's inner link is the feed fallback.
 *
 * The toggle is the whole stage (Malik, 2026-09-04: "we should be able
 * to click anywhere to pause"): one full-bleed button over the video,
 * with the state shown as a pixel play/pause glyph in the corner chip
 * instead of the word. The video itself has no controls, so the button
 * is the only interactive thing in the figure and the accessible name
 * carries the verb.
 */

const REDUCE = '(prefers-reduced-motion: reduce)';
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

export function Clip({
  src,
  poster,
  alt,
  width,
  height,
  max,
}: {
  src: string;
  poster?: string;
  alt: string;
  width: number;
  height: number;
  max?: number;
}) {
  const reduce = useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false
  );
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // Set once the reader presses the button: their choice outranks the
  // viewport rule from then on.
  const [manual, setManual] = useState<boolean | null>(null);

  // Play while on screen, pause off it — unless the reader has decided,
  // or motion is reduced (then it never starts by itself).
  useEffect(() => {
    const el = video.current;
    if (!el || reduce || manual !== null) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.intersectionRatio >= 0.5) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: [0, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, manual]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      setManual(true);
      void el.play().catch(() => {});
    } else {
      setManual(false);
      el.pause();
    }
  };

  return (
    <figure
      className='not-prose clip-wrap'
      style={{ maxWidth: max ?? '100%', margin: '0 auto' }}
    >
      <div className='clip-stage' style={{ aspectRatio: `${width} / ${height}` }}>
        <video
          ref={video}
          className='clip-video'
          src={src}
          poster={poster}
          width={width}
          height={height}
          muted
          loop
          playsInline
          preload='metadata'
          aria-label={alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <button
          type='button'
          className={`clip-toggle${playing ? ' is-playing' : ''}`}
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? 'Pause the recording' : 'Play the recording'}
        >
          <span className='clip-glyph' aria-hidden='true'>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </span>
        </button>
      </div>
    </figure>
  );
}
