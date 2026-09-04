'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

/**
 * The section rail (Malik, 2026-09-01) — a fixed left-gutter navigator
 * for long posts, one tick per h2 with the active section named in a
 * Set C pill (the post's own chrome colours). Modelled on the article
 * rails big release posts use; here it also serves the editing pass,
 * since the tick column is the article's shape at a glance.
 *
 * It reads the rendered headings after hydration instead of receiving
 * them as props, so it needs no pipeline changes and survives every
 * rewrite of the markdown. Jumps use scrollIntoView, so headings need
 * no ids. All state is committed from inside a rAF scheduled by the
 * scroll handler — nothing synchronous in the effect. JS gates
 * visibility to wide viewports so the rail can never fall into the
 * page flow unstyled.
 */

type Entry = { label: string; el: Element };

const WIDE = '(min-width: 1100px)';
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

export function SectionRail() {
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => false
  );
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState(0);
  // How far the rail is pushed up off its centred spot, in px: zero
  // while the article is under it, growing as the article's end rises
  // past its band — so it leaves with the content instead of floating
  // over the footer, the way a sticky element leaves its container.
  const [park, setPark] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!wide) return;
    const hs = [...document.querySelectorAll('.post-prose h2')];
    if (hs.length < 3) return;
    const list: Entry[] = [
      { label: 'Introduction', el: document.querySelector('h1') ?? hs[0]! },
      ...hs.map((el) => ({ label: el.textContent ?? '', el })),
    ];
    const prose = document.querySelector('.post-prose');
    let raf = 0;
    let remeasured = false;
    const measure = () => {
      raf = 0;
      const line = 140;
      let idx = 0;
      for (let i = 0; i < list.length; i++) {
        if (list[i]!.el.getBoundingClientRect().top <= line) idx = i;
        else break;
      }
      setEntries((prev) => (prev.length === list.length ? prev : list));
      setActive(idx);
      const railH = navRef.current?.offsetHeight ?? 0;
      const railBottom = window.innerHeight / 2 + railH / 2 + 24;
      const end = prose?.getBoundingClientRect().bottom ?? Infinity;
      setPark(Math.max(0, Math.round(railBottom - end)));
      // The first pass runs before the nav exists (it renders off this
      // very measure), so its height reads 0; measure once more after
      // the commit so a page loaded at the footer parks correctly.
      if (!navRef.current && !remeasured) {
        remeasured = true;
        setTimeout(measure, 0);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    // The first measure runs on a timeout, not a frame: a background
    // tab is granted no frames, and the rail should already exist by
    // the first one. Scroll updates keep rAF (hidden tabs don't scroll).
    const t = setTimeout(measure, 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [wide]);

  if (!wide || !entries.length) return null;

  const jump = (i: number) => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (i === 0) {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      history.pushState(null, '', location.pathname);
      return;
    }
    const el = entries[i]!.el;
    el.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
    // The heading's id (rehype-slug) becomes the URL, without the
    // native hash jump fighting the smooth scroll.
    if (el.id) history.pushState(null, '', `#${el.id}`);
  };

  // Portalled to <body>: the article wrapper animates in with a
  // transform, and a transformed ancestor becomes the containing block
  // for position:fixed — anchored to a 30,000px article, "fixed" put
  // the rail at the column's literal middle, off every screen.
  return createPortal(
    <nav
      ref={navRef}
      className='post-rail'
      aria-label='Sections'
      style={{
        position: 'fixed',
        left: 0,
        top: park ? `calc(50% - ${park}px)` : '50%',
      }}
    >
      {entries.map((e, i) => (
        <button
          key={i}
          type='button'
          className={`post-rail-item${i === active ? ' is-active' : ''}`}
          aria-current={i === active ? 'true' : undefined}
          onClick={() => jump(i)}
        >
          <span className='post-rail-label'>{e.label}</span>
        </button>
      ))}
    </nav>,
    document.body
  );
}
