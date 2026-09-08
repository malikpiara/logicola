/**
 * Where "Install LogiCola" can actually go (Malik, 2026-09-05).
 *
 * The blog's install island promised a link that adds the app to a
 * home screen on Android, iOS, macOS and Windows. That is four
 * different mechanisms, and one of them is not a link at all:
 *
 *   - Chromium (Android Chrome, desktop Chrome and Edge) fires
 *     `beforeinstallprompt`; keep the event and call `prompt()` from a
 *     click, and the browser's own install sheet opens. The only case
 *     where "click to install" is literally true.
 *   - iOS and iPadOS have no API. Safari's Share sheet, then Add to
 *     Home Screen, is the whole route — so the button can only show
 *     those two steps. iPadOS 13+ reports a Macintosh UA; the touch
 *     count tells it apart.
 *   - Safari on macOS: File, then Add to Dock. Chrome on the same Mac
 *     gets the real prompt.
 *   - Everything else (Firefox has no install at all; Chromium before
 *     its event has fired): point at the browser's own menu. On
 *     Chromium the event may still arrive, and the island upgrades.
 *
 * Pure function of the signals so it can be tested without a browser;
 * the island collects the signals and re-runs it when they change.
 */
export type InstallTarget =
  'installed' | 'prompt' | 'ios' | 'safari_mac' | 'menu';

export interface InstallSignals {
  /** `navigator.userAgent`. */
  ua: string;
  /** `(display-mode: standalone)` matches, or iOS's `navigator.standalone`. */
  standalone: boolean;
  /** A `beforeinstallprompt` event has been captured and not yet used. */
  hasPrompt: boolean;
  /** `navigator.maxTouchPoints` — iPadOS masquerades as a Mac. */
  maxTouchPoints?: number;
}

const IOS_UA = /iPhone|iPad|iPod/;
const MAC_UA = /Macintosh/;
/** Safari's token appears in nearly every UA; the others rule it out. */
const NOT_SAFARI = /Chrome\/|Chromium\/|CriOS\/|FxiOS\/|Edg\/|OPR\/|Firefox\//;

export function installTarget(s: InstallSignals): InstallTarget {
  if (s.standalone) return 'installed';
  if (s.hasPrompt) return 'prompt';

  const ipadAsMac = MAC_UA.test(s.ua) && (s.maxTouchPoints ?? 0) > 1;
  if (IOS_UA.test(s.ua) || ipadAsMac) return 'ios';

  const safari = /Safari\//.test(s.ua) && !NOT_SAFARI.test(s.ua);
  if (MAC_UA.test(s.ua) && safari) return 'safari_mac';

  return 'menu';
}

/**
 * The event Chromium fires; not in lib.dom because no standard owns it.
 * Only the two members the island uses are declared.
 */
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

declare global {
  interface Window {
    /**
     * Stashed by the inline script in app/layout.tsx. The event fires
     * as soon as Chromium judges the page installable — routinely
     * before React has hydrated — so a listener added on mount would
     * miss it. The script keeps it here and announces `lc:installprompt`.
     */
    __lcInstallPrompt?: BeforeInstallPromptEvent | null;
  }
  interface WindowEventMap {
    'lc:installprompt': Event;
  }
}
