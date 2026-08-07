# Handover — 2026-08-06 (two sessions)

Written on branch `color-system-exploration`, covering both of today's
sessions. Entry point for the redesign as a whole is still
**`redesign-handoff.md`**; `pixel-ui.md` is the port contract, and it now
carries a **Porting traps** list — read it before writing app code.
Supersedes `session-handover-2026-08-05.md`.

## The next session builds

Malik's call at close: **the next session starts actually
building/implementing the new LogiCola** — moving from the lab to the
app. What that means concretely:

1. **Port from the contracts, not from memory**: `pixel-ui.md` (shapes,
   chrome, mobile spec, porting traps) and the palette table in
   `redesign-handoff.md` (`getQuizScreenColors` swap is still the ~30-line
   core, drafted once and deliberately reverted).
2. **The release scope is the scored run.** Count mode is not surfaced
   anywhere (decided today — see table below). The app currently ships
   count-as-default with scored as opt-in: that inverts.
3. **Mobile ships the lab's chrome**: header row (bare pixel ✕ ·
   sprite-capped quantised progress bar · icon-only Guide chip), sticky
   full-width gem CTA footer, clean surface (no pattern on question
   screens), in-card exit replacing `ExerciseNavbar`'s white bar.
4. **Still genuinely open** (decisions, not tasks): CTA silhouette (gem is
   a WORKING default; logo/sprite alive on the dial), feedback placement
   (reserved is a WORKING default; re-judge its gap at 390px), the R-guide
   pedagogy question (decision 13), Set R's colour, hint identifier
   Run-in vs Heading, answer treatment (Tint recommended).

## Decided today

|                      | Decision                                                                                                                                                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Notation chip corner | **Sprite 4px** — the keycaps' clip, both chips. Dial removed. Small instances (~20px chips) still owe a per-size tweak; re-judge in KaTeX.                                                                                    |
| Set N guide          | **No guide button** — no guide in the app, none in the 2008 original (no `*H` block; its `*h` is display control).                                                                                                            |
| Scored run only      | **Replaces quiz (count) mode for the release.** No "n of 10", no escape link, no Cells progress. Count code dormant for a future reform. Start blurb "To 100 points · Level 7"; footer "30 / 100 points"; progress Line only. |
| CTA Pixel variant    | Cut from the Primary button dial (the rest is undecided; **gem** is the working default).                                                                                                                                     |
| Mobile chrome        | Header row ✕ · bar · Guide (Duolingo/Brilliant anatomy), sticky footer with full-width CTA, no pattern on question screens, in-card exit. Details in `pixel-ui.md` § Mobile chrome.                                           |

## Done today (second session)

- **Roboto Flex in the lab** (app-parity axes; offline falls back to
  Avenir with a warning comment). Every type judgement is finally in the
  app's face.
- **`<!doctype html>` added — the lab had spent its whole life in quirks
  mode** while the app renders standards. Exposed by dark mode (quirks
  blocks colour inheritance into tables). All pixel measurements recorded
  before 2026-08-06 were quirks-mode numbers; re-measure before leaning
  on one.
- **Primary button dial** (Logo · Gem · Sprite), applied to both CTAs;
  gem working default at Malik's call.
- **Mobile views built**: `Question · M` and `Start · M` (390px frames;
  the container query does the reflow). Full round trip: Start · M →
  Start Quiz → Question · M → ✕ → Start · M.
- **Four-lens audit** (Refactoring UI / HIG / Norman / Saffer) of the
  mobile view, then the fixes Malik picked: sticky header row with the
  progress bar at the screen top, sticky full-width CTA footer, bare
  18px pixel ✕, icon-only 44×44 Guide chip, optical spacing correction
  (13px whitespace discount), pixelised bar (sprite caps R=4/u=2 + fill
  quantised to the 4px grid via CSS `round()`), redundant divider hidden.
- **Shipped-mobile inventory** (from `components/quiz/index.tsx`): the
  app's permanent vaul bottom sheet carries CTA + numeric progress +
  keycaps below `lg`; the guide expands from the same sheet (180/460/full
  snaps); no top-right Guide button on mobile. The lab models the
  collapsed sheet's job with its sticky footer; **the expandable guide
  sheet remains unmodelled** (still a full-bleed overlay stand-in).
- **Pattern on mobile**: new `Clean` centre treatment (genuinely no
  pattern — skips generation); "Off" relabelled **"Full bleed"** after
  its old name caused a real regression; phone frames render patterns at
  0.6 scale (first pass, judge by eye).
- **Scored-run-only sweep** across all lab screens (see Decided).

## Audit findings still open (mobile)

- **Feedback placement is THE unsolved mobile question**: a wrong pick's
  hint lands 514px from the picked cell (ships today in the app too).
  `reserved` is the working default because it never moves the options;
  its gap was measured on desktop (391px on R) — re-judge at 390px. The
  fixed sheet suggests a candidate: feedback surfacing at the sheet edge.
- **Answer-method signifier**: touch has none (keycaps hidden, finding 4's
  "TO ANSWER: click a fallacy" still not restored — mobile is the
  strongest argument yet).
- Desktop Guide chip is 37px tall (mobile instance now 44px); the
  short-set vertical centering (finding 6) not yet changed.
- App-side quick wins found during the audit: the multi-select wording
  decided 2026-08-05 never shipped ("Select all that apply…" still live);
  keycaps render in the mobile sheet on devices with no keyboard.

## Open questions for the build

- **CTA copy**: app WIP says "Start Scored Run"; with one mode, plain
  "Start Quiz" (the lab's label) may read better.
- **The level dial isn't modelled in the lab** — with scored the only
  mode, it is the start screen's main control. Model before finalising
  the mobile start, or design it directly in the app.
- **Where the pattern lives on phones**: current answer "start screen
  only, at 0.6 scale". Judged once, not settled.

## Tooling note (carried, still true)

The preview pane serves stale frames after edits; only a changed `?v=N`
URL forces a fresh document — and it auto-reloads mid-edit-sequence, so
console errors can be stale artifacts of intermediate states. Trust
measurements over pictures; verify errors against the current load
before chasing them.
