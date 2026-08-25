import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const scriptsDir = path.dirname(currentFile);
const projectRoot = path.resolve(scriptsDir, '..');

const BUILD_MANIFEST_PATH = path.join(
  projectRoot,
  '.next',
  'build-manifest.json'
);
const BUILD_ID_PATH = path.join(projectRoot, '.next', 'BUILD_ID');
const QUIZ_MANIFEST_PATH = path.join(
  projectRoot,
  '.next',
  'server',
  'app',
  '(quiz)',
  '[...slugs]',
  'page_client-reference-manifest.js'
);
const QUIZ_CATALOG_PATH = path.join(
  projectRoot,
  'content',
  'quiz-catalog.json'
);
const OUTPUT_PATH = path.join(projectRoot, 'public', 'offline-manifest.json');
const QUIZ_MANIFEST_KEY = '/(quiz)/[...slugs]/page';
const LOADABLE_MANIFEST_PATH = path.join(
  projectRoot,
  '.next',
  'server',
  'app',
  '(quiz)',
  '[...slugs]',
  'page',
  'react-loadable-manifest.json'
);
const SERVER_APP_DIR = path.join(projectRoot, '.next', 'server', 'app');

// Everything the installed shell can ask for while offline. The icon list
// tracks public/manifest.json plus the two channels that are NOT in it —
// the bare favicon and the apple-touch-icon — so adding an icon there means
// adding it here (Malik, 2026-08-23: the maskable pair and the iOS file
// shipped a build before this line caught up with them).
const STATIC_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon.svg',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-maskable.png',
  '/icon-512-maskable.png',
];

async function readJson(filePath) {
  const contents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(contents);
}

async function readRscManifest(filePath) {
  const source = await fs.readFile(filePath, 'utf8');
  const context = { globalThis: {} };

  vm.runInNewContext(source, context);

  return context.globalThis.__RSC_MANIFEST?.[QUIZ_MANIFEST_KEY];
}

function normalizeBuildAsset(filePath) {
  return filePath.startsWith('/_next/')
    ? filePath
    : `/_next/${filePath.replace(/^\/+/, '')}`;
}

function collectRouteAssets(rscManifest, entryKey) {
  const assets = new Set();

  const jsFiles = rscManifest?.entryJSFiles?.[entryKey] ?? [];
  const cssFiles = rscManifest?.entryCSSFiles?.[entryKey] ?? [];

  for (const assetPath of [...jsFiles, ...cssFiles.map(({ path }) => path)]) {
    assets.add(normalizeBuildAsset(assetPath));
  }

  return assets;
}

/**
 * Dynamic-import chunks for the quiz route (Malik, 2026-08-15).
 *
 * The per-set generator wrappers sit behind a client-side
 * `next/dynamic` map (the bundle contract), so their chunks never
 * appear in `entryJSFiles` — that's the same split that keeps them
 * out of the shared quiz chunk. Turbopack records them in the
 * page's react-loadable-manifest instead. Without these, every
 * generated set 503s at Start Quiz on a cold offline cache.
 */
async function collectDynamicChunks() {
  const manifest = await readJson(LOADABLE_MANIFEST_PATH);
  const assets = new Set();

  for (const entry of Object.values(manifest)) {
    for (const file of entry.files ?? []) {
      assets.add(normalizeBuildAsset(file));
    }
  }

  return assets;
}

/**
 * Per-route assets straight from the prerendered HTML. The SSG
 * output is ground truth for what a hard navigation loads: script
 * tags, stylesheet links, script preloads, and font preloads.
 *
 * Runs for EVERY route we cache, not just the quiz ones (Malik,
 * 2026-08-25). `/` and `/offline` were in STATIC_URLS from the
 * start but never had their HTML read — their assets only arrived
 * incidentally, via rootMainFiles and the closure.
 */
async function collectPrerenderedRouteAssets(routePath) {
  // App Router prerenders `/` to index.html; every other route
  // keeps its own path.
  const htmlName = routePath === '/' ? 'index' : routePath.slice(1);
  const htmlPath = path.join(SERVER_APP_DIR, `${htmlName}.html`);

  let html;
  try {
    html = await fs.readFile(htmlPath, 'utf8');
  } catch {
    // Route without prerendered HTML (should not happen for SSG
    // quiz routes) — the entry-file manifests still cover it.
    return new Set();
  }

  const assets = new Set();
  const attrPattern = /(?:src|href)="(\/_next\/static\/[^"]+)"/g;

  for (const match of html.matchAll(attrPattern)) {
    assets.add(match[1]);
  }

  return assets;
}

/**
 * Transitive closure over chunk-to-chunk references. Chunks load
 * each other (and lazy vendors like KaTeX — 256 KB, imported at
 * Start Quiz) via literal `static/chunks/<id>.js` strings in the
 * chunk body, which never surface in any manifest. Scan every
 * chunk we already ship, add what it references, repeat. Only
 * files that exist in `.next/static` are added, so minifier noise
 * can't invent URLs.
 */
async function expandChunkClosure(urls) {
  const closure = new Set(urls);
  const scanned = new Set();
  // woff2 only: every service-worker-capable browser speaks woff2,
  // so the woff/ttf fallbacks would be dead bytes on a metered
  // connection (Malik, 2026-08-15).
  const refPattern =
    /static\/(chunks|media)\/[a-zA-Z0-9_.-]+\.(js|css|woff2)/g;

  let frontier = [...closure];

  while (frontier.length > 0) {
    const next = [];

    for (const url of frontier) {
      if (!url.startsWith('/_next/static/') || scanned.has(url)) {
        continue;
      }
      if (!/\.(js|css)$/.test(url)) {
        continue;
      }
      scanned.add(url);

      const filePath = path.join(
        projectRoot,
        '.next',
        url.replace('/_next/', '')
      );

      let source;
      try {
        source = await fs.readFile(filePath, 'utf8');
      } catch {
        continue;
      }

      const refs = [...source.matchAll(refPattern)].map((m) => m[0]);

      // CSS references sibling assets relatively (KaTeX fonts:
      // `url(../media/KaTeX_….woff2)`), which the absolute pattern
      // above can't see. Resolve them against static/.
      if (url.endsWith('.css')) {
        const cssRelPattern =
          /url\(['"]?\.\.\/(media\/[a-zA-Z0-9_.-]+?\.(?:woff2|css|js))['"]?\)/g;

        for (const match of source.matchAll(cssRelPattern)) {
          refs.push(`static/${match[1]}`);
        }
      }

      for (const ref of refs) {
        const candidate = `/_next/${ref}`;

        if (closure.has(candidate)) {
          continue;
        }

        const candidatePath = path.join(projectRoot, '.next', ref);

        try {
          await fs.access(candidatePath);
        } catch {
          continue;
        }

        closure.add(candidate);
        next.push(candidate);
      }
    }

    frontier = next;
  }

  return closure;
}

/**
 * Every emitted chunk, whether or not anything we can read points
 * at it (Malik, 2026-08-25).
 *
 * The three collectors above are all static analysis, and static
 * analysis has a hard floor here: Turbopack's runtime asks for
 * lazily-loaded chunks by NUMERIC MODULE ID, not by filename, so
 * the literal `static/chunks/<id>.js` strings the closure scans
 * for simply do not exist for them. The client router's own
 * navigation code is one of these — which is why the offline
 * release check caught a ChunkLoadError on client-side nav between
 * two pages that were both fully cached.
 *
 * Resolving module id → chunk file would mean emulating the
 * Turbopack runtime. Shipping every chunk instead costs ~160 KB on
 * a build whose chunks total ~1.7 MB, and it is bounded by the
 * build rather than by how clever the scan is. A chunk cached
 * needlessly wastes bytes once; a chunk missed breaks offline
 * navigation completely. That asymmetry decides it.
 */
async function collectAllEmittedChunks() {
  const chunksDir = path.join(projectRoot, '.next', 'static', 'chunks');
  const assets = new Set();

  const entries = await fs.readdir(chunksDir, {
    recursive: true,
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (!entry.isFile() || !/\.(js|css)$/.test(entry.name)) {
      continue;
    }

    const absolute = path.join(entry.parentPath ?? entry.path, entry.name);
    const relative = path.relative(chunksDir, absolute).split(path.sep).join('/');

    assets.add(`/_next/static/chunks/${relative}`);
  }

  return assets;
}

async function main() {
  const [buildManifest, quizCatalog, rscManifest, buildId] = await Promise.all([
    readJson(BUILD_MANIFEST_PATH),
    readJson(QUIZ_CATALOG_PATH),
    readRscManifest(QUIZ_MANIFEST_PATH),
    fs.readFile(BUILD_ID_PATH, 'utf8'),
  ]);

  if (!rscManifest) {
    throw new Error('Could not load the quiz client reference manifest.');
  }

  const urls = new Set(STATIC_URLS);

  for (const quiz of quizCatalog) {
    urls.add(quiz.quizPath);
  }

  for (const assetPath of [
    ...(buildManifest.polyfillFiles ?? []),
    ...(buildManifest.rootMainFiles ?? []),
    ...(buildManifest.lowPriorityFiles ?? []),
  ]) {
    urls.add(normalizeBuildAsset(assetPath));
  }

  for (const assetPath of collectRouteAssets(
    rscManifest,
    '[project]/app/layout'
  )) {
    urls.add(assetPath);
  }

  for (const assetPath of collectRouteAssets(
    rscManifest,
    '[project]/app/(quiz)/[...slugs]/page'
  )) {
    urls.add(assetPath);
  }

  for (const assetPath of await collectDynamicChunks()) {
    urls.add(assetPath);
  }

  // Every cached page route, not just the quiz ones.
  const pageRoutes = [
    '/',
    '/offline',
    ...quizCatalog.map((quiz) => quiz.quizPath),
  ];

  for (const routePath of pageRoutes) {
    for (const assetPath of await collectPrerenderedRouteAssets(routePath)) {
      urls.add(assetPath);
    }
  }

  for (const assetPath of await collectAllEmittedChunks()) {
    urls.add(assetPath);
  }

  const expanded = await expandChunkClosure(urls);

  const sortedUrls = [...expanded].sort();
  const hash = createHash('sha256').update(sortedUrls.join('\n')).digest('hex');

  const manifest = {
    cacheName: `logicola-offline-${buildId.trim()}-${hash.slice(0, 8)}`,
    generatedAt: new Date().toISOString(),
    quizCount: quizCatalog.length,
    urls: sortedUrls,
  };

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Generated offline manifest with ${sortedUrls.length} URLs.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
