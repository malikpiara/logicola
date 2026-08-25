import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { WORDMARK_PATHS } from './wordmarkPaths';

// The constant exists so client components can render the can without
// the server-only marketingTheme. This test is the sync guarantee: the
// same regex marketingTheme uses at module load, against the same
// asset — if the wordmark SVG ever changes, this fails until the
// constant is regenerated.
describe('WORDMARK_PATHS', () => {
  it('is byte-identical to public/logicola-wordmark.svg', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'public/logicola-wordmark.svg'),
      'utf8'
    );
    const parsed = [
      ...src.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"/g),
    ].map((m) => [/^#f/i.test(m[2]) ? 'w' : 'g', m[1]]);
    expect(parsed).toHaveLength(16);
    expect(WORDMARK_PATHS.map((p) => [...p])).toEqual(parsed);
  });
});
