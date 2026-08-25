# Motion improvement plans — 2026-08-24

Handoff document. Each plan is self-contained: scope, exact values,
files, and a verification step. Grounded in the animations.dev
framework (frequency → purpose → easing → duration → physicality →
interruptibility → performance → accessibility). Per project practice,
anything visual goes through a `docs/` lab prototype for sign-off
before it ships in product code — these plans say what to prototype.

## What the survey found is already right — do not "improve" these

The app has a real motion system, and most of it is course-correct:

- **Tokens** (`globals.css` ~2014): `--ease-out-quart` (0.165, 0.84,
  0.44, 1) as the house entrance curve, `--ease-out-cubic`,
  `--ease-in-out-cubic`, and three duration tokens (feedback 140ms,
  standard 190ms, page-enter 220ms). All under 300ms. Custom curves,
  not built-ins. Correct.
- **One entrance per container.** Screens enter as one `.motion-enter`
  fade-up (220ms quart, 80ms delay); children don't trickle. The
  landing page deliberately has no entrance at all. Correct — resist
  any request to add staggered section reveals.
- **Keyboard actions are instant.** Focus bands appear with no
  transition (dated comment at ~254), number-key selection swaps state
  through 120ms color-only transitions. Correct per the
  "never animate keyboard-initiated actions" rule.
- **The verdict choreography is designed, sequenced, and documented**:
  answer reveal 160ms → bar damage flicker 340ms linear → penalty pays
  over 500ms (`--qp` custom-property transition, held back by
  `transition-delay` so the flicker finishes first) → the ±delta
  readout lives 1600ms and never outlasts the advance. The loss delta
  shakes _before_ the bar moves. This is real orchestration — treat the
  timeline as a contract (see P4).
- **Reduced motion is two-variant, not deleted**: seven
  `prefers-reduced-motion` blocks; the delta still appears and leaves
  (information preserved, movement removed); the question advance
  skips the View Transition push in JS. Correct philosophy.
- **Press feedback** exists app-wide (`.motion-button` 120ms,
  `:active` scale), and Tailwind v4 gates `hover:` behind
  `(hover: hover)` by default.

---

## P1 — One meter grammar (small, safe)

**Problem.** Two sibling progress systems time differently: the
count-mode bar (`.motion-progress`, `components/ui/progress.tsx`) moves
in **420ms `--ease-out-cubic`**, the scored bar (`.qbar`,
`globals.css` ~697) pays in **500ms `--ease-out-quart`**. Same object
("your progress"), two personalities — a cohesion miss, invisible
individually, felt in aggregate.

**Change.** Pick the scored bar's pair as the house meter token
(`--motion-meter: 500ms; --ease-meter: var(--ease-out-quart)`) and
point `.motion-progress` at it. Do not touch the damage-flicker
choreography or its `transition-delay` coupling (the 340ms flicker and
its reduced-motion block at ~763 are load-bearing).

**Files.** `app/globals.css` only.
**Verify.** Count-mode run: bar steps feel identical in weight to a
scored-run payment. Reduced motion: both bars still jump-cut.
**Effort.** ~30 minutes.

## P2 — Exercises sheet entrance: sheet travel, not fade (decision + prototype)

**Problem.** The exercises sheet (`components/mobile/exercisesSheet.tsx`)
is an **85svh** bottom sheet, but it enters with `DrawerContent`'s
default `slide-in-from-bottom-6` — a 24px slide + fade over 200ms. An
occasional, near-full-screen surface entering with a small-popover
gesture reads weightless; the recognized grammar for a sheet this size
is full travel from the bottom edge on a steep curve.

**Change (recommended).** Give the exercises sheet vaul's own travel:
no enter fade, `transform: translateY(100%) → 0` over **500ms
`cubic-bezier(0.32, 0.72, 0, 1)`** (the iOS-sheet curve — add it to the
tokens as `--ease-sheet`). Exit shorter: **~350ms**, same curve family,
same direction it came from. The steep front-load is why 500ms will not
feel slow. Keep the quiz controls sheet and the desktop reference pane
exactly as they are — they are always-open furniture, not entrances.

**Decision for Malik.** The near-place fade is a legitimate
"Family-drawer" look; if the weightless entrance was a deliberate
choice, close this plan as won't-fix instead — but then shorten it to
~150ms so it reads as intent, not as a default that was never tuned.

**Watch.** The sheet now mounts lazily on first burger tap
(2026-08-24 perf pass) — verify the very first open plays the full
travel, not a pop-in, on a throttled connection.

**Files.** `components/ui/drawer.tsx` (a `side='bottom'` variant class
or a new prop), `components/mobile/exercisesSheet.tsx`,
`app/globals.css` (token). Prototype in a `docs/` lab first.
**Verify.** On-device (real phone, not DevTools): open, close,
open-mid-close interrupt (vaul transitions are interruptible — the
override must ride `transition`, never `@keyframes`). Reduced motion:
opacity-only swap, ~200ms.
**Effort.** Half a day including the lab.

## P3 — Guide-pane drag at 60fps (performance, already in the backlog)

**Problem.** Dragging the desktop guide pane's resize grip calls
`setPaneWidth` per `pointermove` → re-renders the whole `QuizSession`
tree (all options, KaTeX segments) at pointer frequency, and
`patternLayer.tsx` rebuilds its SVG string per `ResizeObserver` tick.
This is the one place the app visibly drops frames.

**Change.** Hold the width in a ref during the drag; write
`--quiz-pane-offset` and the pane's inline width directly on the DOM in
the move handler (composite-only properties stay smooth; this is a
layout write, so ALSO throttle to rAF); commit one `setPaneWidth` on
`pointerup` for `aria-valuenow` and persistence. Throttle
`patternLayer` regeneration to rAF, or snapshot it at drag start and
regenerate once on release.

**Files.** `components/quiz/index.tsx` (`startPaneResize`, ~968),
`components/quiz/patternLayer.tsx`.
**Verify.** DevTools performance trace while dragging: no long tasks
over 16ms; React profiler shows zero QuizSession commits during the
drag and exactly one on release.
**Effort.** Half a day. (Tracked as item 4 in the Aug 2026 refactor
backlog — this plan supersedes that line with the measurement spec.)

## P4 — The verdict timeline becomes a written contract (documentation, then one taste option)

**Problem.** The check-answer choreography (reveal 160ms → flicker
340ms → payment 500ms → delta out at 1600ms) is the emotional core of
the product and currently lives as scattered constants in
`globals.css`, `quizColors.ts` comments, and `index.tsx`. Nothing stops
a future edit from, say, shortening the flicker without moving the
`transition-delay` that waits for it.

**Change.**

1. Write the timeline into `docs/pixel-ui.md` as a single table
   (event, start, duration, curve, file:line) and name the coupling
   rules ("payment delay ≥ flicker duration", "delta lifetime =
   1600ms timeout in index.tsx — one source").
2. _Optional taste candidate, prototype only:_ a settle pulse on the
   revealed correct pill — `scale(1 → 1.015 → 1)`, ~200ms, quart,
   nothing under reduced motion. Guardrails: verdicts happen tens of
   times per session, so if the lab shows it registering consciously
   on the third repetition, kill it. The miss side needs nothing — the
   bar flicker and delta shake already carry it.

**Files.** `docs/pixel-ui.md`; lab file for the pulse.
**Effort.** 2 hours for the contract; the pulse is taste-budget.

## P5 — Reduced-motion regression net (QA, hand to anyone)

**Problem.** Seven CSS blocks plus JS gates cover reduced motion, but
nothing re-checks them; today's perf pass alone added three new motion
paths (lazy KaTeX swap-in, lazy sheet mount, scroll-lock).

**Change.** A one-page checklist in `docs/` walked once per release
with macOS's "Reduce motion" on: (1) question advance is a cut, no
push; (2) bar pays instantly, no flicker; (3) delta appears/leaves
without sliding; (4) sheets swap without travel; (5) end-screen count
is instant... plus where each block lives (`globals.css` 763, 1014,
1471, 1527, 2081, 2345, 2582; `prefersReducedMotion()` in
`quiz/index.tsx`; `motion-safe:` variants in `exercisesSheet.tsx`).
Optional hardening: a vitest that greps every `@keyframes` name in
`globals.css` and asserts it is referenced by at least one
reduced-motion override or an allowlist entry.

**Effort.** 2 hours; the grep-test another 2.

---

## Suggested order

P1 (trivial cohesion win) → P3 (the one real jank) → P2 (needs Malik's
decision + a lab) → P4 (contract now, pulse whenever) → P5 (before the
next release). None block each other.
