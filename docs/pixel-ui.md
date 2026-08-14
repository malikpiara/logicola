# Pixel UI treatment — reference

**Entry point for the redesign is `docs/redesign-handoff.md`;** this file is
its shape-and-iconography half.

Status: **PORTED — the question-screen treatment ships in the app as of
2026-08-07** (see "PORTED TO THE APP" in `redesign-handoff.md` for the
file map; generators live in `lib/pixel.ts` with byte-parity tests
against this lab's own output). The working lab is
`docs/pattern-lab.html` (View → Question / Components); this document
remains the treatment's contract — consult it before changing shipped
shapes, not after. Colour decisions live in
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
  that must hold text. **Slimmed 24px → 20px** in the nav lab (Malik,
  2026-08-14): h-5, 10px side padding, mono bold 9px — the 4px stairs
  still read at 20px (8px of chamfer per corner against the height).

Cut: a **tag** variant (square body, stair-stepped sale-tag point) — didn't
work in context.

## Progress indicator — DECIDED: Line (and only Line, this release)

**Line (continuous)**, because the scored run's progress genuinely is:
point values differ per set (+5/+7/+8), levels change what a miss costs,
and the bar must animate **down** as well as up when points are lost.
Cells were considered (10 points per cell) and rejected on those grounds —
and since **the scored run replaced count mode for the release**
(2026-08-06), Cells has no surfaced home at all; its renderer sits
dormant in the lab for the future quiz-mode reform.

**Mobile pixelisation (decided with the mobile chrome):** in the header
row the bar has free ends, and those are its only curve-analog — they
take sprite caps at **R=4 on the 2px grid**. The fill advances in whole
**4px steps** (`width: round(down, P%, 4px)`, plain `%` first as the
fallback), so progress ticks like a loading bar drawn in pixels and the
leading edge never antialiases. The long edges stay ruler-straight — no
crenellation. Desktop's 6px hairline bleeds off the card edges (no free
ends): unclipped, unquantised.

**Animate the property, not the width** (2026-08-12, ported). The
quantised bar's 500ms advance transitions **`--qp`**, registered with
`@property { syntax: '<percentage>' }` — never `width`. A `width`
transition whose two endpoints are `round()` expressions has no
interpolation available, so the engine falls back to a single discrete
flip partway through the window: the bar looked like it snapped, not
advanced. Registering the custom property gives the interpolation a home,
and `round()` re-quantises it every frame — so the fill genuinely _steps
across the 4px grid_ over the half second (measured: 21 distinct widths,
all multiples of 4, decelerating 48 → 4px as `ease-out-quart` demands).
The general rule, worth carrying past this bar: **when a computed value
won't animate, animate its input.** Degrades cleanly both ways — no
`@property` loses the motion but keeps the quantisation; no `round()`
falls back to the plain `%` width. The desktop hairline is a plain
percentage and still transitions `width` directly.

**Cells are for the 10-question count mode only**, where progress really is
discrete: ten blocks, 8px tall with 4px gaps, full-bleed at the card's top —
**done** = accent, **current** = accent at 40% (a half-tone cursor),
**remaining** = ink at 12%. M3's segmented/stop-indicator idea taken
literally.

Also rejected: a square-wave rasterisation of M3 Expressive's wavy indicator
(regular and grammar-legal, but read as ornament where the others read as
information). Still unported: count mode's current cell blinking gently,
cursor-style.

## Damage on a miss — DECIDED: Hit flicker (Direction A)

Judged in **`docs/damage-bar-lab.html`** (2026-08-12), six directions
side by side in all seven set palettes. Locked: **Direction A, "hit
flicker"** — on a scored miss the fill blinks **off** twice in hard cuts
(`opacity` 1 → 0 → 1 → 0 over 340ms, `linear`, no fades), and only then
does the bar pay the penalty. The held-back advance is a
`transition-delay: 340ms` on the fill, so the flicker reads as the hit
and the retreat reads as the cost — two beats, not one blur. The
reference is sprite invulnerability frames (Mega Man, Zelda,
Castlevania); hard cuts are the whole point, since a fade reads as a
render glitch rather than a hit.

Rejected, with the reason worth keeping: **Ghost drain** (SF II) and
**Ember tip** (Halo shield break) both animate the _lost segment
specifically_, which states the cost more literally — reconsider them if
the points economy ever needs teaching rather than just signalling.
**Knockback** (screen-shake juice) moves the bar off its own baseline,
which the pixel grammar can't spend. **Track pulse** is the quietest and
the only one legible at the desktop hairline's 6px. **Pixel crumble**
was cut in judging: too literal, and it breaks the continuous-line rule.

Three constraints the port must keep:

- **Two flashes, never three.** WCAG 2.3.1 caps at three per second; two
  hard off-pulses in 340ms sits inside it with margin, and the flashing
  area is a 10px strip — far below the harmful-area threshold. Any
  future variation is bounded by that, not by taste.
- **Scored mode only.** In count mode the bar means _completion_, and a
  miss doesn't take completion away — flashing it would signal a loss
  that didn't happen. `flashBarDamage()` returns early on
  `mode.kind !== 'score'`.
- **The bar is never the only signal.** It stays `aria-hidden`; the
  numeric points label is the accessible reading, and the option's own
  miss treatment carries the verdict. Under `prefers-reduced-motion` the
  flicker and the held-back delay both drop and the fill simply _is_ at
  its new length.

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

## Notation chips — DECIDED: Sprite 4px, with a small-size caveat

The tinted boxes holding logic — the guide's `☐A`, the hint's `∴ A is
true`, and every inline `code` chip in guide prose. **Decided (Malik,
2026-08-06): the keycaps' own clip, `spriteClip(0, 8)` (R=8/u=4, one 4px
stair), on all of them** — they are one object doing one job, and they now
speak the same grammar as the chrome. Rejected on the way: Rectangle (the
app's 7px radius, the status quo), Sprite 2px (finer grid), and a Gem
candidate (the NEW badge silhouette, `pixelPts(0, 4)`).

**Not yet solved, and owed before the port: the small instances.** L4's
rule chips and R's table chips run ~20px tall with 1px vertical padding,
so the 4px step sits against the letterforms — the keycap survives the
identical clip at 22px only because it is a padded box (the step eats
padding, never glyph). Tweak levers, per the scaling law: room (padding,
where the inline line box allows), or a smaller radius on the same 4px
grid. And the app sets these chips in KaTeX, not the body face — re-judge
there.

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

## Mobile chrome — the phone frame's spec (built 2026-08-06)

The lab's `Question · M` / `Start · M` views. Anatomy, top to bottom:

- **Header row, sticky as a unit** (Duolingo/Brilliant anatomy): bare
  pixel **✕** left (18px glyph, ink@60%, NO plate — but a full 44×44 tap
  box) · **progress bar** filling the middle (10px tall, sprite caps,
  quantised fill — see Progress) · **icon-only Guide chip** right (44×44
  sprite chip, book-heart at 18px, label dropped, `aria-label` kept).
  Row runs 8px from the card edges; the bar takes a **−13px optical
  margin** against the ✕ — (44−18)/2 of invisible whitespace in the bare
  glyph's box — so the perceived gaps match, and +13px right margin when
  the Guide chip is absent (Set N) so the endpoints mirror.
- **Content**: the question screen unchanged; the card's own narrowing
  fires `#questionView`'s container query (640px threshold still a
  placeholder). Prompt sizes in **cqw, not vw** (3.6cqw, 20px floor).
- **Footer, sticky**: count hidden (scored run reads on the bar), the
  CTA full-width. Models the app's collapsed vaul sheet. One divider
  only — the footer's own border-top; the in-flow hr is desktop's.
- **No pattern on question screens** (`Clean` treatment — actually skips
  generation). The pattern's phone home is the start screen, at **0.6
  scale**. The centre dial's "Off" is now labelled **"Full bleed"** —
  its old name caused a real regression.
- **Exit lives in the card** (the ✕), replacing `ExerciseNavbar`'s white
  bar — adopting this reclaims a full navbar of phone height.
- **Not modelled yet**: the expandable guide bottom sheet (the app's
  180/460/full snaps) — the lab fakes a full-bleed overlay; and the
  scored run's level dial on the start screen.

## Porting traps — learned in the lab, will bite in the app

- **`overflow: hidden` is a sticky containing block.** The app's quiz
  card uses `overflow-hidden` to clip the progress bar to its rounded
  corners — any sticky chrome inside it will silently never pin. Use
  `overflow: clip` (clips without creating a scroll container).
- **`container-type: inline-size` captures absolute descendants** (layout
  containment makes it their containing block). Moving the app's
  absolutely-positioned progress line inside a size container re-anchors
  it. The lab reparents the header-row elements per view for this reason;
  the app needs either the same split or a header row at all breakpoints.
- **`vw` lies inside a narrow card** — the lab's prompt clamp read the
  workbench viewport and rendered a size no phone shows. Any `vw`-sized
  type in the quiz should become container-relative (`cqw`) at port.
- **Gate every `:hover` behind `@media (hover: hover)`** or Tailwind's
  default v4 gating — un-gated hover tints stick after taps on touch and
  read as selection state.
- **Rendering mode is part of the material**: the lab was in quirks mode
  its whole life (no doctype) and standards mode changed real things
  (table colour inheritance). Prototype and app must share the mode —
  and pre-2026-08-06 lab measurements are quirks numbers.

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
