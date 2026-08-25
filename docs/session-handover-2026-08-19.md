# Handover — 2026-08-18/19 (footer, stats doc, favicon tab tier)

Written on branch `color-system-exploration`. Supersedes
`session-handover-2026-08-17.md`. Three unrelated threads, all shipped;
the third took five attempts and the reasons are worth reading before
touching colour again.

## 1. Footer — Bluesky, NEW pills, tagged book link

All in `components/footer.tsx`.

- **Bluesky** joins the "Follow us" list and the pixel icon row, using the
  hackernoon library's own `brands/bluesky.svg` so it keeps the bitmap
  grammar. It points at Malik's personal handle — LogiCola has no account
  of its own — so its aria-label names him, unlike its neighbours.
- **The NEW pill** moved off Keyboard and onto Blog, Release Notes,
  Bluesky and Reddit. Badged links are `inline-flex`, not `flex`, so their
  hit box hugs the label the way the unbadged ones do.
- **"Get the Book"** now carries UTMs
  (`utm_source=logicola.org&utm_medium=referral&utm_campaign=get-the-book&utm_content=footer_resources`).
  The `Referer` header alone gives Routledge only the bare origin under
  today's default policy and is dropped entirely under stricter privacy
  settings, so untagged referrals land in their "direct" bucket.
  **PostHog still receives the BARE url** as `link_url`, because saved
  insights filter on that exact string.

Open: four NEW pills is most of the visible footer flagged as new, and the
badge works by being scarce. `TrackedFooterLink` is already wired for the
book CTA and could be pointed at the four badged links to find out whether
the pill lifts clicks or just adds noise.

## 2. `docs/stats.md` — new, and built to be regenerated

First snapshot of the PostHog numbers. Every table carries the query that
produced it, so refreshing it is a re-run rather than a re-derivation.

**Three traps it records, all of which bit during the first pull:**

1. **A quarter of the events table is not production** — localhost and
   Vercel preview hosts. Filter `properties.$host = 'logicola.org'` or you
   overstate traffic ~25% and book clicks ~15%.
2. **Instrumentation landed in stages**, so months are not comparable
   before each event's first-seen date.
3. **`quiz_completed` jumps from ~5–10% of starts to ~93% in August.**
   Almost certainly a definition change, not behaviour — but UNVERIFIED,
   and flagged as not-a-usable-metric until someone traces what the event
   fires on either side.

**Headline findings:** visitors are flat at 320–550/month across six
months, no trend. 3.4% of production visitors click through to the
publisher — strong for a footer link. The affiliate arithmetic is recorded
(~$15–50/yr at current volume; ~25× traffic needed to matter), so the
question can be re-checked rather than re-litigated.

**Cheapest open gap:** the newsletter funnel cannot be measured at all.
`newsletter_subscribe_failed` exists; there is no success event. Failures
are visible, subscriptions are not.

## 3. The favicon tab tier — DECIDED, after four rejected schemes

`components/quiz/useQuizFavicon.ts` (new), `QuizScreenColors.tabColor`,
`app/icon.svg`. Full reasoning and the rejected schemes are in
`docs/color-handoff.md` § "The tab tier".

**What ships:** the shipped mark, unchanged silhouette, recoloured per set.
Every tab colour is the set's **primary** (its surface) at the lightness
that maximises the weaker of its two chrome contrasts (~3.55:1 both ways),
chroma restored to the gamut edge. Root and every non-quiz page wear the
brand magenta `#BD00AD`.

**Mechanics worth knowing before touching it:**

- It is **client-side on purpose**, for the same reason `useQuizChrome` is:
  generated sets resolve their subset — and so their palette — only at
  mount. A per-route `icon.tsx` would have no colour to render and would
  need one icon per slug, re-fusing the generator graph the bundle contract
  keeps apart.
- The mark is **fetched** from `/icon.svg` rather than inlined, so the tab
  icon cannot drift from the real one. The hook knows only which fill to
  swap (`SOURCE_FILL`), and gives up — leaving the default favicon — if the
  artwork stops matching. **If `app/icon.svg` is ever redrawn in another
  colour, `SOURCE_FILL` moves with it.**

**The one live compromise:** J, R and Q have surfaces within 22° of each
other, so their tabs are a family, separated only by lightness (min ΔOK
0.101, just past tellable apart). If they ever read as one set, the fix is
a surface change in the palette, not in the tab tier.

**A process note, because it cost most of the session.** The first tier was
built to clear a 3:1-on-both-chromes bar that nothing had asked for —
borrowed from WCAG 1.4.11, which governs our own UI, not browser chrome.
That invented constraint ruled out every colour the palette already owned,
produced seven new ones, and was written into the test suite where it kept
enforcing itself. Three more schemes followed before the answer turned out
to be the simplest reading of the original ask: the set's main colour, made
to work in both modes.

## State of play

- Branch `color-system-exploration`, everything committed and pushed.
- `pnpm test` (465), `pnpm eslint` (+ `tsc --noEmit`) green.
- `docs/offline-roadmap.md` is untracked and predates this session — left
  alone deliberately.
- Earlier commits in this session (`e1db894`, `c9fc28f`, `dec0506`,
  `e2e6380`) describe superseded favicon schemes. History was NOT rewritten
  — the final state is the last commit, and `docs/color-handoff.md` is the
  record of what won.

## Suggested next

1. **Trace `quiz_completed`.** It blocks the only engagement metric the
   project has, and `docs/stats.md` cannot be trusted on it until then.
2. **Add a newsletter success event.** Smallest possible change, turns a
   blind funnel into a measurable one.
3. **Build something on `question_answered`** — 21k events since
   2026-07-26, the richest dataset here, nothing reads it. Which sets are
   hard, where people stall.
4. **Source/referrer breakdown.** Whether the flat 320–550 visitors are
   course-assigned, search, or old harrycola.com links changes what growth
   work is worth doing.
