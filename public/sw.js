const CACHE_PREFIX = 'logicola-offline-';
const LEGACY_CACHE_PREFIX = 'logicola-cache-';
const OFFLINE_FALLBACK_URL = '/offline';

async function getOfflineManifest() {
  const response = await fetch('/offline-manifest.json', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to load offline manifest: ${response.status}`);
  }

  return response.json();
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const manifest = await getOfflineManifest();
      const cache = await caches.open(manifest.cacheName);

      await cache.addAll(manifest.urls);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const manifest = await getOfflineManifest();
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              ((cacheName.startsWith(CACHE_PREFIX) &&
                cacheName !== manifest.cacheName) ||
                cacheName.startsWith(LEGACY_CACHE_PREFIX))
          )
          .map((cacheName) => caches.delete(cacheName))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        return await fetch(event.request);
      } catch (error) {
        if (event.request.mode === 'navigate') {
          const offlineResponse = await caches.match(OFFLINE_FALLBACK_URL);

          if (offlineResponse) {
            return offlineResponse;
          }
        }

        return new Response('Offline resource unavailable.', {
          status: 503,
          statusText: 'Offline',
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        });
      }
    })()
  );
});
