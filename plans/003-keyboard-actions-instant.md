# 003 — Keyboard-driven quiz actions respond instantly

- **Commit:** 02f1d7b
- **Severity:** HIGH
- **Category:** Purpose & frequency
- **Estimated scope:** 2 files, ~30 lines

## Problem

The two highest-frequency actions in the product animate on the
keyboard path. (1) Selecting an option — digits 1–9 or abbreviation
letters, 100+ times a session — fades its tint and ring band in over
120ms, so the selection trails the keypress; the audit's rule is
"never animate keyboard-initiated actions", and the app itself
already obeys it for the arrow-key focus band (a `display` toggle
with a dated comment). (2) The desktop advance (Enter) hides the next
question behind an undocumented 90ms exit fade before
`handleNextQuestion()` runs — a delay glued to the app's most
repeated keypress, with no rationale comment (unlike its mobile
sibling, which documents the Duolingo push).

## Where

| File                        | Lines    | What's there                                      |
| --------------------------- | -------- | ------------------------------------------------- |
| `app/globals.css`           | ~430–433 | `.qopt` 120ms background/color fade               |
| `app/globals.css`           | ~360–367 | `.qopt-wrap::before` ring band 120ms opacity fade |
| `components/quiz/index.tsx` | 85       | `QUESTION_EXIT_MS = 90`, no comment               |
| `app/globals.css`           | ~119–131 | desktop `[data-motion='leaving']` exit rules      |

### Current code

```css
/* app/globals.css:~430 (.quiz-immersive .qopt) */
transition:
  background-color 0.12s,
  color 0.12s;
```

```ts
// components/quiz/index.tsx:85
const QUESTION_EXIT_MS = 90;
```

## Target

**Part A — selection is instant; hover keeps its fade.**
Scope the existing 120ms transitions to the hover interaction only.
Concretely: keep `transition` on the base `.qopt` rule, and add an
override that zeroes it while the state classes apply:

```css
/* selection state must track the keypress — never fade.
   Hover keeps the 120ms ease above. (dated comment) */
.quiz-immersive .qopt.is-selected,
.quiz-immersive .qopt-wrap.is-ringed::before {
  transition-duration: 0s;
}
```

Check in DevTools that deselection (state class removed) also snaps;
if the removal path still fades (transition lives on the base rule),
move the 120ms declaration into the `:hover` rule instead, gated as
the existing hover rules are (`@media (hover: hover)`).

**Part B — desktop advance: default to instant, keep the mobile
push.** In `handleNextQuestionTransition`, when the View-Transitions
mobile branch is not taken, call `handleNextQuestion()` synchronously
and drop the `[data-motion='leaving']` 90ms path. The incoming
question keeps its existing 150ms `quizQuestionIn` entrance (an
entrance doesn't delay the state change — the new question is already
there and interactive).

**Why these values:** 0s on state per the frequency table's top row
("no animation, ever"); the entrance staying 150ms quart preserves
the "prevent jarring cut" purpose without gating the keypress.

## Conventions to follow

- The arrow-key focus band (`app/globals.css` ~381–393) is the
  in-repo exemplar: state via `display`, instant by design, with a
  dated comment. Match its comment style.
- `QUESTION_EXIT_MOBILE_MS` (index.tsx:87–91) documents its reason —
  if any exit constant survives, it must carry one too.

## Steps

1. Add the selection-state transition override; verify select AND
   deselect snap for keyboard and pointer alike.
2. Remove `QUESTION_EXIT_MS` and the desktop `setTimeout` branch in
   `handleNextQuestionTransition`; the reduced-motion early-return
   already calls `handleNextQuestion()` directly — unify with it.
3. Delete the now-unreachable desktop `[data-motion='leaving']` CSS
   (keep the `width < 40rem` fallback block — it backs the non-VT
   mobile path).
4. `pnpm eslint`, `pnpm vitest run` (the hook tests don't time the
   exit, but run them).

## Out of scope

- The mobile View-Transitions push and `QUESTION_EXIT_MOBILE_MS`
  (documented, measured, exempt).
- The verdict choreography (reveal/flicker/payment/delta) — feedback,
  not keypress animation.
- Pointer-select haptics (`haptic('selection')`).

## Verification

**Build**

- [ ] `pnpm eslint` and `pnpm vitest run` pass.

**Behavior**

- [ ] Press `2` then immediately `Enter`: the tint is fully present
      the frame the digit lands; grading reads the right option.
- [ ] Desktop Enter-advance: the next prompt is interactive with no
      90ms dead window (spam Enter — the `isQuestionLeavingRef` guard
      must still prevent double-advance, or be removed with the
      timeout if it becomes vestigial — check).

**Feel**

- [ ] A fast keyboard run (select → check → advance × 10) feels like
      the interface is ahead of you, never behind.
- [ ] Pointer users: hover fade unchanged; tap-select now snaps —
      confirm this reads as responsiveness, not abruptness, on a real
      phone.

## Notes

Part B removes motion rather than tuning it, per the frequency table.
If Malik misses the desktop exit fade, the honest alternative is not
90ms-on-the-keypress but the mobile model: a View-Transitions push on
desktop too, where old and new travel together and the state change
is never blocked. That would be a new plan, not a tweak to this one.
