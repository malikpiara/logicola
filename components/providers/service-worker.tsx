// You could create a new component like RegisterSW.tsx
'use client';
import { useEffect } from 'react';
import { registerAnalyticsProperties } from '@/lib/analytics';

export default function RegisterSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      const reloadKey = 'logicola-sw-dev-reloaded';

      navigator.serviceWorker.getRegistrations().then((registrations) => {
        Promise.all(
          registrations.map((registration) => registration.unregister())
        ).then(() => {
          if (navigator.serviceWorker.controller) {
            if (sessionStorage.getItem(reloadKey) !== 'true') {
              sessionStorage.setItem(reloadKey, 'true');
              window.location.reload();
            }

            return;
          }

          sessionStorage.removeItem(reloadKey);
        });
      });

      return;
    }

    void (async () => {
      // The manifest's cacheName doubles as the deploy version.
      // sw.js's bytes never change between builds, and browsers only
      // re-run install when the script changes — so a byte-identical
      // sw.js means deploys would NEVER refresh anyone's offline
      // cache. Registering /sw.js?v=<cacheName> makes the script URL
      // part of the version: new build → new URL → fresh
      // install/activate cycle → old caches pruned.
      // (Malik, 2026-08-15, offline roadmap Phase 2.)
      let manifest: { cacheName?: string } | null = null;

      try {
        const response = await fetch('/offline-manifest.json', {
          cache: 'no-store',
        });
        if (response.ok) {
          manifest = await response.json();
        }
      } catch {
        // Offline or manifest unreachable — register the bare URL;
        // an already-installed SW keeps serving regardless.
      }

      const swUrl = manifest?.cacheName
        ? `/sw.js?v=${encodeURIComponent(manifest.cacheName)}`
        : '/sw.js';

      try {
        const registration = await navigator.serviceWorker.register(swUrl);
        console.log('SW registered:', registration);
      } catch (error) {
        console.log('SW registration failed:', error);
      }

      // Ask for durable storage (offline roadmap Phase 2.3). Chrome
      // auto-grants for engaged/installed origins with no prompt;
      // Safari grants for home-screen apps. Where denied, caches
      // stay evictable (and iOS Safari applies its 7-day cap) —
      // that's the honest signal we report, not display-mode.
      let persisted = false;

      try {
        persisted = (await navigator.storage?.persisted?.()) ?? false;

        if (!persisted) {
          persisted = (await navigator.storage?.persist?.()) ?? false;
        }
      } catch {
        // Storage API unavailable — report false.
      }

      // offline_ready is derived from the cache, never asserted:
      // does THIS build's precache exist right now? False during
      // first-visit install is correct — offline wasn't ready when
      // this session started.
      let offlineReady = false;

      try {
        if (manifest?.cacheName) {
          offlineReady = await caches.has(manifest.cacheName);
        } else {
          offlineReady = (await caches.keys()).some((key) =>
            key.startsWith('logicola-offline-')
          );
        }
      } catch {
        // caches API unavailable — report false.
      }

      void registerAnalyticsProperties({
        storage_persisted: persisted,
        offline_ready: offlineReady,
      });
    })();
  }, []);

  return null;
}
