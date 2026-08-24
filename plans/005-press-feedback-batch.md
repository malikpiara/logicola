# 005 — Press feedback: one curve, no dead buttons, no hover flicker

- **Commit:** 02f1d7b
- **Severity:** MEDIUM
- **Category:** Physicality & origin
- **Estimated scope:** 2 files, ~40 lines

## Problem

Three related physicality gaps. (1) Every press scale in the app rides
the built-in `ease` (`--ease-ui`), including the Check Answer gem and
the option pills — built-ins are too weak for deliberate motion, and
`ease` was chosen for the _color_ half of these transitions, not the
transform. (2) Four interactive surfaces have hover states and nothing
on `:active` — the in-quiz chrome (`.qexit`, `.qguide-btn`,
`.qguide-close`) and the landing page's primary click targets
(`.lx-drill` rows, `.lx-resume` banner); on touch, where hover never
fires, these give zero acknowledgement. (3) `.motion-card:hover`
lifts the card itself by −2px, so the card's bottom edge can slide
out from under a resting cursor — the hover-flicker loop the catalog
names.

## Where

| File              | Lines                  | What's there                                                     |
| ----------------- | ---------------------- | ---------------------------------------------------------------- |
| `app/globals.css` | ~53–69                 | `.motion-button`: one 120ms `--ease-ui` for colors AND transform |
| `app/globals.css` | ~342–345               | `.qopt-wrap` press: `transition: transform 100ms ease`           |
| `app/globals.css` | ~678, ~1041, ~1587     | hover-only quiz chrome                                           |
| `app/globals.css` | ~2498–2513, ~2565–2575 | hover-only landing rows/banner                                   |
| `app/globals.css` | ~2068–2070             | `.motion-card:hover { translateY(-2px) }` on the target          |

### Current code

```css
/* app/globals.css:~53 */
.motion-button {
  transition-duration: 120ms;
  transition-property:
    color, background-color, border-color, box-shadow, opacity, transform;
  transition-timing-function: var(--ease-ui);
}
/* :~342 */
.quiz-immersive .qopt-wrap {
  transition: transform 100ms ease;
}
```

## Target

1. **Press curve token.** Add to the tokens block:

```css
--ease-press: cubic-bezier(
  0.25,
  0.46,
  0.45,
  0.94
); /* ease-out-quad — button press */
```

Split `.motion-button` so `transform` gets `--ease-press` at 150ms
while colors keep `--ease-ui` at 120ms (longhand
`transition-property/-duration/-timing-function` lists, aligned by
index). Point `.qopt-wrap`'s transform transition at
`150ms var(--ease-press)` too.

2. **Dead buttons get the house press.** Add `.motion-button` to the
   three quiz-chrome elements' class lists in
   `components/quiz/index.tsx` (their hover styles stay). For the
   landing rows, `.motion-button`'s scale on a full-width row would
   read as the row shrinking — instead:

```css
.lx-drill:active::before {
  background: var(--lx-hover);
}
.lx-resume:active {
  transform: scale(0.99);
  transition: transform 150ms var(--ease-press);
}
```

3. **Hover lift off the target.** Move the `-2px` lift onto the
   card's first child (or an inner wrapper) so the hover zone stays
   put:

```css
.motion-card:hover > * {
  transform: translateY(-2px);
}
```

(Verify each `.motion-card` consumer has a single wrapping child;
add one where it doesn't.)

**Why these values:** ease-out-quad at ~150ms is the catalog's
button-press row; `0.99` on a large row keeps press felt-not-seen;
existing scale values (0.97 buttons, 0.985 options) are documented
and correct — only their curve changes.

## Conventions to follow

- Press values live with their rationale comments (Malik, 2026-08-19
  on the 0.985) — preserve them.
- `.motion-button:active` (globals ~67) is the exemplar for press
  states; `.qghost` (~896) shows the pattern applied to quiz chrome.
- Tokens block at ~2014; keep the `--ease-*` naming and comment
  style.

## Steps

1. Add `--ease-press`; split the `.motion-button` longhands; update
   `.qopt-wrap`.
2. Add `.motion-button` to `.qexit` / `.qguide-btn` /
   `.qguide-close` call sites; add the two landing `:active` rules
   (inside the same `@media (hover: hover)`?— no: `:active` must work
   on touch, keep it ungated).
3. Move the card lift to the child.
4. `pnpm eslint`, `pnpm vitest run`.

## Out of scope

- The gem button's shape/colors; option state ladder tints.
- Adding hover states where none exist (footer chips are hover-free
  by design).
- shadcn `Button` variants (listed as a missed opportunity, not a
  defect — separate decision).

## Verification

**Build**

- [ ] `pnpm eslint` and `pnpm vitest run` pass.

**Behavior**

- [ ] On a touch device or DevTools touch emulation: tapping a
      landing drill row visibly acknowledges before navigation.
- [ ] Rest the cursor at a `.motion-card` bottom edge: no
      hover-in/hover-out flicker.

**Feel**

- [ ] Press-and-hold Check Answer: the down-scale now settles with a
      curve instead of the flat `ease` — felt, not seen.
- [ ] Record a press and scrub: release returns without overshoot.

## Notes

Whether the landing rows should also get the nav-menu drills'
`.motion-button` scale instead of the deeper-fill acknowledgement is
taste — the fill variant is specced because a full-width row
shrinking reads wrong, but Malik may prefer visual consistency with
the nav menu.
