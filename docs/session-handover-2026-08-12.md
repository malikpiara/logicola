# Handover — 2026-08-12 (damage animation on the scored bar)

Written on branch `color-system-exploration`. Supersedes
`session-handover-2026-08-10.md`. A design session, not a refactor one:
one new lab, one decision taken from it, and the port. The design
contracts moved — `pixel-ui.md` gained the damage grammar and the
progress bar's animation mechanism; `redesign-handoff.md` now lists the
second lab.

## Done today

- **Damage lab** (`docs/damage-bar-lab.html`, new). Six miss-feedback
  directions for the scored progress bar, judged live: Hit flicker
  (Mega Man i-frames), Ghost drain (SF II), Knockback (screen shake),
  Ember tip (Halo shield break), Track pulse, and an A×C hybrid, Ink
  flicker. Each runs in all seven set palettes and both bar sizes, with
  a reduced-motion preview. Pixel crumble was built and cut in judging.
  The lab uses the **real** geometry — `spriteClip`/`gemClip` ported
  verbatim from `lib/pixel.ts`, palettes from `quizColors.ts` — so what
  was judged is what ships.
- **Direction A ported.** On a scored miss the fill blinks off twice in
  hard cuts (340ms), then the bar pays the penalty. Choreography lives
  entirely in CSS (`@keyframes qbar-flicker` + a matching
  `transition-delay`); the shell only toggles `.qbar-miss` off the
  grader's verdict and clears it after `MISS_FLASH_MS`. Both bars wear
  it — desktop hairline and mobile sprite bar. Spec and the three
  binding constraints are in `pixel-ui.md § Damage on a miss`.
- **Progress bar advance fixed** — a pre-existing bug found while
  verifying the flicker. The mobile bar's 500ms transition wasn't
  animating at all: it snapped once, mid-window. Cause: `width` was the
  animated property and both endpoints were `round()` expressions,
  which have no interpolation, so the engine fell back to a discrete
  flip. Now `--qp` is registered via `@property` and **it** transitions;
  `round()` re-quantises every frame. The fill steps across the 4px grid
  as it moves — measured 21 distinct widths, all multiples of 4,
  decelerating 48 → 4px. The fix made the bar _more_ in-character, not
  less.
- **Reduced motion on the bar**, which it had never had. `.motion-progress`
  in the globals reduced-motion block belongs to an unrelated shadcn
  component, so the quiz bar's 500ms advance ran regardless. Now
  `.qbar-fill { transition: none }` sits with the flicker's own rule.

441 tests pass; eslint + tsc clean; production build clean, with
`@property`, `round()` and the `var(--qp, 0%)` fallback all verified
intact in the minified CSS.

## Lessons worth keeping

- **When a computed value won't animate, animate its input.** The whole
  `round()` fix in one line, and it generalises past this bar.
- **The stale-CSS trap bit again**, mid-session: a `globals.css` edit
  was silently absent from the served stylesheet until `rm -rf .next`
  and a dev-server restart. Verify CSS changes through `cssRules`, not
  by trusting the edit — the browser will happily show you the old rule.
- Sampling animations in the preview pane needs `setTimeout`, not
  `requestAnimationFrame` (throttled when the tab isn't fronted), and a
  first miss also opens the guide sheet, whose animation will starve a
  polling loop. Measure the mechanism in isolation, then confirm the
  end-to-end settled state.

## Still open (ranked)

1. **Quiz-shell split** — unchanged from the last handover and now
   slightly worse: `components/quiz/index.tsx` grew the flash state and
   its timeout. Still ~1,150 lines owning both drawers, three screens,
   pane resize and input modality; the Check/Next CTA block still exists
   twice and the fallback palette still lives in three files.
2. **`quizColors` keying** — unchanged: display-name strings plus the
   magic subset id 3. Keep `QUIZ_SURFACE_POOL`'s deliberate staleness.
3. **Follow-ups the damage lab opened, none taken:** floating damage
   numbers (a −12 drifting off the bar tip), a paired sound tick, and
   whether a correct answer deserves a mirrored micro-celebration or
   should stay calm so damage keeps the spotlight. The lab is the place
   to judge these, not the app.
4. Carried from earlier handovers: end-screen treatment pass, the
   R-guide pedagogy question (decision 13), CTA silhouette dial.

## If you touch the bar's motion again

The two rules that are load-bearing rather than aesthetic: **two
flashes, never three** (WCAG 2.3.1), and **scored mode only** — in count
mode the bar means completion, and a miss doesn't take completion away.
Both are enforced in code and explained in `pixel-ui.md`; neither is a
preference.
