# Session handover — 2026-08-23 (overnight)

Malik was away for this one and left six items to have ready for review.
Four are **implemented and verified in the product**; two are **labs with
the directions dialled**, because they are calls he said he wanted to make
himself. Nothing is committed — working tree only, as always.

Working tree also still carries the uncommitted 2026-08-22 nav / sheet /
pane / tooltip work. This session did not touch any of it except one line
of `app/globals.css` (noted below).

Status: **536/536 tests**, `pnpm eslint` clean, `pnpm build` clean, offline
manifest regenerates identically (41 URLs). Bundle contract re-checked
after the change: no chunk contains two sets' content.

---

## 1 + 2 · The end screen answers "now what?" — DONE

The two asks were one screen, so they landed together.

**What was actually broken.** The end screen offered `Try Again` and
nothing else. On desktop that was survivable — the quiz _page_ renders the
site navbar inside `hidden lg:block`
(`app/(quiz)/[...slugs]/page.tsx`), so the wordmark is always there. **On
phones it was a genuine dead end**: the only ✕ lives in the question
screen's sticky header, which the end screen replaces, so reaching 100
points removed the last way out and left the browser's Back button — which
on the first page of a session is no way out at all.

**The hierarchy** (one rule, four states — full note at the top of
`components/quiz/endScreen.tsx`): _the primary is always the way forward,
and "forward" is whatever is actually true._

| state                            | primary gem   | quiet tier                |
| -------------------------------- | ------------- | ------------------------- |
| reached 100, a next drill exists | that drill    | try again · all exercises |
| reached 100, no next drill       | all exercises | try again                 |
| ran out of problems              | try again     | all exercises             |

Putting `Try again` in the quiet tier after a completed run is deliberate:
under the 2008 economy reaching 100 **is** completion, so repeating the
drill you just completed is the lesser action. When the run fell short the
same rule puts it back on top. A fallen-short run is never offered the hard
set — that would be the app misreading its own scoreboard.

**Where "next" comes from** — `lib/nextDrill.ts`, new, with tests. The rule
is deliberately narrow: **the next drill inside the same SET**, never the
next row of the catalog. Set A Hard is followed _in the file_ by Set C, and
nothing in Gensler says someone who can translate syllogisms is ready for
propositional logic; offering it anyway would be the app inventing a
curriculum out of an array index. That leaves exactly the four progressions
the `chapter` field already draws:

```
Set A  Easy → Hard        Set J  Basic → Quantified
Set C  Easy → Hard        Set L  Imperative → Deontic
Set N  Believing → Willing → Rationality
```

Q and R are one drill each and honestly have no next; they get the exit and
nothing else. Labels come from the successor's own variant — `Try the hard
set` where it literally is the hard set, `Next: Quantified` / `Next:
Willing` otherwise — and never travel as a bare variant word, so the link
still reads out of context (WCAG 2.4.4).

**Three things fixed en route, each worth knowing on its own:**

1. **The quiet tier had an AA failure.** The old "Ready for a scored run"
   link shipped at `opacity-70`, which measures **4.24:1 on Set A, 3.98 on
   R, 3.92 on J** against the 4.5 floor. 80% is the lowest tier that clears
   on all seven (worst: J at 4.86). The number is now a documented floor,
   not a taste. _Set L flatters everything at 12.67:1 and is exactly why
   this survived — never eyeball a tier on Set L alone._
2. **The headline overflowed on phones.** The end-screen `h1` had no
   horizontal padding, and the section is `overflow-hidden`, so "Exercise
   complete." at `text-4xl` (~300px of glyphs) was clipped at both edges on
   a 375px screen. Same `px-10 md:px-6` the start screen got on 2026-08-21;
   it only survived this long because nobody had reached the end screen on
   a phone.
3. **A clipped gem paints no focus ring, and the band only matched
   `button`.** The onward action is a real `<a>` now (`GemLink`, new in
   `gemButton.tsx` — it navigates, so it must be middle-clickable,
   copyable, and announced as a link). `app/globals.css` line ~266 is the
   one line of the 08-22 work this session touched:
   `:has(button:focus-visible)` → `:has(:is(a, button):focus-visible)`.
   Without it the new link had **no visible focus at all**.

**Verified**: all four states rendered and read; `link → /belief/…/willing/quiz`,
`button "Try again"`, `link → /`; focus band opacity 1 on the gem link;
2px `currentColor` outline at 2px offset on the quiet links; phone overflow
gone at 375px.

_How_, and its limit: through a throwaway route that mounted `EndScreen`
with each prop combination directly, since reaching the real end screen
means scoring 100 points by hand. That route has been deleted. So the
component is verified in every state and the `onTryAgain` **wiring** is
unchanged from what already shipped — but nobody has yet played a real run
to 100 and watched the screen arrive. Worth one play-through on a phone
before this goes out.

### Still open — the start screen has the same phone-width gap

`StartScreen` has no exit either, at any width below `lg`. Land on a drill
from a shared link, decide it's the wrong one, and there is no way back
except Back. I did **not** fix it: Malik asked about the _finished_ quiz,
and the fix is a visible chrome addition to a screen that was composed
deliberately. It is one `<Link>` and I'd suggest the same "All exercises"
quiet link under the CTA. **Malik's call.**

---

## 5 · Points on the phone — DONE, then REPLACED by Malik's call

**Final state: the phone shows a points DELTA, not a total** (Malik,
2026-08-23, `docs/points-readout-lab.html` option D1 — the lab is kept, he
may revisit). The total shipped for one day and then came off. What follows
is the reasoning for the total, retained because the delta inherits most of
its constraints; the delta's own note is at the end of this section.

### The delta — what actually ships

`✕ · [bar, full width] · Guide`, with `+5` / `−10` appearing under the bar's
left end on each verdict and leaving after 1600ms.

**Why it beat the total, and it is not mainly the pedagogy.** The bar
already _is_ the total — it is `progress(scoreState)`, distance to 100 — so
a numeral beside it rendered one fact twice. **Nothing rendered the
economy**, and under the 2008 model the scoring level changes nothing except
the penalty, so a learner at level 5 who never sees "−10" cannot discover
what their level is doing. The delta is the only thing on that screen that
says something the screen did not already say. (The pedagogy points the same
way — Kluger & DeNisi 1996 on self- vs task-directed feedback, Butler 1988
on grades crowding out comments — but that is adjacent literature, not
evidence about this app.)

**Three rules it had to inherit, all of which the code already knew:**

1. **The reward is not a constant.** It is `scoreState.pointsAvailable` —
   Set Q pays 7, Set R pays 8 — and `scoreState` at the moment of the check
   is the pre-answer snapshot, which is exactly what both branches want.
2. **A change of nothing shows nothing.** `chargeFor()` returns 0 for a run
   already in the red under the `no-deeper` floor and for a penalty register
   the set's DSL has decayed to zero. The damage flicker already suppresses
   itself there; the delta uses the identical test. **Both cases fired in
   live testing**, along with a third: Set R's forfeit, where a solve after
   a miss awards 0 and "+0" would read as a bug. _Suppressing the forfeit is
   my judgement call, not Malik's — showing it explicitly would teach the
   forfeit rule, and that is the live alternative._
3. **It joins an existing choreography.** A miss already blinks the fill
   twice over 340ms and only then pays the penalty over 500ms
   (`docs/damage-bar-lab.html`, Direction A). The delta holds through that
   and fades after the bar settles — it does not start a second beat. Under
   `prefers-reduced-motion` it still appears and still leaves; it just stops
   sliding and shaking.

**One colour for both signs.** A dimmed or reddened loss is not available —
the accents clear 4.5:1 by as little as 0.05 and the palette has no red. The
sign carries the meaning, which 1.4.1 requires anyway, so a second colour
would buy nothing it is obliged to buy. The loss is distinguished by motion.

**Accessibility is unchanged by this.** The delta is `aria-hidden` like the
bar, and the sheet's `sr-only` total sentence remains the accessible
reading. So the change removes a visual duplicate, not a fact.

`compactProgressLabel` is kept in `quizMode.ts` with its tests, documented as
dormant — restoring the total is one call site.

### Two bugs this pass turned up

- **A `flex-1` on the bar inside a column container collapsed it to 0px.**
  `flex-1` sets `flex-basis` on the _height_ in a column, so the 12px bar had
  no height at all. This first bit the lab — meaning the "below the bar" and
  "above the bar" options Malik picked from were rendering identically to
  "right of the bar" when he picked them. Fixed in both, and noted in the
  component so it is not found a third time.
- **The Turbopack stale-CSS trap, again.** The `.qdelta` rules never reached
  the browser on the first run, so an early "verified" delta was unstyled
  text. Caught by checking `document.styleSheets` for the rule rather than
  trusting the screenshot. `rm -rf .next` with the dev server stopped.

### The original reasoning, for the total (superseded)

The phone showed the progress _bar_ and nothing else: the number lived in
the sheet as `sr-only` below `md`, so a sighted phone learner could see
they were about halfway and never what they actually had.

Now the sticky header row reads `✕ · bar · 45/100 · Guide`.

- **`md:hidden` is exact, not a guess.** From 768px the sheet's own label
  un-hides itself (`md:not-sr-only`) and sits beside the CTA, so rendering
  in both places would print the score twice on a tablet. Below 768 that
  label is `sr-only`, which is why the new one is `aria-hidden` — the sheet
  keeps the single accessible reading, in words, and the row gets the
  glanceable one.
- **The denominator stays.** "45" beside a half-full bar is genuinely
  ambiguous — 45 points, percent, questions? — and the whole economy is
  "get to 100". Two characters buy the answer.
- **Both tiers are the accent, and that is forced.** The obvious design is
  an accent score with a dimmed "/100"; it cannot be built. The accent
  clears 4.5:1 on its own surface by only 0.05–0.25 (R 4.55, J 4.57,
  C 4.60), so any mix toward the surface drops the target text below AA on
  four of seven sets. Hierarchy comes from **weight** instead, which costs
  no contrast.
- The ✕'s optical −13px margin moved from the bar to a new wrapper: the
  correction belongs to whatever touches the row's edge, and below `md`
  that is now the number. Measured on Set N (no guide chip): left inset
  21px, right inset 21px.

New helper `compactProgressLabel` in `quizMode.ts`, tested including the
negative case (`SHIPPED_FLOOR` bounds further debt, it does not clamp to 0,
so the row has to hold `-10/100` on one line — it does).

---

## 4 · Bigger pattern in the quizzes — DONE, and it's a dial

`QUIZ_PATTERN_SCALE = 1.25` in `components/quiz/patternLayer.tsx`.
Verified live: the fat pixel measures **21.25px** where it was 17.

**This constant IS the pattern lab's Scale slider.** `docs/pattern-lab.html`
renders `(px ? 1.7 : 1) × state.scale × mobileScale`; the app now renders
`PIXEL_FIELD_MACRO × QUIZ_PATTERN_SCALE × (mobile ? 0.6 : 1)`. Same three
factors, same order — whatever number the slider lands on is this constant,
no conversion. So if 1.25 is not it, the lab is the place to find the
number and there is nothing else to change.

It deliberately does **not** move `PIXEL_FIELD_MACRO`. That constant is the
engine's, and the engine has other customers — the footer band and the
exported brand covers — which were judged at the old pitch.

Ceiling, if he wants to push further: the **footer band**, not the start
screen. The band is a fixed 112px strip, so past ~1.4 it stops being a
texture and becomes separate shapes. On the start screen alone 1.4 still
reads.

A same-seed comparison sheet at 1.00 / 1.15 / 1.25 / 1.40, on both
treatments and both breakpoints, was generated from the real engine and is
in this session's scratchpad (`scale-compare.html`). Say the word and it
can be regenerated in seconds.

---

## 3 · Footer illustration — LAB, not shipped → `docs/footer-band-lab.html`

Both directions Malik named, on the real Set L mint with the real bottom
bar above them, at the shipped 56px. Every direction keeps the existing
1600×56 `slice` wrapper, so the band's footprint on the page never moves —
that was the stated constraint. Dials for accent pool, band height, seed
and quilt rate.

**The finding worth the session:** _the quilt has a natural scale, and it is
not the cover's._ A quilt cell is `62 × scale` px and rows are laid from
y=0, so a band whose height is not a whole multiple of the pitch always
ends in a cropped row. That gives the strip one exact answer —
**scale = band height / 62**, which at 56px is **0.90** — and it produces a
single uncropped row of pixel shapes, which is what a border wants to be.
At the covers' own 1.53 you get a sliver and nothing else.

So the two honest options, not one:

- **Direction A — Camo · classic at 0.50.** "The same band, bigger." One
  number, no colour moves, so no contrast can regress; stays a continuous
  texture. 0.70 is past the ceiling (shown in the lab as A′).
- **Direction B — Quilt · pixel at 0.90.** The better-looking band of the
  two, and the one that makes the page's last object and a profile's first
  object the same pattern. Its cost is a **change of register**: the
  shipped band is a texture you read as tone, this is a row of discrete
  marks you read as a border. That is a design change, not a tuning, which
  is why it is not shipped.

Either way the only edit is inside `bandSvg()` in `components/footer.tsx`.

---

## 6 · App icons — LAB + real assets → `docs/app-icon-lab.html`

**Nothing was redrawn.** `public/icon-512.png` is a two-colour mark, so
every pixel was read as a position between its ground `#85FD9D` and its can
`#231F20` and re-laid on a new pair — in **linear light**, so the
antialiased edges and the knocked-out bubbles land exactly where they
already are. The silhouette in every candidate is bit-for-bit the shipped
one; only the two colours moved. That is precisely "keep the icon we
already use but flip the colour", and it is reproducible.

Candidates are real files in `docs/brand/icons/` — each as the plate (512 +
192), a **fitted maskable**, and a **180px apple-touch-icon**.

| candidate                               | figure/ground |
| --------------------------------------- | ------------- |
| today (control)                         | 12.83:1       |
| **Flip · Set L — mint can on plum**     | **12.67:1**   |
| Upright · Set L — plum can on mint      | 12.67:1       |
| Flip · cream can on plum                | 12.63:1       |
| Flip · brand green taken deep `#023318` | 12.01:1       |
| Flip · mint can on magenta              | 4.75:1        |

The shipped icon reads at 16px because it runs 12.83:1. **That number, not
the hue, is what makes a favicon legible**, so it is the constraint any
recolour has to hold. Flipping into Set L keeps it almost exactly. Magenta
does not, and the 16px column in the lab is where that shows.

**Recommendation: Flip · Set L, mint can on plum.** Literal reading of the
brief, holds the contrast the icon depends on, and plum + mint is what the
navbar, landing, footer and Set L's own drills already speak — so an
installed icon matches the first screen it opens.

The one argument against it is heritage: LogiCola has been green since the
Windows 3.1 build shipped a scheme named "Forest green". That is what
**brand green taken deep** is for — the brand green's own hue and
saturation walked to v=0.20, the deepest it goes while still holding 12:1
against the mint. It costs 0.7 of a contrast point.

### Three findings that came out of doing this

1. **The maskable icon is clipped today, on every colour.**
   `manifest.json` declares `icon-192.png` as `"purpose": "any maskable"`,
   which promises Android that all content sits inside a circle of 80% of
   the canvas. Measured on the actual art: the can's box is
   `(124, 71) → (386, 440)`, so its furthest corner is **227.3px** from
   centre against a safe radius of **204.8px**. An aggressive circular mask
   clips _into the can_. It also has transparent corners, which lets the
   launcher's background show through the mask — the other half of the same
   bug. The `-maskable.png` files are the fix (same art at 0.901 on a
   full-bleed ground); the lab shows all three states side by side.
2. **There is no apple-touch-icon.** `app/layout.tsx` declares only
   `icon: '/icon.svg'`, so iOS has nothing to install with. Each candidate
   ships one — square and opaque on purpose, because iOS applies its own
   squircle and a pre-rounded PNG shows the old radius inside the new one.
3. **The product ships three different marks** — `public/icon-512.png`
   (this can, with bubbles), `app/icon.svg` (a plainer magenta can, no
   bubbles) and `public/lc_logo.gif`. Already flagged in
   `brand-decisions.md`. Recolouring the PNG does not fix it: whichever
   candidate wins, `app/icon.svg` needs the same pair or the browser tab
   and the installed app will disagree.

**Not tried: the new logo/wordmark as the icon.** Malik guessed the icon
would work better and he is right for a reason worth stating — the brand's
own division of labour (`brand-decisions.md`, 2026-08-12) is _"the avatar
carries the logo, the cover carries the pattern, neither ever does both"_,
and an app icon is an avatar. A wordmark at 16px is a smudge.

---

---

# Round 2 — after Malik's notes

Three notes came back mid-session: the footer quilt should carry the sets'
colours like the social artifact; the icons should be inverted with **many**
more variations ("these things are numbers games"); and then the decided
social scheme itself, which "should inform decisions on the footer and
icons". Round 2 is those three, and it **overturns part of round 1**.

## A method, first — because it is what made the volume affordable

Colour pairs are now scored, not argued, with the **Duru / ColorMoods
stimulation model** (`two-color-harmony` skill): perceptual intensity σ
weighted ×4, CIELAB ΔL ×2, circular hue distance ×1, plus the vibration
risk curve and the halfway-blend check. On top of that sit the gates this
product already has — WCAG contrast and the OKLab distances in
`lib/patterns.ts`. The composite weights contrast 0.42, because a 16px
favicon is the binding case.

Two whole families died on measurement before anything was rendered, which
is the point of scoring first:

- **Tab-colour grounds fail** — 2.6–4.3:1 against any can. Not bad luck:
  the tab colours were engineered to sit at the balance point where they
  clear ~3.5:1 against _both_ light and dark browser chrome. Being
  deliberately mid-value is exactly what disqualifies them as a ground.
- **Ink ground + that set's own accent fails** — 1.5–3.0:1 across all
  seven. The method predicts it: _pick accents for value contrast against
  the ink, not the background._ Set R's ink and accent are 1.54:1 apart.

What survives is one structure: **a dark chromatic ground with a pale can**,
or its mirror. Every candidate above 9:1 has that shape.

## I got the footer wrong in round 1, and the correction is the useful part

Round 1 measured the seven set surfaces against the footer's mint, found
only 2 of 7 clear `quiltAccentPool`'s 0.17 floor, and concluded the surfaces
could not carry the band — proposing the tab colours instead.

**The brand lab had already been here and reached the opposite conclusion,
for a better reason** (`docs/brand-lab.html`, 2026-08-12/13):

> THE GATE IS A STUDY-SURFACE RULE, and the cover is not a study surface…
> a quilt tile is a SHAPE with a hard edge and a gap around it. **Edge does
> the work that contrast does on a text surface.**

The ungated modes keep the _ink_ gate — a tile the colour of the dominant
has no edge, so it genuinely vanishes — and drop the _ground_ gate. A footer
band is a cover, not a quiz screen: 56 decorative pixels below the last
link, under nothing anyone reads. The rule has no jurisdiction there.

So the answer needed no new design decision at all. The decided cover is
`Set L · Sets · full` — ground `#CFF6DD`, dominant `#3F0167`, a nine-colour
pool, rate 75% — and **the footer already runs that exact ground and that
exact dominant**. I reproduced the pool from the lab's own rule and it
matches Malik's screenshot byte for byte:

```
#FFABC6 #E7F099 #E6ACF4 #9EDAFF #D9CCF9 #E4BDF7 #02302C #1C3601 #751100
```

(The three rejected inks are rejected at 0.021 and 0.082 from the plum
dominant, and "is the dominant".)

**Recommendation: the cover recipe, verbatim, at scale 0.90.** The only open
number is scale, because a quilt cell is `62 × scale` and rows are laid from
y=0, so a 56px strip has one exact answer — `height / 62`. The cover's own
1.53 puts a 95px cell in a 56px band and shows one sliver. Same pattern,
same palette, different number: the same object at two sizes.

Also settled structurally: **camo cannot do this at all.** `camoBody` reads
exactly one entry from its pool (`const c1 = pool[0] || ink`), so a camo
band is a two-colour object however you tune it. "Feature the sets' colours"
does not choose between direction A and direction B — it selects B.

What survives from my tab-colour analysis is one true measurement, kept in
the lab as an alternative: the tab colours are the only tier where all seven
sets are _simultaneously_ gate-clearing and mutually distinguishable
(closest pair 0.101, against the surfaces' 0.041 and **eight** collapsing
pairs). That matters if the goal is "every set identifiable" rather than
"the same artefact as the covers" — and it is worth carrying back to the
cover decision, where the same eight pairs collapse.

## Icons — 50 variations, nine families

Still nothing redrawn: one `t`-map, re-laid fifty times. New this round is a
per-pixel label for the **twelve knocked-out bubbles**, which lets a variant
paint each one a different set's colour.

Families: today inverted · site scheme · one per set (inverted) · one per
set (upright) · set ink + constant can · cross-set · all seven sets ·
**the decided social scheme**. Every variation is on the sheet at 16px in
one row — the only test that matters for a favicon, and the one a 512px
preview always flatters.

**The decided avatar is a plum mark on a mint ground** — a pale ground with
a dark mark, which is the _same_ orientation today's icon already has. So
"invert the colours" moves the icon _away_ from the avatar. That tension is
Malik's to resolve, but one measurement makes it decidable: **the can is
30.5% of the tile and the ground is 69.5%**. The orientation choice is not
which colour is the star; it is _"is this app a pale tile or a dark tile?"_
— and the answer differs by medium. The avatar sits on a white page inside
a ring the platform draws. The app icon sits in a dock over arbitrary
wallpaper with no ring.

The two real candidates:

- **The cover in miniature** — plum can on mint, the cover's own accents in
  the bubbles. The only candidate that rhymes with _both_ social artefacts:
  it is the cover's colour logic at icon scale (mint ground, plum mass,
  those nine accents) and it keeps the avatar's orientation for free.
  12.67:1, unchanged, because the pair underneath is unchanged.
- **The cover inverted** — same nine, mint can on plum, so it is a dark
  tile that holds its edge anywhere.

Plus a heritage option that changes no brand colour at all: **today
inverted, dark end pulled to brand green** (`#023318`), 11.10:1, hue
distance 0.08 — a near-monochrome swap of figure for ground.

Ship-ready files (fitted maskable + 180px apple-touch-icon + 192) exist for
the six-candidate shortlist in `docs/brand/icons/`.

## The end screen got the same treatment — `docs/endscreen-lab.html`

Malik: _"not just on the icon but everywhere else connected to design."_
Fair — round 1 shipped one end-screen composition with no alternatives,
which is not how this project decides things. Six compositions now, same
content and same action set, only the arrangement changing, on real palettes
and the real pattern engine.

**The finding that justified the lab:** on 2026-08-22 the _question_ screen
was deliberately moved off vertical centring — prompt top-anchored, answer
group bottom-anchored, the 2008 window's posture. **The end screen I shipped
is centred**, so the last screen of a run re-introduces the exact model the
screen before it just abandoned. That may still be right — a terminal screen
has no next question to keep stable — but it should be a decision.

The six: centred (shipped) · bottom-anchored · score-as-hero · the receipt
(the only one that surfaces the level, which currently hides inside a
sentence) · two gems in a row · bottom-anchored + two gems. The last two
test whether tonight's _demote Try Again after a completed run_ rule is
right at all.

The lab also carries **six variants of the phone points readout**, since
that shipped without alternatives too — including the question of whether
the number should be the set's ink (7–12.7:1, safer) or its accent
(4.55–5.66:1, but it is the bar's own colour, so it reads as the bar's value
rather than a second unrelated fact). And the constraint that kills the
prettiest ideas: **nothing may be dimmed**, because the accents clear 4.5:1
by as little as 0.05.

## Round 2 changed no product code

All three labs, the 50 icon files and the shortlist assets are new; the
product is exactly as round 1 left it. 536/536 tests, eslint clean.

---

# Round 3 — after four more notes

Four came back: try other **positions** for the phone points ("perhaps below
the bar, or perhaps disconnected from the bar"); the end screen's **buttons
could differ in colour** because "Try the hard set is definitely more
important than Try again"; **the coloured bubbles don't work** — try the
favicon can and the new logo instead, so they can be compared; and the
"just bigger" footer reading **might work at the size used inside a quiz
question**.

## Phone points — `docs/points-readout-lab.html` (new)

Eight positions on real geometry: 390px phone, 8px side padding, the 44px
close target with its −13px optical correction, the 12px sprite-capped bar,
the 44px Guide chip. Dials for set, score and whether the Guide chip is
there (Set N has none).

Two constraints do more work than taste here. **The row is 44px because the
tap targets are**, so anything that stacks a second line — _below the bar_
and _above the bar_ — makes the sticky header ~16px taller, and sticky means
it costs that on every scroll position rather than once. And **the score can
be negative**: `SHIPPED_FLOOR` bounds further debt but does not clamp to
zero, so every position must hold a minus sign.

That last one kills the prettiest option outright. **Riding the fill's
leading edge** — a chip pinned to where the fill ends — is the nicest thing
on the sheet and cannot ship: at 0% there is no edge to ride, at 100% it is
pushed off the track, and a negative score has no position at all.

The two that are genuinely different ideas:

- **Left of the bar.** Cheapest change, clearest argument: left to right it
  reads _"45 of 100, and here is how far that is"_ where the shipped version
  reads _"here is a bar — oh, 45"_. It also groups the number with the ✕
  (both facts about the run) rather than with the Guide chip (a control).
  Same pixels, better sentence.
- **Detached into the sheet.** Costs the header nothing and is already
  half-built — the sheet renders this exact label today, visible from 768px
  and `sr-only` below it. Shipping it is _deleting a breakpoint condition_,
  not adding markup. Cost: the sheet is where the thumb is, not where the
  eye rests, and it vanishes while the guide is expanded.

Where it stops being evidence: nothing settles "number left or right of its
bar" for a 46px readout in a 44px row. Three of the eight are defensible and
the choice is Malik's eye. What the sheet _can_ settle is which are ruled
out, and it does.

## End-screen buttons — and contrast turns out not to be visual weight

Malik is right that they should differ. The treatments are more constrained
than they look, because **a gem is `clip-path`ed and therefore paints no
outline and no box-shadow** — the same fact that made the focus indicator a
painted band. Every "outlined" button here is a real two-layer gem, the
construction `ringBand` already uses.

Measured across all seven palettes:

| secondary              | label on fill | boundary vs surface |              |
| ---------------------- | ------------- | ------------------- | ------------ |
| solid accent           | 4.55 (R)      | 4.55 (R)            | passes       |
| ghost + ink rim        | 7.04 (R)      | 7.04 (R)            | passes       |
| tonal 18% + ink rim    | 5.14 (R)      | 7.04 (R)            | passes       |
| tonal 18%, no rim      | 5.14 (R)      | **1.35 (J)**        | fails 1.4.11 |
| accent fill, ink label | **1.54 (R)**  | 4.55 (R)            | fails 1.4.3  |

**Every soft "tonal" secondary fails 1.4.11 without a rim** — 1.22–1.58:1
against its own surface. The label is legible, the _button_ is not. That is
the treatment everyone reaches for first, so it is in the lab as a labelled
trap.

Then the finding I did not expect. On Set L a magenta accent secondary has
_lower_ contrast than the plum primary (4.75 vs 12.67) and still shouts
louder. Two dials pull opposite ways: **the ink has more lightness
separation on 7 of 7 sets; the accent has more perceptual intensity on 6 of 7.** So which reads as primary depends on how you weight them, and it
genuinely differs by set — a colour-swap hierarchy **inverts on A, C, J, L
and N** and holds only on Q and R.

A hierarchy built on **fill versus no fill cannot invert**, because a solid
object out-weighs a hollow one whatever colours they wear. Hence the
synthesis, and my recommendation: **ghost with an ACCENT rim** — the two
buttons are visibly different _colours_, which is what was asked for, and
the hierarchy is carried by weight, so it holds on 7 of 7. Each card in the
lab now states its own stability check.

## Icons — three marks, compared

The coloured bubbles are out, and the 16px row shows why: twelve 25px
knockouts in a 512px tile are sub-pixel by favicon size, so the variant
degrades to the plain pair exactly where an icon works hardest. Kept as
evidence, not as a proposal.

Both requested marks are built, as **vector**, from the real sources —
`app/icon.svg` for the favicon can and `lib/wordmarkPaths.ts` for the
wordmark, the latter rendered exactly as `marketingTheme`'s `markSvg` does
it, with the lettering a knockout showing the ground and never white ink.
The favicon can is placed on the shipped can's own bounding box (aspects
0.714 vs 0.710), so what differs between the rows is the **drawing**, not
the sizing. Three marks × six colour pairs, each at 104 / 32 / 16px.

They fail in different directions, which is the useful part:

- **The shipped can** has the most character at 512 and loses its bubbles
  first; the silhouette survives 16px because it is one closed shape.
- **The favicon can** is the most robust at 16px and the least distinctive
  at 512 — stripped of bubbles and clasp, a tall rounded rectangle with two
  ribs is a shape many apps already own. Judge it small.
- **The wordmark** is unmistakable at 104px and unreadable at 16px. It is
  also the mark the **decided avatar already uses**, so choosing it makes
  the app icon and the social avatar the same object rather than siblings —
  and `brand-decisions.md`'s own rule ("the avatar carries the logo") is an
  argument for it.

The counter-argument is only the 16px row, and it is not small here:
`useQuizFavicon` repaints `app/icon.svg` per set during a run, so 16px is a
case this product ships deliberately. **The honest resolution may be that
these are two jobs** — the wordmark at 512/180 where it reads, a can at 16px
where it must. Most brands with a lettering mark do exactly that, and it
costs nothing because both are already generated.

## Footer at the quiz's own scale

Added, and Malik's instinct is half right. The question screen's band is
camo classic at `QUIZ_PATTERN_SCALE` 1.25 drawn from `QUIZ_SURFACE_POOL`,
which yields Set J's lilac `#E6ACF4` as the accent — the plum-and-lilac in
his screenshot. At that scale the blob is **~128px**.

- **At the quiz band's own 112px** it reads exactly as the screenshot does,
  and the site footer and the question screen would close with literally the
  same object. It doubles the band's footprint, which the original brief
  said should stay.
- **At 56px** the same field shows a horizon of very large shapes with a lot
  of empty mint. It is also **fragile**: a 56px window onto a 128px-featured
  field is largely decided by the seed, and the band's seed is fixed once and
  forever. Worth flipping the seed dial before judging it.

So: the "just bigger" reading works at the quiz's size _and_ the quiz's
height, or not really at all. Both are in the lab.

## What a research round changed — and one real bug it turned up

With ultracode on I ran a 17-agent workflow over the three open questions,
every top claim independently attacked by a skeptic. Two findings are
verified against this repo and matter more than anything I designed tonight.

**1 · The app already knows how well you reached 100, and throws it away.**
`lib/scoring.ts` carries `solvedClean` ("Problems solved first try — **for
the end screen**") and `missed`. `solvedClean` appears **nowhere else in the
codebase**. The data was built for this screen and never wired to it — and
it matters, because _"graduated" is not one thing_: reaching 100 on a
translation set means only `clean − missed = 20`, so 20-for-20 and 40-for-60
get the same headline and the same hierarchy. Two consequences: the
**receipt** composition has a real figure to show ("18 of 22 first try"), and
the primary could key on run _quality_ rather than merely on hitting the
target — clean run → the successor, marginal run → Try again with the
successor demoted but still visible. That is a genuine amendment to tonight's
rule and it costs one prop.

**2 · A real analytics bug, verified.** In scored mode
`useQuizState.tsx:409` computes
`score_percentage = correctQuestions.length / totalQuestionCount * 100`,
and in scored mode `totalQuestionCount` is **the whole question bank**
(line 111–114) because a scored run has no denominator. So a flawless
20-problem run on Set Q's 118-question bank reports **17%**. The property is
meaningless for every published set, and per `CLAUDE.md` there are saved
PostHog insights pointing at it — so fixing it means re-pointing them with
the `coalesce(properties.new, properties.old)` convention. Not tonight's
work, but it should not sit undiscovered.

**3 · The exit contradicts itself.** "All exercises" routes to `/`, where
`resumeBanner.tsx` says _"Continue where you left off — you were at N
points"_. A just-completed run is handed to a surface describing it as
unfinished. Low severity; the fix is a completion flag on `LastDrill`.

**Folklore that did not survive the skeptics**, worth knowing because it
would otherwise have decided things:

- _"Apple/Microsoft prohibit type in app icons."_ Neither does — both say
  avoid unless essential, in the same sentence, and Microsoft ships Word,
  Excel and PowerPoint as letter plates. The case against the wordmark is
  **arithmetic, not guidance**: at 16px its letter strokes render at 0.45 of
  a device pixel (the bubbles at 0.78). That rules it out at one size only,
  which is why the answer is a size-tiered family rather than a winner.
- _"No major learning app puts a numeral beside its progress bar."_ Not
  established — the Duolingo evidence predated the 2022 redesign and the
  Memrise citation said the opposite. This one **changed a ranking**: it
  demoted "detach the score into the sheet" from first choice to fallback.
- _"M3 forbids two filled buttons / colour is never a substitute for tier."_
  No such rule; M3 files the styles under an axis literally named _Color_.
  What survives is the useful half — M3's worked pairings always differ
  **structurally** (fill vs outline vs none), never by hue alone. Which is
  exactly the argument for _ghost with an accent rim_.
- The _"42% lift from button hierarchy"_ figure traces to no primary source.

One claim I could **not** verify and am therefore not repeating as fact: the
research says `lib/scoring.ts`'s ScoreFloor docstring (74% / 62% / 58%
minimum first-try accuracy) is stale. My own derivation says those numbers
are **bank-size dependent** — `n = 20/(2a−1)` — and the docstring states no
bank size, so it is at best under-specified. Worth a check, not a conclusion.

Also flagged and untested here: **dark mode, Safari's monochrome pinned tab,
and iOS tinted/clear icon variants.** A two-colour knockout mark can collapse
when the system flattens it to one ink. One lab pass before any icon ships.

## Round 3 changed no product code either

Rounds 2 and 3 are labs, measurements and assets. The product is exactly as
round 1 left it: 536/536 tests, eslint clean, everything prettier-clean.

---

## What I did not touch

- **The desktop start/end screens overflow the viewport by ~106px**
  (`h-dvh` section + navbar + `lg:p-4`). Pre-existing, unrelated to this
  work, and the fix is a layout decision on a screen that was composed
  deliberately. Flagging only.
- Everything in the 2026-08-22 working tree, except the one `:has()`
  selector line named above.
- Nothing committed.

## Files

**New**: `lib/nextDrill.ts` (+ test) · `docs/footer-band-lab.html` ·
`docs/app-icon-lab.html` · `docs/endscreen-lab.html` ·
`docs/points-readout-lab.html` · `docs/brand/icons/*` (50 raster variations,
12 vector mark variants, ship-ready assets for the shortlist)

**Changed**: `components/quiz/endScreen.tsx` (rewritten) ·
`components/quiz/index.tsx` · `components/quiz/gemButton.tsx` (+`GemLink`) ·
`components/quiz/patternLayer.tsx` · `components/quiz/quizMode.ts` (+ test) ·
`app/globals.css` (`.qpoints` block, gem focus-band selector)

## Learnings worth carrying

- **Set L flatters every contrast check.** At 12.67:1 it passes anything,
  which is how an `opacity-70` link that fails AA on three sets shipped.
  Any new tier has to be measured against all seven inks, and the honest
  reading is always the _worst_ set, never the one in front of you.
- **A near-threshold accent has no room for a second tier.** The quiz
  accents clear AA by 0.05–0.25, so "same colour, dimmed" is not available
  as a hierarchy device anywhere on a quiz surface. Weight is free;
  lightness is not.
- **Adjacency in a data file is not a curriculum.** The next row of
  `quiz-catalog.json` after Set A Hard is Set C. Shipping that as "what to
  do next" would have been the app making a pedagogical claim out of an
  array index — the fix was to filter to the set first, then step.
- **Recolour beats redraw when the artwork is already right.** Reading each
  pixel as a position on the ground→can axis and re-laying it on a new pair
  preserves antialiasing and knockouts exactly, and it makes the change
  reproducible instead of a hand-made file nobody can regenerate. Do the
  projection in _linear_ light — in gamma space the halo lands wrong and
  the mark grows a rim.
- **A hidden Browser pane never fires rAF**, and `PatternLayer` redraws
  inside `requestAnimationFrame`. A pattern layer that looks empty after a
  viewport resize in the pane is the harness, not the product: reload so
  the component's _synchronous_ first `draw()` runs at the new width.
  (Third time this trap has cost time — it is in the memory file.)
