# Release Checks

Use this checklist before shipping larger changes.

## Automated Checks

```bash
pnpm build
pnpm test
```

## Manual Smoke Checks

Verify these routes load and behave correctly:

- `/`
- `/syllogistic`
- `/progress`
- `/keyboard`
- `/syllogistic/translations/basic/quiz`

## Offline Check

In a production build (`pnpm build && pnpm exec next start`):

1. In a **fresh browser profile** (or after Clear site data), load `/`
   while online and wait for the service worker to finish installing —
   DevTools → Application → Cache Storage should show the
   `logicola-offline-*` cache with the URL count from the build's
   `public/offline-manifest.json`.
2. Go offline by **stopping the server** (or airplane mode on a
   device). Do NOT use the DevTools "Offline" throttle for this check:
   network emulation is per-target and does not apply to the service
   worker, whose fetches keep reaching the real network — the check
   passes while the app is actually broken offline. (Found the hard
   way, 2026-08-15.)
3. Navigate directly to a **generated-set** quiz route you have not
   visited in this profile (e.g. `/propositional/translations/quiz`)
   and click **Start Quiz**. A question must render, with formulas.
   The start screen alone proves nothing — the per-set generator chunk
   and KaTeX load at Start, and they are the assets that go missing
   when the manifest generator regresses.
4. From a cached page, navigate via the in-app nav to another quiz
   (client-side navigation must fall back to the cached page). Watch
   the console, not just the screen: this step is the one that catches
   a **`ChunkLoadError`**. Turbopack requests lazily-loaded chunks by
   numeric module id, so no scan of the build output can see them —
   on 2026-08-25 both pages were fully cached and moving between them
   still died, because the client router's own navigation chunk was
   not in the manifest. `scripts/offlineManifest.test.ts` now fails
   the build for that class of gap, but only after `pnpm build`.
5. Confirm an uncached route falls back to `/offline`.

Two 503s are expected and correct while offline, and neither is a
failure:

- `/offline-manifest.json` — deliberately never cached. The service
  worker is cache-first, so a cached manifest would pin the app to an
  old `?v=` and no later deploy could install.
- `/?_rsc=…` — the RSC payload path is deliberately unfixed. The
  router falls back to a full page load, which the cache serves;
  answering these from the page cache would feed HTML to a flight
  parser.

## Visual Regression

Start the dev server in a separate terminal:

```bash
pnpm dev
```

Capture and compare screenshots:

```bash
pnpm visual:baseline
pnpm visual:capture
pnpm visual:compare
```

Artifacts are written to `artifacts/visual/`.
