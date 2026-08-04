# Quiz redesign — handover

**Start here.** This is the entry point for the redesign work — the colour
system, the pixel UI treatment, and porting both into the app. Written
2026-08-03 on branch `color-system-exploration` (pushed through `2c90ece`).

## The three reference docs, and what each is for

| Doc                    | Role                                                                                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`pixel-ui.md`**      | The **shape and iconography contract** — sprite silhouettes, the four CSS traps, icon table, progress/keycap/guide specs. Port from this, not from memory. |
| **`color-handoff.md`** | The **palette log** — which palette each set gets, the accent tier and its three gates, and every retired candidate with its reason.                       |
| **`color-system.md`**  | The **reasoning archive** — original LogiCola colour extraction, the Duru/ColorMoods method, ranking history. Read when you need _why_, not _what_.        |

The workbench is **`docs/pattern-lab.html`** — open it directly in a browser,
no build step. Three views: **Start**, **Question**, **Components**.

## What has actually shipped

Committed in `37a038f` / `2c90ece` and live in the app:

- `components/newBadge.tsx` — the gem-silhouette `NEW` badge, used by
  `navTopic.tsx` and the footer. Replaced two inconsistent badges.
- Footer social icons in pixel grammar, LinkedIn added, Twitter → X.
- `components/ui/accordion.tsx` — FAQ caret is the library's pixel chevron.
- `components/currentYear.tsx` — live copyright year via
  `useSyncExternalStore`.

**Nothing else has been ported.** In particular `getQuizScreenColors` in
`components/quiz/index.tsx` still holds the OLD palette, and the quiz screens
still look as they always did.

## The decided palette, ready to port

Six of seven sets are settled. This table is the port — drop it straight into
`getQuizScreenColors`, where `countColor` is the accent and `foregroundColor`
is the ink:

| Set | Lab id   | Surface     | Ink       | Accent    |
| --- | -------- | ----------- | --------- | --------- |
| A   | A7       | `#FFABC6`   | `#4A1040` | `#674900` |
| C   | C        | `#E7F099`   | `#02302C` | `#BD00AD` |
| J   | J        | `#E6ACF4`   | `#1C3601` | `#674900` |
| L   | L4       | `#CFF6DD`   | `#3F0167` | `#BD00AD` |
| N   | N10      | `#9EDAFF`   | `#4A1040` | `#8D0381` |
| Q   | Q        | `#D9CCF9`   | `#3E1060` | `#745400` |
| R   | **open** | R / R2 / R3 | `#190B45` | `#1F0D92` |

Set Q is matched by `subSet.id === MEANINGS_AND_DEFINITIONS_SUBSET_ID`, not by
name — that special case must survive the port.

A draft of this port was written and deliberately reverted (the prototyping
moved to the lab instead). It changed only `getQuizScreenColors` plus three
small treatments: selection marked in the accent rather than an ink tint, the
question header in the start screen's mono eyebrow voice, and `1 OF 10` in the
accent. Redoing it is ~30 lines.

## Open decisions

**Blocking the port:**

1. **Set R.** The only unsettled set, and the interesting one: its orange has
   _no ancestor_ in the original LogiCola — the 2008 binaries contain no
   orange at all. So the question is really "does Set R stay orange?"
2. **Promote bases?** `A7`, `L4`, `N10` are family bases carrying variant
   numbers, because the plain letters `A`, `L`, `N` now belong to _retired_
   schemes. Renaming would put two colour systems under one label — the trap
   two different `A7`s already sprang. One decision covering all three.

**Open in the lab** (toggles are live in the Question view — flip and judge):

3. **Error tone** — `Rose mix` (what ships: `#f43f5e` mixed toward the ink,
   the same rose on every set) vs `Tier brick` (a per-set red derived at hue
   29° through the accent tier's gates). The last off-system colour.
4. **Notation chips** — ink tint vs accent tint for KaTeX chips in hints.
5. **Option chip** — square vs puffy diamond.
6. **Focus rings** still use the ink; the accent may be more correct now that
   it marks selection.

**Housekeeping:**

7. **`SET_SURFACES`** in the lab is stale in four of six entries (it feeds the
   quilt accent pool, so fixing it changes every pattern render — do it
   deliberately, not incidentally).
8. **The two docs disagree on the stimulation ceiling** — `color-handoff.md`
   says 0.45–0.65, `color-system.md` says 0.45–0.58. Reconcile before the
   port.

**Explicitly deferred by Malik:** the mobile bottom sheet / guide pane
surfaces, and the end screen's treatment pass.

## Rules that took real work to learn

Do not rediscover these:

- **Straight edges stay ruler-straight; only curves rasterise**, as regular
  symmetric stairs. A seeded random crenellation was built and reverted.
- **Gate 3**: an accent must sit ≥ ~.10 OKLCH-L above the ink. No contrast
  checker measures this — WCAG scores each colour against the _background_,
  never one foreground against the other, which is how a palette passed every
  check with an accent .03 from its own ink.
- **Pale ≠ low-contrast.** Contrast is lightness; how committed a surface
  feels is chroma, and nothing measures chroma.
- **Near the lightness ceiling, hue stops registering** — two surfaces 55°
  apart sat .045 apart at L .95, because the gamut allows almost no chroma
  there. The fix for "these look the same" is lightness, not hue.
- **`filter` runs before `clip-path`** — a drop-shadow ring on a clipped
  element is amputated by its own polygon.
- Tailwind: `border-[var(--x)]` is ambiguous and silently dropped; write
  `border-[color:var(--x)]`.

## Method note

The palette metrics live in the lab itself (OKLCH utilities, the ported
ColorMoods stimulation model, the Colour studio). The global
`two-color-harmony` skill holds the Duru framework behind them. **Malik's eye
leads and the metric follows** — it has overruled the numbers more than once,
correctly.
