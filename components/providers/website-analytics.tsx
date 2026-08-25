'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { capturePageview } from '@/lib/analytics';
import { runWhenIdle } from '@/lib/idle';

export default function WebsiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Idle-deferred (2026-08-24): the first pageview triggers the lazy
    // posthog-js chunk — 222 KB parsed + init with autocapture — and as
    // a bare effect that landed while the page was still settling.
    // FLUSH on cleanup, never cancel: a navigation inside the idle
    // window would otherwise drop this page's view entirely (the
    // fast-bounce sessions are exactly the ones where idle time never
    // arrives). The URL is pinned at schedule time because by cleanup
    // window.location already names the next page.
    const url = window.location.href;
    const pending = runWhenIdle(() => void capturePageview(url), {
      timeout: 2000,
      fallbackMs: 300,
    });
    return () => pending.flush();
  }, [pathname]);

  return null;
}
