# LogiCola stats — working document

Status: **first snapshot, 2026-08-18.** Numbers below are pulled from
PostHog (project "LogiCola 3", id 20336, EU cloud) and are only as
current as that date. Every figure here is reproducible — the queries
are in the last section, so this document can be refreshed rather than
re-derived.

## Read this before quoting any number

Three things distort a naive read of this project's data. All three
bit during the first pull.

**1. A quarter of all traffic is mine.** Over the last 180 days the
`events` table holds 10,569 pageviews, but only **7,930 are on
`logicola.org`**. The rest is `localhost:3000` / `localhost:3100`
(1,999 pageviews) and Vercel preview deploys (~610 across a dozen
hostnames). Every table below is filtered to
`properties.$host = 'logicola.org'`. Any query that omits that filter
overstates traffic by ~25% and book clicks by ~15%.

**2. Instrumentation landed in stages, so months are not comparable.**
Event first-seen dates:

| Event                         | First seen | Note                                         |
| ----------------------------- | ---------- | -------------------------------------------- |
| `quiz_started`                | 2026-02-19 | full history                                 |
| `quiz_completed`              | 2026-02-19 | semantics appear to have changed — see below |
| `quiz_retried`                | 2026-07-13 |                                              |
| `book_cta_clicked`            | 2026-07-13 |                                              |
| `question_answered`           | 2026-07-26 |                                              |
| `landing_drill_click`         | 2026-08-17 | landing page shipped this day                |
| `landing_resume_click`        | 2026-08-17 |                                              |
| `newsletter_subscribe_failed` | 2026-08-17 |                                              |

A month-over-month rise in any of these before its first-seen date is
an artefact of the event not existing, not of user behaviour.

**3. `quiz_completed` has a discontinuity in August.** Completions run
57–284/month from February to July against 1,400–6,600 starts, then
jump to **1,191 completions in August against 1,280 starts** — from
roughly 5–10% of starts to ~93%. A 10× shift in a ratio, in the month
the scored run became the default, is a definition change rather than
a behaviour change. **Unverified.** Until someone traces what
`quiz_completed` fires on before and after, do not read the February–
July and August completion figures as the same metric, and do not put
them on one chart.

## Traffic and engagement (production only)

| Month             | Visitors | Pageviews | Quizzes started | Quizzes completed | Book clicks |
| ----------------- | -------- | --------- | --------------- | ----------------- | ----------- |
| 2026-02           | 152      | 261       | 1,415           | 57                | —           |
| 2026-03           | 546      | 1,129     | 6,594           | 284               | —           |
| 2026-04           | 338      | 577       | 2,934           | 126               | —           |
| 2026-05           | 326      | 561       | 2,830           | 121               | —           |
| 2026-06           | 342      | 566       | 2,749           | 98                | —           |
| 2026-07           | 437      | 1,548     | 1,749           | 175               | 20          |
| 2026-08 (to 18th) | 324      | 3,288     | 1,280           | 1,191             | 11          |

Visitors sit in a **320–550/month band with no trend** across six
months. March is the outlier on both visitors and starts and is worth
explaining before it gets treated as a baseline.

Pageviews per visitor, by contrast, moved sharply: ~1.7 through June,
3.5 in July, **10.1 in August**. That is the month the landing page
shipped (2026-08-17) and drills moved onto the front page — but it
predates that by weeks, so most of it is something else. Also
unexplained.

`question_answered` has run 21,422 events since 2026-07-26 — by far
the highest-volume event, and the one most likely to be useful for
real learning-outcome analysis (which sets are hard, where people
stall). Nothing is currently built on it.

## The book funnel

`book_cta_clicked` fires on the "Get the Book" link in the footer,
which points at the publisher's page for Gensler's _Introduction to
Logic_, 3rd ed. Since it began firing on 2026-07-13, on production
only:

- **31 clicks** from **24 distinct people**
- against **706 visitors** in that window
- = **3.4% of visitors click through to the publisher**

That is a genuinely healthy rate for a footer link, and it is the
single most interesting number in this document.

As of 2026-08-18 the link carries UTM parameters
(`utm_source=logicola.org&utm_medium=referral&utm_campaign=get-the-book&utm_content=footer_resources`)
so Routledge can attribute the referral in their own analytics. The
bare URL, without campaign parameters, is what goes to PostHog as
`link_url`, so existing saved insights keep matching.

### What that is worth as affiliate revenue — the arithmetic

Run at 2026-08-18 to answer "should I join the Routledge affiliate
programme." Recorded so the answer can be re-checked as traffic grows
rather than re-litigated.

| Input                           | Value                    | Confidence                         |
| ------------------------------- | ------------------------ | ---------------------------------- |
| Book list price (Routledge.com) | $74.99                   | high                               |
| Affiliate commission            | ~10% of sale → ~$7/copy  | medium — varies 6–20% by network   |
| Current click volume            | 15–20/month (production) | high                               |
| Click → purchase conversion     | 1–3%                     | **low — assumption, not measured** |

Giving **~$1–4/month, or roughly $15–50/year**. The generous case
(5% conversion, no discounting) reaches ~$120/year.

The conversion assumption is the weak link and it is pessimistic for
a specific reason: Routledge.com at $74.99 is the *most expensive*
place to buy this book — campus and used sellers list it around
$44–55 — and the audience is undergraduates, the most price-sensitive
book buyers there are. We cannot measure past the click, so this
stays an assumption unless a network's dashboard ever confirms it.

Two conclusions, both dated 2026-08-18:

- **Not worth joining for the money.** Affiliate networks hold
  earnings until a minimum payout (commonly ~$50–100); at this
  volume a year might not clear it. Reaching $1,000/year needs ~130
  sales ≈ 6,500 clicks/year ≈ **25× current volume**. That is a
  traffic problem, not an affiliate problem.
- **The referral itself is the asset.** ~250 qualified textbook
  buyers/year sent to the publisher for free, by the maintained
  companion software to their own textbook, is the opening of a
  partnership conversation with Taylor & Francis. The UTM tagging
  now running is what makes that conversation evidence-based. Revisit
  once there is a term's worth of data.

## Known gaps

- **The newsletter funnel cannot be measured.**
  `newsletter_subscribe_failed` exists (3 events, all 2026-08-17);
  there is no corresponding success event. Failures are visible,
  subscriptions are not. This is the most cheaply-fixed gap here.
- **`quiz_completed` semantics are unresolved** (see above). Until
  traced, the completion rate is not a usable metric.
- **No source/referrer breakdown yet.** Whether the 320–550 monthly
  visitors are course-assigned, search, or the old harrycola.com
  links is unknown, and it changes what growth work is worth doing.
- **Nothing is built on `question_answered`** despite it being the
  richest dataset in the project.
- **Test-account filtering is done by hostname here, not by
  PostHog's own internal-user filter.** The `query-*` tools apply the
  project filter automatically; raw SQL does not. If the project's
  filter is ever configured properly, prefer it over the `$host`
  predicate.

## Regenerating this document

All figures come from `execute-sql` against the `events` table. Note
that HogQL requires a `timestamp` bound on every query.

Monthly traffic and engagement, production only:

```sql
SELECT
    toStartOfMonth(timestamp) AS month,
    uniqIf(person_id, event = '$pageview') AS visitors,
    countIf(event = '$pageview') AS pageviews,
    countIf(event = 'quiz_started') AS quizzes_started,
    countIf(event = 'quiz_completed') AS quizzes_completed,
    countIf(event = 'book_cta_clicked') AS book_clicks
FROM events
WHERE timestamp >= now() - INTERVAL 180 DAY
  AND properties.$host = 'logicola.org'
GROUP BY month
ORDER BY month
```

Book click-through rate since the event began firing:

```sql
SELECT
    countIf(event = 'book_cta_clicked') AS book_clicks,
    uniqIf(person_id, event = 'book_cta_clicked') AS book_clickers,
    uniqIf(person_id, event = '$pageview') AS visitors,
    round(100.0 * uniqIf(person_id, event = 'book_cta_clicked')
        / uniqIf(person_id, event = '$pageview'), 2) AS pct_clicking
FROM events
WHERE timestamp >= toDate('2026-07-01')
  AND properties.$host = 'logicola.org'
  AND event IN ('book_cta_clicked', '$pageview')
```

Instrumentation timeline — run this first after any release, to catch
new events before comparing months:

```sql
SELECT
    event,
    toDate(min(timestamp)) AS first_seen,
    toDate(max(timestamp)) AS last_seen,
    count() AS total
FROM events
WHERE timestamp >= now() - INTERVAL 180 DAY
  AND event NOT LIKE '$%'
GROUP BY event
ORDER BY first_seen
```

Hostname split — run this to confirm the production filter is still
catching all the noise:

```sql
SELECT properties.$host AS host, count() AS pageviews, uniq(person_id) AS visitors
FROM events
WHERE timestamp >= now() - INTERVAL 180 DAY
  AND event = '$pageview'
GROUP BY host
ORDER BY pageviews DESC
LIMIT 20
```
