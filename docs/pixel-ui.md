# Pixel UI treatment — reference

**Entry point for the redesign is `docs/redesign-handoff.md`;** this file is
its shape-and-iconography half.

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

Generator: `spritePts(inset)` / `spriteClip(inset)` in `pattern-lab.html`.
It emits one 32-point `polygon()` — px units on the leading edges,
`calc(100% − Npx)` mirrored on the trailing ones, so one path serves any
pill width. Points start and end on the **left edge**, which is what lets
`ringBand()` splice a hole into them. **Pixel mode** (kept for comparison
only) is the same idea at u = 8px with a fixed 2-step corner; its pill now
comes from `pixelPts()` so that one generator feeds both the silhouette and
its ring band, and the stylesheet polygon it used to rely on survives only
for the badge. **Cartridge was removed** — Sprite is the default.

The **badges** stay on the stylesheet polygon at u = 4px: filled square
chips (no outline ring — a clipped border loses its stroke on the stairs),
echoing the original LogiCola's filled abbreviation box.

## Ringing a clipped shape — and the CSS traps

A ring on a staircase silhouette is the single hardest thing in this
treatment. Three mechanisms were tried, in this order; only the third is
correct.

1. **`border`** — a clipped border loses its stroke on every step. `border`
   paints along the border-box rectangle and `clip-path` then cuts the
   corners off it. An outline on a clipped shape has to follow the
   _silhouette_, which a border cannot.
2. **`drop-shadow` on the element** — amputated by its own polygon, because
   **filter runs before clip-path** (spec order). Moving the filter to an
   **unclipped wrapper** fixes that: it then operates on the already-clipped
   child, and the shadows land free.
3. **A clipped band** — what the lab now does, and the only mechanism that
   survives every treatment. The wrapper's `::before` is filled with the
   ring colour and clipped to the outer silhouette **minus** the inner one,
   `evenodd`.

The drop-shadow version (2) failed the moment a treatment had no fill:
**`drop-shadow` traces the alpha channel, not the border-box**, so a pill
whose background is `transparent` gets its _letterforms_ outlined instead
of its silhouette. It only ever looked right because every state happened
to be filled. Two corollaries died with it — corner notches (four
orthogonal shadows dilate a rectilinear shape into a plus, leaving the
convex corners short) and the rule that any ringed state needed an
**opaque** fill (the shadow silhouette showed through glass as a slab).
The band overlaps no interior, so a ringed state's fill may now be as
translucent as it likes.

Two things carry over unchanged:

- **Hover specificity.** The generic `:hover` tint rule outranks the
  selected rule, and would repaint a selected option with the idle hover
  tint under the cursor. The selected rule must claim its own `:hover`.
- **Footprint neutrality.** Rings grow outward, so a selected pill would
  read taller than its neighbours. The generated path takes an `inset`
  argument equal to the ring width, and the pill shrinks by exactly what
  the ring adds back. **Selection changes an option's colour, never its
  size.** (An outer dark "sprite contour" was tried for weight and cut: it
  read as unexplained noise and grew the silhouette.)

  The `reserved` feedback placement is the same principle one level up — an
  option never moves under the cursor either, because the slot that carries
  a hint is always there rather than appearing between pills. Neutrality at
  the pill is worth little if the whole list jumps 48px the moment you get
  one wrong. See open decision 4 in `redesign-handoff.md`.

Splice the hole at **50% on the left edge**, where both silhouettes run
straight: the outgoing connector and the polygon's implicit closing edge
are then the same segment traversed twice, which has no area. Splice it
anywhere else and a wedge appears.

Which state wears a ring, in what colour and at what width, is a **colour**
decision, not a shape one — see the answer-treatment dial in the lab and
`color-handoff.md`. What ships today: selected = **accent-tinted opaque
interior** (14% accent composited onto the surface) + **4px accent ring**,
the third colour marking the live element as it does for the progress fill
and count line.

### Three marks, one option

An option can be focused, the multi-select cursor, and selected at the same
time. The band generator serves all three, and they are kept apart on three
axes at once — position, width and hue — because hue alone would fail WCAG
1.4.1:

| mark     | position                                    | width | colour          |
| -------- | ------------------------------------------- | ----- | --------------- |
| focused  | **outside** the silhouette, 2px surface gap | 2px   | `--qo-focus`    |
| cursor   | **on** the silhouette                       | 2px   | `--qo-focus`    |
| selected | **on** the silhouette                       | 4px   | treatment's own |

Focus and cursor share a colour deliberately: they mean the same thing
("where I am") and separate by position. `--qo-focus` is the **ink** for any
treatment that leaves the ink unspent, and the **accent** for one that
doesn't (Weight).

The focus band's radius grows by exactly the 4px it stands off (R = 28), so
it stays concentric instead of tightening at the corners. **The gap is not
decoration** — ink and accent are only 1.60–2.67:1 apart, below 1.4.11's
3:1, so the two marks may never touch; with surface between them each is
measured against the surface instead. Pill mode falls back to a plain
`outline` at the same width, colour and offset.

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
- `spriteClip` / `ringBand` are framework-free string generation — in React,
  compute once per state and set via `style.clipPath`. Don't express either
  as a Tailwind arbitrary value; both are far past the readable length.
- The ring needs a **sibling** layer, not an ancestor: a `clip-path` on a
  wrapper clips its whole subtree, so putting the band there deletes the
  label and badge along with the pill's interior. In the lab it's the
  wrapper's `::before`.
- Tailwind: `border-[var(--x)]` is ambiguous (width vs colour) and is
  silently dropped — always `border-[color:var(--x)]`.
- The lab's option markup is a faithful mirror of `components/option.tsx`'s
  immersive mode (badge + label pill, hint attached beneath the pill that
  earned it); port the classes state-for-state: rest / `is-selected` /
  `is-ruled` / `is-revealed`.
