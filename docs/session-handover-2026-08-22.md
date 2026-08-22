# Session handover — 2026-08-22

The mobile bottom-sheet + guide-content redesign: explored in two labs,
decided dial by dial with user testing, and PORTED. Working tree carries
the full port, uncommitted (Malik commits).

## The two labs (the decision record)

- `docs/sheet-lab.html` — sheet interaction. Six anatomies, dragger,
  gesture, morph, ✕ explored; decision log in its notes overlay.
- `docs/guide-lab.html` — guide content for Sets A/Q/R. Directions per
  set, type audit, provenance work; decision log in its notes overlay.
- Serve via `cd docs && python3 -m http.server 8123` + cache-buster.
- The labs stay as ARCHIVE: the product is now the source of truth; the
  lab files were not back-synced with late wording tweaks.

## Decisions (all Malik's, dated in the lab notes)

Sheet: **classic anatomy** (grabber above CTA) · **iOS-narrow 36×5
dragger** · **CTA hides when open as a 200ms opacity+blur morph** ·
**flick zone** (bottom 30%, velocity-gated) · **✕ chip kept** ·
**fit-to-content expanded snap** (no full snap when the guide fits).
Retired along the way: split/corner/merged/scroll-lock anatomies, code
index (killed by testing — nobody recalls fallacies by code), chevron +
pixel-caps draggers.

Guide content: **zebra rows with pixel-stair corners** (brand rounds by
raster, never border-radius) · **∴ embolded/enlarged inside its chip** ·
**guide type on the hint tier** (15px body — was 13px, confirmed by both
the Butterick/Santa Maria audit AND user testing) · **passage floor
21px** · **Set Q: fresh original examples, table first, definition prose
REMOVED from the sheet** · **Set R: fresh original descriptions on the
shipped linear layout** · **Set A guide unchanged** (Gensler's 2008 \*H
screens kept the schema abstract despite knowing each question's
letters — revealed pedagogy; the options already do the letter-mapping).

## The port (this working tree)

- `components/ui/drawer.tsx` — narrow grabber; drag-then-click guard
  (click lands after pointerup, so the "was this a drag?" answer lives
  in a ref across that gap).
- `components/quiz/index.tsx` — qsheet-head morph layers; ✕ chip
  (`.qsheet-x`, CLOSE_CHIP_CLIP); flick-zone touch effect (yields to a
  scrollable options region — the grid-set guard); content-fit snap:
  guide stays MOUNTED (measured via callback-ref + ResizeObserver on
  the content wrapper — a plain useRef never saw the portal's late
  attach, and observing the maxHeight-clamped container misses content
  growth), `snapKindOf`/`nextSnapKind` generalised over a dynamic snap
  list.
- `components/quiz/wffGuide.tsx` — Set Q fresh examples, table-first,
  prose gone, credit line (`qguide-src`).
- `components/quiz/setRGuide.tsx` — intro de-sourced, credit line.
- `content/sets/setR.data.ts` — 18 original descriptions (feed guide AND
  hints; clause counts/numbering preserved — answer notes cite them;
  `*must*` emphasis kept; "isn't just…" grading guards rephrased, not
  dropped). Generator snapshot deliberately updated.
- `components/quiz/hintBlock.tsx` — ∴ glyph wrapped (`.qtf`) inside
  inference chips.
- `app/globals.css` — guide type scale, zebra + per-td stair clips
  (a `<tr>` can't carry clip-path), `.qsheet-*` morph/chip/guide-reveal
  block with prefers-reduced-motion, qprompt floor 21px.

Status: 521/521 tests, eslint + tsc clean, verified live on the running
dev server at mobile size (Set A fit-snap 452px with two-snap cycle;
Set Q morph/✕/zebra/fresh examples; Set R fresh text + styled ∴).
`[hidden]`-vs-display audit of the product: clean (Tailwind's `hidden`
utility only).

## Open / next

1. **On-device pass** of the port (gestures need thumbs; the labs were
   phone-tested, the port only pane-tested).
2. **Set Q start screen** (optional): the removed "what is a definition"
   teaching defaults to living in the book; a condensed start-blurb line
   is the alternative if Malik wants it in-app.
3. **Set A column order** — asked 2026-08-22, answered with a census:
   basic subset's correct answers split 46 class / 54 individual, hard
   is 95 class / 5 — and the 2008 table order (class first) is
   Gensler's. Recommendation: don't flip. Malik's call if revisited.
4. Provenance: guides are now original-text; the PASSAGES and other
   sets' content were out of scope for this pass.
