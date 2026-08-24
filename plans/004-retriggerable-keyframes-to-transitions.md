# 004 — Re-triggerable surfaces move by transition, not keyframes

- **Commit:** 02f1d7b
- **Severity:** HIGH
- **Category:** Interruptibility (+ two riders on the same component)
- **Estimated scope:** 3 files, ~50 lines

## Problem

CSS transitions retarget from their current value mid-flight;
`@keyframes` restart from zero. Two toggleable surfaces use keyframes:

1. **FAQ accordion** (`type='multiple'`, landing page): re-clicking a
   row inside its 190ms window restarts the panel from `height: 0` —
   the Sonner-bug class. It also animates `height`, a Layout property.
2. **Desktop Exercises nav menu**: deliberately click-only, so
   open/close is a toggle on one 200ms keyframe pair; the second
   click starts `zoom-out-95` from `scale(1)`, not the in-flight
   scale.

Two riders on the same nav-menu line, filed by separate auditors:
its `animate-in` keyframes never receive a curve (no `ease-*`
utility → they run on the browser-default `ease` — the only intended
motion in the app on a stock curve), and the viewport scales from
`origin-top-center` while hanging off a single left-aligned trigger —
growth should read from the button (Radix NavigationMenu publishes no
`--radix-*-transform-origin` variable, so the honest fix is
`origin-top-left`).

## Where

| File                                | Lines | What's there                                                 |
| ----------------------------------- | ----- | ------------------------------------------------------------ |
| `components/ui/accordion.tsx`       | 64    | `animate-accordion-up/down` classes                          |
| `tailwind.config.mjs`               | 65–92 | the height keyframes + 190/150ms registrations               |
| `components/ui/navigation-menu.tsx` | 116   | `animate-in/out zoom-*` toggle, no ease, `origin-top-center` |

### Current code

```tsx
// components/ui/accordion.tsx:64
'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down';
```

```tsx
// components/ui/navigation-menu.tsx:116
'motion-panel origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 md:w-[var(--radix-navigation-menu-viewport-width)]';
```

## Target

**Accordion** — replace the keyframes with a grid-rows transition
(interruptible, composite-friendly, no measured height needed):

```css
/* globals.css — accordion content wrapper */
.faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 190ms var(--ease-out-quart);
}
.faq-panel[data-state='open'] {
  grid-template-rows: 1fr;
}
.faq-panel > * {
  overflow: hidden;
}
```

(Radix keeps content mounted with `forceMount`; if the current setup
unmounts on close, prefer the Radix-recommended
`--radix-accordion-content-height` + `transition` on `height` — still
interruptible, and acceptable under the audit's "very few children"
layout exception — over keeping keyframes.) Delete the
`accordion-up/down` keyframes from `tailwind.config.mjs` and their
entry in the reduce block (`globals.css` ~2110) once nothing uses
them.

**Nav menu** — replace the keyframe pair with a transition:

```
className: 'motion-panel origin-top-left relative mt-1.5 …
  transition-[opacity,transform] duration-200 ease-[var(--ease-out-quart)]
  data-[state=closed]:opacity-0 data-[state=closed]:scale-95
  data-[state=open]:opacity-100 data-[state=open]:scale-100'
```

If Radix unmounts the viewport on close (no exit visible), keep the
enter side as the transition via `@starting-style` (see
`css-techniques` pattern) rather than reintroducing keyframes.

**Why these values:** 190/200ms match the removed timings (occasional
surfaces, standard band); `--ease-out-quart` is the house entrance
curve the component always meant to use; `scale-95` preserves the
existing zoom depth; `origin-top-left` anchors growth to the trigger
edge.

## Conventions to follow

- Tokens at `app/globals.css` ~2014.
- `.mobile-menu` (`globals.css` ~222–238) is the in-repo exemplar of
  a transition-driven, trigger-anchored panel — match it.
- The reduce block at ~2107 currently names `.animate-accordion-*` —
  update it to cover whatever selector replaces them (or rely on the
  broader movement-zeroing rules; verify under emulation).

## Steps

1. Accordion: swap classes for the grid-rows pattern; verify open,
   close, and rapid re-click mid-flight retarget smoothly.
2. Remove the dead keyframes from `tailwind.config.mjs` and the dead
   names from the reduce block.
3. Nav menu: apply the transition form + `origin-top-left`; check the
   closed state actually renders (exit) or use `@starting-style`
   (enter-only).
4. `pnpm eslint`, `pnpm vitest run`.

## Out of scope

- Every other `animate-in` user — drawer classes are handled by plan
  002; `qbadge-in`, `.motion-answer-reveal`, `.motion-quiz-question`,
  `qdelta` are keyed remounts (verified non-retriggerable) and stay
  keyframes.
- The nav menu's content, hover-prevention behavior, and layout.

## Verification

**Build**

- [ ] `pnpm eslint` and `pnpm vitest run` pass.

**Behavior**

- [ ] FAQ: double-click a row rapidly — the panel reverses from its
      current height, never snapping to 0 first.
- [ ] Nav menu: open, click again inside 200ms — it retargets from
      the in-flight scale.
- [ ] Reduced motion emulated: neither surface moves; opacity may
      still fade.

**Feel**

- [ ] The menu now grows from its trigger's corner — record and
      scrub: cause (button) and effect (panel) read as connected.
- [ ] The accordion settle should feel like the quart curve — steep
      start, gentle landing; if it reads flat, the curve utility
      didn't apply (check for the plan-001/002 layering trap).

## Notes

The nav menu's three defects came from three different audit angles
landing on one line — fixing them together avoids three passes over
the same class string.
