const CACHE_NAME = 'logicola-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.svg',
  // Add other static assets like
  '/globals.css',
  // Add any other pages/routes you want to cache
  '/syllogistic/translations/quiz',
  'informal/definitions/quiz',
  'propositional/translations/quiz',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});