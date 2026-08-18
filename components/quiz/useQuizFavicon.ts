'use client';

import { useEffect } from 'react';

/**
 * Wear the set's colour in the browser tab for the duration of a run —
 * the sibling of `useQuizChrome`, which does the same job for the OS
 * chrome. A tab strip with four drills open should say which set each
 * one is at a glance (Malik, 2026-08-18).
 *
 * The shipped mark, unchanged, with one colour swapped: same silhouette,
 * same proportions, no chip or backdrop behind it (Malik, 2026-08-18 —
 * a first pass framed it on a square of the set's surface and that was
 * not the ask).
 *
 * It wears the set's `tabColor` — a fourth colour the palette gained for
 * this job, because none of the three it already had could do it. A tab
 * strip is a background we do not control, and the duotone holds only
 * pale surfaces and very dark inks: measured against white and dark
 * chrome, the best of all 21 shipped set colours reached 2.27:1 on its
 * weaker side. The reasoning and the per-set ratios live on
 * `QuizScreenColors.tabColor`.
 *
 * Client-side for the same reason `useQuizChrome` is, and the reason is
 * worth repeating because a per-route `icon.tsx` looks like the obvious
 * Next-native answer: generated sets (everything but Set Q) resolve
 * their subset — and so their palette — only at MOUNT. The server has
 * no colour to render, so the file convention would have to ship one
 * icon per slug and re-fuse the generator graph the bundle contract
 * keeps apart (see the project notes).
 *
 * The mark is FETCHED from the shipped `/icon.svg` rather than inlined
 * here, so the tab icon can never drift from the real one — the only
 * thing this file knows about the artwork is which fill to swap.
 */

/** The colour the shipped mark is drawn in — the one fill we replace. Must
 *  track `app/icon.svg`: the default mark is the brand magenta as of
 *  2026-08-18 (Malik — root and the marketing pages read as their own place
 *  rather than as a set). If the artwork is ever redrawn in another colour,
 *  this constant moves with it or the tab quietly keeps the default. */
const SOURCE_FILL = '#BD00AD';

/** One fetch per page load, shared by every mount. Resolves to null if
 *  the icon can't be read, which simply leaves the default favicon up. */
let markPromise: Promise<string | null> | null = null;

function loadMark(): Promise<string | null> {
  if (!markPromise) {
    markPromise = fetch('/icon.svg')
      .then((r) => (r.ok ? r.text() : null))
      .catch(() => null);
  }
  return markPromise;
}

/** The shipped mark with its green swapped for the set's colour. Returns
 *  null if the file isn't the mark we expect, so a surprise leaves the
 *  default favicon alone rather than blanking the tab. */
export function tintedIcon(markSvg: string, color: string): string | null {
  if (!markSvg.includes('<svg') || !markSvg.includes(SOURCE_FILL)) return null;
  const svg = markSvg.split(SOURCE_FILL).join(color);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function useQuizFavicon(color: string | undefined) {
  useEffect(() => {
    if (!color) return;

    let cancelled = false;
    let restore: (() => void) | null = null;

    void loadMark().then((markSvg) => {
      // The run can end before the fetch lands; don't paint a tab the
      // user has already left.
      if (cancelled || !markSvg) return;
      const href = tintedIcon(markSvg, color);
      if (!href) return;

      let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
      const ownsLink = link === null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      const previousHref = link.getAttribute('href');
      const previousType = link.getAttribute('type');
      link.setAttribute('type', 'image/svg+xml');
      link.setAttribute('href', href);

      restore = () => {
        if (ownsLink) {
          link.remove();
          return;
        }
        if (previousHref === null) {
          link.removeAttribute('href');
        } else {
          link.setAttribute('href', previousHref);
        }
        if (previousType === null) {
          link.removeAttribute('type');
        } else {
          link.setAttribute('type', previousType);
        }
      };
    });

    return () => {
      cancelled = true;
      restore?.();
    };
  }, [color]);
}
