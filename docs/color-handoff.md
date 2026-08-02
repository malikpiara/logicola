# Colour work — handoff

**Next session: tweak colours and pick the final set palettes.**
Read this first, then `docs/color-system.md` for the full reasoning.

## Where things stand

The workbench is **`docs/pattern-lab.html`** — open it directly in a browser
(no build step, no server). It was in a session scratchpad before; it now
lives in the repo so it can't be lost again.

It contains 16 palettes, 17 patterns, the ported ColorMoods stimulation
engine, and a Colour studio (surface / ink / accent wells with hex fields,
live metrics, partner suggestions, "Save as set" persisted to localStorage).

**Nothing has shipped to the app yet.** `getQuizScreenColors` in
`components/quiz/index.tsx` is untouched. The decision was: refine the whole
system in the lab, then port once.

The card now shows **each set's real copy** (2026-08-02) — the `title` and
`description` of its first subset, verbatim from `content/sets/*.ts`, split
the same way `StartScreen` splits them (`Modal Translations: Basic` →
eyebrow `SET J · BASIC`, headline `Modal Translations`). It previously showed
"Ready for a challenge?" / "Test your knowledge on this chapter…", which are
only StartScreen's _fallbacks_ for a subset with no title. Testing against
them inverted the hierarchy and made every palette carry identical words —
the opposite of the point, since colour is how a visitor tells sets apart.
Palettes with no parent set borrow Set A's copy (the longest pair, so the
worst case). The palette code moved to a caption **under** the card.

The description is **`font-normal`, not `font-light`** (2026-08-02), in the
lab and in `startScreen.tsx`. At `text-lg` on a saturated surface a 300 weight
thinned the stems enough that the sentence read as decoration — and it is the
line that says what the drill is. Hierarchy is unaffected: the headline is
still `font-bold`.

## Settled — read this, then skim the rest as working notes

Everything below this section is an append-only log of one day's decisions, in
the order they were made. Several passages describe palettes that were later
retired; they are kept for the reasoning, not as current state. **This table
is the current state.**

| Set | Palette     | Surface              | Ink              | Accent            |
| --- | ----------- | -------------------- | ---------------- | ----------------- |
| A   | **A7**      | `#FFABC6` pink       | `#4A1040` plum   | `#674900` ochre   |
| C   | **C**       | `#E7F099` chartreuse | `#02302C` teal   | `#BD00AD` magenta |
| J   | **J**       | `#E6ACF4` lilac      | `#1C3601` forest | `#674900` ochre   |
| L   | **L4**      | `#CFF6DD` mint       | `#3F0167` violet | `#BD00AD` magenta |
| N   | **N10**     | `#9EDAFF` sky        | `#4A1040` plum   | `#8D0381` magenta |
| Q   | **Q**       | `#D9CCF9` periwinkle | `#3E1060` violet | `#745400` ochre   |
| R   | _undecided_ | R / R2 / R3          | `#190B45` navy   | `#1F0D92` indigo  |

**Six of seven sets are settled. Only Set R is open**, and it is the one whose
hue family has no ancestor in the original at all.

The ink vocabulary came out balanced: no ink has more than two users
(`#4A1040` A7+N10, `#02302C` C+S2, `#24450A` G6+G7), except `#190B45`, which is
one set's three candidates. That was not an accident of the cuts — it was the
argument that picked N10 over N9.

**Free agents** S1, S2, G4, G6, G7 · **held back** Q2 (dark-mode seed), Crm
(brand reference). Everything else lives in the `RETIRED` block in
`pattern-lab.html`.

Still open: **Set R**; open item #2 (promote bases — A7 aside, `L4` and `N10`
carry variant numbers because the plain letters belong to retired schemes);
**`SET_SURFACES`** is now badly stale (below); and **the two docs disagree on
the stimulation ceiling** — this file says 0.45–0.65, `color-system.md` says
0.45–0.58. Worth reconciling before the port.

## The 16 palettes

| Family                     | Members            |
| -------------------------- | ------------------ |
| A · pink surface           | A7                 |
| C · chartreuse             | C                  |
| J · lilac                  | J                  |
| L · mint                   | L4                 |
| N · sky                    | N10                |
| R · orange                 | R, R2, R3          |
| Q · Meanings & Definitions | Q                  |
| Unparented                 | S1, S2, G4, G6, G7 |
| Held back                  | Q2, Crm            |

**A6 → G6** (2026-08-02). Set A is a pink-surface family now, so a pale-leaf
surface no longer belongs to it. The palette itself is sound and is held in
the unparented G pool for a future set — renamed, not cut.

**C2, J3 and J6 retired** (2026-08-02). All three were the same experiment —
put a deep blue-violet in the ink and demote the family's original ink to the
accent slot. **Set C is C and Set J is J.** Their hexes and the reason each
lost are preserved in a `RETIRED` comment block in `pattern-lab.html`, below
the `PALETTES` array; uncomment one back into its family block to restore it.
That block is a morgue and does not render — unlike **Held back** (Q2, Crm),
which are live objects that still appear in the lab under their own rule.

With those three gone, **`#0F005A` leaves the live vocabulary** — no remaining
palette uses the deep violet ink.

**A5 retired** (2026-08-02), superseded by A8 the same day. Not cut for any
failure — it passed every gate, and its 8.86:1 ink was the highest in the
family. Cut because A8 is the same scheme with a committed surface, and
keeping both would have meant two pinks 353° apart differing only in chroma.
`#A10094` and `#FFC2DA` leave the live vocabulary with it. A8 was Set A's base
for the rest of that day — _and was itself retired the same day; **Set A is
A7**. See "The final cut" below._

**L4 and A8 added** (2026-08-02), both built as in-between steps.

**L4** `#CFF6DD` / `#3F0167` / `#BD00AD` is the OKLCH midpoint of L and L2 on
_both_ surface and ink — hue 157° between L's aqua-mint 174° and L2's pale
leaf 141°, ink 305° between their 315° and 295°. Every measure lands between
its neighbours, including stimulation (0.583, between 0.551 and 0.629), which
is the check that the interpolation is perceptual rather than just numeric. It
takes C and L's `#BD00AD` rather than L2's near-identical magenta: 4.75:1 here
against 4.57:1, and no new hex.

**A8** `#FFB6D4` / `#1C3601` / `#9D038F` — and the diagnosis matters more than
the palette. **A5 is not low-contrast.** Its ink clears **8.86:1**, _more_ than
A7's 8.26:1, and its accent clears 4.75:1 against A7's 4.70:1. What separates
them is surface **chroma**: A5 sits at .076, the palest pink in the family,
against A7's .104. That is what reads as washed out — a pale ground makes the
whole card feel weak even while the type is measurably more legible on it.
A8 keeps A5's hue (353°) and its forest ink, and takes A7's commitment: chroma
.092, lightness .853. Cost: A5's magenta falls to 4.38:1 on the darker ground,
so it deepens to `#9D038F` (4.53:1) — hue preserved exactly, only value moves,
per the 2026-07-30 rule. **A8 is one new hex; L4 is none.**

The general point: _pale_ and _low-contrast_ are different failures with
different fixes. Contrast is a lightness relationship and is what a checker
measures; how committed a surface feels is chroma, and nothing measures it.
Reaching for more contrast when the real complaint is chroma darkens the ink
that was already fine and costs accent headroom for nothing.

## N5 — marine, on the original's own blue anchor

_Superseded: N5 was retired later the same day. Kept for the anchor
measurements, which still hold._

The 2008 binaries carry **two** cool anchors, not one, and they measure to the
degree:

- **aqua 195–196°** — VGA Aqua, and Gensler's `#BBFFFF` help-page ground
- **blue 264°** — VGA Blue, VGA Navy _and_ his `#000077` link colour, all 264

That settles the "odd duck" question with a number rather than a feeling.
**N3 at 206° is the aqua one. N2 at 232° is neither** — it splits the two
anchors and matches no ancestor. It is the second surface in the catalogue
with no original hue behind it; Set R was the first, and for a different
reason (the original has no orange at all, whereas N2's territory exists in
the original _twice_ and N2 sits between both).

N2 has a second problem: its three hues are **232 / 284 / 273** — surface, ink
and accent all inside the blue-violet arc, with the accent only ΔL .029 from
the ink. It fails gate 3, so it has no third colour. It is a monochrome.

**N5** `#9DBDFF` / `#1C3601` / `#8D0381` takes 264° itself.

|                      | value                                                        |
| -------------------- | ------------------------------------------------------------ |
| surface              | L .799, **C .101**, hue 264° — more committed than N2's .096 |
| ink contrast         | 7.07:1                                                       |
| accent contrast      | 4.53:1, ΔL **.145** above the ink, 69° off the surface       |
| stimulation          | 0.503, vibration 0                                           |
| nearest live surface | N2 .056, then Q .093                                         |

Surface lightness came off a sweep, not an eye: **L .80 is where three curves
cross.** Lighter than ~.84 the blue turns pale periwinkle and collapses onto Q
(distance .038 at L .88, against .093 here — L2 was retired for sitting .029
from G6). Darker than ~.76 the accent can no longer clear 4.5:1 without
falling to ink depth, which is N2's failure.

Hues run **264 / 133 / 333**: the ink is A8 and J's forest and the accent is
the system's magenta arc, so the _chord_ is the original's Lime/Magenta while
the _surface_ supplies its Blue. Diverse surface, familiar chord — which is
the brief.

**One new hex.** G4's existing `#7400A7` actually clears more contrast here
(4.85 vs 4.53) but sits only 46° off the surface, so it would read as a darker
blue rather than a third colour — the gate-2 trap that cost J its magenta. 69°
is worth the hex. `N4` is a burned name, cut 2026-07-30.

### N6 and N7 — completing the 2×2

N5 alone confounds two questions: _which anchor_ and _which chord_. N6 and N7
separate them, and neither costs a new hex — both reuse A7's plum `#4A1040`
and N5's magenta `#8D0381`.

|            | aqua 195° | marine 264° |
| ---------- | --------- | ----------- |
| **forest** | —         | N5          |
| **plum**   | **N6**    | **N7**      |

|        | hues        | surf C   | ink        | accent     | ΔL         | stim        |
| ------ | ----------- | -------- | ---------- | ---------- | ---------- | ----------- |
| N2     | 232/284/273 | .096     | 7.91:1     | 7.25:1     | **.030** ✗ | 0.526       |
| N3     | 206/201/29  | **.055** | 8.71:1     | 4.76:1     | .172       | **0.410** ✗ |
| N5     | 264/133/333 | .101     | 7.07:1     | 4.53:1     | .145       | 0.503       |
| **N6** | 195/336/333 | **.115** | **8.72:1** | **5.10:1** | .151       | **0.578**   |
| **N7** | 264/336/333 | .101     | 7.75:1     | 4.53:1     | .151       | 0.498       |

**N6** `#56DBDB` / `#4A1040` / `#8D0381` is the aqua anchor done properly —
195° exactly, at 82% of the chroma available there, paired with a rose ink.
That is **scheme #1 of the 2008 list, Aqua/Rose**, and the chord rhymes with
A7, which already runs a plum ink under a warm accent. It posts the best
numbers in the family on every axis: highest surface chroma, highest ink
contrast, highest accent contrast, stimulation 0.578.

**N7** `#9DBDFF` / `#4A1040` / `#8D0381` is N5's marine carrying N6's rose ink,
so the pair isolates chord from anchor.

Two things to watch. **N6 and N7 both run ink 336° against accent 333°** — three
degrees apart, separated by value alone (ΔL .151). Legal under gate 3 and the
same structure L4 uses at 18°, but it is the tightest hue pairing in the
catalogue. If either looks muddy at size, the fix on N6 is A7's ochre
`#674900`, which clears 4.96:1 and opens the spread to 195/336/82; N7 has no
equivalent escape, since ochre loses contrast on the marine.

And the table above prices the two incumbents honestly: **N2 fails gate 3**
(ΔL .030 — accent at ink depth), and **N3's stimulation is 0.410, below the
0.45–0.65 band** — it is the flattest palette in the catalogue, which follows
from its surface and ink being 5° apart.

### N8 and N9 — from the studio experiment

Malik's studio pairing: `#D1F6FE` ice over `#24450A`, G6's olive-forest. **The
chord is the contribution** — a cool surface with a _green_ ink is something
the N family did not have. N3's ink sits 5° from its own surface, which is why
N3 is the flattest palette in the catalogue at 0.410; the experiment measures
0.490 on a comparable surface.

**"Might be too similar to L4" is correct, and the cause is not the hue.** The
surface sits **55° from L4** (212° vs 157°) yet only **.045** away
perceptually. At L .949 the sRGB gamut allows a maximum chroma of **.042** at
that hue, and the surface is already using **95% of it**.

That is the general lesson, and it inverts the usual instinct: **near the top
of the lightness range every hue collapses toward white, so "pick a different
colour" cannot separate two surfaces and "be less light" can.** Dropping to
L .88 buys 2.5× the chroma and moves the distance from .045 to .099.

|            | surface   | ink       | hue  | surf C   | ink    | accent | stim      | vs L4    |
| ---------- | --------- | --------- | ---- | -------- | ------ | ------ | --------- | -------- |
| experiment | `#D1F6FE` | `#24450A` | 212° | **.040** | 9.49:1 | —      | 0.490     | **.045** |
| **N8**     | `#85E9FD` | `#24450A` | 212° | .098     | 7.81:1 | 5.30:1 | **0.551** | .099     |
| **N9**     | `#79D9FC` | `#1C3601` | 224° | .103     | 8.33:1 | 5.34:1 | 0.541     | **.138** |

**N8** is the experiment corrected — same hue, same ink, lightness dropped
until the hue can show. Stimulation lands on 0.551, exactly where C and J sit.
Note only **one** catalogue accent qualifies: `#24450A` is a _light_ ink
(L .352), so gate 3 demands an accent above L .452 and most of the magentas
are too dark to clear it.

**N9** pushes the same chord 12° bluer into the open 206→232 gap, on the deeper
forest `#1C3601` that A8, J and N5 already share. **The deeper ink is what buys
back the accent choice** — three accents qualify here against N8's one. Best L4
separation of any variant at .138; the cost is N2 at .051, though N2 fails
gate 3 anyway.

Neither costs a new hex beyond its surface.

### N10 — Malik's S13

`#9EDAFF` sky under N6/N7's plum `#4A1040` and N5's magenta `#8D0381`. Only the
surface is a new hex. **It posts the best contrast pair in the family** — ink
**9.68:1** and accent **5.66:1**, both family highs — passes all three gates
(accent 97° off the surface, ΔL .151 over the ink), sits at 95% of the chroma
available at L .86, and scores 0.530 with no vibration.

The one thing it lacks is ancestry. At **236°** it sits in the gap between the
original's aqua 195° and blue 264° — **four degrees from N2**, which is exactly
the "matches no ancestor" charge laid against N2 above. Recorded rather than
treated as a veto: N2's actual disqualification was failing gate 3, and N10
passes it comfortably. Ancestry is one input among several.

### The final cut — A8, N3, N9 retired; N8 → G7

**Set A is A7** and **Set N is N10.** A8 went the same day it was made: A7 was
kept instead, which also resolved the ink concentration — `#1C3601` forest had
briefly reached three users (A8, J, N9) and is now down to one (J). `#FFB6D4`
leaves the vocabulary; `#9D038F` survives on G7.

**N10 won over N9 on ink vocabulary as much as on contrast.** N9 measured
better on surface chroma (.103 vs .080) and cross-set distance (.110 from Q,
against N10's .076), but its forest ink was already J's and A8's. A third user
would have made forest the system default and left the surfaces doing less of
the work of telling sets apart. N10's plum is shared only with A7.

**N3 retired** on the one criterion it never met: its ink sat 5° from its own
surface, so stimulation was 0.410, and it used just 45% of the chroma available
to it — the least committed live palette.

**N8 → G7, and its surface committed on the way out.** `#85E9FD` (L .88,
C .098) → **`#70E8FF`** (L .87, C .112) — 100% of the chroma the gamut allows
at that lightness, ink 7.60:1, accent 5.16:1, stimulation 0.572.

The floor here is set by the ink, not by taste: `#24450A` is a _light_ ink
(L .352), so gate 3 demands an accent above L .452, and `#9D038F` is the only
one in the catalogue that also clears 4.5:1 on this surface. Push past L .86
and that last accent begins to fail. More commitment is available if wanted —
L .86 gives C .120 at stimulation 0.582, L .84 gives C .142 at 0.608 — but both
cross the 0.58 ceiling `color-system.md` states, which is why L .87 was taken.

G7 is held for **Set B (Syllogistic Arguments)** or **Set H (Quantificational
Translations)** — both exist in `content/sets/` and are commented out of
`index.ts`, so this is two real sets waiting, not a hypothetical. It pairs with
G6 by construction: same olive-forest ink, pale leaf and pale sky, magenta in
both accents.

### Set N cut to four — N2, N5, N6, N7 retired

**Set N is N3, N8, N9, N10.** Hexes in the `RETIRED` block. `#77C6EE`,
`#2A0D73`, `#9DBDFF` and `#56DBDB` leave the live vocabulary; `#1F0D92` stays
(R family), as do `#1C3601`, `#4A1040` and `#8D0381`.

**What this removes is both of the original's cool anchors.** N6 held aqua
195°, N5 and N7 held blue 264°. The four survivors sit at **206 / 212 / 224 /
236** — the band _between_ the anchors, which is the territory the retired N2
was criticised for occupying. After this cut Set N has no ancestral hue, and
neither does Set R. Recorded, not relitigated: the fidelity ranking was always
one input, and N6 leading on paper (chroma .115, stimulation 0.578) did not
make it the right card to look at.

The survivors crowd each other — N9~~N10 .037, N8~~N10 .045, N3~N8 .043 — and
**that does not matter**, because only one becomes Set N. Intra-family distance
is not a distinctiveness problem; distance to _other sets_ is, and all four
clear their nearest non-N neighbour comfortably: N3 .075 from L4, N8 .099 from
L4, N9 .110 from Q, N10 .076 from Q.

One open flag among the survivors: **N3's stimulation is 0.410**, below the
0.45–0.65 band, because its ink sits 5° from its own surface. It is the only
survivor that fails a stated criterion.

### The oversupply this replaced

Eight candidates, against one apiece for C, J, L and Q. Ten pairs sit under
.06 apart, including **N9~~N10 at .037, N8~~N10 at .045 and N8~N9 at .046** —
the three newest crowd each other, which is an artefact of building them in
one session rather than a real spread.

|         | hue | surf C   | ink        | accent     | ΔL   | stim      | gates |
| ------- | --- | -------- | ---------- | ---------- | ---- | --------- | ----- |
| N2      | 232 | .096     | 7.91:1     | 7.25:1     | .030 | 0.526     | ✗     |
| N3      | 206 | .055     | 8.71:1     | 4.76:1     | .172 | **0.410** | ✓     |
| N5      | 264 | .101     | 7.07:1     | 4.53:1     | .145 | 0.503     | ✓     |
| N6      | 195 | **.115** | 8.72:1     | 5.10:1     | .151 | **0.578** | ✓     |
| N7      | 264 | .101     | 7.75:1     | 4.53:1     | .151 | 0.498     | ✓     |
| N8      | 212 | .098     | 7.81:1     | 5.30:1     | .129 | 0.551     | ✓     |
| N9      | 224 | .103     | 8.33:1     | 5.34:1     | .145 | 0.541     | ✓     |
| **N10** | 236 | .080     | **9.68:1** | **5.66:1** | .151 | 0.530     | ✓     |

On the numbers the field reduces to three real choices: **N6** (aqua anchor,
highest chroma and stimulation), **N5/N7** (blue anchor, the two chords), and
**N10** (best contrast, no ancestor). **N8 and N9 are dominated by N10** — it
beats both on ink and accent contrast while sitting .037–.045 away — and N2
fails a gate while N3 falls below the stimulation band. Retiring N2, N3, N8 and
N9 would leave a clean four.

**A correction worth having:** N3's accent is `#B0241A`, a brick red at **29°**
— not a magenta. N3 is a _tonal aqua_: its surface and ink are 206° and 201°,
five degrees apart, with one warm spark. If the magenta reading is what
appeals, N3 does not currently have it, and swapping its coral for the
system's magenta is a one-line change.

## The L verdict — settled

**Set L is L4 alone.** L and L2 were both retired 2026-08-02; their hexes and
reasons are in the `RETIRED` block. `#C100B2` left the vocabulary with L2;
`#BD00AD` stays, shared by C, L4 and G6.

**A note on the name.** L4 is Set L's base but is not called `L`, because the
original `L` is a _different_ colour scheme now sitting in RETIRED. Reusing
the label would put two schemes under one name — the trap the two different
`A7`s already sprang. Same reason `L3` stays burned. This is open item #2
(promote bases) in miniature: the winners for A, L and N all carry variant
numbers, and renaming any of them costs the same collision.

The reasoning that decided it:

|        | surface        | chroma | **% of gamut used** | ink     | accent     | stim      | nearest non-L |
| ------ | -------------- | ------ | ------------------- | ------- | ---------- | --------- | ------------- |
| L      | `#C8F0E3` 174° | .045   | **39%**             | 12.92:1 | 4.52:1     | 0.551     | G6 **.050**   |
| **L4** | `#CFF6DD` 157° | .052   | 55%                 | 12.67:1 | **4.75:1** | **0.583** | G6 .036       |
| L2     | `#DBFAD5` 141° | .059   | 64%                 | 12.15:1 | 4.77:1     | 0.629     | G6 **.029**   |

**L4 wins by losing no axis.** Its accent clears with margin (4.75:1 against
L's tight 4.52), its stimulation sits dead centre of the 0.45–0.65 band, and
it is more committed than L while more distinct than L2. The other two each
fail one axis badly.

**L2 is weakest because its problem is structural.** Its surface sits .029
from G6 in OKLab — _closer to G6 than to its own sibling L_ (.044). G6 is the
ex-A6 being held for a future set, so adopting L2 quietly forecloses that. It
is also the lightest surface in the catalogue (L .953), which gives it the
lowest chroma ceiling of the three (.092) — it has the least room to ever
become more committed. And 0.629 sits near the band's top edge before the
pattern adds any energy.

The distinction that decided it: **L2's weakness could not be tuned out.**
Moving its hue away from 141° to escape G6 turns it into L4 or L. **L's could**
— at 39% of available chroma it was the palest surface in the catalogue, but
had .069 of headroom at its own lightness and hue. Both lost to the variant
that needed no rescue.

**Still open for L4:** it uses 55% of the chroma available at its lightness
and hue, so the commitment question the A5 → A8 move answered for Set A has
not been asked here. Raising L4's chroma toward its .096 ceiling is the same
one-number change, and it would cost accent headroom the same way.

Note for the record: **L and L2 were both on the stated-favourites list**, and
the catalogue's own numbers went against both. Worth watching whether the
surviving palette still feels right at full size — the metric described these,
it did not choose them.

`★` in the lab marks Malik's own saved palettes; they take the first variant
slot in each family. Malik's stated favourites, as named at the time:
**C, L, L2, R, MD, S1**. L, L2 and A5 have since been retired and MD renamed
to Q, so only C, R and S1 still exist under those labels.

**Naming rule (2026-08-02): a palette is named for its SET.** `MD`/`MD2`
became `Q`/`Q2` — they dress Set Q, and every other family already followed
the rule. The corollary is the one live exception: `A8`, `L4`, `N5`–`N7` are
family bases carrying variant numbers, because the plain letters `A`, `L` and
`N` now belong to _different_, retired schemes. Reusing a letter would put two
colour systems under one label; see open item #2.

## Decided

- **Q** (was MD) — periwinkle `#D9CCF9` + violet ink `#3E1060`. Settled.
- **Dark surfaces are out.** Every favourite is a pale surface; the
  forest-ground and dark-purple variants were retired.
- **Q2 (was MD2) and Crm are held back** (2026-08-02) — out of the quiz pool, kept in
  the lab below a "Held back" rule. Q2 tested as the most dissonant palette
  in the set; its dark surface is parked as a **dark-mode seed**, not cut.
  Crm stays as a **brand reference** — cream won't claim a hue, so it can't
  carry a window. The lab marks both with `reserve:` and sorts them last.
- **Set A moved into pink territory** — its green now lives in the ink.
- **Every accent clears 4.5:1** against its surface (it renders as the
  "10 QUESTIONS" text). Hue was preserved; only value moved.
- **Accent pool** is "Sets verbatim" — the real set surfaces plus Set A's
  magenta.

## Open — this is tomorrow's work

1. **Pick the final palette per set.** A (A8 vs A7) and R (R vs R2 vs R3).
   The Q and Q2 questions are closed. **L is A8 vs A7 territory too** — see
   the L verdict below.
2. **Promote bases.** Set A has no palette named `A`; Set N has no `N`.
   Decide whether to rename the winners.
3. ~~**The accent=ink defect.**~~ **Resolved 2026-08-02** — see "The accent
   tier" below. C, J, L and S2 all have real accents now, all borrowed from
   hexes already in the catalogue. Four palettes still fail the value gate
   and were deliberately left alone: **N2, S1, G4**.
4. **`SET_SURFACES`** (in the lab) has drifted further — it now lists **two**
   colours that are no longer any set's surface: the retired peach `#F2CDA6`
   (should be R's `#FFD199`) and, since L was retired on 2026-08-02, the old
   mint `#C8F0E3` (should be L4's `#CFF6DD`). It also still carries Set A's
   forest `#1C3601`, which is an ink now, not a surface. Left alone on purpose
   — rewriting the pool changes every quilt render, which is a separate
   decision from curating the palettes.
5. **Then port** to `getQuizScreenColors`.

## The accent tier

Item #3 turned out not to be four separate colour choices. Sorting the
catalogue by which accents actually function gives one band — **OKLCH L
.41–.56, landing at 4.6–5.7:1** on their surface. Every accent that failed sat
at **L .28–.32**, which is _ink_ depth. The catalogue has surfaces at L .82–.93
and inks at L .22–.35 with a hole in the middle; a working accent is precisely
a colour in that hole. C, J, L and S2 had nothing there, so they borrowed their
ink and the scheme never completed.

Three gates, all needed:

1. **≥ 4.5:1 against the surface** — it renders as the "10 QUESTIONS" text.
2. **≥ ~40° from the surface hue** — else it is just a darker surface.
3. **≥ ~.10 lighter than the ink in L** — else it is a second ink.

Gate 3 is the one **no contrast checker measures.** WCAG scores each colour
against the background and never one foreground against the other, which is
exactly how J3 carried an accent .03 from its own ink and still "passed".

Gate 2 is a heuristic, not a law: **A5/A8 break it** (magenta ~20° off the pink
surface) and reads fine, because ΔL .19 does the separating that hue doesn't.
Read it as "differ from the surface in hue _or_ clearly in value". Gate 3 has
no such escape — two foregrounds at one depth read as one colour however far
apart their hues are.

| Palette | Was | Now              | Contrast | ΔL vs ink | Hue vs surface |
| ------- | --- | ---------------- | -------- | --------- | -------------- |
| C       | ink | `#BD00AD` (G6's) | 4.60:1   | .27       | 140°           |
| J       | ink | `#674900` (A7's) | 4.57:1   | .13       | 122°           |
| L       | ink | `#BD00AD` (G6's) | 4.52:1   | .28       | 159°           |
| S2      | ink | `#7400A7` (G4's) | 6.02:1   | .15       | 134°           |

**No new hexes.** Every accent already existed in the catalogue, so the ink
vocabulary didn't grow — the surfaces still do the distinguishing.

Notes on the choices: **J takes ochre, not magenta**, because its lilac surface
already sits in the magenta arc (320° vs 333°) — every magenta reads as a
darker surface there. Ochre is the only existing hue far from both the surface
and the forest ink. It is the weakest of the four and the one to re-examine:
it is outside the pink/lilac/green register, and against the forest ink it
reads brown. The in-register alternative is a lime `#405600`, but at 8° from
the ink it is a lighter forest, not a third colour. **S2 takes purple rather
than the magenta** because it shares C's teal ink, and matching accents too
would make the two near-siblings.

**Left alone on purpose** (real, but not what item #3 asked for): N2 (ΔL .03),
S1 (−.10, already flagged as "the one compromise"), G4 (.09). C2 also failed
this gate and was retired instead.

## Guardrails learned the hard way

- **An approved idea is not an approved blast radius.** A token-split
  experiment was approved in principle; the implementation also restored
  every pruned palette and undid the curation. One concern per change.
- **The v2 ranking rubric describes, it does not decide.** It is a fit to six
  stated favourites. Its ink-depth term penalises lighter, more chromatic
  inks — using it to drive removals narrows the library's colour range.
- **Malik's eye leads, the metric follows.** He identified the three worst
  accent-contrast failures and J4's tight value gap before any measurement,
  and both times the numbers agreed.

## Method reference

The global skill `two-color-harmony`
holds the Duru framework and the ColorMoods model:
stimulation = (4·intensity + 2·ΔL + 1·hueΔ)/7, vibration risk, the halfway
rule, and the generation sweep. LogiCola's target band is ≈0.45–0.65.
