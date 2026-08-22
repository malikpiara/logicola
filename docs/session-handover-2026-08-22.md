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

## Device-pass fixes (later 2026-08-22, in working tree — uncommitted)

Three findings from Malik's on-device pass, all implemented + verified:

1. **Back collapses the sheet** before leaving the page (M3's back
   contract): expand pushes one history entry; Back or any UI collapse
   pops it. Known accepted quirk: routing away with the sheet open
   leaves the spent entry (one extra Back later) — popping it during a
   route transition would yank the user backwards.
2. **Flick works on Set R now**: the options-region guard yields only
   while the region can still scroll DOWN — at list end the flick
   claims the swipe. The old guard blanket-blocked the always-scrollable
   grid.
3. **The sheet's top rule fades**: transparent collapsed (the sheet
   fuses with the page), ink-12% once expanded — moved from inline
   style to `.quiz-controls-drawer[data-expanded]` CSS so it can
   transition; unlayered so it outranks the border-0 utility.

## Desktop pane round (2026-08-22, in working tree — uncommitted)

1. **Pointer-dead page bug (Malik's Set R report) FIXED**: vaul 1.1.2
   never forwards `modal` to Radix, Radix writes `pointer-events: none`
   on body at drawer mount, and vaul's one-shot restores lose the
   effect-order race in this tree. Fix = a MutationObserver watchdog
   scoped to the question flow that reverts any `none` on body — races
   can't be won by timing, only by watching.
2. **Pane ink**: the SITE CHROME's #3F0167 (`PANE_INK`), not the set ink
   — the pane lives on the quiz's outside and speaks the outside's
   voice; set accents stay for personality. Mobile keeps full set ink.
3. **Resize handle moved OUTSIDE the pane** (fixed sibling straddling
   the edge — the stair clips swallow protruding children), with a
   pixel "Resize" tooltip (hover/focus, 300ms delay), keyboard arrows
   on the 16px grid, aria-valuenow/min/max.
4. **Focus etiquette**: pane open → focus ✕; close → back to the Guide
   toggle. Title now "Reference guide" (parity with the mobile morph).
5. **Layering**: pane z-30, navbar relative z-50 — the Exercises menu
   opens above the pane; safe because quiz-pane-push keeps the bar off
   the pane. Open decision skipped by Malik: pane width/open-state
   persistence (suggestion 2) — offered, not taken up yet.

## Tooltip system (2026-08-22, in working tree — uncommitted)

`components/ui/pixelTip.tsx` + the contract in docs/pixel-ui.md §
Tooltips (M3 + NN/g + WCAG 1.4.13 distilled): desktop-only plain labels
for ICON-ONLY controls, shortcut teaching as `Label — Key`, 300ms
delay, hover + :focus-visible reveal, Esc dismiss, role=tooltip +
aria-describedby, chrome-ink chip, `@media (hover: none)` removes tips
(touch never depends on them). Applied: pane ✕ ("Close — Esc"), resize
handle ("Resize", bespoke but ARIA-parity), footer social chips, and —
Malik's refinement of the rule — the OPTION pills teach their shortcut
("Press 3" / "Type aa", hover-only so arrow navigation stays quiet,
silent once the solution shows). The sin is REDUNDANCY, not
labeled-ness: a tip on a labeled control is fine when it adds what the
label doesn't. Sentence case, never caps. Bug fixed en route: the
focus-etiquette's programmatic ✕ focus tripped the tip's
:focus-visible reveal and pinned it — focus moved to the pane region
(tabIndex −1, one-retry rAF for the portal's late attach).

Round 2 (Malik's briefs + /microinteractions audit): grip darkens for
the WHOLE drag via isPaneResizing (not :active — the cursor outruns the
handle), tip suppressed mid-drag; warm-window delay grouping (Base UI's
behavior — a neighbor tip within 600ms of one shown reveals instantly);
origin-aware reveal motion (3px from the trigger side; translate
centers, transform moves — they compose); shortcuts render as
<kbd class=qtip-kbd> chips; and the Saffer LONG LOOP: option tips
retire per-device once the learner selects by key
(lib/shortcutTeaching.ts — the scaffold teaches itself out of a job).
The "permanent green close-esc" Malik saw = Turbopack stale CSS (known
trap): fresh markup + old stylesheet renders raw tip text. Remedy
rm -rf .next; hit twice more during this round's own verification.

Round 3 — MOVED TO RADIX (`@radix-ui/react-tooltip`, in-family with
dialog/navigation-menu/vaul; `PixelTipProvider` at the app root,
delayDuration 300 / skipDelayDuration 600 = the warm window, for free).
Why: the CSS-only spike died of geometry — the pane's ✕ tip was cut by
the pane's own stair clip (Malik's screenshot), Set R's first-row tips
by the grid's overflow, and `.quiz-immersive kbd` painted the shortcut
keys in the set's ink (rust on plum, unreadable). The portal escapes
all three ancestors; collision handling keeps tips in the viewport;
`.qtip-kbd` is explicitly white regardless. Hand-rolled warm window,
Esc and aria code deleted. Grip tip is now a PixelTip too (`suppressed`
while dragging). Verified on a clean server: ✕ tip fully visible, option
tips above the grid, kbd white.

## Question-screen testing items (2026-08-22) — docs/question-lab.html

Two user-testing findings, prototyped as DIRECTIONS (Malik calls):

1. Feedback placement — shipped order prompt → question → feedback →
   options (the 2008 discourse order, decision 4); one tester wanted
   feedback ABOVE the drill question. Dial 2: between / above the
   question / above the prompt. Norman cuts both ways (mapping to the
   options vs adjacency to the passage the hint sends you back to) —
   an eyes-and-thumbs call on Set R.
2. Stable regions on phones — two shipped mechanisms cause the wobble:
   vertical centering of the question column (Set C's short prompt
   floats over dead space; options land at a different y per question)
   and the 2026-08-19 mobile exception that sizes the feedback slot to
   live content (options shift on a miss). Dials 3+4 restore each
   reservation separately; middle path noted (reserve on list sets,
   live-size the grid set where the band costs a third of the screen).

DECIDED (later 2026-08-22): **feedback ABOVE the drill question**
(prompt → feedback → question → options), and **prompt top-anchored,
answer group bottom-anchored** — the 2008 window's own model; no
reserved boxes anywhere (the gap between the two is the feedback's
home, so a hint fills it without moving the options on list sets).

Hierarchy correction (Malik, same day): the drill question ("Which is
the right translation?") is the LABEL of the answer list, so it travels
with the options — the bottom-anchored unit is feedback · question ·
options as one `.qanswer` group (`margin-top: auto` on the group, not
on the options). My first split capture stranded the eyebrow at the top
beside the prompt: wrong relationship by spacing. "The boxes" remark
was Malik's own confusion over the dashed guides, not a rejection to
act on. The lab dials dock BESIDE the stage on ≥900px viewports
(always open — the strip had covered the subject on desktop) and stay a
self-closing bottom strip on phones. Port pending.

## Learnings worth carrying (2026-08-22)

- **Races are won by watching, not by timing.** The pointer-dead page
  (vaul vs Radix over body `pointer-events`) survived every one-shot
  restore; a MutationObserver that reverts the write whenever it lands
  ended it. When two libraries fight over one attribute, observe the
  attribute.
- **A clip eats its descendants.** Tooltips inside a stair-clipped pane
  or an overflow-scrolling grid get cut; the only durable home for
  overlay UI is a portal (sibling of the clip, not child). Third time
  this lesson cost a round — it is now in docs/pixel-ui.md § Tooltips.
- **Spacing IS hierarchy.** The drill question stranded at the top
  beside the prompt read as the prompt's subtitle; moved next to the
  options it reads as their label. Same words, same sizes — only the
  gap changed meaning (Refactoring UI: groups by proximity).
- **Scaffolds should retire themselves.** Shortcut tips teach "the badge
  is a key" and then go quiet per device once a key selection happens
  (Saffer's long loop) — a teaching aid that stays forever becomes
  noise.
- **Labs prototype DIRECTIONS; Malik decides.** Default the shipped
  state as the control, dial the alternatives, capture evidence. A lab
  that defaults to my preference pre-empts the call.
- **Turbopack can serve stale CSS** after globals.css edits: fresh
  markup + old stylesheet produced both Malik's "green permanent
  close-esc" and two false verification failures of my own. Remedy:
  `rm -rf .next` and restart before trusting what you see.
- **Desktop testing needs desktop-shaped tools.** The lab's control
  strip covered the 430px stage on a wide viewport; docking it beside
  the stage (≥900px) is the difference between a lab that can be read
  and one that can't.

## Open / next

0. **Port the question-screen layout** (decided above): FeedbackSlot
   above the question header; column = prompt top / answer group
   (feedback · question · options) bottom; reassess the 2026-08-19
   live-sizing exception against the new gap model.
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
5. **Pane width/open-state persistence** (desktop suggestion 2) —
   offered, not taken up.
