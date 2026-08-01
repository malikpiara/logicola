# Colour work — handoff

**Next session: tweak colours and pick the final set palettes.**
Read this first, then `docs/color-system.md` for the full reasoning.

## Where things stand

The workbench is **`docs/pattern-lab.html`** — open it directly in a browser
(no build step, no server). It was in a session scratchpad before; it now
lives in the repo so it can't be lost again.

It contains 21 palettes, 17 patterns, the ported ColorMoods stimulation
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
only StartScreen's *fallbacks* for a subset with no title. Testing against
them inverted the hierarchy and made every palette carry identical words —
the opposite of the point, since colour is how a visitor tells sets apart.
Palettes with no parent set borrow Set A's copy (the longest pair, so the
worst case). The palette code moved to a caption **under** the card.

The description is **`font-normal`, not `font-light`** (2026-08-02), in the
lab and in `startScreen.tsx`. At `text-lg` on a saturated surface a 300 weight
thinned the stems enough that the sentence read as decoration — and it is the
line that says what the drill is. Hierarchy is unaffected: the headline is
still `font-bold`.

## The 21 palettes

| Family                      | Members        |
| --------------------------- | -------------- |
| A · pink surface, green ink | A5, A7         |
| C · chartreuse              | C, C2          |
| J · lilac                   | J, J3, J6      |
| L · mint                    | L, L2          |
| N · sky                     | N2, N3         |
| R · orange                  | R, R2, R3      |
| MD · Meanings & Definitions | MD             |
| Unparented                  | S1, S2, G4, G6 |
| Held back                   | MD2, Crm       |

**A6 → G6** (2026-08-02). Set A is a pink-surface family now, so a pale-leaf
surface no longer belongs to it. The palette itself is sound and is held in
the unparented G pool for a future set — renamed, not cut.

**J6 added** (2026-08-02) — J3's lilac with the ink dropped to `#0F005A`, Set
C2's deep violet. Nearly J3's own hue (273° vs 264°) at half the lightness:
**9.91:1** on the lilac against J3's 7.43, stimulation **0.53** (in the
0.45–0.65 band), no vibration. It also opens the widest value gap of any J ink
from the family's forest accent (ΔL .079 vs J3's .029), which is the standing
crowding problem in J. `J4` and `J5` are burned names — both were tried and
cut — hence J6.

`★` in the lab marks Malik's own saved palettes; they take the first variant
slot in each family. Malik's stated favourites: **C, L, L2, R, MD, S1**.

## Decided

- **MD** — periwinkle `#D9CCF9` + violet ink `#3E1060`. Settled.
- **Dark surfaces are out.** Every favourite is a pale surface; the
  forest-ground and dark-purple variants were retired.
- **MD2 and Crm are held back** (2026-08-02) — out of the quiz pool, kept in
  the lab below a "Held back" rule. MD2 tested as the most dissonant palette
  in the set; its dark surface is parked as a **dark-mode seed**, not cut.
  Crm stays as a **brand reference** — cream won't claim a hue, so it can't
  carry a window. The lab marks both with `reserve:` and sorts them last.
- **Set A moved into pink territory** — its green now lives in the ink.
- **Every accent clears 4.5:1** against its surface (it renders as the
  "10 QUESTIONS" text). Hue was preserved; only value moved.
- **Accent pool** is "Sets verbatim" — the real set surfaces plus Set A's
  magenta.

## Open — this is tomorrow's work

1. **Pick the final palette per set.** A (A5 is the presumptive base, ranks
   #3) and R (R vs R2 vs R3). The MD2 question is closed — held back.
2. **Promote bases.** Set A has no palette named `A`; Set N has no `N`.
   Decide whether to rename the winners.
3. **The accent=ink defect.** C, J, L and S2 use their ink as their accent,
   so nothing completes the scheme. Needs a real accent each — this is the
   last structural gap.
4. **`SET_SURFACES`** (in the lab) still lists the retired peach `#F2CDA6`
   instead of R's current `#FFD199`, so the verbatim pool carries one colour
   that is no longer any set's surface.
5. **Then port** to `getQuizScreenColors`.

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

The global skill `two-color-harmony` (`~/.claude/skills/two-color-harmony/`)
holds the Duru framework and the reverse-engineered ColorMoods model:
stimulation = (4·intensity + 2·ΔL + 1·hueΔ)/7, vibration risk, the halfway
rule, and the generation sweep. LogiCola's target band is ≈0.45–0.65.
