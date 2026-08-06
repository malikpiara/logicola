# Quiz redesign — handover

**Start here.** This is the entry point for the redesign work — the colour
system, the pixel UI treatment, and porting both into the app. Written
2026-08-03 on branch `color-system-exploration` (pushed through `2c90ece`).

## The reference docs, and what each is for

| Doc                          | Role                                                                                                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`pixel-ui.md`**            | The **shape and iconography contract** — sprite silhouettes, the CSS traps, the three option marks, icon table, progress/keycap/guide specs. Port from this, not from memory. |
| **`color-handoff.md`**       | The **palette log** — which palette each set gets, the accent tier and its three gates, and every retired candidate with its reason.                                          |
| **`color-system.md`**        | The **reasoning archive** — original LogiCola colour extraction, the Duru/ColorMoods method, ranking history. Read when you need _why_, not _what_.                           |
| **`accessibility-modes.md`** | **Deferred, not decided** — `forced-colors` (Windows High Contrast) and `prefers-contrast`, both unhandled, plus why the treatment is not a user setting.                     |

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

3. **Answer treatment** — four readings of the option's five-state ladder
   (idle / hover / selected / revealed / ruled), all spending only surface,
   ink and accent, differing in opacity, mix ratio and which colour carries
   which state. `Tint` is the baseline that shipped. `Accent` lets the third
   colour tint the idle state instead of reserving it for the pick.
   `Invert` fills the picked option solid accent, the move the reveal makes
   in ink. `Weight` spends no accent on the options at all — **this is
   effectively what ships today** ([option.tsx:95](../components/option.tsx)
   marks selection with an ink border and an ink tint), at heavier values, so
   read it as the status quo rather than as a new proposal. Tokens and
   per-variant notes in `OPTION_TREATMENTS`.

   **Retired 2026-08-05**, both cut once the shortlist came down to Tint /
   Invert / Weight. `Ghost` (no fill, 2px ink hairline) — worth knowing that
   it is the reason the ring works at all: as the only fill-less pill it
   exposed that the old drop-shadow rim traced the alpha channel and outlined
   the letterforms, which bought the band mechanism. Nothing left in the dial
   has a transparent pill, so nothing will catch a regression there.
   `Plate` (Tint made opaque) — measured indistinguishable from Tint in every
   configuration the lab offers, because the pattern never sits under the
   options. Revisit only if that rule is relaxed. Both are kept in full, with
   their values, in the comment above `OPTION_TREATMENTS`.

4. **Feedback placement** — where a wrong pick's hint and the answer
   explanation land. Raised by Malik from a screenshot of the 2008 original
   (Set R): its answer palette is anchored to the bottom of a fixed window
   and the discourse accumulates in the space above, so feedback appears
   **above** the options and **the options never move**. Those are two
   separable properties, hence three modes rather than two.

   Displacement of the option palette inside the card, measured on the real
   Q and R samples (positive = pushed down, negative = pulled up):

   | set               | mode       | on a hint  | on the answer |
   | ----------------- | ---------- | ---------- | ------------- |
   | Q (2×4, 7 cells)  | `inline`   | — no hints | **−23px**     |
   |                   | `above`    | — no hints | **+25px**     |
   |                   | `reserved` | —          | **0px**       |
   | R (3×6, 18 cells) | `inline`   | **0px**    | **0px**       |
   |                   | `above`    | **+158px** | **+50px**     |
   |                   | `reserved` | **0px**    | **0px**       |

   (R's hint figures move with decisions 5 and the 2026-08-05 audit: they were
   +98px / 311px flat, +134px / 347px once the clauses became a list, and
   +158px / 391px once the measure was constrained to 62ch.)

   **`above` is the worst of the three, not the best.** On Set R a hint
   shoves the whole eighteen-cell palette down 158px — the cell you were
   reaching for is somewhere else by the time you look back. That is the
   opposite of what the original achieved, and it is what you get by
   copying its position without its constant height.

   **For grid sets the app's current below-placement already scores zero.**
   R's card is taller than the card's `min-height`, so there is no slack to
   re-centre and a block appended under the grid moves nothing. The trade
   there is therefore not stability — it is reading order: `above` gives
   question → attempt → response → palette, `inline`/below makes you look
   past the palette to find out what happened. `reserved` is the only mode
   that buys the reading order without paying for it in movement.

   **Set Q's −23px is the card re-centring, not an insertion.** `.card` is
   `justify-content: center`, and Q's seven cells leave vertical slack, so
   growth _anywhere_ — including below the grid — moves everything by half
   the added height. Worth knowing before porting: whether the app's card
   centres decides whether "put it below" is stable at all, and it is only
   stable on the tall sets.

   `reserved` sizes itself by rendering the tallest thing the slot could
   hold invisibly and floating the live content over it — no magic number,
   and no long hint sneaking past a `min-height` guess. On R that tallest
   thing is the appeal-to-authority gloss: a lead plus three clauses, 108px.
   Its cost is visible in the clean state: on R the palette starts **347px**
   down the card instead of 213px.

5. **Hint hierarchy.** Four changes, all live in the lab; the first three
   are agreed, the fourth is a `Hint identifier` toggle to compare.

   - **Clauses render as a list.** They already _are_ one in the data
     (`clauses: string[]`), and `fallacyGloss` flattens them into a
     semicolon-separated run-on for want of anywhere to put structure. The
     2008 original set them on their own lines too.
   - **Two tones, not one.** The identifier is the error tone — that is the
     part meaning "you were wrong". The body is ink, because it is the
     _definition_ of the thing you picked, and 240 characters of rose reads
     as scolding rather than as reference.
   - **`∴` is chipped.** The glosses are half logic ("Most people believe A.
     ∴ A is true.") and the app sets notation apart everywhere else, but
     `FeedbackText` only catches _quoted_ tokens and `∴` isn't in its glyph
     set — so Set R was the one place logic stayed undifferentiated prose.
     The lab chips `∴` to the end of its sentence.
   - **Identifier: code chip vs full name** — open. Once a hint leaves its
     pill it has to say which pill it came from, and the name repeats the
     label sitting right there in the grid. The chip reuses the cell's own
     badge.

   Also fixed: the block showed the **first** ruled option's hint, so with
   `maxWrongGuesses: 3` the second and third guesses appeared to do nothing.
   It now shows the most recent.

   **The cost is real and is decision 4's problem.** Structure makes the
   block taller: `above`'s drift on Set R went 98px → 134px, and
   `reserved`'s permanent gap went 311px → 347px. Better hierarchy and
   cheaper reserved space pull against each other.

   **Porting needs a content decision first.** `Option.hint` is a flat
   `string`, which is why the structure was flattened in the first place.
   The lab carries `lead` + `clauses` separately and marks emphasis as
   `*word*`. Either `Option.hint` gains structure, or the renderer splits
   the existing `(1) … ; (2) …` string back apart. See also the two 2008
   markup bytes now documented at the top of `content/sets/setR.data.ts`
   — `0xBD` emphasis (5 runs, `must`/`probably`) and `0xBE` fallacy-code
   references (47 runs), both flattened by the port.

6. **Error tone** — `Rose mix` (what ships: `#f43f5e` mixed toward the ink,
   the same rose on every set) vs `Tier brick` (a per-set red derived at hue
   29° through the accent tier's gates). The last off-system colour.
7. **Notation chips** — ink tint vs accent tint for KaTeX chips in hints.
8. **Option chip** — square vs puffy diamond.
9. ~~**Focus rings** still use the ink~~ — **decided, and it is a
   requirement, not a preference.** LogiCola 3 is used by US universities, so
   the option's marks have to survive an accessibility audit. An option can
   carry three at once and today all three are ink:

   | mark                  | today                                                              | measured                                                                                              |
   | --------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
   | focused               | 2px ink ring ([option.tsx:80](../components/option.tsx))           | identical to the selected border — 1:1                                                                |
   | cursor (multi-select) | ink @ 45% border ([option.tsx:97](../components/option.tsx))       | **1.96–2.39:1** vs the option's fill, 2.28–2.87:1 vs the surface — **fails WCAG 1.4.11 on every set** |
   | selected              | ink border + ink @ 15% ([option.tsx:95](../components/option.tsx)) | —                                                                                                     |

   The rule adopted in the lab: **focus and cursor share one colour, and it
   is never the colour selection uses.** Ink for every treatment that leaves
   the ink unspent; the accent for Weight, which doesn't. Focus sits
   _outside_ the silhouette with a 2px surface gap at 2px wide, the cursor
   sits _on_ it at 2px, selection is a 4px band — so the marks differ in
   position and width as well as hue, which is what 1.4.1 (Use of Color)
   wants. Flip **Keyboard marks → Show** to judge it; the toggle stacks focus
   on the picked option deliberately, because that is the worst case.

   **The 2px gap is structural.** Ink and accent sit only 1.60–2.67:1 apart
   across the six sets — two marks in those colours touching each other would
   fail 1.4.11. Separated by surface, each is measured against the surface
   instead (ink ≥ 7.34:1, accent ≥ 4.57:1). Never close it.

   The cursor's fix is independent of which treatment wins: **full-strength
   at 2px, not a 45% tint.** That alone clears 1.4.11.

10. **Does Set R keep its guide at all?** Raised by Malik 2026-08-06, NOT
    decided. R's 18-fallacy table is the only guide with no 2008 ancestor
    of any kind (no `*H` Info block, no feedback text to lift — see the
    provenance note in Caveats). The original never offered the full
    reference during the drill, and there is a pedagogical argument that
    a recognition exercise shouldn't hand the student all eighteen
    definitions one click away. Removing it would also dissolve this
    guide's hardest layout case (the 18-row table in a narrow panel) —
    which is a reason to decide it BEFORE polishing that layout, and not
    a reason to decide it either way.

**Housekeeping:**

10. **`SET_SURFACES`** in the lab is stale in four of six entries (it feeds the
    quilt accent pool, so fixing it changes every pattern render — do it
    deliberately, not incidentally).
11. **The two docs disagree on the stimulation ceiling** — `color-handoff.md`
    says 0.45–0.65, `color-system.md` says 0.45–0.58. Reconcile before the
    port.
12. ~~**The lab's Q and R samples misrepresent their layout**~~ — **fixed
    2026-08-05.** Both were four-option lists; both are **grid +
    multi-select** sets in the app (`optionLayout: 'grid'`,
    `multiSelect: true`). They are now lifted verbatim from
    `content/sets/setQ.ts` (question 3.1) and `content/sets/setR.data.ts`
    (the `ge` Pontiac variant — the same passage as the 2008 screenshot),
    and the lab grew what it needed to render them honestly: column-major
    grid layout, compact cells at a 12px sprite corner, the two-letter
    abbreviation on Set R's badge instead of a position, typing a code to
    pick, multi-select with the subset rule, and the `1 – 4` keyboard hint
    made truthful.

    That fix is what made decision 4 answerable. A grid cannot take an
    inline hint at all — an expanding cell breaks the row alignment the
    column-major reading order depends on, which is exactly
    `inlineHintFor`'s early return, and exactly why the original had to put
    feedback somewhere else.

    Still unmodelled: the guide drawer's two-dimensional keyboard hints, and
    `maxWrongGuesses: 3`.

## Caveats — read before trusting anything below

**The lab is not in the app's typeface.** `pattern-lab.html` sets
`'Avenir Next', Futura, system-ui`; the app ships **Roboto Flex** (variable,
width axis) via `next/font/google`, applied on `<body>` in `app/layout.tsx`.
They share no metrics. Every typographic decision recorded here — the 62ch
measure, 18px/500 notation chips, 0.12em caps tracking, 1.25 prompt leading,
weight 500 on grid cells — was judged in the wrong face, and Avenir Next is
a macOS system font that is never loaded as a webfont, so the lab already
renders differently for anyone not on a Mac. **Re-judge every type decision
once the lab is on Roboto Flex.** Ratios and hierarchy should survive; exact
values will not.

~~**The guide panel shows the wrong content for six of seven sets**~~ —
**fixed 2026-08-06.** `SET_GUIDES` in the lab now mirrors the app's real
guides from `wffGuide.tsx` (A ↔ subset 1, C ↔ 6, J ↔ 4, L ↔ 12, Q ↔ 3,
R ↔ 18); R's 18-fallacy table is generated from the R sample's own options
so hint and guide share one source. Set N has no guide in the app, so N
now hides the Guide button instead of wearing Set J's reference — and the
2008 original agrees: the decoded DSL's Info-button block (`*H`) exists in
B, D, E, F, G, I, K, M, O and Q, but not in N (its lowercase `*h` is a
display-control block, not text). Provenance of the others, corrected by
Malik 2026-08-06: only Q's guide descends from a `*H` Info block; A, C and
J's guides were assembled by Malik from the sets' OWN 2008 feedback
messages — the DSL contains the guide sentences verbatim ("wff must have
one of these eight forms…", "parentheses for each · (AND), ∨ (OR)…") as
answer feedback, not as Info text. R's table is from the textbook's
Fallacies chapter. So every guide but R's has a 2008 ancestor — the
ancestors just live in different blocks. The panel
scrolls, and guide notation runs through the same chip/emphasis machinery
as the hints, so the Notation chip and Emphasis dials apply to it. Layout
and density are now JUDGEABLE, not judged — the panel is still the
lab's own 300px overlay, not the app's container-queried sheet/rail.

**Notation chips are plain text in the lab, KaTeX in the app.** The size and
weight decisions carry; the optical result needs re-checking on real KaTeX.

**`forced-colors` is predicted, not tested** — see `accessibility-modes.md`.

**Set R's grid is a desktop judgement.** The container query is in and
reflows 3×6 → 2×9, but 640px is a placeholder and the exhaustive mobile pass
is deliberately a separate exercise.

## Design audit — 2026-08-05

Run against six lenses (systematic visual audit, Norman, Saffer, Refactoring
UI, Butterick, conversion copy). Scores before: discoverability **6/10**,
microinteractions **5/10**, Refactoring UI **7/10**. The system discipline was
never the weak part — signification and motion were.

**Applied:**

| #   | Finding                                                                                                                                                                                     | Fix                                                                                                                                                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Multi-select was an unannounced mode.** Q and R both accept several answers; the same click added to a set here and replaced a pick elsewhere, with nothing on screen to tell them apart. | A line under the header. Wording is **"More than one answer can be right."**, not "select all that apply" — the subset rule accepts _any_ genuine answer, so demanding all of them would promise something the grader doesn't do.                                                              |
| 2   | **The grid didn't respond.** Three columns at every width; the app is `grid-cols-2 lg:grid-cols-3`.                                                                                         | A **container** query on `#questionView` (the card's width is set by the workbench, so viewport width says nothing useful). Column-major flow needs rows and columns to move together and CSS can't divide, so JS supplies both pairs. 640px is a prototype threshold pending the mobile pass. |
| 3   | **The hint ran to ~96 characters per line** — past the 45–90 that stays readable, and the densest prose on the screen.                                                                      | `max-width: 62ch`. Now 70ch.                                                                                                                                                                                                                                                                   |
| 5   | `.qheader` / `.eyebrow` tracked at **0.3em**; caps want 5–12%.                                                                                                                              | 0.12em, the top of the range — keeps the eyebrow's character without letting the words disassemble. `.qcount` 0.2em → 0.1em.                                                                                                                                                                   |
| 6   | Options and hints were both 15px/400, and moving the hint body to ink removed the colour that had separated them.                                                                           | Grid cells to **500**. A control should read as a control; weight is the single right lever.                                                                                                                                                                                                   |
| 7   | The largest text on the screen was the only thing on `line-height: normal`.                                                                                                                 | 1.25.                                                                                                                                                                                                                                                                                          |
| 9   | **Selection feedback had two timings** — the fill faded over 120ms while the ring popped, because the band only existed while its class did.                                                | The band is always rendered and fades with the fill. `--qo-band` is set on _every_ wrapper, not just ringed ones, so a band fading OUT keeps its silhouette instead of collapsing to a rectangle mid-fade.                                                                                     |
| 10  | `prefers-reduced-motion` covered exactly one selector (`.cta`).                                                                                                                             | Covers every transition and animation added here.                                                                                                                                                                                                                                              |
| 11  | The two loudest events — being wrong, and the reveal — were instant and unremarked.                                                                                                         | A 180ms badge entrance and a 200ms feedback entrance, both `ease-out-quart`.                                                                                                                                                                                                                   |

**The frequency rule drove the motion budget.** Picking an option happens
dozens of times a session, so it gets the cheapest possible acknowledgement —
a 120ms fade and a 97% press scale — and nothing more. Being wrong and being
right happen once per question; those got the beat. Only `opacity` and
`transform` are animated; the band's `clip-path` stays instant, since
animating it would be layout work per frame for a change nobody perceives
mid-flight.

**`qState.fresh` is load-bearing.** The lab re-renders on every dial change,
so an animation keyed to a class alone replays whenever you touch a control.
The CTA diffs against a snapshot, marks only the options that actually moved,
and the first render consumes the flag. Motion marks a change, not a redraw.

**One regression, mine, caught by the audit's own screenshot.** The clause
list used a flex `li` for its hanging number. That makes every inline child a
separate flex item, so the moment a clause contained an `<em>` the sentence
broke into three gapped boxes and lost its word order. Now absolute
positioning. **Inline content must stay in one inline formatting context.**

**Cost, which feeds decision 4:** the narrower measure makes the block taller
again. `above` drift on Set R is now **158px** (was 134, was 98 before the
hint restructure) and `reserved`'s permanent gap is **391px** (was 347, was
311). Every legibility gain has been paid for in vertical space.

**The two-letter code chip was tried and rejected** (Malik, 2026-08-05). It
failed twice. It has to be decoded — `aa` names nothing on its own — and,
decisively, **ruling an option replaces its badge with ✕**, so at the moment
the hint appears the code it points at is nowhere on screen. A pointer whose
referent is destroyed by the event that reveals it is not a pointer.

The earlier argument that the full name is "redundant with the cell" was also
wrong. The reduction filter asks whether something can go without losing
meaning, and the name is the SUBJECT of the explanation, not a label on it —
while the cell that repeats it has greyed out and lost its badge.

A hint now always names its fallacy in full. Two layouts are live to compare:
**Run-in** flows the name into the sentence (`Appeal to authority. This is
fallacious if:`) — which is the 2008 source's own form, and a line shorter,
which matters given every legibility gain so far has been paid for in
reserved height. **Heading** gives the name its own line. A description that
opens on a parenthetical (`ah`) runs on without the period.

Only the lamp carries the error tone now; the name and all prose are ink.

**Emphasis: `Rule` DECIDED 2026-08-05** — a hard 2px accent underline. The
system is flat and rectilinear; the soft band it replaces was the one
soft-edged thing in it, and a ruled line is what this grammar would draw. It
also survives at any text size, which the 4px-cornered Sprite does not.

**Notation chips: `Sprite 4px` DECIDED** (Malik, 2026-08-06) — the
keycaps' own clip (`spriteClip(0, 8)`), on both notation chips. The dial
ran `Rectangle` (the app today) · `Sprite 4px` · `Sprite 2px` · briefly
`Gem` (the NEW badge's silhouette via `pixelPts(0, 4)`, from the
MaterialShapes exploration); all but the winner are removed from the lab.
**Carried with the decision: the smaller instances need careful per-size
tweaking before the port** — L4's rule chips and R's table chips run
~20px tall, where the R=8 corner leaves only ~4px of straight edge and
1px of vertical padding puts the step against the letterforms; the
keycap survives the same clip at 22px because it is a padded box. Tweak
candidates when this is picked up: room (padding, where the inline line
box allows it) or a smaller radius on the same 4px grid, per the scaling
law. Note the app renders these chips in KaTeX, so the tweak must be
re-judged there.
The card carried five small chips in three corner treatments: keycap, option
badge and guide button all spoke the pixel grammar, while the two chips
holding actual LOGIC — the guide's `☐A` and the hint's `∴ A is true` — were
the only square and rounded things on it, and in the body face rather than
mono. Two objects doing the same job, a tinted box around a symbol, styled
three ways. `Sprite 4px` is byte-identical to the keycap clip; `Sprite 2px`
runs the same construction on a finer grid, halving how much corner a small
box loses. Both zero the leftover 7px radius. The counter-argument, not yet
dismissed: chrome and content need not look alike, and notation is content.

**Correcting an earlier claim in this file:** the 4px corner does not simply
"fail below ~20px". The keycap is 22px tall with the same 4px step and reads
fine. The variable is whether the shape has **room around its content** — a
keycap is a padded box, so the step eats padding; the rejected Sprite
emphasis was a fill sitting tight behind glyphs, so the step ate letterforms.
Size alone is not the test.

**Emphasis: the rejected four** (`Band` · `Marker` · `Sprite` · `Rule` · `Accent`).
Only `must` is emphasised now — the source marks `must` and `probably` as a
contrast pair, but two marks in one clause fragment it, and `must` is the
operative word: asserting necessity IS the fallacy, `probably` is only the
non-fallacious alternative. Every variant pairs its mark with weight, so
none conveys emphasis by colour alone.

Retired from the dial: `Italic` (too quiet at 15px) and `Spaced` — the
latter being the 2008 source's own device, letterspacing, which is faithful
but harms reading at this size.

**A scaling law worth carrying into the pill redesign:** the rasterised
corner is a fixed 4px, so its visual weight is inversely proportional to the
box. On a 48px pill it is an eighth of the height and reads as a detail; on
a ~20px inline highlight it is a fifth per corner and reads as damage. The
device does not scale down — a smaller box needs either a smaller unit or
more room around it.

**Removed by mistake and restored:** the lamp icon. It was listed in the
diagnosis as one of three "throat-clears", but it was not part of finding 1 or
3 and was never approved — it went out with the block rewrite and was not
mentioned in the summary. It does a job the code chip does not: the chip says
_which option_ the hint is about, the lamp says _what kind of message_ it is.
Inline placement had lost its only marker entirely. Restored in the error tone
beside the chip; the body stays ink.

**Not done:** finding 4, the original's _"TO ANSWER: click a fallacy or type
its abbreviation"_ — the primary signifier for an eighteen-cell palette,
dropped in favour of a keyboard reference that presumes you already know the
cells are clickable. Not declined, just not selected.

**Deliberately rejected:** elevation on the option cells. Refactoring UI's
depth chapter would want it; the system is flat by rule and the pixel
silhouette is the signature moment. Shadows would fight it.

~~**Next, and known to be blocking judgement:** the lab's guide panel shows
the SAME modal-logic reference for every set~~ — **done 2026-08-06**, see
the Caveats entry above. The guide-panel judgements (density, the notation
chip corner on real material, run-in vs heading beside a real reference)
are now unblocked.

**Explicitly deferred by Malik:** the mobile bottom sheet / guide pane
surfaces, the end screen's treatment pass, and both display modes in
`accessibility-modes.md` — `forced-colors` (Windows High Contrast, predicted
to erase every mark in the option ladder, unverified) and
`prefers-contrast: more`. Neither is a toggle; both key off the OS.

## Rules that took real work to learn

Do not rediscover these:

- **Straight edges stay ruler-straight; only curves rasterise**, as regular
  symmetric stairs. A seeded random crenellation was built and reverted.
- **Gate 3**: an accent must sit ≥ ~.10 OKLCH-L above the ink. No contrast
  checker measures this — WCAG scores each colour against the _background_,
  never one foreground against the other, which is how a palette passed every
  check with an accent .03 from its own ink.
- **Two marks on one component are measured against each other, not just
  against the surface** (WCAG 1.4.11). Ink and accent are 1.60–2.67:1 apart,
  so they may never touch — a gap of surface between them is what makes each
  legal. This is gate 3's problem wearing a different hat: both are about the
  pair, and neither is something a contrast checker will tell you.
- **A custom property declared on an element beats the one it would
  inherit.** A `--x` default on `.qopt-wrap` silently shadowed the
  per-treatment `--x` set on the card, so one treatment's override never
  applied. Defaults belong on the same element the overrides are written to.
- **Setting inline properties never removes the ones you didn't set.** A
  token only some treatments declare survives the switch away from them —
  Weight's accent focus ring stuck to Tint. Hence `OPTION_DEFAULTS`, spread
  under every treatment on each render.
- **Pale ≠ low-contrast.** Contrast is lightness; how committed a surface
  feels is chroma, and nothing measures chroma.
- **Near the lightness ceiling, hue stops registering** — two surfaces 55°
  apart sat .045 apart at L .95, because the gamut allows almost no chroma
  there. The fix for "these look the same" is lightness, not hue.
- **`filter` runs before `clip-path`** — a drop-shadow ring on a clipped
  element is amputated by its own polygon.
- **`drop-shadow` traces the alpha channel, not the border-box** — so it
  cannot ring anything that isn't filled. Give an option no background and
  the "ring" outlines its letterforms. Rings on clipped shapes are now a
  band: outer silhouette minus inner, `evenodd`, on a **sibling** layer —
  clip the wrapper instead and the same polygon deletes the label too.
- Tailwind: `border-[var(--x)]` is ambiguous and silently dropped; write
  `border-[color:var(--x)]`.

## Method note

The palette metrics live in the lab itself (OKLCH utilities, the ported
ColorMoods stimulation model, the Colour studio). The global
`two-color-harmony` skill holds the Duru framework behind them. **Malik's eye
leads and the metric follows** — it has overruled the numbers more than once,
correctly.
