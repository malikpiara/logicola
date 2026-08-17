# Handover — 2026-08-17 (landing lab built; composition DECIDED same day)

Written on branch `color-system-exploration`. Supersedes
`session-handover-2026-08-15.md`. A single-day arc in six passes:
lab built → composition decided → ported → three tweak rounds —
everything COMMITTED AND PUSHED at session close (see the closing
section; earlier "not committed" notes below record the state at the
time they were written).

## DECIDED (same day, second pass — Malik, from the dials)

Malik played the dials and picked the composition; it is now the
lab's default (preset A; the superseded morning proposal is A0):

- **Ground: Set L mint** — the first content surface off the
  white/cream lean, consistent with the standing Set L primary lean.
  Front-runs D11 for ONE surface, doesn't close it (LP11 card). The
  page now reads mint (landing) → white (FAQ) → mint (footer).
- **Hero: compact masthead** (LP4 decided) · **mascot off** (LP5
  leaning off) · **copy VERBATIM** (LP6 — the proposed edit was NOT
  taken; it stays one dial away).
- **Form: topic CARDS at both widths** (LP2 decided in two passes —
  first "topic cards on mobile instead" over desktop rows, then,
  after more testing, "topic cards would also work better on
  desktop". One form, one component, no layout fork; rows stay on
  the dial for comparison).
- **Colour: chips** (LP3 decided) — neutral white cards, set colour
  in the 30px gem icon-chips and tags. Side-effect worth keeping: in
  this composition every focusable sits on a white card, so the
  system-green focus ring passes 1.4.11 without derivation.
- **Guide: the RESUME banner is the target state** (LP7) — port
  order: catalogue first, then the quiz persists a last-drill key,
  then the banner (renders only when the key exists; first-time
  visitors see a clean catalogue).

Measured in the decided state: first drill tap (the resume banner
counts — for a returning student it IS the first drill) at phone
y≈295px, desktop y≈289px; all contrast pairs green.

## PORTED (same day, third pass)

Malik: "go ahead and start implementation … don't push yet, I'll want
to see, test and tweak."

The decided composition is IN THE APP, working tree only — NOT
committed, NOT pushed (Malik's call: local testing first, on the
`logicola-dev` server, port 3100):

- **`components/landing/exercisesCatalog.tsx`** (new, server) — the
  masthead (H1 words verbatim, display register, plum on mint) + the
  catalogue: six topic cards from `content/topics.ts` (IA + colours
  already lived there; no new data file), gem icon-chips wearing the
  set surfaces, D6 set tags (header for single-set topics, per-drill
  for Informal), `drillTitle` short labels with full-title
  `aria-label`s (WCAG 2.4.4). The token block carries measured ratios
  and is the D11 swap point for this surface.
- **`components/landing/drillLink.tsx`** (new, client) — the drill
  row: gem hover-fill on a `::before` layer so the row stays UNCLIPPED
  and `:focus-visible` draws a complete rectangle (the ring rule);
  fires `landing_drill_click` (`topic_id`, `quiz_path`, `position`
  1-based across the page, `source: 'landing_catalog'`).
- **`components/landing/resumeBanner.tsx`** (new, client) — renders
  only when `lib/lastDrill.ts`'s key exists; reads through
  `useSyncExternalStore` (the `currentYear.tsx` pattern — the
  react-hooks lint rejects setState-in-effect, and the snapshot is
  reference-cached against the raw string because React compares with
  Object.is). Clip on an inner span, focus on the link. Fires
  `landing_resume_click`.
- **`lib/lastDrill.ts`** (new) — read/write/snapshot/subscribe for
  `localStorage['logicola.last_drill']`.
- **`components/quiz/index.tsx`** — one effect after `useQuizChrome`:
  writes the key during an active run (start screen excluded), an
  OBSERVATION of `scoreState.score` — grading truth stays in the hook.
- **`app/globals.css` § Landing exercises** — `.lx-*`, colour only
  via `--lx-*` vars; wrap follows the app container (screen-xl +
  px-4/sm:px-6, the 08-15 carried rule).
- **`app/(site)/page.tsx`** mounts it; **`components/header.tsx`
  DELETED** (the old hero — mascot + drift-green H1; the lab's Hero ·
  today dial preserves it for reference).

Verified: eslint + tsc clean, 458 tests green, no console/server
errors; live loop tested end-to-end — Start Quiz on Deontic
Imperative wrote the key, the homepage then showed "Continue where
you left off · Deontic Translations: Imperative · you were at 0
points" linking back. Mint ground, stretched plum H1, 6 cards / 13
drills / NEW gem confirmed in the DOM at desktop and 390px.

**Seam to judge on the preview: the SHIPPED footer is still cream**,
so the real page reads mint → white FAQ → cream footer until D11
lands (the lab simulated the favourite Set L footer below — that
swap is `components/footer.tsx`'s token block).

Capture trap (new): headless Chrome renders a cross-origin iframe
BLANK under both `--virtual-time-budget` and `--timeout` — the 390px
iframe wrapper that worked for static labs fails against the dev
server. The chrome-devtools MCP (`new_page` → `resize_page` 390 →
`take_screenshot fullPage`) is the working phone-capture path for
app pages; its `filePath` must be inside the workspace.

## TWEAK ROUND 1 (same day, fourth pass — Malik, from testing)

Three notes, all landed (still uncommitted):

1. **"White margins left and right"** — root cause was the (site)
   layout's `<main className='flex'>`: the page div sized to
   fit-content and the mint stopped ~60px short of each edge. Fix:
   `w-full` on the page div (comment marks it load-bearing). While
   in there, the ALIGNMENT pass: both navbars moved from `p-4` (16px
   at every width) to `px-4 py-4 sm:px-6`, so the bar's logo now sits
   on the same gutter as every section. Measured after: every left
   edge (bar · H1 · eyebrow · cards · FAQ heading · footer) = 16px at
   390, 24px at 1280; card interior text aligns at ground + 20px.
2. **"Other sections reflect Set L"** — the FAQ and the footer
   re-grounded (token swaps in their own files, as designed):
   - `components/faqSection.tsx`: white ground kept, inks now plum
     (type 14.88:1 / body #693988 8.26:1), the open plate is MINT
     `#CFF6DD` (the faq lab's echo=both state — no longer an "echo",
     the whole page wears the scheme), index stays magenta (Set L's
     own accent). NEW: `--faq-focus #0C8F4E` — one derived value
     clearing 3:1 on both white (4.15) and the mint plate (3.54);
     this also fixes the PRE-EXISTING failure on the old cream plate
     (green was 2.84:1 there — the 08-15 finding, now closed for
     this surface).
   - `components/footer.tsx`: the provisional cream RETIRED — ground
     mint, type plum, tiers re-derived (head 5.16 / link 8.06 / fine
     5.99 / hair #BBD4CC), the can is plum-on-mint (12.67:1 — the
     "legal but faint" green-can caveat retires with the cream), the
     camo band is plum + magenta on mint (the footer lab's Set L
     recipe), and the subscribe button is a LOCAL constant (plum bg,
     mint label) instead of marketingTheme's — the blog still speaks
     cream, deliberately.
3. **"Titles not in caps"** — `text-transform: uppercase` removed
   from the display voice on the landing H1, the FAQ heading, and
   the footer banner; tracking flipped +0.01em → −0.01em (caps
   tracking doesn't suit mixed case). The mono EYEBROWS stay
   uppercase — they are labels, not titles. NOTE FOR THE SYSTEM: the
   display voice is now "stretch, mixed case" — the labs and the
   marketing pages still speak caps; carry the rule when they're
   next touched.

Verified after the round: eslint + tsc clean, 458 tests green,
prettier applied; full-bleed + alignment + colours measured live at
390 and 1280 via the chrome-devtools MCP.

**Still cream after this round (deliberate):** the blog/marketing
pages (`lib/marketingTheme.ts`) and the mobile nav sheet's chrome
(`components/mobile/exercisesSheet.tsx`, cream world) — plus the
desktop bar's drift-green "Exercises" trigger (`text-primaryColor`).
All are D11-adjacent surfaces to sweep when the scheme call goes
global.

## TWEAK ROUND 2 (same day, fifth pass — nav + logo)

Malik: "update the navbar and the navigation color scheme", then
"the navbar adopts the mint background on the landing page — and only
on the landing page", then "replace the LogiCola text with our logo".
All landed (still uncommitted):

- **Bars** (`components/navbar.tsx`, `components/mobile/navbar.tsx`):
  Set L inks — plum trigger/burger (the drift-green
  `text-primaryColor` usage is GONE from the bar; that was one of the
  three circulating greens), muted Blog tier `#715790`, Donate gem
  plum-on-mint (the footer button's pair). **Conditional ground**: on
  `/` the bar is mint and fuses with the masthead ("nav shares the
  ground it sits on" — the marketing lab's rule); everywhere else
  (incl. quiz pages) it stays white over the set surfaces. Ground +
  hover ride `--nav-ground`/`--nav-hover` vars. Trigger needed
  `bg-transparent` — shadcn bakes `bg-background` into it, invisible
  on white, a stray pill on mint.
- **The can replaces the bar's text wordmark** — new
  `components/logoMark.tsx` + `lib/wordmarkPaths.ts` (the 16 paths as
  a checked-in constant, because `markSvg` lives in SERVER-ONLY
  marketingTheme and the bars are client components;
  `wordmarkPaths.test.ts` asserts the constant stays byte-identical
  to `public/logicola-wordmark.svg` — the same guarantee the server
  parse gives). Knockout = `var(--nav-ground)`, so the lettering
  stays a hole on mint and white alike. 36px desktop / 34px mobile.
- **Desktop panel** (`components/nav/exercisesMenu.tsx`): re-inked —
  plum type, ACTIVE fill is now the MINT (selection previews the
  scheme ground, exactly as cream previewed cream), META is the
  scheme's magenta, tiers re-derived on white with ratios.
- **Mobile sheet** (`components/mobile/exercisesSheet.tsx`): the
  cream chrome RETIRED — mint sheet, plum type, grabber `#9DA0B4`
  (byte-identical to topics.ts's Set L grab: same formula, same
  inputs), tiers re-derived (`META_MINT` = magenta 4.75:1 on mint).
  `CreamDrills` renamed `MintDrills`. Variant 'g' set-worlds
  untouched.

Verified live via the chrome-devtools MCP: panel opened (mint active
row, magenta SET A, plum drills), sheet driven to level 2 (mint world,
white drill cards), bar mint on `/` with transparent trigger idle.
eslint + tsc clean; 459 tests (the new wordmark sync test included).
Debug note: vaul renders a hidden duplicate of the sheet — click the
match with `getBoundingClientRect().width > 0`, not the first match.

After this round the ENTIRE homepage speaks Set L (bar → masthead →
catalogue → FAQ → footer). Remaining cream: blog/marketing
(`marketingTheme.ts`) only.

## DIRECTION FROM MALIK (2026-08-17 — binds the lab)

Tested the shipped nav variants on mobile, verbatim: **"the navigation
items need to be on the frontpage/landing page instead … The main goal
we have is for people to do the logic drills, so we should surface
them right away."**

The shipped mobile path to a drill is three taps (Exercises → topic →
drill through the bottom sheet). The catalogue is six topics and
thirteen drills — small enough to BE the landing page. This session
built the lab for that, per the prototype-first house rule.

## What exists now

**`docs/landing-lab.html`** (new) — the landing page as a single live
configurator, same conventions as the FAQ/footer labs (one dial state,
1200px frame + 390px phone). New in this lab: a **fold marker** in the
phone frame (≈660px — iPhone 14, Safari chrome at first load) and an
audit line that MEASURES where the first drill link lands, so "surface
the drills right away" is a number, not a feeling. Dials:

- **Ground** — white (default; the 08-15 direction: content region
  white, footer takes the colour) + cream / Set L / 2008.
- **Hero** — today's block (mascot + drift-green H1, honest to the
  app) / compact display masthead / none. The ledger form carries the
  masthead in its rail.
- **Form** — topic cards (2-col grid, drills inline) / topic rows
  (full-width bands) / drill ledger (the FAQ's split-rail shape — the
  homepage's two big sections would share one grammar).
- **Colour** — set-surface plates (the quilt identity; each card wears
  the colour its quiz screen wears) / neutral cards + set colour in
  gem icon-chips and tags / quiet (control).
- **Drills** — rows with chevrons / sprite pills.
- **Guide** — off / START HERE gem on Set A's first drill / resume
  banner (simulated; the port needs the quiz to persist a last-drill
  key first).
- **Mascot** — on/off (today's hero always carries it; ledger rail
  hides it on the phone — fold budget spent on drills).
- **Copy** — verbatim vs a proposed one-liner edit ("Endless logic
  drills with step-by-step hints — free in your browser, online or
  off.").
- **Below** — the SHIPPED FAQ + the favourite Set L footer simulated
  in full (context only), re-groundable to cream, or hidden.

Default composition = the proposal: white · masthead · cards · plates
· rows · START HERE · mascot off · edited copy · Set L below.
Presets A–E jump whole compositions (A proposal · B ledger rail ·
C rainbow rows + pills · D quiet control · E today's hero + catalogue,
the nearest-today baseline). Deep-linkable state
(`?form=ledger&color=chips…`) for sharing and headless capture.
Decision cards LP1–LP10 inside the file; port + a11y notes in § 2.

## Measured (the lab's own audit, default state)

- **First drill on the phone: y≈351px — above the 660px fold**, with
  two full topic cards (four drills) visible before the first scroll.
  Today's hero pushes the first drill to the fold line itself
  (preset E shows it); production today has zero drills on the page.
- Taps to first drill: 0, vs 3 through the shipped sheet.
- All contrast pairs green in the default state (worst: set tag 4.6:1,
  focus 3.1:1 derived).

## Finding that outlived the lab

**The system green `#05A24B` focus ring fails WCAG 1.4.11's 3:1 floor
on ALL SIX set surfaces** (pink 2.0:1 … lilac 2.5:1 territory). The
08-15 finding (cream/mint grounds) extends to every topic plate: if
plates ship, `content/topics.ts` needs a derived per-topic `focus`
tier next to meta/body/hair/grab. The lab derives it at render
(green walked toward the topic ink until ≥3:1) and the audit strip
names the derived sets.

## Verified

No console errors; **64 dial-state combinations rendered in a loop
without a throw**; audit strip all-green in the default; phone frame
`scrollWidth` 390 (no horizontal overflow); toggling the FAQ sim keeps
focus and the height animation; prettier (pre-push hook format)
applied and the file re-verified after. Captures made via the
established workflow: pane JS for offsets (forced 1400px width — the
hidden pane renders at 0×0), headless Chrome `--window-size=1400,H`,
`sips` crops. Screenshots live in the session scratchpad only.

## Traps (this session's additions to the list)

- The hidden Browser pane now reports a **0-width viewport**, so
  offsets measured there are wrong until you force
  `document.documentElement.style.width='1400px'` and re-render —
  then they match headless Chrome at the same window width (±8px
  scrollbar).
- `python3 -m http.server` still serves stale lab HTML — cache-buster
  every reload (`?cb=N`).

## TWEAK ROUND 3 (same day, sixth pass — closing)

Malik: "remove this from the blog and release notes" (screenshot: the
cream FOLLOW THE RELEASES card). **`components/marketing/
newsletterCard.tsx` DELETED**, its three usages removed (blog index ·
blog post · release notes). Rationale: the footer now carries the
subscribe banner on EVERY page, so the card duplicated it one
viewport above itself — the footer lab's F6 rule (one oxygen mask per
page level). KEPT deliberately: the release-notes HERO pill
(`source: 'release_notes_hero'` — the page's own primary action, a
different job) and the footer banner. PostHog note: the retired
card's `subscribe_source` values (`blog_index`, `blog_post`,
`release_notes`) stop emitting; placement comparisons now read
`footer` vs `release_notes_hero`.

Session closed 2026-08-17: everything above COMMITTED AND PUSHED to
`color-system-exploration` (this session's only push). The Vercel
preview is the judging surface now.

## Next session

1. **Malik tests the Vercel preview on-device** — the landing, the
   mint bar fusing on `/`, the sheet, the resume banner (play a
   drill first; the banner needs the localStorage key).
2. **The D11 sweep's last surface: blog/marketing**
   (`lib/marketingTheme.ts` — cream "Brand · inverted" tokens, caps
   display voice). When it moves to Set L, carry the mixed-case title
   rule and re-judge the release-hero pattern field's pool on mint.
   The labs also still speak caps + cream chrome — update
   deliberately, not incidentally.
3. Still open from 08-14/15: D13 (3d-f vs 3d-g — LOWER STAKES now,
   the sheet is secondary navigation; decide calmly, then delete
   `/nav-preview` and the variant switch), FQ9–FQ11 follow-ups, the
   instructor section, `CONTACT_MAILTO` confirmation, the mascot's
   new home (it left the homepage — the lab's Hero · today dial keeps
   it; Malik may want it somewhere warmer than nowhere).
4. **Measure LP1's hypothesis in PostHog** once the preview ships:
   `landing_drill_click` funnel vs the sheet path, share of landing
   sessions reaching `quiz_started`, median time-to-first-drill.
