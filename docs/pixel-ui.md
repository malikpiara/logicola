# Pixel UI treatment — reference

Status: **question-screen treatment decided in the lab, not yet ported;
first components ARE ported** — the NEW badge (`components/newBadge.tsx`),
the footer's social icons, and the FAQ caret ship in the app as of
2026-08-03. The working lab is `docs/pattern-lab.html` (View → Question /
Components); this document is the treatment's contract, so it can be reused
and ported without re-discovering its rules. Colour decisions live in
`color-handoff.md` / `color-system.md`; this file is about **shape,
iconography and pattern placement**.

## The one rule

> **Straight edges stay ruler-straight. Only curves rasterise — as regular,
> symmetric stairs.**

Learned from pixeliconlibrary.com's SVGs (their play-triangle's hypotenuse
steps uniformly, one grid unit at a time; nothing jitters) — and confirmed
the hard way: a seeded random crenellation along the pills' straight edges
was built first and reverted as jarring. Irregular jitter on a straight edge
reads as noise or damage; rasterisation is _regular_ quantisation of curves.

## Sprite silhouette (the decided answer shape)

A pill's rounded corner is a quarter-circle of radius **R = 24px** quantised
onto a **u = 4px** grid by midpoint sampling — each 4px row takes the
circle's half-width at the row's middle, rounded to the grid:

```
inset(k) = R − round( √(R² − (R − (k+½)u)²) / u ) · u
→ profile [16, 8, 4, 4, 0, 0]   (four distinct stairs per corner)
```

Generator: `spriteClip(inset)` in `pattern-lab.html`. It emits one 32-point
`polygon()` — px units on the leading edges, `calc(100% − Npx)` mirrored on
the trailing ones, so one path serves any pill width. **Pixel mode** (kept
for comparison only) is the same idea at u = 8px with a fixed 2-step corner,
implemented as a static stylesheet polygon; **Cartridge was removed** —
Sprite is the default.

The **badges** stay on the stylesheet polygon at u = 4px: filled square
chips (no outline ring — a clipped border loses its stroke on the stairs),
echoing the original LogiCola's filled abbreviation box.

## Selection mechanics — and the four CSS traps

Selected state = **accent-tinted opaque interior** (14% accent composited
onto the surface) + **4px accent ring**. The ring is the set's accent, per
the colour system: the third colour marks the live element (progress fill,
count line, the pick).

The traps, each of which will bite any reimplementation:

1. **A clipped border loses its stroke on every step.** `border` paints
   along the border-box rectangle; `clip-path` cuts the corners off it.
   Outlines on clipped shapes must follow the _silhouette_ — drop-shadows do.
2. **Filter runs before clip-path** (spec order). A drop-shadow ring on the
   clipped element is amputated by its own polygon. The ring lives on an
   **unclipped wrapper** (`.qopt-wrap.ring`), whose filter operates on the
   already-clipped child.
3. **Drop-shadows behind translucent fills read as a solid slab.** The rest
   state's 9% tint is glass; the shadow silhouette shows straight through
   it. Any state that carries shadows must use an **opaque** fill
   (pre-composite the tint onto the surface colour with `color-mix`).
4. **Hover specificity.** The generic `:hover` tint rule outranks the
   selected rule and would flip the fill back to glass (re-triggering trap
   3). The selected rule must also claim its own `:hover`.

**Footprint neutrality:** drop-shadow rings grow outward, so a selected
pill would read taller than its neighbours. The generated path takes an
`inset` argument (4px = ring width): the selected pill's silhouette shrinks
by exactly what the ring adds back. **Selection changes an option's colour,
never its size.** (An additional outer dark "sprite contour" was tried for
weight and cut: it read as unexplained noise and grew the silhouette.)

## Iconography

Source: **pixeliconlibrary.com** — 24-unit grid, polygon-based, same grammar
as the Sprite silhouettes. Conventions:

- Inline SVG with `fill="currentColor"` and `aria-hidden="true"` — icons
  take the tone of the text they sit in, so they obey the colour system for
  free (hint icons render in the error tone, badge marks in badge colour).
- Sizes: **18px** beside body/hint text (baseline-tucked, `margin-right`
  ~9px), **12px** inside the 32px badges.

In use:

| Icon   | Library id                                | Where                                                 | Meaning                                                                                                                                                                  |
| ------ | ----------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lamp   | `minds`                                   | leads every hint paragraph                            | guidance, not scolding                                                                                                                                                   |
| ✕      | `times`                                   | badge of a ruled-out option                           | replaces the index — only on options the learner actually guessed, so the mark stays personal; options merely receding at reveal keep their number                       |
| ✓      | `check`                                   | badge of the revealed correct answer                  | its ~2-unit stroke matches `times`, so the badge marks read as one family; the library's `check-solid` is the heavier variant if the mark ever needs more weight at 12px |
| Book   | `book-heart`                              | the Guide toggle                                      | heart-on-cover over the plain `book` — the reference guide is the loving part of the product; `book`, `book-solid`, `book-heart-solid` also pasted and available         |
| ◀ ▶    | `angle-left-solid` / `angle-right-solid`  | keycap arrow glyphs                                   | the library's own chevrons; replaced an earlier reuse of `play-solid`                                                                                                    |
| Caret  | `angle-down-solid`                        | FAQ accordion trigger (`components/ui/accordion.tsx`) | replaced the lucide ChevronDown; same size + rotate-on-open contract (NB Tailwind v4's `rotate-180` sets the standalone `rotate` property, not `transform`)              |
| Brands | `reddit`, `twitter`, `github`, `linkedin` | footer icon row (`components/footer.tsx`)             | fetched from the library repo (`icons/SVG/brands`); LinkedIn newly added to the row                                                                                      |

Wanted (to be pasted from the library when needed): **arrow-right** (Next
Question CTA). The repo is directly fetchable —
`raw.githubusercontent.com/hackernoon/pixel-icon-library/main/icons/SVG/…` —
so future icons need not be pasted by hand.

## Option-chip shapes (kept as affordances)

An `Option chip` control offers two silhouettes for the option-index chips
in the pixel modes (the pill reference keeps its circle). Fills and state
colours (✓ / ✕ / number, accent when selected) are untouched:

- **Square** — the shipped chip (sprite corners, `spriteClip` at u=4).
- **Diamond (puffy)** — MaterialShapes' puffy diamond rasterised onto the
  chip's 4px grid: row widths 2·4·6·8·8·6·4·2 cells, the straight-edged
  pixel diamond fattened one row at the waist. It happens to echo the ◇
  of the modal-logic content. (A clam-shell arch was tried and cut.)

## The NEW badge — DECIDED: Gem, ported to the app

The `NEW` pill in the exercises nav, prototyped in its real context (white
menu surface, mono nav titles) in the lab's **Components view** (the
specimen moved out of the start/question flow). Fill moves from
Tailwind fuchsia to the system's own magenta **`#BD00AD`** (C and L's accent,
live in the catalogue); white text, mono bold 10px, 0.08em tracking.
Variants, silhouette the only variable:

- **Pill** — ships today; kept as the reference row.
- **Pixel pill** — the pill's semicircular caps (R = 12, full half-height)
  rasterised. The badge grid is too coarse at u=4 (the cap collapses to one
  stair), so the caps sample at **u=2**, profile [8, 4, 2, 2, 0, 0] —
  precedented, the icon library itself rasterises at 1 unit.
- **Sprite · lip** — the R=8 `spriteClip` chip plus the keycaps' 2px bottom
  lip in **`#8D0381`** (N10's accent, `#BD00AD`'s darker sibling), so the
  sticker materiality stays inside the colour system.
- **Gem ★ — DECIDED and shipped** as `components/newBadge.tsx`, used by
  `navTopic.tsx` (replacing the fuchsia `flower-tag`) and the footer's
  Keyboard link (replacing the green `rounded-full` pill). Elongated octagon
  with two-step stair chamfers: the puffy-diamond idea adapted to a shape
  that must hold text.

Cut: a **tag** variant (square body, stair-stepped sale-tag point) — didn't
work in context.

## Progress indicator — DECIDED: Line by mode

**Line (continuous) is the default**, because the scored run is becoming the
app's default mode and its progress is genuinely continuous: point values
differ per set (+5/+7/+8), levels change what a miss costs, and the bar must
animate **down** as well as up when points are lost. Cells were considered
for it (10 points per cell) and rejected on those grounds.

**Cells are for the 10-question count mode only**, where progress really is
discrete: ten blocks, 8px tall with 4px gaps, full-bleed at the card's top —
**done** = accent, **current** = accent at 40% (a half-tone cursor),
**remaining** = ink at 12%. M3's segmented/stop-indicator idea taken
literally.

Also rejected: a square-wave rasterisation of M3 Expressive's wavy indicator
(regular and grammar-legal, but read as ornament where the others read as
information). Possible motion once ported: count mode's current cell blinking
gently, cursor-style; the scored line animating width both directions.

## Guide button and reference panel

The chrome piece that still spoke another product's language (white chip,
lucide icons). Redesigned in-system:

- **Button**: ink-glass chip (9% fill, 15% hover), `book-heart` icon at 16px,
  label `GUIDE` in the mono eyebrow voice (11px, 0.12em tracking), sprite
  corners at **R=12** (profile [4, 0, 0] — `spriteClip` takes the radius as
  its second argument; R=24 is pill scale, R=12 chip scale, R=8 the 32px
  close chip).
- **Panel**: flat overlay sheet in the set's own surface colour — no white,
  no shadow — with a 2px ink-18% rule for its left edge, `REFERENCE` eyebrow,
  rows of notation chip + description, and a sprite-cornered ✕ close chip.
  Needs `z-index` above the question content: DOM order alone paints the
  pills over it.
- In the app the desktop guide _pushes_ the workspace aside (vaul sheet);
  the lab mocks the overlay only — the push behaviour and surface colour
  question for the real `WffGuide` content is decided at port time.

## Keyboard hints

Pixel keycaps instead of prose. `[1] – [4] picks · [◀][▶] moves · [enter]
checks`: each cap
is a 22px sprite chip (R=8 corners) in ink-glass with a **2px darker bottom
lip** (`border-bottom`, ink at 35%) — the 8-bit reading of key depth while
staying flat colour. The bottom edge is straight, so the lip survives the
clip everywhere except the corner stairs, which shortens it pleasingly. Verb
labels ("picks", "checks") replace the app's full sentence ("You can use
keys 1 to 4 or …") — the caps carry the what, the verbs carry the so-what.

## Pattern placement on the question screen

The start screen shows the pattern off (panel treatment). The question
screen **banishes it to a footer band**: a fixed **112px** strip at the
card's foot, with the card reserving **152px** bottom padding so all
content — footer controls included — sits on clean surface. The pattern
frames the work; it never sits under text. In the lab each view keeps its
own centre treatment (`state.centre` vs `state.centreQ`), footer being the
question screen's default.

## Porting notes

- The quiz card already flows all colour through `--quiz-surface` /
  `--quiz-fg` / `--quiz-accent`; this treatment adds no new colour inputs
  (the error tone comes from the colour system's rose-mix or tier-brick
  decision, still open in `color-handoff.md`).
- `spriteClip` is framework-free string generation — in React, compute once
  per (selected) state and set via `style.clipPath`. Don't express it as a
  Tailwind arbitrary value; it's far past the readable length.
- Tailwind: `border-[var(--x)]` is ambiguous (width vs colour) and is
  silently dropped — always `border-[color:var(--x)]`.
- The lab's option markup is a faithful mirror of `components/option.tsx`'s
  immersive mode (badge + label pill, hint attached beneath the pill that
  earned it); port the classes state-for-state: rest / `is-selected` /
  `is-ruled` / `is-revealed`.
