# Motion plans — index

Written 2026-08-24 at commit `02f1d7b` by the `improve-animations`
audit (four auditors over the eight-category catalog, every citation
re-verified). Each plan is self-contained for an executor with no
audit context. This directory supersedes the survey-level
`docs/motion-plans-2026-08-24.md` from earlier the same day — its P1
is absorbed into 006, its P2 note into 002, its P3 into 001.

## Execution order

| #   | Plan                                                                                    | Severity         | Status | Depends on   |
| --- | --------------------------------------------------------------------------------------- | ---------------- | ------ | ------------ |
| 001 | [Pane drag composite-only](001-pane-drag-composite.md)                                  | HIGH (perf)      | DONE   | —            |
| 002 | [Sheets own their motion + reduce works](002-sheets-own-their-motion.md)                | HIGH (a11y)      | DONE   | —            |
| 003 | [Keyboard actions instant](003-keyboard-actions-instant.md)                             | HIGH (frequency) | DONE   | —            |
| 004 | [Re-triggerable keyframes → transitions](004-retriggerable-keyframes-to-transitions.md) | HIGH (interrupt) | DONE   | —            |
| 005 | [Press feedback batch](005-press-feedback-batch.md)                                     | MEDIUM           | DONE   | —            |
| 006 | [Cohesion batch](006-cohesion-batch.md)                                                 | MEDIUM→LOW       | DONE   | 003 (item 1) |

001–004 are independent and can run in parallel worktrees. 006's
first item shrinks if 003 lands first — sequence it last.

Cross-plan trap to know before executing any of them: Tailwind v4
emits utilities inside `@layer utilities`, and vaul injects unlayered
CSS plus inline styles — several of the app's declared timings were
dead on arrival because of this. When a plan's change "doesn't seem
to apply", check the cascade in DevTools before doubling values
(plans 002 and 004 document the specifics).

## Execution notes (2026-08-24, same day)

All six plans executed and verified in a CDP-driven Chrome (the in-app
Browser pane's occluded renderer does NOT run CSS transitions — every
"snap" it reports is an artifact; verify motion with the chrome-devtools
MCP). Deviations from the written plans, all argued in code comments:
001 kept `margin-right` for open/close (pushed text must rewrap; the
per-frame cost went away at the source) and used a trailing 150ms
debounce for the pattern layer. 004's accordion transition lives on a
CHILD of the Radix Content — Radix writes inline transitionDuration:0s
on the Content while measuring, which silently kills transitions
declared there. 005 replaced the move-lift-to-child card fix with a
2px hover apron (the lift's content and border must move together).
002 resolved the old docs/motion-plans P2 decision by honesty: with
the dead fade classes gone, the exercises sheet plays vaul's full
travel. Opportunities 1–4 landed with the batch (3 was already true —
shadcn Button carries the press grammar); opportunity 5 is prototyped
at docs/scoring-demo-lab.html awaiting sign-off. Still owed to Malik:
on-device feel-checks (sheet travel, toast tempo, Android back-fold).

## Missed opportunities (additive — separate budget, not defects)

From audit category 8; each passed the frequency test. Not planned;
promote to a plan only on request:

1. Landing drill rows: press acknowledgement on touch (largest
   overlap with plan 005 — its landing `:active` rules cover this).
2. Subscribe form: morph the pill into the success state instead of
   swapping paragraphs; reserve the button's width so
   "Subscribing…" doesn't shift the input (rare surface, delight
   budget).
3. shadcn `Button` (used on /keyboard, /progress): adopt
   `.motion-button` instead of a second hover-only grammar.
4. Drawer grabber: a pressed state (mirrors the resize grip's
   pattern) on a control that is tapped, never hovered.
5. Marketing-only: a short looping demo of one graded answer (bar
   payment + delta) on the landing page, replacing prose — the
   product's most distinctive mechanic is currently invisible until
   the first drill.

## Audited clean — do not "fix"

The verdict choreography (reveal 160ms → flicker 340ms → payment
500ms → delta 1600ms), the arrow-key focus band (instant by design),
the mobile Duolingo push and its measured timings, `.motion-enter`'s
one-entrance-per-container use everywhere except startScreen:190, the
option press/hover scale values (0.985/1.002 — documented), the
countUp cascade design (rAF-through-ref, reduce branch), qbar's
`@property`-registered fill, all keyed-remount keyframes (`qdelta`,
`qbadge-in`, `.motion-answer-reveal`, `.motion-quiz-question`), Sonner
's own reduced-motion handling, and a codebase with zero
`transition: all`, zero animated blur, zero unguarded smooth-scroll.
