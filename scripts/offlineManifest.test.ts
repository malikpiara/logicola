import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guards the offline manifest against the trap that shipped twice
 * (Malik, 2026-08-25).
 *
 * Every collector feeding the manifest is static analysis, and
 * Turbopack asks for lazily-loaded chunks by numeric module id — so
 * a scan for literal `static/chunks/<id>.js` strings cannot see
 * them. The client router's navigation chunk is one of these: both
 * pages fully cached, and moving between them offline still died
 * with a ChunkLoadError. The generator now sweeps the whole chunks
 * directory; this test is what stops that sweep being "tidied"
 * back into something clever.
 *
 * Reads build output, so it only runs after `pnpm build`.
 */

const projectRoot = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '..'
);
const chunksDir = path.join(projectRoot, '.next', 'static', 'chunks');
const manifestPath = path.join(projectRoot, 'public', 'offline-manifest.json');

const hasBuild = existsSync(chunksDir) && existsSync(manifestPath);

describe.skipIf(!hasBuild)('offline manifest', () => {
  const manifest = hasBuild
    ? (JSON.parse(readFileSync(manifestPath, 'utf8')) as { urls: string[] })
    : { urls: [] };
  const cached = new Set(manifest.urls);

  it('caches every emitted JS and CSS chunk', () => {
    const emitted = readdirSync(chunksDir, { recursive: true })
      .map(String)
      .filter((name) => /\.(js|css)$/.test(name))
      .map((name) => `/_next/static/chunks/${name.split(path.sep).join('/')}`);

    expect(emitted.length).toBeGreaterThan(0);

    const missing = emitted.filter((url) => !cached.has(url));

    expect(missing).toEqual([]);
  });

  it('never caches the manifest itself', () => {
    // Cache-first + a cached manifest = the app pins itself to an
    // old ?v= and no deploy can ever install again.
    expect(cached.has('/offline-manifest.json')).toBe(false);
  });

  it('caches the landing page and the offline fallback', () => {
    expect(cached.has('/')).toBe(true);
    expect(cached.has('/offline')).toBe(true);
  });
});
