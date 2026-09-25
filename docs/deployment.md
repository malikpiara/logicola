# Deployment — Cloudflare Workers

Since 2026-09-24, logicola.org is a **Next static export served by
Cloudflare Workers**. Every page, chunk, image and feed is a file in
`out/`, served as Workers static assets. The only code that runs per
request is `worker/index.ts`, and only for `/api/*` (the newsletter).

This is the runbook: how a deploy is shaped, the rules the static
export imposes, and how to ship, configure, verify and roll back. The
move itself is PR #176; Vercel was retired the same day.

## Why it moved

In September 2026 the Vercel Hobby plan went over three limits over its
30-day window. ISR Writes were at 449K of 200K, Edge Requests at 1M of
1M, and Fast Origin Transfer at 10.13 GB of 10 GB (ISR Reads were at
699K of 1M). On Hobby, going over means a possible pause rather than a
bill. Logs pointed at two causes, both in LogiCola:

- **The blog link cards never prerendered.** `opengraph-image.tsx` used
  `generateImageMetadata`, and Next's wrapper replaces the file's
  `generateStaticParams`. So every card rendered on demand, and every
  expiry was an ISR write of about 55 KB (7 write units).
- **The offline precache.** Each new visitor's service worker fetches
  the whole manifest, about 115 URLs, and on Vercel every one of those
  was a metered edge request. The quiz pages among them were ISR reads.

Every page was already prerendered, so a static host could serve the
same site. On Cloudflare, static asset requests are free and unmetered.

## Shape of a request

```
browser ──▶ Cloudflare (zone logicola.org, account "Malik")
             │
             ├─ www.logicola.org/*  ── zone Redirect Rule (301, keeps path + query) ──▶ logicola.org
             │
             └─ logicola.org/*      ── Worker route ──▶ Worker "logicola"
                                         ├─ matches a file in out/  → static asset (the Worker never runs; free)
                                         ├─ /api/*                  → worker/index.ts → Loops (newsletter)
                                         └─ anything else           → out/404.html, status 404
```

- `logicola.org`'s DNS record is an originless placeholder,
  `A 192.0.2.0` (proxied). A route only runs for a hostname that has a
  proxied record, so the record has to exist, but requests never reach
  its address. **Don't delete it.** `www`'s record is there for the same
  reason: the Redirect Rule needs something proxied to act on.
- Mail on logicola.org is Cloudflare Email Routing (the MX records).
  The move didn't touch it.

## The static-export rules

Read these before adding anything that runs on a server. Most of them
fail `next build` loudly; rule 7 fails quietly.

1. **Nothing renders per request.** No API routes, POST handlers,
   Server Actions, middleware/proxy, `cookies()` / `headers()` / server
   `searchParams`, ISR (`revalidate`), or draft mode. `next build`
   rejects most of these with "cannot be used with output: export".
2. **Route handlers are static, metadata routes included.** `robots`,
   `sitemap`, the feeds and `footer-band.svg` all export
   `dynamic = 'force-static'`. Dynamic segments need
   `generateStaticParams` (and `dynamicParams = false`).
3. **Server code goes in `worker/index.ts`**, with tests in
   `worker/index.test.ts`. It runs only for `/api/*` (`run_worker_first`
   in `wrangler.jsonc`). Keep status codes meaningful: the newsletter
   form reads `response.ok` and reports `status_code` to PostHog.
4. **Never use `generateImageMetadata`.** Next's wrapper drops the
   file's `generateStaticParams`, so the image never prerenders. Under
   the export that is a build error; on Vercel it failed quietly, as an
   ISR write per request, which is why it matters if the export is ever
   turned off. The link cards are
   `app/(marketing)/blog/[slug]/card.png/route.tsx`, and their
   `og:image` with its alt text is set in the post page's
   `generateMetadata`.
5. **There is no image optimizer** (`images.unoptimized: true`).
   `next/image` still gives width/height and lazy loading, but the file
   ships as committed, so size and compress images before adding them.
6. **Redirects go in `public/_redirects`, headers in `public/_headers`.**
   Workers reads both and never serves them as files. Neither applies
   to responses the Worker generates, so set `/api/*` headers in the
   Worker's code.
7. **Anything generated after `next build` writes into `out/`**
   (fails quietly). The export copies `public/` into `out/` before
   `postbuild` runs, so a file written to `public/` at that point misses
   the deploy. The offline manifest is written to
   `out/offline-manifest.json` for this reason.

## Files that make up the deploy

| File                                    | Role                                                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `next.config.mjs`                       | `output: 'export'`, `images.unoptimized`                                                                            |
| `wrangler.jsonc`                        | The Worker: assets from `out/`, 404 page, trailing-slash handling, `/api/*` to the Worker, the route, observability |
| `worker/index.ts`                       | `/api/newsletter` (Loops); other `/api/*` paths get the 404 page                                                    |
| `public/_redirects`                     | The moved Set R post; old link-card URLs → `card.png`                                                               |
| `public/_headers`                       | Year-long cache on `/_next/static/*`, RSS content types, `noindex` on `*.workers.dev`                               |
| `scripts/generate-offline-manifest.mjs` | Postbuild: writes `out/offline-manifest.json`                                                                       |

## Deploying

### Workers Builds (the normal path)

Pushing to `main` builds and deploys. Other branches get a preview URL
on `*.upfra-me.workers.dev`, which `_headers` marks `noindex`. Settings
live at Workers & Pages → **logicola** → Settings → Build:

| Setting                          | Value                                                                     |
| -------------------------------- | ------------------------------------------------------------------------- |
| Repository / production branch   | `malikpiara/logicola` / `main`                                            |
| Build command                    | `pnpm build`                                                              |
| Deploy command                   | `npx wrangler deploy` (default)                                           |
| Preview command (other branches) | `npx wrangler preview` (default, open beta), which produces a preview URL |
| Build variables                  | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`                     |
| Node                             | The build image's default (24.x, as on Vercel). CI runs 22.               |
| Wrangler                         | The version in `package.json`; Workers Builds uses the project's own.     |

### Manual

```bash
pnpm build && pnpm cf:deploy
```

This builds with `.env.local`'s `NEXT_PUBLIC_*` values and deploys from
your machine (wrangler is logged in to the "Malik" account).

## Configuration and secrets

| Variable                   | Where it lives                                               | Read by                               | Notes                                                                           |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_POSTHOG_KEY`  | Workers Builds build variable; `.env.local` locally          | `next build` (inlined into client JS) | Public by design, but kept out of git so forks don't report into this project.  |
| `NEXT_PUBLIC_POSTHOG_HOST` | Same                                                         | Same                                  |                                                                                 |
| `LOOPS_API_KEY`            | Worker secret: `pnpm exec wrangler secret put LOOPS_API_KEY` | `worker/index.ts`                     | Without it the endpoint answers 503.                                            |
| `LOOPS_MAILING_LIST_ID`    | Worker secret, optional                                      | `worker/index.ts`                     | Not set as of 2026-09-24, so signups become subscribed contacts without a list. |

Secrets survive deploys. `wrangler secret list` shows names, never
values. Previews inherit nothing from production (no route, no secrets;
they keep their own, `wrangler preview secret`), so a preview's newsletter
answers 503, which keeps branch testing from subscribing anyone. The
empty `previews` block in `wrangler.jsonc` is required: without it
`wrangler preview` refuses to run, which is how the first branch build
failed.

### Local development

- `pnpm dev` (`next dev`) has **no `/api/newsletter`**, because the
  endpoint lives in the Worker. The newsletter form shows its error
  state there, and that's expected.
- `pnpm start` runs `wrangler dev` on port 3000 after `pnpm build`. It
  serves `out/` plus the Worker with production's routing (`_headers`,
  `_redirects`, the 404 page). **It loads `.env.local`**, because
  wrangler reads `.env*` files when there's no `.dev.vars`. So
  `LOOPS_API_KEY` is the real key, and a signup there subscribes for
  real. To keep local signups off Loops, create a `.dev.vars`
  (gitignored) without `LOOPS_API_KEY`. Its presence stops wrangler
  reading `.env*` files, and the endpoint answers 503.

## Verify a deploy

```bash
curl -sI https://logicola.org/ | grep -iE "^(HTTP|cache-control)"
```

Expect a 200. Right after a route change, give it up to a minute to
propagate across Cloudflare before worrying. What each path should do:

| Request                                         | Expected                                      |
| ----------------------------------------------- | --------------------------------------------- |
| `/`, a quiz, a blog post                        | 200 `text/html`, `max-age=0, must-revalidate` |
| `/blog/`                                        | 307 → `/blog`                                 |
| `/blog/set-r-informal-fallacies`                | 308 → `/blog/informal-fallacies`              |
| `/blog/<slug>/opengraph-image-yqks0s/card`      | 308 → `/blog/<slug>/card.png`                 |
| `/_next/static/…`                               | `max-age=31536000, immutable`                 |
| `/blog/feed.xml`, `/release-notes/feed.xml`     | `application/rss+xml`                         |
| an unknown path                                 | 404 with the export's 404 page                |
| `GET /api/newsletter` / `POST` with a bad email | 405 / 400 JSON                                |
| `www.logicola.org/<path>?<query>`               | 301 → `logicola.org/<path>?<query>`           |

Then run the offline check in `docs/release-checks.md`. Failed
newsletter signups show up in **Workers Logs** (logicola → Observability)
as `newsletter subscribe failed:`.

## Rollback

- **A bad build.** Roll the Worker back to its previous version, either
  in the dashboard (logicola → Deployments) or with
  `pnpm exec wrangler rollback`. Only the code and assets change; the
  route stays.
- **There is no second host.** Vercel was retired on 2026-09-24, so a
  Cloudflare outage takes the site down with it. In an emergency, `out/`
  is plain files that any static host can serve; only `/api/newsletter`
  would need an equivalent. Point the zone's `logicola.org` record at
  that host and delete the `logicola.org/*` route.

## Vercel (retired 2026-09-24)

Vercel ran LogiCola until 2026-09-24 and was retired the same day, once
Cloudflare was serving:

- The cutover used a Worker **route** in front of Vercel's DNS records,
  so deleting the route was an instant way back while that mattered.
- To retire Vercel, the `logicola.org` record was repointed in place to
  the placeholder `192.0.2.0`, keeping the route, and `www`'s record was
  repointed away from Vercel too. A custom domain was tried first and
  refused: Cloudflare won't attach one while the hostname has a record
  it doesn't manage (code 100117). Deleting the record first would work,
  but it opens a gap that resolvers can cache as "no address" for up to
  ~30 minutes.
- `beta.logicola.org`, an old branch domain that only returned Vercel's
  404, went with the Vercel project, and so did `vercel.json`.

**If you want a custom domain later:** it's tidier (Cloudflare manages
the record and the certificate) but gains nothing functional. Do it at a
quiet hour: delete the `logicola.org` record, then straight away swap
the route in `wrangler.jsonc` for
`{ "pattern": "logicola.org", "custom_domain": true }` and deploy. Then
delete the leftover route in the dashboard, because wrangler never
deletes routes removed from its config.

## Costs and limits (Workers Paid)

The Cloudflare account is on **Workers Paid** ($5/month, shared by every
Worker in the account, Cherrydock included). As checked in Cloudflare's docs on
2026-09-24:

- **Static asset requests: free and unlimited** on every plan. That covers
  every page, chunk, image and the service worker's precache, which is almost
  all of LogiCola's traffic.
- **Worker requests: 10 million a month included**, then $0.30 per million.
  Only `/api/*` runs the Worker. On launch day that was 3 invocations, all
  newsletter checks.
- **CPU: 30 million CPU-ms a month included**, and up to 30 s per request by
  default. The newsletter handler mostly waits on Loops, and waiting isn't CPU
  time.
- **100,000 files per version** (the export is about 480) and 25 MiB per file.

So LogiCola adds nothing to the bill: static requests are free, and the
newsletter's Worker requests are a rounding error inside what's included.
(Corrected 2026-09-24: this section first described Workers Free, whose 100,000
requests a day and 10 ms CPU cap don't apply to this account.)

## Found during the move

- `generateImageMetadata` never prerenders (rule 4). Its wrapper's own
  `generateStaticParams` fills only the image id, never `slug`.
- `scripts/offlineManifest.test.ts` skips itself when there's no build.
  While it still pointed at `public/`, it skipped silently. It now reads
  `out/`, so run `pnpm build` before trusting a green `pnpm test` on
  manifest changes.
- A route (not a custom domain) needs a proxied DNS record for its
  hostname. Here that's the placeholder `A 192.0.2.0` record.
- Wrangler turns off the `workers.dev` URL and preview URLs once a
  route exists, unless `wrangler.jsonc` sets them. Both are set.
- Cloudflare won't attach a Workers custom domain to a hostname that
  has a DNS record it doesn't manage (code 100117), even though wrangler
  offers to override conflicts; the record has to be deleted first.
- Wrangler never deletes a route you remove from `wrangler.jsonc`. It
  warns and leaves it, so delete routes in the dashboard.
- `/blog/` redirects with a 307 on Workers (Vercel sent a 308). The
  difference doesn't matter.
- The `cloudflare-api` MCP (mcp.cloudflare.com) can't sign in from the
  Claude desktop app, because it rejects the app's `claude://` OAuth
  redirect. The builds, observability and bindings MCPs work.
