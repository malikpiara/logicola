# 006 — Cohesion batch: one curve per gesture, one entrance per container

- **Commit:** 02f1d7b
- **Severity:** MEDIUM → LOW (five small items, batched)
- **Category:** Cohesion, hierarchy & spatial consistency
- **Estimated scope:** 5 files, ~40 lines

## Problem

Five small cohesion drifts, none feel-breaking alone, all cheap:

1. The question advance mixes curve families: exits run
   `--ease-out-cubic`, entrances `--ease-out-quart`, and the
   view-transition pair runs cubic — one gesture, two personalities.
   (If plan 003 removes the desktop exit, only the mobile/VT halves
   remain — do this after 003.)
2. The start screen nests `.motion-enter` inside `.motion-enter`
   (screen + level dial), composing to 16px travel and a
   curve-squared fade on the dial — "one entrance per container."
3. The exercises sheet's level-2 topic pane slides its full width on
   Tailwind's stock `ease-out` — the catalog's small-container case:
   crossfade with a directional hint reads calmer, and the stock
   curve is off-family.
4. Sonner toasts run library defaults (400ms, built-in `ease`) — the
   slowest motion in the product, on `/keyboard`'s copy actions.
5. `.motion-progress` (420ms `--ease-out-cubic`) is token drift: its
   only consumer's values are hardcoded so the transition never fires
   today — align it before someone wires it up and ships the drift.

## Where

| File                                   | Lines                | What's there                             |
| -------------------------------------- | -------------------- | ---------------------------------------- |
| `app/globals.css`                      | ~119–151, ~1936–1974 | advance exit/VT curves (cubic)           |
| `components/quiz/startScreen.tsx`      | 190                  | inner `.motion-enter`                    |
| `components/mobile/exercisesSheet.tsx` | 107                  | full-width slide, `motion-safe:ease-out` |
| `components/ui/sonner.tsx`             | 14–28                | no timing overrides                      |
| `app/globals.css`                      | ~215–220             | `.motion-progress` 420ms cubic           |

### Current code

```css
/* globals.css:~122 */
transition-timing-function: var(--ease-out-cubic);
/* globals.css:~1938 */
::view-transition-old(quiz-question) {
  animation-duration: 260ms;
  animation-timing-function: var(--ease-out-cubic);
}
```

```tsx
// exercisesSheet.tsx:107
`flex h-full w-[200%] motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out ${
```

## Target

1. Point every `quiz-question` exit and both `::view-transition-*`
   rules at `var(--ease-out-quart)`; durations unchanged.
2. Delete `motion-enter` from `startScreen.tsx:190`.
3. Level-2 pane: keep the direction reversal, change the movement to
   an 8px hint + fade at the house curve —
   `motion-safe:duration-[190ms] motion-safe:ease-[var(--ease-out-quart)]`,
   travel cut from `-translate-x-1/2` panes to opacity crossfade with
   `translate-x-2` hint on the incoming pane. If the two-pane
   `w-[200%]` structure makes a true crossfade awkward, the minimum
   fix is the curve + duration swap alone.
4. One unlayered rule for toasts:
   `[data-sonner-toast] { transition-duration: 190ms; transition-timing-function: var(--ease-out-quart); }`
   — verify swipe-to-dismiss still tracks before keeping it.
5. `.motion-progress`: `transition-duration: 500ms;
transition-timing-function: var(--ease-out-quart);` to match the
   scored bar (or adopt a shared `--motion-meter` token, per the
   superseded docs/motion-plans P1).

**Why these values:** quart is the house curve; 190ms is
`--motion-standard`; 500ms matches the scored meter's documented
payment; 8px + fade is the catalog's small-container crossfade.

## Conventions to follow

- Tokens at `app/globals.css` ~2014.
- The mobile push (old-left/new-right) and its durations are
  measured and documented — curves only, never timings.
- `.motion-enter`'s single-container use on every other screen is the
  exemplar for item 2.

## Steps

1–5 map one-to-one to the Target items; each is independently
shippable. Run `pnpm eslint` + `pnpm vitest run` after.

## Out of scope

- The verdict choreography and the damage-bar timeline.
- The countUp cascade (its 130ms offset and uniform weighting were
  audited LOW; the docstring documents the cascade deliberately —
  treat as won't-fix unless Malik asks).
- Sheet entrance redesign (plan 002's note).

## Verification

**Build**

- [ ] `pnpm eslint` and `pnpm vitest run` pass.

**Behavior**

- [ ] Mobile advance: push plays; both layers ease identically.
- [ ] Start screen: the level dial arrives with its screen, one
      travel, one fade.
- [ ] Reduced motion: level-2 pane still swaps (the `motion-safe:`
      gate keeps holding).

**Feel**

- [ ] Sheet level-2: the topic change should read as content
      swapping in place, eyes stationary — record and compare to the
      current full slide.
- [ ] Toasts: still elegant at 190ms? Sonner chose slower on
      purpose; if 190ms feels clipped on `/keyboard`, 250ms quart is
      the compromise — note which shipped.

## Notes

Items 3 and 4 are the two where code can't judge feel: the
crossfade-vs-slide choice inside the sheet and the toast tempo are
Malik's on-device calls. Ship the curve/duration alignment
regardless; hold the structural crossfade for the lab if in doubt.
