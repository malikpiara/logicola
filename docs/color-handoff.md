# Colour work — handoff

**Next session: tweak colours and pick the final set palettes.**
Read this first, then `docs/color-system.md` for the full reasoning.

## Where things stand

The workbench is **`docs/pattern-lab.html`** — open it directly in a browser
(no build step, no server). It was in a session scratchpad before; it now
lives in the repo so it can't be lost again.

It contains 20 palettes, 17 patterns, the ported ColorMoods stimulation
engine, and a Colour studio (surface / ink / accent wells with hex fields,
live metrics, partner suggestions, "Save as set" persisted to localStorage).

**Nothing has shipped to the app yet.** `getQuizScreenColors` in
`components/quiz/index.tsx` is untouched. The decision was: refine the whole
system in the lab, then port once.

## The 20 palettes

| Family                      | Members    |
| --------------------------- | ---------- |
| A · pale surface, green ink | A5, A6, A7 |
| C · chartreuse              | C, C2      |
| J · lilac                   | J, J3      |
| L · mint                    | L, L2      |
| N · sky                     | N2, N3     |
| R · orange                  | R, R2, R3  |
| MD · Meanings & Definitions | MD, MD2    |
| Unparented                  | S1, S2, G4 |
| Brand                       | Crm        |

`★` in the lab marks Malik's own saved palettes; they take the first variant
slot in each family. Malik's stated favourites: **C, L, L2, R, MD, S1**.

## Decided

- **MD** — periwinkle `#D9CCF9` + violet ink `#3E1060`. Settled.
- **Dark surfaces are out.** Every favourite is a pale surface; the
  forest-ground and dark-purple variants were retired. MD2 is the last dark
  one standing and is a candidate for removal.
- **Set A moved into pink territory** — its green now lives in the ink.
- **Every accent clears 4.5:1** against its surface (it renders as the
  "10 QUESTIONS" text). Hue was preserved; only value moved.
- **Accent pool** is "Sets verbatim" — the real set surfaces plus Set A's
  magenta.

## Open — this is tomorrow's work

1. **Pick the final palette per set.** A (A5 is the presumptive base, ranks
   #3), R (R vs R2 vs R3), and whether MD2 survives.
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

The global skill `two-color-harmony`
holds the Duru framework and the ColorMoods model:
stimulation = (4·intensity + 2·ΔL + 1·hueΔ)/7, vibration risk, the halfway
rule, and the generation sweep. LogiCola's target band is ≈0.45–0.65.
