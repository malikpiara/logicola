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

const STATIC_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
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

  const sortedUrls = [...urls].sort();
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
