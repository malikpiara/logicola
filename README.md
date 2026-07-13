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

## Verification

Run the core verification checks:

```bash
pnpm build
pnpm test
```

The production build also regenerates the offline cache manifest used by the service worker.

## Offline Support

Logicola supports offline access for published quizzes after the app has been installed or loaded while online.

Technical details and maintenance notes are documented in
[docs/offline-support.md](docs/offline-support.md).

## Project Notes

- Quiz route publishing is tracked in `content/quiz-catalog.json`.
- The offline service worker is intentionally scoped to published quizzes and the app shell they need.
- For maintenance and release verification, see
  [docs/release-checks.md](docs/release-checks.md).

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to load Roboto Flex.
