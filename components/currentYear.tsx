'use client';

import { useSyncExternalStore } from 'react';

/** The year never changes mid-session, so there is nothing to subscribe to. */
const subscribe = () => () => {};
const getYear = () => new Date().getFullYear();

/**
 * The current year, kept honest on a statically prerendered page.
 *
 * `new Date().getFullYear()` inside a server component is evaluated when the
 * page is BUILT, so a site deployed in 2025 keeps claiming 2025 until its
 * next deploy — the same staleness as a hardcoded literal, just less
 * obvious. `useSyncExternalStore` is React's sanctioned way to read a value
 * that legitimately differs between server and client: it renders
 * `buildYear` for SSR and hydration (so the markup matches and there is no
 * mismatch warning), then swaps in the real clock without an effect.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(subscribe, getYear, () => buildYear);
  return <>{year}</>;
}
