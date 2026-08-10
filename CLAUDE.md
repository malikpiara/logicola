# LogiCola 3

Web port of Harry Gensler's LogiCola logic drills. Next.js 16 (App
Router, Turbopack), React 19, Tailwind 4, strict TypeScript. Used in US
university courses — accessibility (WCAG) is a release blocker, not a
trade-off.

## Commands

- `pnpm test` — vitest; the quiz logic lives in hook/lib tests.
- `pnpm eslint` — eslint + `tsc --noEmit`. Run before calling work done.
- `pnpm build` — production build; postbuild regenerates the offline
  manifest.
- Dev server: `.claude/launch.json` (`logicola-dev`, port 3100). Use the
  preview tools, never a raw Bash dev server.

## Architecture — read before touching the quiz

- Route `app/(quiz)/[...slugs]/page.tsx` → `lib/publishedQuizLookup.ts`
  decides **static** (`<Quiz subSet>`, Set Q) vs **generated** (per-set
  wrapper in `components/quiz/generated/`).
- **Bundle contract.** Every quiz slug shares ONE route, so each set's
  generator must ship only in its own chunk. The per-set wrappers are
  dispatched behind a **client-side `next/dynamic` map** — that exact
  placement is load-bearing: a static import of any generator from
  shared code re-fuses all of them into every quiz page, and so does
  `dynamic()` called from a *server* module (both variants were built
  and measured before landing here; the fused chunk was ~204 KB). Never
  import `content/sets/*.generator` or `content/sets/setR.data` from
  shared client modules; `content/generators.ts` is a test-only
  registry.
- **Grading truth lives only in `useQuizState.onCheckAnswer`.** It
  returns `'correct' | 'miss' | undefined`; the shell reacts to that
  verdict. Never re-derive correctness in a component.
- **Retries are remounts.** `Quiz` bumps the session key and passes
  `initialMode`; state resets happen through initializers. Never add an
  enumerated reset to the hook.
- Scoring economies come from each set's 2008 DSL (`lib/scoring.ts`). A
  set without a derived economy must fail `canScore` — never lend it
  another set's numbers.

## Analytics (PostHog)

- Event properties are **snake_case only** (`quiz_title`,
  `total_questions`, `correct_questions_count`, `score_percentage`).
- Renaming a property means also re-pointing saved PostHog insights.
  The convention there is `coalesce(properties.new, properties.old)` so
  history keeps counting — keep that pattern.

## Conventions

- Code comments carry dated design decisions ("Malik, 2026-08-08") —
  they are the project's memory. Preserve them when moving code.
- Design contracts: `docs/pixel-ui.md` (port contract),
  `docs/redesign-handoff.md` (redesign entry point), newest
  `docs/session-handover-*.md` (state of play).
- `QUIZ_SURFACE_POOL` in `components/quiz/quizColors.ts` is
  stale-by-design (the pattern accents were judged against it) — never
  "tidy" it to the shipped palette.
- Commits and PRs carry no Claude attribution.
