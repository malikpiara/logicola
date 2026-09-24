![Logicola Mascot](public/mascot.png)

LogiCola 3 is an instructional program that goes with Gensler's Introduction to Logic (Routledge Press). Since Harry Gensler, the original creator has passed away, I decided to create a new version to preserve an important learning resource and honour his legacy.

Logicola is a web-based remake of the original Logicola software, designed to help students learn logic more easily across modern devices while preserving the spirit of the original program.

The live project is available at [logicola.org](https://logicola.org).

## About

This project focuses on making logic instruction more accessible to students,teachers, and universities by combining:

- Interactive quizzes.
- Installable web app support for offline quiz use.

Logicola is still growing. The current codebase reflects both ongoing content development and the practical goal of keeping the platform widely accessible on the web.

## Getting Started

Install dependencies with pnpm:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the app by modifying files in `app/`, `components/`, and
`content/`.

Copy `.env.example` to `.env.local` for analytics and the newsletter. Both are
optional: without them the site runs, it just doesn't report or subscribe.

## Verification

Run the core verification checks:

```bash
pnpm build
pnpm test
```

`pnpm build` produces a static export in `out/` and writes the offline cache
manifest used by the service worker into it. To run that build the way
production serves it (on the Cloudflare Workers runtime, with the site's
redirects, headers and 404 page), use:

```bash
pnpm start
```

The newsletter endpoint only exists in that mode: under `pnpm dev` the signup
form shows its error state.

## Deployment

logicola.org is a static export served by
[Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/).
Pushes to `main` deploy through Workers Builds; other branches get a preview
URL. The only server code is `worker/index.ts`, which handles newsletter
signups. The site moved from Vercel on 2026-09-24.

How deploys work, the rules a static export imposes, configuration, rollback,
and retiring the old Vercel project are in
[docs/deployment.md](docs/deployment.md).

## Offline Support

Logicola supports offline access for published quizzes after the app has been installed or loaded while online.

Technical details and maintenance notes are documented in
[docs/offline-support.md](docs/offline-support.md).

## Project Notes

- Quiz route publishing is tracked in `content/quiz-catalog.json`.
- The offline service worker is intentionally scoped to published quizzes and the app shell they need.
- For maintenance and release verification, see
  [docs/release-checks.md](docs/release-checks.md).
- For deploys, configuration and rollback, see
  [docs/deployment.md](docs/deployment.md).

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to load Roboto Flex.

## License

LogiCola 3 is free and open source software under the
[GNU Affero General Public License v3.0 or later](LICENSE) (changed
from MIT on 2026-08-24 — see [NOTICE](NOTICE) for the history and the
preserved MIT attribution).

Use it, study it, share it, fork it. The one obligation that matters:
if you run a **modified** version as a network service, AGPL section 13
requires you to offer your users its complete source. Someone can
charge for a fork — but they cannot keep it closed, which is the point.

Versions published while the project was MIT-licensed remain MIT for
those versions. Rights in the Gensler drill material are separate from
the software licence.
