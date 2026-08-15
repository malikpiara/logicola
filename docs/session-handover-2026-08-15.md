# Handover — 2026-08-15 (FAQ lab built; awaiting Malik's judgement)

Written on branch `color-system-exploration`. Supersedes
`session-handover-2026-08-14.md`, whose "Next session" this session
executed. An AUTONOMOUS session — Malik was away, so everything here is
proposed, nothing is decided. Nothing was committed or pushed.

## DIRECTION FROM MALIK (2026-08-15, mid-session — binds the lab)

**"We want the footer part to be colored. So it might make sense for
the rest of the website or for the FAQ section to have a white
background."** The lab was reworked the same day to record that lean:

- **Default ground is now WHITE**; the scheme grounds stay on the dial
  for comparison. FQ1 flipped from "judge" to "rec: white".
- **The footer below the section is simulated in FULL** (Malik:
  "simulate/show what will be below — subscription + footer"): the
  favourite footer-lab state — subscribe-first banner, row pill, the
  can + mission, link columns, pixel icons in white gem chips, fine
  camo band at bottom — at both widths, re-groundable Set L (default)
  / shipped cream / hidden. Context only; its own audit lives in the
  footer lab. Generators, mark paths and icons mirrored verbatim from
  footer-lab.html / lib/pixel.ts / components/footer.tsx.
- **New Echo dial (FQ9, the new question)**: does the white FAQ
  anticipate the footer's colour? Off (cold seam) / heading ink (the
  display heading takes the footer's ink — plum before the mint
  arrives; coloured ink on display only, ensure-checked at the 3:1
  large-text floor) / figure tint (plates, cards and the open-fill
  take the footer's GROUND instead of cream) / both. Echo follows the
  Ft. dial, so a D11 change moves it automatically. Default: heading.
- **Presets row** (A–E): whole compositions one click apart — white
  over Set L (default), figures tinted, white cards two-col, quiet
  white (nearest today), and the superseded cream morning proposal.

## Feedback round (same day, third pass — Malik's screenshot notes)

1. **Two adjacent open plates fused** — "no margin/spacing between the
   2 painted/expanded answers is bad design." Fixed: consecutive OPEN
   items in open-fill now separate by a 10px gap of ground (the option
   marks' surface-gap rule at section scale — two figures never
   touch); the gap animates with the open transition and only appears
   between two open plates, so the closed rhythm is unchanged.
2. **"Frequently asked questions is HUGE."** The display capped at
   56px in the first cut; now `clamp(30px, 3.1vw, 42px)` (26px phone)
   — the section register: an h2 inside a page, one step below hero
   display, still ~2.7× the answer text. FQ4's card records it.
3. **Contact (new FQ10 + Contact dial)** — Malik: name the "me"? let
   professors book calls? Three states: "Email me" (as drafted) /
   named ("Email me — I'm Malik, and I read every message", keeping
   the first-person voice) / named + booking ("Teaching with LogiCola?
   Book a 15-minute call…"), where the booking line also extends the
   classroom entry. DEFAULT: named. The booking variation is framed as
   the LogiSkor discovery channel — booked calls are measurable
   teacher leads; port note says tag `book_call_click` /
   `source: 'faq_rail'` in PostHog (snake_case per convention).
   Provider (Cal.com / Calendly) undecided; link inert in the lab.

Also added in this pass: **deep-linkable dial state** —
`faq-lab.html?items=cards&echo=both&open=0,1` overrides any dial and
the open set, for sharing exact compositions during judgement (and
for headless capture).

## Feedback round 2 (same day, fourth pass)

1. **"QUESTIONS and FREQUENTLY ASKED QUESTIONS seems a bit
   redundant"** — correct; the eyebrow repeated its own heading. New
   **Head pair dial (FQ11)**: no eyebrow (heading is the label —
   DEFAULT), SUPPORT (adjacent register), or the roles flipped (FAQ
   eyebrow + "ASK AWAY" display — the only pair where both layers
   carry information; tone is the judgement). The mono voice survives
   in FOR INSTRUCTORS and the index numbers.
2. **The two stacked contact paragraphs read "too much" as a block**
   — hierarchy, not content. Contact split into two dials: **Contact**
   (the email line's voice: "Email me" vs the signed "I'm Malik") and
   **Instructors** (off / rail-inline, the fused draft / rail-block /
   **own hairline-topped section under the list — DEFAULT**, FOR
   INSTRUCTORS eyebrow). The strip also gives non-split layouts and
   the phone a home for the CTA (rail options are split-desktop only
   and fall back to the strip elsewhere). The classroom entry's
   "book a short call" sentence now follows the Instructors dial. The
   retired `contact=call` deep-link value migrates automatically.

Default composition after both feedback rounds: white · split ·
open-fill · display (plum echo) · no eyebrow · numbered · six ·
edited · "I'm Malik" email line · instructor strip · Set L footer
simulated below.

## What exists now

**`docs/faq-lab.html`** (new) — the homepage FAQ as a single live
configurator, same conventions as the footer lab (one dial state, two
widths: 1200px frame + 390px phone). Ten dials plus the presets row:

- **Ground** — the D11 candidates + today's white (Brand · mint stays
  dead).
- **Layout** — centered (as today) / split rail (heading + intro +
  mailto left, questions right) / two columns.
- **Items** — hairline rows / pixel-cornered cards (`spriteClip(0,16)`,
  shadow on a wrapper) / **open-fill**: hairline rows where the OPEN
  item paints a figure plate — clip always on, visible only when the
  fill paints (the nav lab's hover-fill construction). The plate bleeds
  by the wrap gutter (`--bleed`: 24px desktop / 20px phone, flush with
  the frame edge there).
- **Answer** — bare vs small plate (`spriteClip(0,12)`); moot under
  open-fill.
- **Heading** — today's centered bold vs mono QUESTIONS eyebrow +
  display stretch (split always displays).
- **Index** — mono 01–06 in the scheme accent, ensure-contrast
  darkened; indent released at phone width.
- **Entries** — today's four vs six (+ "How can I support the
  project?", + "Can I use LogiCola in my classroom?" — the
  mission/donate story WITHOUT duplicating the header's Donate gem).
- **Copy** — verbatim (`page.tsx` words, glyphs corrected) vs a
  proposed edit (fixes the stale "couple of months" age claim, the
  comma splice, Logiskor/LogiSkor).
- **Ft. below** — the FULL footer simulation under the FAQ (see the
  direction block above; it replaced the morning's cropped seam
  strip). Not audited here.
- **Echo** — FQ9, added with the direction (see above).

Decision cards FQ1–FQ9 inside the file; recommendations marked
(white ground, open-fill, display heading, six entries, edited copy,
FAQPage JSON-LD — with the honest caveat that Google no longer shows
FAQ rich results for ordinary sites; the value is AI answer engines).
The default state IS the proposal, post-direction: white · split ·
open-fill · display (ink echoing the footer) · numbered · six ·
edited · Set L footer simulated below.

Deliberately absent: a pattern dial — the footer's band closes the
page one viewport below, and D14 killed desktop pattern surfaces
beyond it. Argue it back in deliberately if wanted.

## Finding that outlived the lab

**The system green `#05A24B` focus outline fails WCAG 1.4.11 on the
brand grounds: 2.84:1 on cream `#EDEDE3`, 2.85:1 on Set L mint
`#CFF6DD`** (floor is 3:1; it passes on white at 3.35:1 and scrapes
3.0:1 on the 2008 aqua). Every lab uses that outline globally, and the
shipped cream footer presumably does too. The lab now derives a
per-scheme focus colour (green mixed toward the type colour until
≥3:1) and the audit strip flags when the derived value is in play. A
task chip was spawned to audit the app's real `:focus-visible` styles
across grounds; the derived token belongs in the same files D11's
switch will edit (`content/topics.ts`, `components/footer.tsx`,
`lib/marketingTheme.ts`).

## Verified

Desktop states screenshotted (default proposal, white/centered/today
baseline, Set L cards two-col, 2008 original split); phone frame
verified at 390px (split stacks, plate flush, indent released, 52px
triggers); toggle syncs both frames without re-render (focus and the
height animation survive); `aria-expanded` flips; audit strip all-green
in every scheme; reduced-motion kills the transitions.

## Traps hit this session (extends the 08-14 list)

- **The Browser pane's hidden renderer never fires rAF** — that is WHY
  its screenshots show stale compositor tiles, and any rAF-waiting
  script times out. Don't fight it: capture with headless Chrome
  (`--headless=new --virtual-time-budget=6000 --window-size=W,H
--screenshot=…`), measuring the target's offset first via the pane's
  JS (which works fine hidden), then `sips` crop. URL fragments can't
  scroll to nodes inside `overflow:hidden` containers (the phone
  frame), so anchors alone won't aim the shot.
- **chrome-devtools MCP**: a stale profile lock gives "browser already
  running" — kill the `chrome-devtools-mcp/chrome-profile` processes
  and `rm` the profile's `Singleton*` links. It also wedged mid-session
  (30-min tool hang); don't lean on it as the only capture path.
- **`python3 -m http.server` + browser heuristic caching** serves
  stale lab HTML after edits — reload with a cache-buster query.

## SHIPPED (fifth pass — Malik: "implement the FAQ … so I can test it")

The lab's default composition is now IN THE APP, pushed to this
branch for the Vercel preview (same flow as nav and footer):

- **`components/faqSection.tsx`** (new) — copy (six entries, edited
  pass), the measured `FAQ_*` colour tokens (the D11 switch edits that
  block; display ink deliberately does NOT echo any footer scheme
  while FQ9/D11 are open), FAQPage JSON-LD generated from the same
  array as the visible copy, the named mailto line, first entry open
  by default. `app/(site)/page.tsx` now just mounts it; the old
  `accordionData` (typewriter quotes, stale age claim) is gone.
- **`app/globals.css` § Homepage FAQ** — the open-fill construction:
  clip always on via `style.clipPath` (`spriteClip(0,16)` from
  `lib/pixel.ts`), plate paints on `data-state='open'`, hairlines as
  `::before` (borders die on the corner stairs), 10px ground gap
  between adjacent open plates, `--faq-bleed` 16px/24px flush with the
  gutters, answers indented 30px only at `lg`. Reduced-motion guard
  extended; `animate-accordion-up/down` was already guarded.
- **Held back deliberately:** the FOR INSTRUCTORS section ("needs
  more thought and structure" — Malik) and every echo variant. The
  shadcn accordion wrapper is untouched.
- Verified: 916 tests green, eslint + tsc clean (`pnpm eslint` noise
  is the stale offline-phase-0-2 worktree, not
  this change), desktop + 390px renders match the lab (plate flush,
  57px triggers, no horizontal overflow — `scrollWidth` 390).
- **TODO carried in code:** `CONTACT_MAILTO` points at
  `mailto:malik@hey.com` — confirm the public address before this
  leaves the preview branch (the old copy promised "email me" with no
  link at all).
- Trap for the record: **headless Chrome clamps windows to ~500px
  wide** — a `--window-size=390` capture renders layout at 500 and
  crops, which looks exactly like page overflow. The page was fine
  (`scrollWidth` 390). Capture phones through a 390px iframe in a
  wider window instead.

## Next session

1. **Iterate with Malik on the Vercel preview** — he tests the shipped
   section, then: FQ9 (echo — heading ink is a one-constant change in
   `faqSection.tsx`), FQ11 (head pair), FQ10 (the instructor section —
   needs real structure: what a professor sees, what they get, where
   it lives; the booking provider and the `book_call_click` event come
   with it).
2. Still open from 08-14: D13 (3d-f vs 3d-g on `/nav-preview`), D11
   (scheme), D14's nav band edge, the hero — the remaining big surface
   after FAQ.
