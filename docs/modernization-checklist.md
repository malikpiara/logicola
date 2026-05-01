# Modernization Checklist

## Baseline Verification

Run these checks before and after each dependency phase:

```bash
pnpm build
pnpm test
```

Manual smoke-check routes:

- `/`
- `/syllogistic`
- `/progress`
- `/keyboard`
- `/syllogistic/translations/basic/quiz`

## Visual Regression Routine

Start the dev server in a separate terminal:

```bash
pnpm dev
```

Capture the baseline once:

```bash
pnpm visual:baseline
```

Capture the current phase after upgrades:

```bash
pnpm visual:capture
pnpm visual:compare
```

Artifacts are written to `artifacts/visual/`:

- `baseline/` stores the approved screenshots
- `current/` stores the latest capture
- `diff/` stores pixel diffs for review

If a route legitimately changes and the result is approved, refresh the baseline:

```bash
pnpm visual:baseline
```
