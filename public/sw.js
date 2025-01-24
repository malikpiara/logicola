const CACHE_NAME = 'logicola-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.svg',
  // Add other static assets like
  '/globals.css',
  // Add any other pages/routes you want to cache
  'syllogistic/translations/basic/quiz',
  'syllogistic/translations/hard/quiz',
  'syllogistic',

  'propositional/translations/quiz',
  'propositional/translations/hard/quiz',
  'modal/translations/basic/quiz',
  'modal/translations/quantified/quiz',

  'Deontic/translations/Imperative/quiz',
  'Deontic/translations/Deontic/quiz',
  'belief/translations/basic/quiz',
  'belief/translations/willing/quiz',
  'belief/translations/rationality/quiz',
  
  'informal/definitions/quiz',
  'propositional/translations/quiz',
  'keyboard',

  '/syllogistic/translations/basic/quiz',
  '/syllogistic/translations/hard/quiz',
  '/syllogistic',

  '/propositional/translations/quiz',
  '/propositional/translations/hard/quiz',
  '/modal/translations/basic/quiz',
  '/modal/translations/quantified/quiz',

  '/Deontic/translations/Imperative/quiz',
  '/Deontic/translations/Deontic/quiz',
  '/belief/translations/basic/quiz',
  '/belief/translations/willing/quiz',
  '/belief/translations/rationality/quiz',
  
  '/informal/definitions/quiz',
  '/propositional/translations/quiz',
  '/keyboard'
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