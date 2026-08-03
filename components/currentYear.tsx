'use client';

import { useEffect, useState } from 'react';

/**
 * The current year, kept honest on a statically prerendered page.
 *
 * `new Date().getFullYear()` inside a server component is evaluated when the
 * page is BUILT, so a site deployed in 2025 keeps claiming 2025 until its
 * next deploy — the same staleness as the hardcoded literal this replaced,
 * just less obvious. Rendering the build year first (so server and hydration
 * agree, and there is no flash or layout shift) and correcting it on mount
 * means the footer is right even on a build that has sat untouched into a
 * new year.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const [year, setYear] = useState(buildYear);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}
