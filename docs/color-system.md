# LogiCola color system — working document

Status: **in refinement, lab-first.** Nothing here ships to
`components/quiz/index.tsx` (`getQuizScreenColors`) until the whole system is
settled — cross-set relatedness is part of the method. Method reference: the
global `two-color-harmony` skill,
built from Ruxandra Duru's framework and the ColorMoods
generator. Working prototype: the "Start-screen pattern lab" artifact, which now
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

**Family state 2026-08-02:** A [A5, A7] · C [C, C2] · J [J, J3, J6] ·
L [L, L2] · N [N2, N3] · R [R, R2, R3] · MD [MD] · free agents [S1, S2, G4,
G6] · held back [MD2, Crm]. Library is 21.

- **A6 → G6.** Set A resolved into a pink-surface family, so its pale-leaf
  member no longer belongs to it. Renamed into the unparented G pool and kept
  for a future set rather than cut — the palette is fine, its parent was wrong.
- **J6 added** — J3's lilac `#E6ACF4` over `#0F005A`, the ink C2 already uses.
  Same blue hue family as J3 (273° vs 264°) at half the lightness (OKLCH L .22
  vs .33): 9.91:1 against the surface where J3 gives 7.43, stimulation 0.53,
  vibration 0. The reason to prefer it isn't the contrast headroom — it is the
  **accent gap**: J's forest accent `#1C3601` sits ΔL .029 from J3's ink and
  ΔL .079 from J6's, so J6 is the first J variant where ink and accent read as
  two different depths rather than one.
- Borrowing an ink that already exists elsewhere in the system is deliberate.
  A new hex would widen the palette; reusing C2's violet keeps the catalogue's
  ink vocabulary small, which is what makes the surfaces do the distinguishing.

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

## The original LogiCola's colour world (observed 2026-07-30)

Evidence from the original program — the real binaries, not recollection.

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
