# Handover — 2026-08-06

Written at the end of the session on branch `color-system-exploration`.
Entry point for the redesign as a whole is still **`redesign-handoff.md`**
(read its Caveats first); `pixel-ui.md` is the port contract. This file is
only "where we got to and what to do next". Supersedes the pick-up list in
`session-handover-2026-08-05.md`.

## Pick up here (Malik's queue, in his order)

**1 · The primary button.** Redesign/rethink the primary CTA ("Start
Quiz" / "Check Answer" / "Next Question") — potentially pixelise/sprite
it. Everything it needs is in `pixel-ui.md`: the sprite construction
(R=24 is pill scale), the ring-band machinery if it ever needs a focus
treatment, and the scaling law. Note the CTA today is ink-filled with
surface text, the one solid-ink object on the card — whatever the shape
becomes, that colour role is load-bearing (it is the only thing that
outranks the options).

**2 · The mobile view.** Redesign + UX pass + add a progress bar. Known
inputs: Set R's 3×6 → 2×9 container query is in but 640px is a
placeholder ("desktop judgement" caveat in `redesign-handoff.md`); the
guide's mobile surface is a bottom sheet in the app and was explicitly
deferred; the progress indicator decision is already made (**Line,
continuous** — never cells — see `pixel-ui.md`, driven by the scored run
becoming the default mode). The exhaustive mobile pass was deliberately
parked as its own exercise — this is it.

**3 · Still cheap, still unblocking: Roboto Flex in the lab.** Carried
from yesterday, still not done. Every type judgement — including how the
decided chip corner sits against letterforms — is being made in Avenir
Next, which the app does not ship.

## Decided today

|                      | Decision                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Notation chip corner | **Sprite 4px** — the keycaps' own clip, `spriteClip(0, 8)`, both chips. Dial removed (Rectangle / Sprite 2px / a brief Gem candidate all cut). |
| Set N guide          | **No guide button** — N has no guide in the app and none in the 2008 original (no `*H` Info block; its `*h` is display control, not text).     |

Carried WITH the chip decision, not yet done: **the small instances need
a per-size tweak** — L4's rule chips and R's table chips run ~20px with
1px vertical padding, so the 4px step sits against the letterforms. The
keycap survives the identical clip at 22px because it is padded. Levers:
room, or a smaller radius on the same grid. Re-judge in KaTeX at port
time. Full note in `pixel-ui.md` § Notation chips.

## Done today

- **The per-set guides are real** (yesterday's blocker 1). `SET_GUIDES`
  in the lab mirrors `wffGuide.tsx` for A, C, J, L, Q; R's 18-fallacy
  table is GENERATED from the R sample's own options so guide and hint
  share one source. Panel scrolls; guide notation runs through the same
  chip/emphasis machinery as hints. Guide-panel judgements are unblocked.
- **Provenance settled** (and corrected by Malik): Q's guide descends
  from the 2008 `*H` Info block; A, C and J's guides are Malik's lift of
  the sets' OWN 2008 feedback text (verbatim in the decoded DSL); R's
  table is the only guide with no 2008 ancestor at all. `*H` exists in
  B, D, E, F, G, I, K, M, O, Q — not N, not R.

## New open item

**Does Set R keep its guide at all?** (decision 13 in
`redesign-handoff.md`.) Pure textbook addition, and a pedagogical case
against handing a recognition drill all eighteen definitions one click
away. Raised by Malik, deliberately not decided. Decide it before
polishing the 18-row-table layout, since removal would dissolve that
problem.

## Still open (inherited)

- **Feedback placement** (decision 4) — `reserved` is the only mode that
  holds the palette still; costs 391px of permanent gap on Set R.
- **Hint identifier**: Run-in vs Heading.
- **Answer treatment**: Tint / Accent / Invert / Weight — Tint
  recommended, not decided.
- **Set R's colour** (the only unsettled palette) and the
  base-promotion question (A7/L4/N10 naming).
- Finding 4 of the audit: the original's "TO ANSWER: click a fallacy or
  type its abbreviation", still not restored.
- Everything in `accessibility-modes.md`.

## Tooling note (carried)

The preview pane serves stale frames after file edits; only a changed URL
(`?v=N`) reliably forces a fresh document. Trust measurements over
pictures.
