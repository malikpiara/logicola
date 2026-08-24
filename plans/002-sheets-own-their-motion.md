# 002 — Make exactly one timing rule live per sheet, and make reduce actually reduce

- **Commit:** 02f1d7b
- **Severity:** HIGH (accessibility half) / MEDIUM (cohesion half)
- **Category:** Accessibility + Cohesion
- **Estimated scope:** 3 files, ~50 lines

## Problem

vaul injects an **unlayered** stylesheet at runtime and writes inline
`transition` styles on snap, while every Tailwind utility in this app
lives inside `@layer utilities`. Unlayered declarations beat layered
ones regardless of specificity, and inline beats both. Three
consequences, all verified live:

1. The drawer's declared house timing — `duration-200
ease-[var(--ease-out-quart)] animate-in slide-in-from-bottom-6 …`
   — is **dead CSS**. vaul's 500ms `cubic-bezier(0.32, 0.72, 0, 1)`
   runs on every sheet.
2. Under `prefers-reduced-motion: reduce`, the desktop reference pane
   and the mobile exercises sheet **still travel their full slide**:
   the app's `.animate-in { animation: none }` override (specificity
   0,1,0) loses to vaul's `[data-vaul-drawer][data-vaul-snap-points=false][data-vaul-drawer-direction=…][data-state=open]`
   (0,4,0, unlayered). vaul ships zero reduced-motion handling itself.
3. The `.quiz-controls-drawer { transition: none }` reduce rule is
   dead the same way, and vaul's inline snap transition can't be
   beaten by any stylesheet without `!important`.

Rule: "Movement with no `prefers-reduced-motion` handling — under
reduce, ensure nothing moves." This repo treats WCAG as a release
blocker, which is why the a11y half is HIGH.

Also in scope (same surfaces, accessibility): two animated controls
below the 44px floor — the pane resize grip (16px wide) and the
`.qsheet-x` collapse chip (32×32) on the touch sheet.

## Where

| File                        | Lines                | What's there                                           |
| --------------------------- | -------------------- | ------------------------------------------------------ |
| `components/ui/drawer.tsx`  | 96–97                | dead `animate-in/out slide-*` + `duration-200` classes |
| `app/globals.css`           | ~2107–2114           | reduce block vaul outranks                             |
| `app/globals.css`           | ~240–247, ~1527–1535 | dead `.quiz-controls-drawer` overrides                 |
| `components/quiz/index.tsx` | ~1654                | 16px resize grip                                       |
| `app/globals.css`           | ~1487–1506           | 32px `.qsheet-x`                                       |

### Current code

```tsx
// components/ui/drawer.tsx:96 (side === 'bottom' branch)
'motion-panel duration-200 ease-[var(--ease-out-quart)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-6 data-[state=closed]:slide-out-to-bottom-5';
```

```css
/* app/globals.css:2107 (inside prefers-reduced-motion: reduce) */
.animate-in,
.animate-out,
.animate-pulse,
.animate-accordion-down,
.animate-accordion-up {
  animation: none;
  transition: none;
}
```

## Target

1. **Delete the dead classes** from both branches of
   `DrawerContent` in `components/ui/drawer.tsx`: every
   `data-[state=…]:animate-*`, `slide-in-*`, `slide-out-*`, and the
   `duration-200 ease-[…]` that pretended to time them. vaul's own
   500ms `cubic-bezier(0.32, 0.72, 0, 1)` becomes the _declared_
   grammar, not an accident. Add the curve to the tokens block:

```css
/* app/globals.css tokens (~2014) */
--ease-sheet: cubic-bezier(0.32, 0.72, 0, 1); /* vaul's own; sheets speak it */
```

2. **A reduce block that wins.** Add, UNLAYERED (top level of
   globals.css, outside every `@layer` and after the imports):

```css
@media (prefers-reduced-motion: reduce) {
  [data-vaul-drawer],
  [data-vaul-overlay] {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
```

`1ms` rather than `none`: vaul's close logic waits on
transition/animation end events, and `none` can strand the sheet's
unmount. `!important` is required to beat the inline snap styles —
this is the documented exception, not sprinkling. The overlay's
existing fade carries the state change (reduced motion means
gentler, not zero).

3. **Hitboxes** (no layout change):

```css
.qgrip-wrap::before {
  content: '';
  position: absolute;
  inset: 0 -14px;
}
.qsheet-x::before {
  content: '';
  position: absolute;
  inset: -6px;
}
```

**Why these values:** −14px widens 16→44; −6px widens 32→44 — the
44×44 floor. The grabber itself is already 44×100 (documented HIG
floor) — don't touch it.

## Conventions to follow

- Tokens live at `app/globals.css` ~2014; follow the `--ease-*`
  naming.
- `components/quiz/index.tsx` already gates JS motion through
  `prefersReducedMotion()` — reuse it if any JS-side gate is needed.
- Preserve every dated comment; the drawer.tsx grabber comment block
  (2026-08-21/22) is project memory.

## Steps

1. Remove the dead classes from `drawer.tsx` (both `side` branches
   and the overlay's `data-[state=…]` pair at line ~32 — check in
   DevTools first which of the overlay's classes are live; the
   overlay may keep its fade if it genuinely applies).
2. Add `--ease-sheet` token with a comment naming vaul as its source.
3. Add the unlayered reduce block; delete the two dead
   `.quiz-controls-drawer` reduce rules (~240–247's `transition:
none` line and the ~1527–1535 block) so the next reader doesn't
   trust them.
4. Add the two hitboxes; `.qgrip-wrap` and `.qsheet-x` both already
   have `position` contexts — verify, else add `position: relative`.
5. `pnpm eslint`, `pnpm vitest run`.

## Out of scope

- vaul's drag physics, snap points, and `patches/vaul@1.1.2.patch`.
- The quiz controls sheet's snap choreography and grabber behavior.
- Sheet entrance redesign (travel vs fade) — that's a separate taste
  decision; this plan only makes the cascade honest.

## Verification

**Build**

- [ ] `pnpm eslint` and `pnpm vitest run` pass.

**Behavior**

- [ ] DevTools → Elements → Computed on an open exercises sheet: the
      live `transition`/`animation` comes from exactly one rule, and
      you can name it.
- [ ] Emulate `prefers-reduced-motion: reduce`: exercises sheet,
      desktop reference pane, and controls-sheet snaps all appear
      without travel; the sheet still opens and closes (unmount not
      stranded).
- [ ] Screen-reader/tab pass still reaches the grip and ✕; their
      hover/press targets accept clicks 14px outside the old bounds.

**Feel**

- [ ] With reduce OFF, drag-release the exercises sheet mid-flight:
      it retargets smoothly from the finger's position (vaul's
      transition, now uncontested).
- [ ] Record open/close and scrub: one curve, steep start, gentle
      settle; no double-animation artifacts.

## Notes

After this lands, "the sheet feels slow/weightless" becomes a real
question for the first time (today's 200ms declaration was never
running). If Malik wants a different sheet personality, tune vaul's
via a deliberate unlayered override on `--ease-sheet`/duration — one
rule, in one place, documented.
