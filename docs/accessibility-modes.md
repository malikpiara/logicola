# Accessibility modes — open issues

Two OS-declared display modes the app does not handle. Both are **automatic**
— the user has already set them system-wide — so neither needs a setting, a
toggle, or anything to discover. Written 2026-08-05 on branch
`color-system-exploration`, out of the answer-treatment work; entry point for
that is `redesign-handoff.md`.

**Why this matters here.** LogiCola 3 is used for teaching at US
universities, which makes WCAG conformance a blocker for adoption rather than
a polish item. Campus lab machines are also where Windows High Contrast Mode
actually turns up.

## Why this is not a user setting

The question that produced this file was whether the answer treatment (Tint
vs Weight) should be exposed as an accessibility preference. It should not,
and the reason generalises:

**Tint and Weight use the same two colours in opposite roles.** Tint marks
selection with the accent and focus with the ink; Weight does the reverse.
So "can I tell my pick from my cursor?" resolves to the same number either
way — contrast(accent, ink) = **1.60–2.67:1**, ΔL 0.13–0.27, across the six
settled sets. Anyone who cannot separate those two under one treatment cannot
separate them under the other. A toggle would move the problem, not fix it.

What does the separating for that user is the part that isn't colour: a 4px
band on the silhouette versus a 2px band outside it with a gap — identical in
both treatments.

The rule to carry forward: **an accessibility setting is warranted when the
default cannot serve someone, not when two compliant options both can.**
Offering a choice between two AA-conformant designs is theatre, and it taxes
exactly the people it claims to serve, who now have to find and understand it
before they've had a bad experience. Everything below is automatic instead.

---

## 1 · `forced-colors: active` — Windows High Contrast Mode

**Status: unhandled. Predicted severe. Not yet verified on Windows.**

### The prediction

Every distinction in the option ladder is carried by `background`:

| what                      | painted by                           |
| ------------------------- | ------------------------------------ |
| idle / hover / ruled fill | `background` on `.qopt`              |
| selection band            | `background` on `.qopt-wrap::before` |
| cursor band               | `background` on `.qopt-wrap::before` |
| focus band                | `background` on `.qopt-wrap::after`  |
| revealed fill             | `background` on `.qopt`              |

There is deliberately no border anywhere in the pixel shape modes —
`.qopt.pixelated` sets `border-color: transparent`, because a clipped border
loses its stroke on every stair (see `pixel-ui.md`).

Forced-colors overrides `background-color` and `color` with system colours
and leaves `clip-path` alone. So the expected result is that the silhouettes
survive intact while **every mark disappears**: no fill, no selection band,
no cursor, no focus ring — just text on a flat canvas, with no way to tell
picked from focused from ruled out.

The irony is exact: this treatment abandoned `border` because clipping
destroys it, and `border` is precisely what WHCM preserves.

### Proposed fix

Under `@media (forced-colors: active)`, stop trying to keep the treatment and
fall back to something the mode can render:

- Drop `clip-path` on the pills and revert to plain rounded pills.
- Carry every state on `border` and `outline`, which forced-colors keeps and
  recolours correctly.
- Use the system colours for meaning — `Highlight` / `SelectedItem` for the
  picked option, `CanvasText` for the rest.
- Reach for `forced-color-adjust: none` only where a colour is genuinely
  load-bearing and cannot be expressed in system colours. Default to letting
  the OS win.

### How to verify

Needs a real Windows machine (or someone with one) — Chrome DevTools'
`emulate` in this toolchain does not cover forced-colors. Turn on High
Contrast in Windows Settings → Accessibility → Contrast themes, then walk a
quiz: idle, hover, cursor, focused, selected, revealed, ruled out. The test
is whether all seven are still distinguishable, not whether they look good.

---

## 2 · `prefers-contrast: more`

**Status: unhandled. Lower priority than 1.**

The six settled sets sit comfortably above AA but not dramatically so, and
the marks that carry state are thin: selection is a 4px band, focus 2px,
cursor 2px.

This is the one place a **second ladder genuinely earns its keep** — not
Tint-vs-Weight, which are both ordinary AA with equivalent numbers, but a
variant that:

- pushes the selected label past AAA (7:1) on every set, not just four of
  six;
- widens the marks, since 1.4.11's 3:1 is about contrast and says nothing
  about a 2px mark being findable;
- deepens the idle fill so the option's own boundary doesn't depend on a 9%
  wash.

Because it keys off a media query, it costs the user nothing and adds no
surface to the UI. It does add a second ladder to maintain — which is the
cost a toggle would also have carried, but this time buying something a
toggle could not.

### How to verify

`prefers-contrast` is emulable in Chrome DevTools (Rendering panel), so this
one can be checked locally without special hardware.

---

## Already handled — don't redo

`prefers-reduced-motion` is done properly: `app/globals.css:345` plus the
`matchMedia` guard in `components/quiz/index.tsx:398`, and
`watercolorWash.tsx` opts out of its drift.

## Measurements these rest on

Computed across the six settled sets (A, C, J, L, N, Q) from
`redesign-handoff.md`'s palette table, in sRGB for WCAG and OKLab for ΔL:

| pair                                         | range                              |
| -------------------------------------------- | ---------------------------------- |
| ink vs surface                               | 7.34 – 12.67:1                     |
| accent vs surface                            | 4.57 – 5.66:1                      |
| **accent vs ink**                            | **1.60 – 2.67:1** (ΔL 0.13 – 0.27) |
| cursor as shipped (ink @ 45%) vs option fill | 1.96 – 2.39:1 — **fails 1.4.11**   |
| cursor as shipped vs surface                 | 2.28 – 2.87:1 — **fails 1.4.11**   |

The accent-vs-ink row is why the focus ring stands off the pill with 2px of
surface between them: separated, each mark is measured against the surface
and passes; touching, they are measured against each other and fail.
