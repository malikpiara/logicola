# Handover — 2026-08-10 (review & refactor session)

Written on branch `color-system-exploration`. Supersedes
`session-handover-2026-08-06.md`. This session was a full-codebase
review followed by the top refactors from it; the design contracts
(`pixel-ui.md`, `redesign-handoff.md`) are unchanged. A project
`CLAUDE.md` now exists — the durable rules from this session
(bundle contract, single grader, remount retries, analytics naming)
live there, not here.

## Done today

- **Per-set generator code-split.** Quiz pages had shipped a ~204 KB
  chunk with all six generators + the Set R corpus. Now each set's
  wrapper (`components/quiz/generated/`) is its own chunk behind a
  client-side `next/dynamic` map; the Set R guide table split into
  `setRGuide.tsx` the same way. Measured after: each page carries only
  its own generator; Set Q carries none. `QuizClient` deleted.
  - The lesson, proven by two failed intermediate attempts (bundles
    were re-measured after each): within one route, statically imported
    `'use client'` entries do NOT split, and `dynamic()` in a _server_
    module doesn't either. Only `import()` inside a client module is a
    real boundary.
- **`katexSpan.jsx` → typed `.tsx`** with a module-level KaTeX render
  cache (options re-render every keystroke; formulas now parse once).
- **React Strict Mode re-enabled** (off since March 2024). Verified in
  dev: a miss charges exactly once (−10 at level 5), no double effects.
- **Analytics props deduplicated to snake_case.** `quiz_started` lost
  `title`; `quiz_completed` lost `subSet`/`totalQuestions`/
  `correctQuestionsCount`/`scorePercentage`. The three PostHog insights
  reading retired names were re-pointed with
  `coalesce(quiz_title, chapter)`-style fallbacks and validated live —
  the two start→complete funnels had already been silently broken by an
  even older rename (`chapter`).
- **Retry = remount.** `Quiz` holds `{attempt, initialMode}`; the key
  bump rebuilds the session, `useQuizState(subSet, initialMode)` skips
  the start screen on retry mounts. The old 14-setter reset became the
  analytics-only `captureRetry`. E2E-verified: full scored run to 100 →
  Try Again → fresh 0/100 run in the same mode.
- **Single grading path.** `onCheckAnswer` now returns
  `'correct' | 'miss' | undefined`; the shell's duplicated `willMiss`
  grader and the redundant `setTimeout(0)` guide-expansion effect are
  gone. Verified on mobile viewport: first miss still expands the
  guide sheet.
- `useQuizState` dead API removed (`onShowSolution`, `questionIdx`,
  `questionOrder`, `totalQuestionCount`, `onShowEndScreen`).

441 tests pass; eslint + tsc clean; production build clean.

## Still open (ranked)

1. **Quiz-shell split** — `components/quiz/index.tsx` is ~1,150 lines
   owning both drawers, three screens, pane resize and input modality.
   Known duplications inside it: the Check/Next CTA block exists twice
   (desktop footer + mobile sheet), and the fallback palette
   (`#431407`/`#fdba74`/`#ffffff`) lives in three files
   (index/startScreen/endScreen). Do it between design pushes — the
   file is the active design surface and has no JSX test coverage.
2. **`quizColors` keying** — dispatches on display-name strings
   (`'Set A'`) plus a magic subset id (3). The palette belongs with the
   set data; keep the deliberate `QUIZ_SURFACE_POOL` staleness intact.
3. Carried from earlier handovers: end-screen treatment pass, the
   R-guide pedagogy question (decision 13), CTA silhouette dial.

## If analytics props change again

Re-point saved insights in the same session (this time it was
insights 363100, 364915, 370956) and validate with a live
`insight-query` run — the funnels' silent zero-counting is what a
rename looks like when nobody re-points.
