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

In a production build:

1. Load the app while online.
2. Confirm the service worker is installed.
3. Go offline.
4. Open and refresh at least one published quiz route.
5. Confirm an uncached route falls back to `/offline`.

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
