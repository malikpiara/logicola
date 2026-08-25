# Handover — 2026-08-05

> **Superseded by `session-handover-2026-08-06.md`** — kept for the
> decision log and the two rules below.

Written at the end of a long session on branch `color-system-exploration`.
Entry point for the redesign as a whole is still **`redesign-handoff.md`** —
read its new **Caveats** section first. This file is only "where we got to
and what to do next".

## Pick up here

**1 · Wire the real per-set guides into the lab.** ~~This is the blocker.~~
**Done 2026-08-06** — `SET_GUIDES` in the lab, mirrored from
`wffGuide.tsx`; N hides the button (no guide in the app); R's table is
generated from the R sample's own options. Items 2 and 3 are unblocked.
The guide panel currently shows the same modal-logic reference
(`☐A ◇A ∼◇A (A ⊃ B)`) for every set — verified identical across J, Q, R, C
and L4. It is Set J's guide wearing every other set's palette, so on Set R
the fallacy quiz explains necessity operators. The app already keys per-set
guides off `GUIDE_SUBSET_IDS` in `components/quiz/wffGuide.tsx`, including
the 18-fallacy table for Set R. Until the lab pulls that, **any judgement
about the guide panel is being made against the wrong material** — the same
trap as the Q and R sample questions before they were made real.

**2 · Then the pill redesign** (the guide's notation chips and their
relatives). The Notation chip dial is already in — `Rectangle` (today) /
`Sprite 4px` / `Sprite 2px` — but see 1 before judging it.

**3 · Put the lab on Roboto Flex** and re-judge the type decisions. See the
Caveats section of `redesign-handoff.md`. This is cheap and unblocks
trusting any of the typography work.

## Decided today

|                       | Decision                                                                                                         |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Emphasis in hints     | **Rule** — 2px accent underline. Band / Marker / Sprite / Accent kept for comparison; Italic and Spaced retired. |
| Hint identifier       | **Full name, never the code.** Run-in vs Heading still a dial.                                                   |
| Emphasised words      | **`must` only**, not the `must`/`probably` pair.                                                                 |
| Clause casing         | Sentence case via `::first-letter` — presentation only, data stays verbatim.                                     |
| Multi-select          | Announced: "More than one answer can be right."                                                                  |
| Set R / Set Q samples | Real, from `content/sets/`. Both are grid + multi-select.                                                        |
| Set R labels          | Terse grid labels restored (`Genetic`, `Post hoc`, `Appeal to crowd`).                                           |

## Still open

- **Feedback placement** (decision 4 in `redesign-handoff.md`) — `reserved`
  is the only mode that holds the palette still, and it now costs 391px of
  permanent gap on Set R. Not chosen.
- **Hint identifier**: Run-in vs Heading.
- ~~**Notation chip corner**~~ — **DECIDED 2026-08-06: Sprite 4px**, the
  keycap clip, both chips; other options (Rectangle, Sprite 2px, and a
  briefly-added Gem) removed from the lab. Still owed: a careful per-size
  tweak for the smaller instances (L4's rule chips, R's ~20px table
  chips) before the port.
- **Does Set R keep its guide at all?** (new, 2026-08-06) — R's table is
  the only guide with no 2008 ancestor, and there is a pedagogical case
  for a recognition drill not offering all eighteen definitions one click
  away. Raised by Malik, deliberately not decided.
- **Answer treatment**: Tint / Accent / Invert / Weight — Tint recommended,
  not decided.
- Finding 4 of the audit: the original's _"TO ANSWER: click a fallacy or
  type its abbreviation"_, dropped and not restored.
- Everything in `accessibility-modes.md`.

## Two rules learned the hard way today

**Inline content must stay in one inline formatting context.** A flex
container makes every inline child its own unwrappable box. This bit twice —
first scrambling the clause list's word order the moment a clause contained
an `<em>`, then again in the hint head. Neither was visible in a DOM check;
both were visible in a screenshot.

**A pointer is only a pointer if its referent survives.** The two-letter code
chip pointed at the cell's badge — and ruling an option replaces that badge
with ✕, so the code stopped existing at the exact moment the hint showed it.

## Tooling note

The preview pane wedged repeatedly and served stale frames; `location.reload()`
and `navigate` both bounced off it, and only a changed URL (`?v=N`) forced a
fresh document. Computed-style checks stayed accurate throughout, screenshots
did not. **Trust the measurement over the picture**, and if a screenshot
disagrees with a stated result, suspect the pane first.
