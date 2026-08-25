# Session handover — 2026-08-24

**Read this first. The situation changed mid-session and the priority is
not what the branch history suggests.**

## The situation

Malik spoke to a professor at the **University of Texas at Arlington**
who has **class tomorrow (2026-08-25)**. LogiCola has to ship to
production **today**. This was not planned or expected.

**The public beta is cancelled.** Do not spend time on
`beta.logicola.org`, on Vercel domain assignment, or on branch-preview
access. That work was in flight this morning and is now dead. Cloudflare
already proxies the subdomain to Vercel if it ever comes back — nothing
was configured, so nothing needs undoing.

## The one thing that blocks shipping

`color-system-exploration` is **132 commits ahead of `origin/main` and 5
commits behind it**. Production serves `main`. Everything from the last
two weeks — the end-screen receipt, the app icons, the phone points, the
pattern scale, the footer band, today's focus fix — is live nowhere.

Shipping means merging this branch to `main`. That diff is **331 files,
+76,830 / −2,965**, and it does not merge cleanly.

### The six conflicts, and which ones can hurt you

Verified today with `git merge-tree --write-tree origin/main
color-system-exploration`:

| file                                        | why it conflicts                  |
| ------------------------------------------- | --------------------------------- |
| `components/quiz/useQuizState.tsx`          | main added `question_answered`    |
| `content/sets/setA.generator.ts`            | main's Gensler fidelity fixes     |
| `content/sets/setN.generator.ts`            | main's Gensler fidelity fixes     |
| `__snapshots__/setA.generator.test.ts.snap` | follows setA                      |
| `__snapshots__/setL.generator.test.ts.snap` | follows main's Set L fidelity fix |
| `__snapshots__/setN.generator.test.ts.snap` | follows setN                      |

**The content conflicts are the fidelity-critical ones and they are
where a class gets taught something false.** `main` carries
`e5c4a5e fix(content): restore Gensler-faithful answers in Sets A, L,
and N` — corrections this branch never saw. Resolve them **against the
textbook and the decoded 2008 DSL** (option `a` is the correct one; a
doubled source letter is lowercase), never against derived audit notes
and never by taking "ours" to make the conflict go away. Snapshots must
be regenerated **after** the generators are right, not used to decide
what right is.

**`useQuizState.tsx` is the other one to slow down on.** Per `CLAUDE.md`,
grading truth lives only in `onCheckAnswer` and nowhere else. `main` adds
analytics capture in the same file this branch rewrote for scoring. Keep
both; re-derive nothing.

Suggested order: merge `origin/main` **into the branch** first, resolve
there, get the suite green, then merge the branch to `main` — so `main`
is never in a broken state.

## Blockers to decide before the merge

Ranked. Malik has seen all three and has not ruled on them.

1. **Screen readers cannot reach the quiz.** The vaul sheet marks the
   question and every option `aria-hidden`, at **every width, desktop
   included** — verified today via the accessibility tree, where the
   options are simply absent until the attribute is stripped by hand.
   WCAG is a release blocker for this project and this ships into a
   university course tomorrow. A background task chip exists for it.
   Fix is to make the drawer non-modal (`modal={false}` or equivalent)
   and re-verify the tree at phone width, including focus and Escape.
2. **`score_percentage` is meaningless and will corrupt tomorrow's
   data.** `useQuizState.tsx:409` divides by the whole question bank in
   scored mode, so a flawless 20-problem run on Set Q's 118-question
   bank reports **17%**. If the class is meant to produce usable
   numbers, today is the moment. Note `CLAUDE.md`'s rule: renaming a
   property means re-pointing saved PostHog insights with
   `coalesce(properties.new, properties.old)`. Also note this file is
   one of the merge conflicts — do the merge first, fix after.
3. **The icons shipped without the pass their own handover demanded.**
   `98b5fd3` landed the split-by-mark family, but dark mode, Safari's
   monochrome pinned tab and the iOS tinted/clear variants were never
   checked. A two-colour knockout mark can collapse when the system
   flattens it to one ink. Ten minutes of checking, not a redesign.

Known and explicitly **not** blockers, flagged so they are not
rediscovered under time pressure: the desktop start/end screens overflow
the viewport by ~106px (pre-existing, a layout decision on a deliberately
composed screen); the end screen's exit routes to `/` where the resume
banner calls a just-finished run unfinished (low severity, needs a
completion flag on `LastDrill`); `lib/scoring.ts`'s `ScoreFloor`
docstring states accuracy minima without a bank size, so it is at best
under-specified (`n = 20/(2a−1)` is bank-dependent) — a check, not a
conclusion.

## What landed today

All committed and pushed to `color-system-exploration`.

- `891b3c1` — a mouse pick no longer wears the keyboard's focus band.
  Chrome's `:focus-visible` heuristic **promotes** the focused element
  the moment any key is pressed, so clicking an option and then pressing
  Enter to check made the clicked pill sprout the keyboard band.
  Cancelling `mousedown` stops the button taking focus from the click.
- `22d3419` — the footer band takes the covers' quilt at 0.74.
- `b74f1c7` — the legal links stop pretending to be links; Keyboard →
  LaTeX Keyboard.

Two corrections worth carrying, because both were mine and both were
wrong in the handover you may otherwise trust:

- **The band's uncropped scales are a family, not a number.** I wrote
  that a 56px strip has one natural quilt scale, `h / 62`. A cell is
  `62 × scale` and rows lay from y=0, so **any** whole row count divides
  evenly: `h / (62 × N)`. Malik caught it, and releasing the whole-row
  rule altogether is what produced the shipped 0.74.
- **The shortcut tooltips are not cached and not broken.** They retire
  per-origin via `localStorage` (`lc-shortcuts-used`) the first time a
  device selects an option by number key — Saffer's long loop, working
  as designed. Expect them to reappear on each new origin.

The **overnight 2026-08-23 batch is now fully reviewed**; the footer
band was the last of the six open items. Nothing from that batch is
awaiting Malik.

## Environment

- **Disk is at 97%** (~6 GiB free, briefly down to 2.1 GiB today, where
  one command failed with ENOSPC). Builds will start failing.
- Dev server: `.claude/launch.json` → `logicola-dev`, port 3100. Use the
  preview tools, never a raw Bash dev server.
- The labs are static files; serve them with
  `python3 -m http.server 8899` from the repo root and open
  `/docs/<lab>.html?v=N`. That server sends no cache headers, so bump
  the cache-buster or you will judge a stale render.
- `docs/offline-roadmap.md` is **untracked** — 290 lines, dated
  2026-08-15, written as a plan of record. Its "Why now" rests entirely
  on a GeoIP read of the audience as Asia- and Philippines-heavy, which
  sits badly against the standing position that the target is the US
  textbook market. Worth rethinking before it is committed as policy —
  and today's UT Arlington deadline is a point against it, not for it.
