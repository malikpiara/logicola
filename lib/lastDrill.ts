/**
 * The landing page's "continue where you left off" memory — written by
 * the quiz shell during an active run, read by the resume banner
 * (components/landing/resumeBanner.tsx). localStorage only: per-device
 * by design, no backend. Decided in docs/landing-lab.html LP7 (Malik,
 * 2026-08-17 — the resume banner is the decided guide state; it renders
 * only when this key exists, so first-time visitors see a clean
 * catalogue).
 */
export interface LastDrill {
  /** the full catalogue title, e.g. "Deontic Translations: Imperative" */
  title: string;
  /** the quiz route, e.g. /deontic/translations/imperative/quiz */
  path: string;
  /** scored-run points at the time of writing; null in count mode */
  points: number | null;
  /** epoch ms — unrendered today; lets a future rule expire stale entries */
  at: number;
}

const KEY = 'logicola.last_drill';

export function readLastDrill(): LastDrill | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LastDrill>;
    if (
      typeof parsed.title !== 'string' ||
      typeof parsed.path !== 'string' ||
      !parsed.path.startsWith('/')
    ) {
      return null;
    }
    return {
      title: parsed.title,
      path: parsed.path,
      points: typeof parsed.points === 'number' ? parsed.points : null,
      at: typeof parsed.at === 'number' ? parsed.at : 0,
    };
  } catch {
    // Blocked storage or a corrupted value — the banner just won't show.
    return null;
  }
}

export function writeLastDrill(drill: Omit<LastDrill, 'at'>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ ...drill, at: Date.now() })
    );
  } catch {
    // Full or blocked storage — losing the banner is the whole failure mode.
  }
}

/* The banner reads through useSyncExternalStore (the currentYear.tsx
   pattern — React's sanctioned way to read a value that differs between
   server and client). Its getSnapshot must return a REFERENCE-STABLE
   value or React loops on Object.is, so the parse is cached against the
   raw string and only re-runs when the string actually changes. */
let cachedRaw: string | null = null;
let cachedDrill: LastDrill | null = null;
let cachePrimed = false;

export function lastDrillSnapshot(): LastDrill | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (!cachePrimed || raw !== cachedRaw) {
    cachePrimed = true;
    cachedRaw = raw;
    cachedDrill = readLastDrill();
  }
  return cachedDrill;
}

/** Cross-tab updates only — same-tab writes happen on quiz pages, never
 *  while the landing page is mounted. */
export function subscribeLastDrill(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}
