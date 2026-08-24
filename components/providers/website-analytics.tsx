'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { capturePageview } from '@/lib/analytics';

export default function WebsiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Idle-deferred (2026-08-24): the first pageview triggers the lazy
    // posthog-js chunk — 222 KB parsed + init with autocapture — and as
    // a bare effect that landed while the page was still settling. The
    // 2s cap guarantees the pageview still fires on bounce-fast visits;
    // later route changes usually find the browser idle immediately.
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(() => void capturePageview(), {
        timeout: 2000,
      });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(() => void capturePageview(), 300);
    return () => clearTimeout(id);
  }, [pathname]);

  return null;
}
