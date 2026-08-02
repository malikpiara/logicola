# LogiCola color system — working document

Status: **in refinement, lab-first.** Nothing here ships to
`components/quiz/index.tsx` (`getQuizScreenColors`) until the whole system is
settled — cross-set relatedness is part of the method. Method reference: the
global `two-color-harmony` skill (`~/.claude/skills/two-color-harmony/`),
built from Ruxandra Duru's framework and the reverse-engineered ColorMoods
generator. Working prototype: the "Start-screen pattern lab" artifact
(claude.ai/code/artifact/834effbe-bbf0-4a58-831a-48af77b90f1b), which now
embeds the ColorMoods scoring model and a pair generator.

## Intent

Honour the original LogiCola's rich, chromatic colors while modernising.
Every set is a duotone: **pale-tinted surface + very dark chromatic ink**,
plus one accent chosen for value contrast against the ink. Test patterns for
color decisions: **Camo · classic** and **Camo · giant** (they show
surface/ink/accent in organic masses at honest proportions).

## Current palettes (as in `getQuizScreenColors` today)

| Set | Surface              | Ink                   | Accent            | Verdict                                                      |
| --- | -------------------- | --------------------- | ----------------- | ------------------------------------------------------------ |
| A   | `#1C3601` dark green | `#FFFFFF`             | `#F233DF` magenta | keeper (inverted structure: dark surface, light ink)         |
| C   | `#E7F099` chartreuse | `#02302C` dark teal   | `#02302C`         | **favourite** — halfway pair (~80°), lukewarm, huge ΔL       |
| J   | `#E6ACF4` lilac      | `#1C3601` dark green  | `#1C3601`         | **favourite** — complementary hues defused by near-black ink |
| L   | `#C8F0E3` mint       | `#3C034F` deep purple | `#3C034F`         | favourite                                                    |
| N   | `#ADE2E9` sky        | `#2A0D73` indigo      | `#1F0D92`         | acceptable; accent must be value-sorted vs ink               |
| R   | `#F2CDA6` peach      | `#190B45` navy        | `#1F0D92`         | **failing — being replaced**                                 |

## The Set R diagnosis

R is the only pair crossing the warm/cool divide, and orange–blue is the
strongest complement in the wheel: maximum hue tension, no shared temperature,
nothing mediating. Retuning the surface (peach → apricot `#FFD199`, matching
C/J/L's OKLCH character) improved the surface but cannot fix the pair — **the
ink is the problem, not the orange.**

Reference stills (Malik's screenshots) agree: orange lives with **olive**
(analogous through yellow), **plum/purple** (halfway, warm side), **maroon**
grounds — always chromatic warm darks, never blue, never black.

### Candidates in the lab (pick pending)

| Id  | Chord                             | Surface   | Ink       | Accent                                    |
| --- | --------------------------------- | --------- | --------- | ----------------------------------------- |
| R2  | apricot & olive (still 3)         | `#FFD199` | `#4A4708` | `#A93BE8` purple completes                |
| R3  | orange & plum                     | `#FBAB5E` | `#45104E` | `#C2187B` magenta completes               |
| R4  | marigold & violet (still 2)       | `#F2C14E` | `#451D71` | `#C98BEB` lilac completes                 |
| R5  | maroon ground & apricot (still 1) | `#8E4242` | `#FFD199` | `#A833E8` — inverted structure like Set A |

## Sampled chords from the reference stills

1. Maroon ground `#8E4242` · oranges `#F8830B` / salmon `#F28E68` · pink
   `#E88AB0` · lilacs `#C79EF2` · vivid purple `#A833E8` · olive `#4C4A0C`
2. Purple `#B76AE0` × marigold `#EAB33C`
3. Olive ground `#5A5407` · orange `#F5850C` · lilac `#C46FE8`

## Rules locked so far

- Duotone at full strength (no tints/washes); flat, no gradients.
- Pale surface + dark chromatic ink (or the inverse, per Set A / R5).
- Ink shares the surface's temperature; complements only as accents.
- Accents auto-sorted by |ΔL vs ink| (implemented in the lab's `filteredPool`).
- All perceptual math in OKLCH/OKLab; character edits (L, C) before hue edits.
- To generate new set pairs: fix the surface, target the stimulation region of
  C/J, take the generator's suggestions, then apply the structure rules above.

## The recovered stimulation setting

Scored with the ported ColorMoods model (surface vs ink):

| Pair                 | Score                            |
| -------------------- | -------------------------------- |
| Set C                | 0.551                            |
| Set J                | 0.540                            |
| R2 apricot & olive   | 0.418 (calmer than the family)   |
| **R3 orange & plum** | **0.539 — matches C/J exactly**  |
| R4 marigold & violet | 0.592 (slightly hotter)          |
| R5 maroon & apricot  | 0.400 (calm; inverted structure) |

**The LogiCola stimulation region is ≈ 0.54.** This is, in effect, the
ColorMoods slider position Malik used when generating C and J originally.
Note the score alone doesn't catch R-with-navy (0.578, vibration 0) — its
failure is the temperature crossing, which the studio flags separately.

## Reference stills, measured

| Chord                           | Score                     | Note                                                               |
| ------------------------------- | ------------------------- | ------------------------------------------------------------------ |
| Still 1: maroon ground × orange | 0.450                     | analogous warm                                                     |
| Still 1: lilac × olive          | 0.477                     |                                                                    |
| Still 3: olive ground × orange  | 0.463                     |                                                                    |
| Still 3: olive × lilac          | 0.550                     |                                                                    |
| Still 2: purple × marigold      | **0.652, vibration 0.27** | the deliberate spike — poster/motion energy, not a reading surface |

## Generated sets from the stills (G family, in the lab)

| Id  | Chord                                    | Surface   | Ink       | Accent    | Score |
| --- | ---------------------------------------- | --------- | --------- | --------- | ----- |
| G1  | salmon & maroon                          | `#FFB394` | `#6E2430` | `#C79EF2` | 0.438 |
| G2  | pink & olive                             | `#FFAFCF` | `#4C4A0C` | `#F8830B` | 0.450 |
| G3  | lilac & olive (still 1's pill)           | `#D9A9F2` | `#4C4A0C` | `#F8830B` | 0.485 |
| G4  | orange & maroon (still 1's ground chord) | `#FFA759` | `#5E1F26` | `#A833E8` | 0.467 |
| G5  | pink & plum                              | `#FFABC6` | `#4A1040` | `#EAB33C` | 0.464 |

## Target stimulation — decision

**Band, not point: 0.45–0.58 for quiz surfaces.** C/J anchor the top
(0.54–0.55); the stills and the warm G family sit 0.44–0.49. The gap is
partly an artifact of Duru's per-hue intensity weights (orange/red segment
0.90 vs chartreuse/lilac 1.10) — warm pastel duotones plateau lower on the
metric while feeling equally lively. Reserve 0.6+ (still 2's purple×marigold
zone, vibration-adjacent) for marketing/motion moments, never study surfaces.
The original's EGA-bright energy is honoured through accents and patterns,
not through surface pairs.

Terminal accent pools retired from the lab (kept in git history); a
"Reference stills" pool with the full sampled chord replaced them.

## Malik's saved sets (recovered 2026-07-30) and what they taught

★ = "works amazingly well". Scores from the ported model.

| Id  | Chord                    | Surface   | Ink       | Score                                   |
| --- | ------------------------ | --------- | --------- | --------------------------------------- |
| ★S1 | lilac & rust             | `#E4BDF7` | `#AD3821` | 0.49 — 90° halfway, dusty-rose midpoint |
| S2  | marigold & teal          | `#FBCB6A` | `#02302C` | 0.57                                    |
| S3  | committed sky & indigo   | `#77C6EE` | `#2A0D73` | 0.53                                    |
| S4  | chartreuse & deep violet | `#E7F099` | `#0F005A` | 0.68                                    |
| S5  | chartreuse & blurple     | `#E7F099` | `#3821AD` | 0.68                                    |
| S6  | lilac & pure blue        | `#E6ACF4` | `#0000F5` | 0.63                                    |
| S7  | lilac & deep blue        | `#E6ACF4` | `#0000A7` | 0.58                                    |
| ★S8 | pale green & violet      | `#DBFAD5` | `#400081` | 0.63                                    |
| ★S9 | committed coral & navy   | `#FB826A` | `#190B45` | 0.58                                    |
| S10 | orange & navy            | `#FBB36A` | `#190B45` | 0.58                                    |
| S11 | Set A with lime ink      | `#1C3601` | `#C3FF7A` | 0.51                                    |

**Doctrine revisions from this data:**

1. Inks may be vivid and mid-value (L 0.22–0.51, chroma to 0.30) — not only
   near-blacks. The ink is a colour, not a darkness.
2. The taste band widens and heats: **0.45–0.65** (favourites at 0.49 / 0.58 /
   0.63).
3. Temperature crossing works when the surface commits (S9's saturated coral +
   navy) — the old R failed for timidity (pale low-chroma apricot), not for
   crossing per se.

## Variant pass (A2–N3, in the lab)

Two per original set, applying the above: one hotter sibling with a vivid
ink (C2 rust, C3 plum, J2 magenta, L3 plum-magenta, N3 blurple), one in a
different register (A2 apricot-ink, J3 orchid, L2/N2 calm teals). Scores
0.40–0.62, zero vibration. R excluded — it has R2–R5 plus S9/S10.

## Primary surface hues (Malik, 2026-07-30)

Diversity of surface colour is wanted, but LogiCola's **primary hue
territory is pink, fuchsia, green and chartreuse**. Other hues (sky, lilac,
orange…) are welcome as supporting sets; the core of the catalogue leans on
those four families. Accent pool for all patterns: **Sets verbatim** (the
real surfaces + Set A's magenta) — tuned/stills/terminal pools retired.

## A and MD rework

Both shared the same disease: **white ink** — a neutral where every winning
set uses a colour — and both measured at the family's apathy edge (A 0.395,
MD 0.415).

**MD: DECIDED 2026-07-30** — periwinkle surface `#D9CCF9`, violet ink
`#3E1060`, marigold accent `#EAB33C` (0.45). Malik: "really hit the nail."
The old white-ink purple (`#6C2E99`/`#FFFFFF`) is retired; MD2 (richer
purple, pink ink) kept as the dark-surface alternative for now.

**Variant ownership & renaming** (2026-07-30): Malik's saves are the
official variants for most sets, so the catalogue was regrouped by parent
and relabelled — his picks take the **first** variant slot in each family:

| Was | Now    | Chord                    |
| --- | ------ | ------------------------ |
| S11 | **A2** | forest & lime            |
| S4  | **C2** | chartreuse & deep violet |
| S5  | **C3** | chartreuse & blurple     |
| S6  | **J2** | lilac & pure blue        |
| S7  | **J3** | lilac & deep blue        |
| S8  | **L2** | pale green & violet      |
| S3  | **N2** | committed sky & indigo   |
| S9  | **R2** | committed coral & navy   |
| S10 | **R3** | orange & navy            |

S6/S7 were assigned to J because they use J's _exact_ surface hex
(`#E6ACF4`) — inferred, not stated; correct if wrong. **S1** (lilac & rust)
and **S2** (marigold & teal) stay unparented alongside the G family.

Remaining A candidates after regrouping: **A2** (ex-S11), A3 (forest &
pink), A4 (forest & mint), A5 (pink surface & forest ink), A6 (pale leaf —
too close to C).

**A: open, round two.** A4 (pale leaf) rejected — its surface sits only 24°
from C's chartreuse (pair-distance score 0.277: near-twins). Candidates now:

- **S11** — forest & lime ink, magenta (0.51): the keep-the-dark fix
- **A5** — forest & pink ink, lime completes (0.50)
- **A6** — forest & mint ink, magenta kept (0.48)
- **A7** — pink surface & forest ink, magenta (0.49): moves A into the open
  pink/fuchsia primary territory (C owns chartreuse, J lilac)
- Fallbacks per Malik: G5, S1, or full colour replacement.

## Library ranking (2026-07-30)

Scored against the codified doctrine, two views. **Pair** = surface+ink only
(chromatic ink 33, stimulation band 30, value gap 24, primary-hue territory
13). **Full** additionally scores whether the accent completes the scheme.

**Retired 2026-07-30** after the first ranking: **A** (white ink, dead last),
**R4** (apricot & olive), **R5** (orange & plum — R3 with worse contrast),
**R6** (marigold & violet — didn't cohere), **R7** (maroon ground), and
**J2** (ex-S6, lilac & pure blue — overpowering; its deeper sibling J3
keeps the chord), and **J5** (warmer orchid surface — too close to J's own
lilac, which is the hue the set is known by). Library is 32. A2 is now Set
A's de facto base; R keeps only R / R2 / R3; **every J variant now shares
the original `#E6ACF4` surface and varies only the ink** — the cleanest
family structure in the catalogue, and a good template for the others.

Top of the full ranking: **A2 · L2 · C5 · C4 · J3 · C3 · N4 · G5 · A4**.
Bottom: **S2 · N3 · C · Crm · J**.

### The accent audit — the actionable finding

Ten palettes carry an accent that does no work. Four are literally
`accent === ink` (**C, J, L, S2**) — the shipped originals never got an
accent, they just repeat the ink. Six more are near-ink twins (**C2, N, N2,
R, R2, R3** — the whole R family inherits a navy accent barely distinct from
its navy ink). These lose full-ranking points purely on the accent slot; as
_pairs_ several are excellent (L 92, N 90, R2 80.7).

**Every set with an unfinished accent needs one assigned before the port.**
Duru's rule: the accent completes the scheme — usually the complement of the
pair, in a small dose, with value contrast against the ink.

### Recalibration against Malik's stated favourites (2026-07-30)

Favourites: **C, L, L2, R, MD, S1**. Four sat in the first rubric's bottom
half — so the rubric was wrong, not the taste. Measured means:

|                       | surface L | ink L    | ink chroma | ΔL       | stimulation |
| --------------------- | --------- | -------- | ---------- | -------- | ----------- |
| His six               | 0.90      | **0.32** | **0.12**   | **0.70** | 0.54        |
| My top six (unpicked) | 0.80      | 0.50     | 0.20       | 0.62     | 0.58        |

**The doctrine correction:** the post-S-saves revision ("vivid mid-value
inks welcome") over-rotated. His settled taste is **pale surface (L≈0.90) +
genuinely deep ink (L≈0.32) + a large value gap (ΔL≈0.70)**, with ink
chroma _moderate_ (0.12), not vivid. The old A/MD white-ink failure wasn't
"insufficiently chromatic" — it was the inverted structure plus a neutral.

Rubric v2 weights: value gap 30, ink depth 22, surface paleness 18,
stimulation band 15, ink chromatic-but-not-vivid 8, accent 7 (down from 25 —
C/L/R are favourites _despite_ accent=ink, so the accent is a small element
on screen, not a gate). Hue territory dropped as a quality term: his six
span chartreuse, mint, green, orange and violet, so it's a catalogue-
composition policy, not a per-palette signal.

Fit: **L2 #1, MD #2, R #4, C #8, L #9** — five of six in the top nine.

**S1 is the exception, and it means something.** At ink L 0.51 / ΔL 0.41 it
breaks both dominant rules. Rather than contort the rubric for n=1, treat it
as evidence of a **second register**: a close-value, warm, higher-chroma
pair. Good for covers and marketing; the deep-ink register is the one that
suits study surfaces, where the value gap is also doing legibility work.

**Structural implication for Set A — CONFIRMED by Malik 2026-07-30:** every
favourite is a pale surface, and dark-surface palettes rank near the bottom
under v2. Only three dark surfaces remain: **A2, A3** (forest ground) and
**MD2** (#27). **A5** (pink surface, forest ink) is the pale-structure
option for Set A and ranks #3 — the presumptive answer to the A question.

Also cut 2026-07-30: **A4** (forest & mint), **C4** (chartreuse & rust),
**C5** (chartreuse & plum), then **A2** (forest & lime), **A3** (forest &
pink) and **G2** (pink & olive). Library is 25. Hexes preserved above and
in the ranking history if any need restoring.

**Set A is now pale-only** — A5 (pink surface, forest ink, #3) and A6 (pale
leaf, #13). **MD2 is the single remaining dark surface in the catalogue**
(#24), so the dark-ground structure is effectively retired; MD2 is the last
candidate to resolve or drop.

Further cuts 2026-07-30: **G3, C3, N4, G2, G1**. **G5 moved into Set A as
A7** (pink & plum) — note this A7 is not the earlier A7, which became A5.
Library is 22.

The shipped sky **N** (`#ADE2E9`/`#2A0D73`) was dropped 2026-07-30; the set
continues through its variants. Library is 21.

Family state: A [A5, A6, A7] · C [C, C2] · J [J, J3, J4] · L [L, L2] ·
N [N2, N3] · R [R, R2, R3] · MD [MD, MD2] · free agents [S1, S2, G4] ·
brand [Crm].

**Family state 2026-08-02:** A [A7] · C [C] · J [J] · L [L4] · N [N10] ·
R [R, R2, R3] · Q [Q] · free agents [S1, S2, G4, G6, G7] ·
held back [Q2, Crm]. Library is 16 — C2, J3, J6, A5, L and L2 retired, see
below; L4 and A8 added as in-between steps and both survived their parents,
see "Pale is not low-contrast"; N5 added, see "Two cool anchors".

Six of the seven sets are now single-palette: A, C, J, L, N and Q. Only
Set R is still undecided, with three candidates.

### Final state 2026-08-02

| Set | Palette | Surface | Ink | Accent |
| --- | ------- | ------- | --- | ------ |
| A | A7 | `#FFABC6` | `#4A1040` | `#674900` |
| C | C | `#E7F099` | `#02302C` | `#BD00AD` |
| J | J | `#E6ACF4` | `#1C3601` | `#674900` |
| L | L4 | `#CFF6DD` | `#3F0167` | `#BD00AD` |
| N | N10 | `#9EDAFF` | `#4A1040` | `#8D0381` |
| Q | Q | `#D9CCF9` | `#3E1060` | `#745400` |
| R | open | R/R2/R3 | `#190B45` | `#1F0D92` |

**The ink vocabulary is the quiet result.** No ink has more than two users —
`#4A1040` (A7, N10), `#02302C` (C, S2), `#24450A` (G6, G7) — apart from
`#190B45`, which is Set R's three candidates. That balance was the *argument*,
not a side effect: **N10 beat N9 on ink concentration rather than on its own
numbers.** N9 measured better on surface chroma (.103 vs .080) and cross-set
distance (.110 from Q vs .076), but its `#1C3601` forest was already carried by
J and A8, and a third user would have made forest the default ink and left the
surfaces doing less of the work of telling sets apart. Retiring A8 the same day
took forest back down to one user.

**A8 retired** in favour of A7 — see the RETIRED block; A8 was correct about
A5's chroma deficit and still lost, because Set A only needs one pink.
**N3 retired** on the criterion it never met (ink 5° from its own surface,
stimulation 0.410, 45% chroma utilisation).

**N8 → G7**, into the free-agent pool alongside G6, with its surface committed
on the way out: `#85E9FD` (L .88, C .098) → `#70E8FF` (L .87, C .112), 100% of
the gamut ceiling for that lightness. Its floor is set by its own ink: at
L .352 `#24450A` is light, so gate 3 demands an accent above L .452 and
`#9D038F` is the only catalogue colour that also clears 4.5:1 there. L .86
(C .120) and L .84 (C .142) are reachable but score 0.582 and 0.608, past the
0.58 ceiling stated above — worth noting that **this document and the handoff
disagree on that ceiling** (0.45–0.58 here, 0.45–0.65 there). Reconcile before
the port.

G7 is held for **Set B** or **Set H**, both of which exist in `content/sets/`
and are commented out of `index.ts`.

**Naming rule (2026-08-02): palettes are named for their SET.** `MD`/`MD2`
became `Q`/`Q2`; every other family already followed the rule.

- **A6 → G6.** Set A resolved into a pink-surface family, so its pale-leaf
  member no longer belongs to it. Renamed into the unparented G pool and kept
  for a future set rather than cut — the palette is fine, its parent was wrong.
- **J6 added** — *superseded the same day; J6 was retired, see "Retired
  2026-08-02" below. Kept here because the measurement stands.*
  J3's lilac `#E6ACF4` over `#0F005A`, the ink C2 then used.
  Same blue hue family as J3 (273° vs 264°) at half the lightness (OKLCH L .22
  vs .33): 9.91:1 against the surface where J3 gives 7.43, stimulation 0.53,
  vibration 0. The reason to prefer it isn't the contrast headroom — it is the
  **accent gap**: J's forest accent `#1C3601` sits ΔL .029 from J3's ink and
  ΔL .079 from J6's, so J6 is the first J variant where ink and accent read as
  two different depths rather than one.
- Borrowing an ink that already exists elsewhere in the system is deliberate.
  A new hex would widen the palette; reusing C2's violet keeps the catalogue's
  ink vocabulary small, which is what makes the surfaces do the distinguishing.

## The accent tier (2026-08-02)

The accent=ink defect in C, J, L and S2 was not four colour choices — it was
one missing tier. The accents that function in this catalogue occupy a single
band, **OKLCH L .41–.56 at 4.6–5.7:1** on their surface; every accent that
failed sat at L .28–.32, i.e. ink depth. Surfaces live at L .82–.93 and inks
at L .22–.35, and a working accent is a colour in the hole between them. The
four defective palettes simply had nothing there and reused their ink.

An accent must (1) clear 4.5:1 on the surface, (2) sit ≥ ~40° from the surface
hue *or* separate from it strongly in value, and (3) sit ≥ ~.10 lighter than
the ink. **Gate 3 is invisible to contrast tooling** — WCAG measures each
foreground against the background and never against the other foreground —
which is how J3 shipped an accent .03 from its own ink while "passing".
Gate 2 bends: A5's magenta is 21° off its pink surface and works, because
ΔL .19 substitutes for hue distance. Gate 3 does not bend.

Assigned from hexes already in the system, so the vocabulary did not grow:
C → `#BD00AD` (4.60:1, ΔL .27) · J → `#674900` (4.57:1, ΔL .13) ·
L → `#BD00AD` (4.52:1, ΔL .28) · S2 → `#7400A7` (6.02:1, ΔL .15).

J is the compromise. Its lilac surface sits at 320°, inside the magenta arc,
so every magenta in the catalogue reads there as a darker surface rather than
a third colour — the same trap S1 fell into. Ochre is the only existing hue
far from both the surface and the forest ink, and it is outside the preferred
pink/lilac/green register. Worth revisiting; the lime alternative `#405600`
is in-register but only 8° from the ink, so it is a lighter forest.

Not touched, though they fail gate 3: N2 (.03), S1 (−.10), G4 (.09).

## Retired 2026-08-02 — A5

`#FFC2DA` / `#1C3601` / `#A10094`, Set A's base until A8 replaced it the same
day. **Not cut for a failure.** It passed every gate and its 8.86:1 ink was the
highest in the family. It went because A8 is the same scheme on a committed
surface, and keeping both would have left two pinks 353° apart separated only
by chroma — a distinction users cannot act on. `#A10094` and `#FFC2DA` leave
the live vocabulary with it.

A8 is the base now. Note its chroma is at **100% of the sRGB ceiling** for hue
353° at L .853, so Set A cannot get more committed without going darker.

## Retired 2026-08-02 — C2, J3, J6

The deep-violet-ink experiment is over. All three put `#0F005A`-class blue
violet in the ink and demoted the family's original ink to the accent slot;
all three are cut, and `#0F005A` leaves the live vocabulary with them. Hexes
survive in a `RETIRED` comment block under `PALETTES` in `pattern-lab.html`,
restorable by uncommenting into the relevant family.

| Name | Surface   | Ink       | Accent    | Why it lost                                                                              |
| ---- | --------- | --------- | --------- | ---------------------------------------------------------------------------------------- |
| C2   | `#E7F099` | `#0F005A` | `#02302C` | Accent ΔL .06 from its ink — the very defect item #3 was about. C now has a real accent.   |
| J3   | `#E6ACF4` | `#0000A7` | `#1C3601` | Accent ΔL .03 from its ink while passing every contrast check. Ink chroma .228 glared.     |
| J6   | `#E6ACF4` | `#0F005A` | `#1C3601` | Measured best of the three, but 22° from MD's surface with a near-identical violet ink.    |

J3 is the one worth remembering: it is the case that produced gate 3. It
cleared 7.43:1 on its surface and 7.34:1 for its accent — two comfortable
passes — and still failed, because nothing in the tooling compares the two
foregrounds to each other. **Set C is C and Set J is J.**

## Pale is not low-contrast (2026-08-02)

A5 was reported as reading low-contrast next to A7. It measures the opposite:

| | surface L | surface **C** | ink contrast | accent contrast | stimulation |
| --- | --- | --- | --- | --- | --- |
| A5 | .876 | **.076** | **8.86:1** | 4.75:1 | 0.492 |
| A8 | .853 | .092 | 8.17:1 | 4.53:1 | 0.496 |
| A7 | .830 | **.104** | 8.26:1 | 4.70:1 | 0.464 |

A5's type is *more* legible than A7's on both counts. The difference is
**surface chroma** — .076 against .104, the palest pink in the family. A weakly
chromatic ground makes a card feel washed out regardless of how the type
measures, and no accessibility tool reports it, because contrast is a
lightness relationship and commitment is a chroma one.

The fix therefore moves chroma, not lightness. **A8** `#FFB6D4` keeps A5's hue
(353°) and its forest ink `#1C3601`, and takes A7's commitment: C .092, L .853.
The cost is accent headroom — a darker ground leaves less room beneath it, so
A5's `#A10094` drops to 4.38:1 and deepens to `#9D038F` (4.53:1). Hue exact,
value only.

**Generalisable:** when a palette is described as low-contrast, check chroma
before touching value. Deepening an ink that already clears 8:1 buys no
legibility and spends the accent's remaining room.

**L4** `#CFF6DD` / `#3F0167` / `#BD00AD` is the unrelated half of the same
request — the OKLCH midpoint of L and L2 on both surface and ink (hue 157°
between 174° and 141°; ink 305° between 315° and 295°). Stimulation 0.583 sits
between L's 0.551 and L2's 0.629, which is the evidence the interpolation is
perceptual and not merely arithmetic. It reuses `#BD00AD`, so it costs no new
hex; `L3` is a burned name from the first batch.

### The same lens applied to L: L4 survives, L and L2 retired

Running the chroma-utilisation check across the L family shows the whole set
is under-committed — **L uses 39% of the chroma available at its own lightness
and hue, L4 55%, L2 64%** — against a catalogue where L, L4 and L2 are the
first, second and fourth palest surfaces live.

**L4 is strongest** because it fails no axis: accent 4.75:1 (L's is a tight
4.52), stimulation 0.583 dead centre of band, and it sits between its siblings
on both commitment and distinctiveness.

**L2 is weakest, and the reason is that its defect is structural rather than
parametric.** Its surface is .029 from G6 in OKLab — closer to G6 than to its
own sibling L at .044 — so adopting it partly forecloses G6, which is being
held for a future set. Being the lightest surface in the catalogue (L .953)
also gives it the lowest chroma ceiling of the three. Escaping G6 would mean
moving its hue off 141°, at which point it becomes L4 or L; there is no tuning
that fixes it in place.

L's paleness, by contrast, was one number: .069 of chroma headroom at its
existing hue and lightness. Same move as A5 → A8.

**Both were retired 2026-08-02 and Set L is L4 alone.** The variant built as
an interpolation outlived the two palettes it was interpolated from — the same
outcome as A8 over A5, and for a related reason: a midpoint inherits neither
parent's extreme. L4 keeps 55% chroma utilisation, so the commitment question
remains open for it too; raising it toward the .096 ceiling is available and
would cost accent headroom the same way A8's did.

`L4` keeps its number rather than being promoted to `L`, because the original
`L` is a different scheme in RETIRED and one label must not cover two. The
catalogue has already been bitten once by a reused name (two different `A7`s).
This is open item #2 — promote bases — and it now applies to A, L and N alike:
every surviving base carries a variant number, and every rename costs the same
collision.

**MD2 and Crm held back 2026-08-02.** Neither is a candidate for a quiz
window any more, and the lab now separates them from the set palette under a
"Held back" rule rather than deleting them:

- **MD2** (`#7B2FB0` / `#FFD7F0`) — the most dissonant palette in the set,
  and user testing agreed. It is also the last dark surface standing, which
  is precisely what makes it worth keeping: **it is parked as a dark-mode
  seed, not cut.** With MD2 out, the light-surface rule is now total rather
  than near-total — the catalogue has one structure, not two.
- **Crm** (`#EDEDE3` / `#05A24B`) — the social cover's cream. Kept as a
  reference point for the brand, but too low-commitment to carry a window.
  A quiz surface has to claim a hue; cream declines to.

The MD family is therefore a single settled palette, and the "does MD2
survive?" question in the handoff is closed.

**Set A is now a pink-surface family** — pink & forest ink (A5), pale leaf
(A6), pink & plum (A7). Its green identity lives in the ink.

## Accent legibility pass (2026-07-30)

The accent renders as the "10 QUESTIONS" count text on the surface, so it
has a hard contrast floor (4.5:1 for text this size). Nine palettes failed;
Malik flagged the three worst by eye before any measurement — A7 (1.08:1),
MD (1.27), S1 (1.57).

Fix method: **preserve the accent hue exactly, move only its value** (chroma
held, clipped to gamut), searching down in OKLCH L until ≥4.6:1 while
staying perceptually clear of the ink.

| Set | Accent before | after     | contrast    |
| --- | ------------- | --------- | ----------- |
| A5  | `#F233DF`     | `#A10094` | 2.21 → 4.75 |
| A6  | `#F233DF`     | `#BD00AD` | 2.76 → 4.62 |
| A7  | `#EAB33C`     | `#674900` | 1.08 → 4.70 |
| L2  | `#F233DF`     | `#C100B2` | 2.95 → 4.77 |
| N3  | `#FA6C5B`     | `#B0241A` | 2.01 → 4.76 |
| MD  | `#EAB33C`     | `#745400` | 1.27 → 4.64 |
| S1  | `#F8830B`     | `#723800` | 1.57 → 5.66 |
| G4  | `#A833E8`     | `#7400A7` | 2.54 → 4.75 |

Every quiz palette now clears 4.5:1 (minimum 4.62). **Crm left unchanged** —
its coral is brand identity, not a set accent, and it isn't a quiz surface.

**Two open judgment calls:**

1. **S1's accent is now only 0.12 from its ink** — its orange and its rust
   ink are hue siblings, so darkening for legibility pulls them together.
   Either accept it, or move the accent to a completing hue (plum/magenta).
2. **A7 and MD lost their bright marigold**, becoming dark ochre. Same hue,
   very different character.

### The token split — TRIED AND REVERTED 2026-07-30

The accent does two jobs (count text _and_ pattern accent) with opposite
requirements, so splitting it into `count` + `pattern` looked attractive and
was implemented. **Malik asked for it to be reverted**, and it has been: the
lab is back to a single `accent` per palette.

Why it was rolled back: the implementation did not stay data-only. Alongside
the token change it **restored every palette pruned during the session**
(20 → 43) and re-ordered the accent pool, undoing the whole curation. The
colour work Malik had approved was lost inside a change he had only approved
in principle.

**Lesson — the important one from this session:** an approved idea is not an
approved blast radius. "Let's try the token split" authorised a token split,
not a library restoration. Ship one concern per change; never fold a
reversal of the user's own decisions into an unrelated improvement.

If the split is revisited, do it as a pure token change: add the second
field, touch no palette values, no list membership, no pool ordering.

**Also reverted with it** (all introduced after the approved point):

- the removal of `filteredPool`'s value-contrast sort
- the palette's own accent being appended to its pool
- an unused `wcagContrast` helper

**Standing caution, kept from that work:** the v2 ranking rubric is a fit to
six stated favourites, not a quality measure. Its ink-depth term (22 pts,
full marks at L ≤ 0.33) systematically penalises lighter, more chromatic
inks, and using it to drive removals narrows the library's colour range.
Use it to describe, not to decide.

## The original LogiCola's colour world (extracted 2026-07-30)

Evidence from `~/Code/logicola-ghidra` — the real binaries, not recollection.

**2008 `LCEXE_2008.exe`** ships a colour system that is _already a duotone
system_. Its scheme list, in order:

> Aqua/Rose · Rose/Aqua · Blue/Cream · Cream/Blue · Lime/Magenta ·
> Magenta/Lime · Gray/White · White/Gray · White/White · Random

with an intensity dial: **Pastel · Moderate · Deep**. `LC.ini` stores exactly
two fields for this — `Color=` (scheme index) and `Saturation=` (intensity).
So the original's model was: **an invertible two-colour pair plus an
intensity setting.** That is the same model this project rebuilt from Duru's
framework, arrived at independently.

**Windows 3.1 / 2003 `LOGICOLA.EXE`** names its schemes:

> Sky blue · Hot pink · Forest green · Paper white · Silver · Banana · Dusk ·
> Monochrome · Windows default · Custom · Random

and carries the VGA-16 palette by name: Black, Navy, Green, Teal, Maroon,
Purple, Olive, Gray, Silver, Blue, Lime, Aqua, **Fuscia** (sic), Yellow,
White.

**Gensler's own help HTML** (embedded in the 2008 exe) uses `#BBFFFF` pastel
aqua as the page ground and `#FFFF88` banana/cream for tables, with `#000077`
/ `#007700` / `#770000` links. Two measured pastels, straight from the author.

### Two cool anchors, not one (measured 2026-08-02)

The extraction above lists aqua and blue separately but never measured them.
Converted to OKLCH they are unambiguous, and they are **69° apart**:

| Original colour | OKLCH hue |
| --- | --- |
| VGA Aqua `#00FFFF` | 195° |
| VGA Teal `#008080` | 195° |
| Gensler's help ground `#BBFFFF` | 196° |
| VGA Blue `#0000FF` | **264°** |
| VGA Navy `#000080` | **264°** |
| Gensler's link `#000077` | **264°** |
| VGA Fuscia `#FF00FF` | 328° |
| Gensler's banana `#FFFF88` | 109° |

Three independent sources land on 264 to the degree — two VGA names and a
hand-picked link colour from the author's own HTML. The original's blue is not
approximately blue; it is a specific hue the system can be held to.

Against those anchors the N family reads:

- **N3 at 206°** — the aqua one, 10° off the anchor.
- **N2 at 232°** — *neither*. It sits between the two anchors and matches no
  ancestor. Set R was previously identified as the only set whose surface hue
  has no ancestor in the original; N2 is the second, and by the opposite
  mechanism — R's territory does not exist in the original at all, while N2's
  exists twice and N2 falls in the gap.
- N2's hues are also **232 / 284 / 273**, all inside the blue-violet arc, with
  the accent ΔL .029 from the ink. It fails gate 3: it is a monochrome with no
  third colour, which is the structural half of why it reads oddly.

**N5** `#9DBDFF` / `#1C3601` / `#8D0381` occupies 264° itself: surface L .799,
C .101 (more committed than N2's .096), ink 7.07:1, accent 4.53:1 at ΔL .145
and 69° off the surface, stimulation 0.503.

Its lightness is the output of a sweep rather than a preference. **L .80 is
where three constraints meet:** above ~.84 the blue pales into periwinkle and
collapses onto Q (perceptual distance .038 at L .88 versus .093 at L .80 —
and L2 was retired at .029 from G6); below ~.76 no accent can clear 4.5:1
without dropping to ink depth. The window is roughly L .78–.82.

Its chord is deliberately borrowed: hues **264 / 133 / 333** put A8 and J's
forest in the ink and the catalogue's magenta in the accent, so N5 reproduces
the original's **Lime/Magenta** pairing in its foregrounds while its surface
supplies the original's **Blue**. One new hex — G4's `#7400A7` gets better
contrast here (4.85 vs 4.53) but sits 46° off the surface and would read as a
darker blue, the gate-2 trap that cost J its magenta.

Also worth recording: **N3's accent `#B0241A` is a brick red at 29°, not a
magenta**, and N3's surface and ink are only 5° apart (206 / 201) — it is a
tonal aqua with a warm spark, not a three-hue chord. That 5° gap also drops its
stimulation to **0.410, below the 0.45–0.65 band**: N3 is the flattest palette
in the catalogue.

### N6 and N7 — separating anchor from chord

N5 on its own confounds two decisions. N6 and N7 complete a 2×2 so they can be
judged apart, and neither costs a new hex — both reuse A7's plum `#4A1040` and
N5's magenta `#8D0381`.

|            | aqua 195° | marine 264° |
| ---------- | --------- | ----------- |
| **forest ink** | — | N5 |
| **plum ink** | N6 | N7 |

| | hues | surface C | ink | accent | ΔL | stim |
| --- | --- | --- | --- | --- | --- | --- |
| N2 | 232/284/273 | .096 | 7.91:1 | 7.25:1 | **.030** ✗ | 0.526 |
| N3 | 206/201/29 | **.055** | 8.71:1 | 4.76:1 | .172 | **0.410** ✗ |
| N5 | 264/133/333 | .101 | 7.07:1 | 4.53:1 | .145 | 0.503 |
| **N6** | 195/336/333 | **.115** | **8.72:1** | **5.10:1** | .151 | **0.578** |
| **N7** | 264/336/333 | .101 | 7.75:1 | 4.53:1 | .151 | 0.498 |

**N6** `#56DBDB` / `#4A1040` / `#8D0381` — the aqua anchor at 195° exactly,
using 82% of the chroma available there, under a rose ink. That is **scheme #1
of the 2008 list, Aqua/Rose**, and it leads the family on every measured axis.

**N7** `#9DBDFF` / `#4A1040` / `#8D0381` — N5's marine under N6's rose ink.

### N8 and N9, and why a near-white surface cannot be distinguished by hue

From Malik's studio experiment, `#D1F6FE` over `#24450A` (G6's olive-forest).
Its contribution is the **chord**: a cool surface with a green ink, which the
N family lacked. N3's ink sits 5° from its own surface and scores 0.410; the
experiment scores 0.490 on a comparable ground.

His own read — that it might be too close to L4 — is right, and the mechanism
is worth generalising. The surface is **55° from L4 in hue** (212° vs 157°) and
still only **.045** away perceptually. At **L .949 the sRGB gamut allows a
maximum chroma of .042** at that hue, and the surface already uses **95%** of
it.

> Near the ceiling of lightness, every hue collapses toward white. Two
> surfaces 55° apart become indistinguishable not because the hues are close
> but because neither can carry enough chroma to be seen. **"Choose a different
> colour" cannot fix it; "be less light" can.** Dropping to L .88 buys 2.5× the
> chroma and takes the distance from .045 to .099.

This is the counterpart to the A5 finding. There, a pale surface read as
low-contrast when contrast was fine and chroma was the deficit. Here, chroma
is not a free parameter at all — lightness sets its ceiling — so the fix has
to come through L.

| | surface | ink | hue | surf C | ink cr | accent | stim | dist. L4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| experiment | `#D1F6FE` | `#24450A` | 212° | **.040** | 9.49:1 | — | 0.490 | **.045** |
| **N8** | `#85E9FD` | `#24450A` | 212° | .098 | 7.81:1 | 5.30:1 | **0.551** | .099 |
| **N9** | `#79D9FC` | `#1C3601` | 224° | .103 | 8.33:1 | 5.34:1 | 0.541 | **.138** |

**N8** is the experiment corrected: same hue, same ink, lightness lowered until
the hue registers. Stimulation lands at 0.551 — C and J's own value.

**N9** takes the chord 12° bluer into the open 206→232 gap on the deeper forest
`#1C3601`. A second-order effect worth noting: **the ink's lightness governs how
much accent choice a palette has.** `#24450A` is a light ink at L .352, so gate
3 demands an accent above L .452 and only one catalogue magenta qualifies for
N8; `#1C3601` at L .30 opens that to three for N9.

### N10 (Malik's S13) and the oversupply of Set N

`#9EDAFF` under N6/N7's plum `#4A1040` and N5's magenta `#8D0381`; only the
surface is new. It takes the family's best contrast pair — **ink 9.68:1 and
accent 5.66:1**, both highs — clears all three gates, uses 95% of the chroma
available at L .86, and scores 0.530.

Its only deficit is ancestry: at **236°** it sits between the original's aqua
195° and blue 264°, four degrees from N2 — the same "no ancestor" charge laid
against N2. That is recorded, not treated as disqualifying. N2 fails on
**gate 3**; N10 passes it. Ancestry is one input among several, and it does not
outrank a measured pass.

**Set N briefly had eight candidates against one apiece for C, J, L and Q.**

### The cut: N2, N5, N6, N7 retired — Set N is N3, N8, N9, N10

Chosen against the measured recommendation, which had been to keep N5/N6/N7
and N10 and cut N2/N3/N8/N9. What the numbers said, and what they missed:

**It removes both of the original's cool anchors.** N6 held aqua 195°, N5 and
N7 held blue 264°. The survivors sit at **206 / 212 / 224 / 236** — the band
*between* the anchors, which is exactly the territory N2 was criticised for.
Set N now joins Set R as a family with no ancestral hue. The fidelity ranking
was always one input among several, and N6 leading on paper (chroma .115,
stimulation 0.578, scheme #1 Aqua/Rose) did not make it the right card to look
at. Malik's eye has beaten the metric twice before in this document.

**The survivors crowd each other, and that is not a fault.** N9~N10 .037,
N8~N10 .045, N3~N8 .043 — but only one becomes Set N, so intra-family distance
carries no information. Distance to *other sets* is what matters, and every
survivor clears its nearest non-N neighbour: N3 .075 (L4), N8 .099 (L4),
N9 .110 (Q), N10 .076 (Q). This is worth stating because it is easy to read a
crowded family as a problem when the family is a shortlist, not a shipped set.

**One survivor fails a stated criterion:** N3's stimulation is 0.410, under the
0.45–0.65 band, because its ink sits 5° from its own surface.

`#77C6EE`, `#2A0D73`, `#9DBDFF` and `#56DBDB` leave the live vocabulary.
`#1F0D92` stays with the R family; `#1C3601`, `#4A1040` and `#8D0381` stay with
the survivors.

Caveat on N6 and N7: **ink 336° against accent 333°** is three degrees, separated by
value alone (ΔL .151). It passes gate 3 and mirrors L4's structure at 18°, but
it is the tightest hue pairing in the catalogue. N6's escape is A7's ochre
`#674900` (4.96:1, spread 195/336/82); N7 has none, as ochre loses contrast on
the marine.

### The hue families, and the one that is missing

The original's chromatic world is **aqua · rose/magenta · lime/green ·
cream/yellow · blue**, plus neutrals. **There is no orange anywhere in it** —
not in the VGA-16 names it uses, not in the scheme list, not in the help HTML.

This independently explains Set R. It has been the problem child all session
on Duru grounds; it is _also_ the one set whose surface hue has no ancestor
in the original.

### Fidelity ranking

Scored on hue proximity of the surface (45%) and ink (30%) to the nearest
original anchor, plus a bonus (25%) when the pair reproduces one of the
original's own pairings (Aqua/Rose, Blue/Cream, Lime/Magenta, invertible).

| #   | Set    | Score | Reads as     | Original pairing?              |
| --- | ------ | ----- | ------------ | ------------------------------ |
| 1   | **A5** | 94.2  | rose / lime  | ✓ Lime/Magenta inverted        |
| 2   | **J**  | 88.7  | rose / lime  | ✓ Lime/Magenta inverted        |
| 3   | **L**  | 77.5  | aqua / rose  | ✓ Aqua/Rose                    |
| 4   | Crm    | 69.6  | cream / lime | —                              |
| 5   | J3     | 68.5  | rose / blue  | —                              |
| 6   | C      | 67.9  | lime / aqua  | —                              |
| 7   | C2     | 67.8  | lime / blue  | —                              |
| 8   | A7     | 66.2  | rose / rose  | —                              |
| 9   | N3     | 65.0  | aqua / aqua  | —                              |
| 10  | R      | 61.5  | cream / blue | ✓ Blue/Cream (surface 37° off) |
| 11  | A6     | 61.3  | lime / lime  | —                              |
| 12  | N2     | 60.3  | aqua / blue  | —                              |
| 13  | L2     | 57.8  | lime / blue  | —                              |
| 14  | R3     | 56.5  | cream / blue | ✓ Blue/Cream (surface 44° off) |
| 15  | MD2    | 53.4  | rose / rose  | —                              |
| 16  | S2     | 51.4  | cream / aqua | —                              |
| 17  | S1     | 44.1  | rose / rose  | —                              |
| 18  | MD     | 41.1  | rose / rose  | —                              |
| 19  | R2     | 33.9  | rose / blue  | —                              |
| 20  | G4     | 26.1  | cream / rose | —                              |

**A5 is the single most faithful palette in the library** — hot pink surface
plus forest green ink is literally two of the Win3.1 scheme names combined,
and it inverts the 2008 Lime/Magenta pair. Set J, shipped, is second.

Caveat: this measures _hue ancestry only_. It is deliberately blind to
legibility, stimulation and taste — a set can be faithful and still wrong
(and vice versa). Use it alongside the v2 ranking, not instead of it.

## Patterns

Smooth **Quilt · squares** and **Quilt · mixed** hidden 2026-07-30 (not
deleted — commented out in `PATTERNS`; generators and `quiltBase` intact).
**Quilt · pixel** is the only quilt on show. 17 patterns live.

### Where the first metric disagreed with Malik's gut

- **S1** (★ "amazing") ranks mid — its value gap is only 0.41, below the
  rubric's comfort threshold. It works on hue structure (a textbook 90°
  halfway) and chroma instead. The rubric under-weights that route.
- **R2** (★ "amazing") ranks low on the _full_ score but 80.7 as a pair —
  entirely the inherited accent. Fix the accent and it jumps.

Both are rubric limitations, not palette faults. Malik's eye caught the R
and A problems before the metric did; the metric is a check, not a judge.

## Log

- 2026-07-30 — R diagnosed; R2–R5 candidates added; ColorMoods model ported
  into the lab; this doc + global skill created. Write-back policy: lab until
  the full system is settled.
