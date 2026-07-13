# Offline Support

Logicola supports offline use for all published quizzes after the app has been opened while online at least once.

## Scope

- Published quiz routes are cached for offline use.
- Non-quiz routes are not guaranteed to work offline.
- Uncached offline navigations fall back to `/offline`.

## How It Works

- `content/quiz-catalog.json` lists the published quizzes.
- `pnpm build` generates `public/offline-manifest.json`.
- `public/sw.js` caches the published quiz routes and required app assets.

## When Publishing a New Quiz

1. Add the quiz content.
2. Add the published route to `content/quiz-catalog.json`.
3. Run `pnpm build`.
4. Test the route offline.

If a quiz is not listed in `content/quiz-catalog.json`, it will not be included in the offline bundle.
