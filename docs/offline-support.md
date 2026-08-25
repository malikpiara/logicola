# Offline Support

LogiCola supports offline use for all published quizzes after the app
has been opened while online at least once. This includes the
generated sets and formula rendering (KaTeX), not just the page
shells — see "What broke before" below.

## Scope

- Published quiz routes work offline end to end: start screen,
  Start Quiz, question rendering with formulas.
- Non-quiz routes are not guaranteed to work offline.
- Uncached offline navigations fall back to `/offline`.
- Client-side navigations offline work via Next's MPA fallback: the
  router's RSC fetch fails, the router hard-navigates, and the
  service worker serves the cached page. Do NOT "fix" the service
  worker to answer RSC fetches (`?_rsc=`) from the page cache — that
  would feed full HTML to a fetch expecting a flight payload and
  break the router. Verified 2026-08-15.

## How It Works

- `content/quiz-catalog.json` lists the published quizzes.
- `pnpm build` (postbuild) runs
  `scripts/generate-offline-manifest.mjs`, which emits
  `public/offline-manifest.json`. The URL set is the union of:
  - static URLs and quiz routes from the catalog,
  - the quiz route's entry JS/CSS (build + RSC manifests),
  - **dynamic-import chunks** from the quiz page's
    `react-loadable-manifest.json` — the per-set generator wrappers
    live behind a client-side `next/dynamic` map (the bundle
    contract), so they never appear in `entryJSFiles`,
  - per-route assets parsed from the prerendered `quiz.html` files,
  - a **transitive closure** over chunk-to-chunk references (chunks
    load each other and lazy vendors like KaTeX via literal
    `static/chunks/<id>.js` strings), including KaTeX's woff2 fonts
    resolved from relative `url(../media/…)` refs in CSS. woff2
    only — every SW-capable browser speaks woff2, and the woff/ttf
    fallbacks would be dead bytes on metered connections.
- `public/sw.js` precaches every manifest URL at install and serves
  cache-first for static assets, network-first for navigations.
- `components/providers/service-worker.tsx` registers
  `/sw.js?v=<cacheName>`. The query string is the deploy version:
  sw.js's bytes never change between builds, and browsers only re-run
  install when the script (URL included) changes — without the
  version, deploys would never refresh anyone's offline cache. It
  also requests `navigator.storage.persist()` (durable storage where
  granted) and registers the `offline_ready` / `storage_persisted`
  analytics super properties.

Current payload: ~2 MB of static assets + the prerendered quiz pages
(114→74 URLs after the woff2 trim; see the manifest for the live
number).

## What broke before (2026-08-15)

The manifest was built only from `entryJSFiles`, which cannot see
dynamic imports. On a cold cache, offline, every generated set 503'd
at Start Quiz (its generator chunk was missing), and so did KaTeX
(256 KB, lazy-loaded at Start) — so formula rendering broke for
every set. It often _looked_ fine in testing because Next.js link
prefetching had warmed the HTTP disk cache with the missing chunks;
that cache is evictable and was never a guarantee. The release-check
offline procedure in `docs/release-checks.md` exists to keep this
from regressing: it must click Start Quiz on a cold generated set,
with the server actually stopped (DevTools offline emulation does not
apply to service worker fetches).

## When Publishing a New Quiz

1. Add the quiz content.
2. Add the published route to `content/quiz-catalog.json`.
3. Run `pnpm build`.
4. Test the route offline per `docs/release-checks.md` — including
   Start Quiz, not just the start screen.

If a quiz is not listed in `content/quiz-catalog.json`, it will not
be included in the offline bundle.

## Related

- `docs/offline-roadmap.md` — plan of record, hypotheses, and the
  measurement layer (offline tally, install tracking, durability
  super properties).
