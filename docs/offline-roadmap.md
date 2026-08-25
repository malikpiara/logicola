# Offline Roadmap

Plan of record for making quizzes reliably available offline, and for
deciding whether per-quiz download control is worth building.

Established Malik, 2026-08-15, against build `e3qpRmhOicTgqBzb7JM_U`.
Re-verify the measurements in "Findings" before trusting this document
after a few more deploys.

**Execution status (2026-08-15, `worktree-offline-phase-0-2` branch):**
Phases 0–2 are DONE. All findings were re-verified against a live
build; where reality disagreed with a finding, the finding below is
annotated rather than silently rewritten. Every roadmap claim was also
fact-checked against Aug-2026 sources; no claim was refuted (nuances
annotated inline). Phases 3–5 remain gated on Phase 1 data.

## Why now

100+ weekly active users, mobile-heavy, concentrated in Asia with a
large Philippines share. That audience is predominantly Android, often
on metered prepaid data and intermittent connectivity. Offline is worth
more to them than it was to the desktop audience this feature was
originally scoped for.

## Findings that shape the plan

1. **The six generated sets are probably not cached today.** The offline
   manifest is built from the quiz route's `entryJSFiles`. The per-set
   generator chunks are behind a client-side `next/dynamic` map
   (`components/quiz/generated/index.tsx`) — which is exactly what keeps
   them out of that list. Measured: all six missing.

   | set | chunk | size |
   |---|---|---|
   | setA | `0lvracbvk04l8.js` | 31.5 KB |
   | setC | `1pxrq3zsc3gge.js` | 14.2 KB |
   | setJ | `3uljsfexhw1qt.js` | 22.5 KB |
   | setL | `0rdbvx1sz3ryk.js` | 21.4 KB |
   | setN | `24vlv5nfe4hvr.js` | 20.9 KB |
   | setR | `0-w99a3rdgbb7.js` | 28.1 KB |

   The bundle contract is not at fault and must not be relaxed to fix
   this — the split is what keeps the quiz route small. The manifest
   generator has to learn about it instead.

   **Verified and WIDENED (2026-08-15):** confirmed with a stopped
   server and a cold profile — generated sets 503 at Start Quiz. But
   the miss was bigger than this table: **KaTeX (256 KB) and two more
   quiz-shell chunks** are also lazy-loaded at Start and were also
   missing, so formula rendering broke for *every* set offline, Set Q
   included. Two testing traps made this look healthier than it was:
   Next's link prefetch warms the HTTP disk cache with exactly the
   missing chunks (so warm-profile tests pass by luck), and DevTools
   offline emulation does not apply to service-worker fetches (so
   emulated-offline tests pass even on cold profiles). Real-offline
   methodology is now codified in `docs/release-checks.md`.

2. **`sw.js` never writes to the cache at runtime.** Only the
   install-time `addAll`. So anything absent from the manifest is
   available offline by luck of the HTTP disk cache, or not at all.

3. **RSC navigations miss the cache — REVISED (2026-08-15): this is
   fine and must stay.** Verified offline with a real router click:
   the RSC fetch fails, Next falls back to an MPA hard navigation, and
   the SW's navigate branch serves the cached page. Client-side nav
   works offline end to end. The originally proposed `ignoreSearch`
   fix would have been actively harmful — serving full HTML to a fetch
   expecting a flight payload. Phase 2.2 became "verify + document,
   change nothing."

4. **Total offline payload is ~2 MB** (revised 2026-08-15 from
   1.35 MB: the complete set adds KaTeX + its woff2 fonts + two shell
   chunks; woff/ttf fallbacks are excluded as dead bytes). Still small
   enough that per-quiz storage management is UI for a problem that
   does not exist. This remains the main argument for shipping a
   status badge rather than a toggle.

5. **`navigator.storage.persist()` is never called.** Caches are
   evictable everywhere, and on iOS Safari (non-installed) they are
   subject to WebKit's 7-day cap.

6. **iOS home-screen apps use a separate storage container.** Downloads
   and localStorage do not carry over from Safari. A fresh install is a
   cold start with no migration path.

7. **posthog-js does not buffer events offline.**
   [posthog-js#1583](https://github.com/PostHog/posthog-js/issues/1583)
   is open and unplanned. Offline sessions cannot be measured directly;
   they must be summarised locally and reported on reconnect.

8. **Feature flags fail offline.** `/flags` is a POST, so a service
   worker cannot cache it, and bootstrapping conflicts with flag
   persistence
   ([posthog-js#1868](https://github.com/PostHog/posthog-js/issues/1868)).
   Never gate offline behaviour behind a PostHog flag.

9. **`$exception` has not fired in 30 days.** Error tracking is
   effectively off, and service-worker failures on real phones are
   exactly the class of bug that is otherwise invisible.

10. **`public/manifest.json` locks `orientation: portrait`** and sets
    `start_url: "/"`. Both only bite once installed.
    *(Orientation lock removed 2026-08-15; `start_url: "/"` kept
    deliberately — changing it complicates attribution for no
    measured benefit yet.)*

11. **NEW (2026-08-15): deploys never refreshed the offline cache.**
    `sw.js`'s bytes are identical across builds, and browsers only
    re-run the install step when the SW script changes — so no deploy
    ever re-cached anything for an existing user. The offline copy
    was frozen at whatever build first installed the SW (self-
    consistent, but permanently stale, and the Phase 2 fixes would
    never have reached returning users). Fixed by registering
    `/sw.js?v=<cacheName>`: the script URL is part of the
    registration identity, so a new build forces a fresh
    install/activate cycle and the activate handler prunes the old
    cache.

12. **Fact-check nuances (Aug 2026, all claims otherwise confirmed):**
    the backdate timestamp is a capture *option*
    (`capture(name, props, { timestamp })`), not a property;
    exception capture is `capture_exceptions: true` at init, and
    PostHog error tracking has a free 100k/mo tier (not add-on
    gated); `beforeinstallprompt` was never deprecated and remains
    Chromium-only; and **iOS 26 (Sept 2025) opens any
    added-to-Home-Screen site as a web app by default**, which
    materially lowers the friction Phase 4's install nudge assumed —
    the nudge's copy can now be "Add to Home Screen" with no caveats
    about bookmark-vs-app behaviour.

## Ordering principle

Instrumentation ships before anything it needs to evaluate, because the
data has a two-week lead time and the code takes an hour. Correctness
fixes ship next, because they are bugs regardless of what the data says.
Everything after that is gated on a hypothesis.

---

## Phase 0 — Verify the diagnosis

Blocks everything. Finding 1 is inference from a manifest diff, not an
observation.

| # | Task | Effort |
|---|---|---|
| 0.1 | `pnpm build && pnpm start`, DevTools offline, cold cache, load one quiz from each of sets A/C/J/L/N/R + Q | 1/10 |
| 0.2 | Repeat via in-app client-side navigation to confirm the `?_rsc=` miss | 1/10 |
| 0.3 | Repeat on a real Android Chrome and a real iOS Safari | 2/10 |

The dev server unregisters the service worker
(`components/providers/service-worker.tsx`), so none of this can be
tested against `logicola-dev`.

**H0 — generated sets fail offline on a cold cache.**
*Test:* clear site data, load `/` online, go offline, hard-load
`/syllogistic/translations/basic/quiz`.
*Confirms if:* the page shells but the quiz never renders, or falls
through to `/offline`.
*Falsifier:* it works — the chunk arrived some other way, the chunk
analysis is wrong, and Phase 2.1 changes shape.

---

## Phase 1 — Instrumentation

No dependencies. Ship first. All of it lives in `lib/analytics.ts`
(~50 lines today). Event properties stay snake_case.

| # | Task | Effort |
|---|---|---|
| 1.1 | Super properties via `posthog.register()`: `display_mode`, `sw_controlled`; async follow-up register for `offline_ready`, `storage_persisted` | 1/10 |
| 1.2 | Offline tally in localStorage → one backdated `offline_session_summary` on next online load | 2/10 |
| 1.3 | `beforeinstallprompt` → `pwa_install_available`; `appinstalled` → `pwa_installed` (Android only; iOS emits nothing) | 1/10 |
| 1.4 | Enable `$exception` capture | 1/10 |
| 1.5 | Let it run ~2 weeks for a baseline | — |

Use an explicit `timestamp` on the summary event so offline activity
lands on the day it happened rather than the day it was reported.
`$geoip_country_name` and `$device_type` are already on every event — no
new instrumentation needed for the audience cut.

**Known measurement trap:** on iOS, the installed app has a separate
storage container and therefore a fresh `distinct_id`. The same person
becomes two users. Read iOS installs as *share of sessions in standalone
mode*, never as a conversion rate.

**H1 — a meaningful share of mobile users install to the home screen.**
*Metric:* % of sessions with `display_mode: standalone`, split by OS.
*Threshold:* >5% means install is a real behaviour worth designing for;
<1% means Phase 4 is speculative.

**H2 — most returning users have a usable offline copy.**
*Metric:* % of sessions with `offline_ready: true`.
*Threshold:* if this is already >80%, the caching layer is healthier
than Finding 1 suggests and Phase 2.1 is lower priority. If it is low,
that is the strongest signal in the whole plan.

**H3 — people actually use the app offline.**
*Metric:* weekly sessions producing an `offline_session_summary`, as a
share of all sessions.
*Threshold:* <2% kills Phase 5 outright and probably Phase 3 too. >10%
makes offline a headline feature rather than a nicety.

**H4 — iOS Safari users lose their cache to the 7-day cap.**
*Metric:* returning iOS sessions where `storage_persisted: false` and
`offline_ready` has flipped `true → false`, versus the Android rate.
*Threshold:* if the iOS rate materially exceeds Android's, Phase 4 is
justified; if not, drop the install nudge entirely.

---

## Phase 2 — Correctness

These are bugs. Ship them whatever the data says. Depends on Phase 0
only for confirmation of 2.1.

| # | Task | Effort |
|---|---|---|
| 2.1 | Include per-set generator chunks in the offline manifest | 4/10 |
| 2.2 | Fix the RSC navigation miss (`ignoreSearch`, or precache the RSC payloads explicitly) | 2/10 |
| 2.3 | Call `navigator.storage.persist()` on registration | 1/10 |
| 2.4 | Update `docs/offline-support.md` so its claim is true | 1/10 |
| 2.5 | Add an offline smoke test to `docs/release-checks.md` so this cannot silently regress | 1/10 |
| 2.6 | Drop `orientation: portrait` from `public/manifest.json`; reconsider `start_url` | 1/10 |

**2.1 has two routes — decide before starting:**

- *Build-time.* Teach `scripts/generate-offline-manifest.mjs` to resolve
  the dynamic-import chunk graph and emit `{ quizPath: [urls] }`.
  Sturdier, survives without a browser, and is the prerequisite for
  Phase 5. Cost: that work Turbopack's chunk output, which is
  the single biggest unknown in this plan.
- *Runtime.* `import()` the set from a client module and capture what
  the browser fetched via `performance.getEntriesByType('resource')`.
  Cheap, no build archaeology, but fragile and can only cache a set the
  user has already opened.

Recommendation: build-time, because a manifest that only covers
already-visited sets does not fix the bug for a first-time offline user
— which is the whole failure mode.

**H5 — fixing the manifest raises offline readiness.**
*Metric:* `offline_ready` share before vs after the 2.1 deploy.
*Test:* only possible because Phase 1 shipped first. Expect a step
change within a week as clients pick up the new SW.
*Falsifier:* no movement — the caching was already working through some
path the manifest diff does not capture, and Finding 1 needs a rethink.
*Note (2026-08-15):* `offline_ready` is defined as "this build's
cache exists" (`caches.has(cacheName)`), so every deploy briefly dips
the metric until clients re-install — read trends across deploys, not
day-to-day. Because Phases 1 and 2 ship together, there is no true
"before" baseline for H5; the step change to watch is Finding 11's
instead (first deploy after this one is the first ever to refresh
existing users' caches).

---

## Phase 3 — Offline status badge

Depends on Phase 2 (do not advertise offline until it works) and reads
Phase 1's H3 to decide whether it is worth the surface area.

| # | Task | Effort |
|---|---|---|
| 3.1 | Lab prototype in `docs/` for sign-off, per project convention | 2/10 |
| 3.2 | Durability-aware copy driven by `navigator.storage.persisted()`, not by display-mode | 2/10 |
| 3.3 | Implement below the Start Quiz button in `components/quiz/startScreen.tsx` | 2/10 |
| 3.4 | Accessibility pass — status text in a live region, contrast across every set surface | 2/10 |

Not a `role="switch"`. It is a status line with, at most, a remove
affordance. The interesting design question for the lab is what the
control says in the **stale-after-deploy** state, which is the state
users will actually hit most often.

**H6 — telling people the app works offline changes behaviour.**
*Metric:* `offline_session_summary` rate and 7-day return rate, before
vs after.
*Threshold:* if offline usage does not move at all, offline is a
reliability property rather than a feature, and it should stop consuming
roadmap.

---

## Phase 4 — iOS install nudge

**Gated on H4.** Build only if iOS eviction is measurably real.

| # | Task | Effort |
|---|---|---|
| 4.1 | Contextual copy tied to durability, not a generic install banner | 2/10 |
| 4.2 | Handle the fresh-container cold start — silent re-download on first standalone launch | 2/10 |

The nudge that works is the honest one: "may be cleared after a week of
not opening LogiCola — add to Home Screen to keep it." A generic install
banner is not this.

Because the installed container starts empty, the post-install
experience must re-download without asking. At 1.35 MB that is
acceptable; do not show a progress UI for it.

---

## Phase 5 — Per-quiz download and delete

**Gated on H3 and on evidence that anyone wants control.** Finding 4
argues this is probably never justified. Documented so the decision is
deliberate rather than forgotten.

| # | Task | Effort |
|---|---|---|
| 5.1 | Per-quiz cache buckets keyed by set and build id | 3/10 |
| 5.2 | Store *intent* in localStorage, derive *state* from `caches.has()`; reconcile on SW activate | 4/10 |
| 5.3 | Download/remove UI with progress and failure states | 3/10 |
| 5.4 | Quota display via `navigator.storage.estimate()` | 1/10 |

The enabling mechanic: the Cache API is origin-scoped, not
worker-scoped. The page can open and fill a cache itself, and
`caches.match()` with no cache name already searches every bucket — so
the existing fetch handler serves page-written caches for free, with no
`postMessage` protocol.

The hard part is not the UI. It is that every deploy changes the build
id and every chunk hash, so all downloads go stale at once and the
`activate` handler currently deletes any cache it does not recognise.
Storing intent separately from state is what makes that survivable.

**H7 — users want per-quiz control rather than all-or-nothing.**
*Metric:* if 5.x ever ships behind a staged rollout, the share of users
who remove any individual quiz.
*Threshold:* below ~5%, revert to automatic caching of everything and
delete the feature.

---

## The cut line

If Phase 1 shows H3 below 2%, stop after Phase 2. The offline story
becomes: it works, it is never mentioned, and it costs nothing to
maintain. That is a perfectly good outcome and the most likely one.

## Explicitly out of scope

- Relaxing the bundle contract to simplify the manifest. The 204 KB
  regression is not worth trading for a simpler build script.
- Gating offline behaviour on installed-PWA detection. `display-mode`
  is a display signal, not an install signal, and it would deny offline
  to the Android majority for no durability gain.
- Gating any of this behind a PostHog feature flag (Finding 8).
