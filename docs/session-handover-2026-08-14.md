# Handover — 2026-08-14 (nav + footer: lab-designed, shipped to the branch)

Written on branch `color-system-exploration` (pushed through `0a872b1`).
Supersedes `session-handover-2026-08-12.md`. A design-and-ship session:
two new labs, fourteen nav decisions and seven footer calls worked
through with Malik live, and both surfaces implemented and pushed for
Vercel preview. (Earlier the same day, a separate session shipped the
blog + release notes and the marketing lab — its state lives in
`lib/marketingTheme.ts` and `docs/marketing-lab.html`.)

**THE PRIORITY GOING FORWARD: the new design and the new landing page.
The next session is the FAQ section — prototype first, then implement.**
See "Next session" at the bottom before doing anything else.

## Done today

- **Nav lab** (`docs/nav-lab.html`, new — the judgement bench for the
  exercises menu). Decisions D1–D14 inside it, most taken same-day:
  two-level IA (topic → drill, derived from `slugs[0]`), set-letter
  order, chapter meta out of the UI, master–detail over the mega-menu,
  descriptions in the panel, set letters visible, bottom sheet as the
  mobile container with 3d-f/3d-g the surviving branded variants,
  pixel-silhouette corners as the desktop card default (lightened
  shadows), gem-clipped hover fills, Brand · mint killed everywhere,
  camo band the sole surviving desktop pattern, NEW gem slimmed to
  20px. Rejected directions stay live in the file, relabelled.
- **Nav shipped.** Desktop: the flat dropdown became the master–detail
  panel on a pixel-cornered contained card; the bar itself untouched
  (Malik's call) except Donate, now the sprite gem CTA. Mobile: vaul
  bottom sheets — 3d-f on `/`, 3d-g on the TEMPORARY `/nav-preview`
  route for the on-device D13 judgement (delete the route once
  decided). New files: `content/topics.ts` (IA + ensure-contrast colour
  tiers as constants), `components/nav/*`, `components/mobile/
exercisesSheet.tsx`. HIG pass applied: 44pt targets, safe-area
  padding, vaul drag-to-dismiss. Commit `161cec8`.
- **Footer lab** (`docs/footer-lab.html`, new — a single live footer
  with eight dials: scheme / layout / subscribe / pattern / band
  position / socials / mark / mission, plus a 390px phone frame driven
  by the same state). Cards F1–F7. The subscribe form is the
  release-notes DECIDED pill; the socials dial carries the shipped
  pixel icons. **The default is Malik's favourite: Set L ·
  subscribe-first · row · fine camo band at bottom · pixel icons in
  white gem chips · the can · mission on.**
- **Footer shipped** (`components/footer.tsx`, commit `0a872b1`) — the
  favourite structure on the PROVISIONAL Brand · cream: subscribe-first
  banner reusing the shipped `NewsletterForm` (posts to
  `/api/newsletter`, `subscribe_source: 'footer'` — placements are now
  comparable in PostHog), the green can + mission line, all links and
  events preserved, icons in 30px white gem chips inside 44px tap
  boxes, and the fine camo band (`lib/patterns` `camoBody`, green +
  magenta, seed 11, 1600px render slice-cropped so features never
  squeeze).

## Colour state (do not re-litigate; do not re-propose)

- **Cream `#EDEDE3` + system green `#05A24B` is provisional.** Malik,
  verbatim: "I have a feeling we'll switch our main color scheme to
  Set L or Brand original. But let's keep the cream for now."
- **Brand · mint (green-on-mint) is DEAD** — killed on sight, removed
  from the nav lab and retired to a comment in the marketing lab's
  dial (the `brandField` burial). Set L (plum on the same mint) is a
  different scheme and very much alive — Malik's favourite footer
  state wears it.
- Every shipped scheme-dependent value is a named token with its
  measured ratio (`content/topics.ts`, `components/footer.tsx`,
  `lib/marketingTheme.ts`) — the eventual switch is a constant swap.
- Three greens are in circulation and only one is right: `#05A24B`
  (the system), `#17a34a` (tailwind `primaryColor` — drift, still on
  the desktop nav trigger), `#00A842` (`app/icon.svg` — drift).

## The rules that did the work (port-critical, learned the hard way)

- **A `clip-path` crops everything its element paints — box-shadow and
  `filter: drop-shadow` included.** Effects go on a wrapper/ancestor
  (the pixel card's shadow lives on the Radix Viewport;
  `pixel-ui.md`'s ring rule generalised). Malik caught the invisible
  card himself.
- **The role split is the 1.4.3 fix**: the scheme's TYPE colour carries
  every small run of text; the coloured ink is display, underline and
  CTA ground only. Corollary discovered in the footer: NO text passes
  4.5:1 on the brand green — when the ink can't carry text, the
  button stands on type (see `btnColors` guard in the footer lab).
- **Logotypes are exempt** from 1.4.3/1.4.11 — the green can at 2.8:1
  on cream is legal-but-faint, flagged as such, a brand call not a
  compliance one.
- **One world per screen** (mobile sheets): a menu never stacks
  grounds — 3d-d paints the whole sheet including the grabber; 3d-f's
  level 2 stays in the cream world. Both dissonances were Malik's
  catches.
- **The brand spends inks and accents, never pale surfaces on pale
  grounds** (brand lab's forced inversion) — every pattern colour in
  nav and footer obeys it.

## Open decisions

- **D13 final (mobile nav): 3d-f vs 3d-g** — judged on-device via `/`
  vs `/nav-preview` on the Vercel preview. Then delete `/nav-preview`
  and the variant switch in `components/mobile/navbar.tsx`.
- **D11 (scheme)** — cream provisional; lean Set L / Brand original.
  The labs are the judging surfaces; `marketingTheme.ts`, `topics.ts`
  and `footer.tsx` are the three token files to swap when it lands.
- **D12 shell half** — contained card shipped as default; full-bleed
  kept in the lab.
- **D14** — the camo band shipped on the footer; whether the desktop
  NAV also gets the band edge (nav lab § 4p survivor) is unconfirmed.
- **F-cards**: footer Legal links are still `#`; newsletter provider
  undecided (Supabase stub captures meanwhile); Donate deliberately
  not duplicated into the footer.
- Dependabot: 26 vulnerabilities on the default branch (12 high) —
  task chip spawned, untriaged.

## Traps for the next session (all cost real time today)

- **The Browser pane went stale/hidden repeatedly** (0×0 viewport,
  stale compositor tiles in screenshots). Verify with the
  chrome-devtools MCP instead; for long-page screenshots, hide the
  sections you don't need, wait two rAFs, capture the short page.
- **macOS `sips --cropOffset` silently wraps at 16384px.** Crop tall
  captures in two stages or shorten the page first.
- **The pre-push hook runs prettier over docs/ too** — `pnpm
format:fix` before pushing anything that touches lab HTML.
- Malik's own dev server may hold port 3000 — ours is `logicola-dev`
  on 3100 (the local launch config); the docs labs serve via `docs-lab`
  on 8077. Never kill his process.
- Radix NavigationMenu's panel chrome lives on the Viewport —
  `viewportClassName` passthrough added to the shadcn wrapper for the
  pixel card.

## Next session — FAQ section (prototype first, per house rule)

The FAQ lives in `app/(site)/page.tsx` (`accordionData`, five entries)
rendered through `components/ui/accordion.tsx` (shadcn; the caret is
already the library's pixel chevron). It's the last homepage section
still wearing none of the new design.

Suggested shape, consistent with how nav and footer went:

1. **Read first**: this file, `docs/redesign-handoff.md` (lists all
   five labs), `docs/nav-lab.html` + `docs/footer-lab.html` in a
   browser (the decisions live inside them), `lib/marketingTheme.ts`.
2. **Build `docs/faq-lab.html`** with dials, reusing the established
   canon (schemes with cream provisional + Set L + 2008 original,
   ensure-contrast machinery, sprite/gem clips, mono eyebrows, the
   figure rule, deep-register patterns). Real FAQ copy from the
   homepage. Questions worth dialling: ground (white vs scheme),
   item treatment (hairline rows vs cards vs gem-clipped fills on
   open), the open-state (does an answer get a surface?), heading
   treatment (display stretch + mono eyebrow), one-column vs
   two-column at desktop, whether FAQ gains entries (the mission/
   donate story), FAQPage JSON-LD in the port.
3. **Judge with Malik, then implement + push** to this branch for the
   Vercel preview, same as nav and footer.
4. Landing-page work continues around it — the homepage is now header
   (old bar + new panel), hero/content (untouched), FAQ (next), footer
   (new). The hero is the remaining big surface after FAQ.
