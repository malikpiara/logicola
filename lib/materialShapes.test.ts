import { describe, expect, it } from 'vitest';
import {
  MATERIAL_SHAPES,
  gridToPath,
  rasterise,
} from './materialShapes';

const byName = (name: string) =>
  MATERIAL_SHAPES.find((s) => s.name === name)!;

const rows = (grid: boolean[][]) =>
  grid.map((r) => r.filter(Boolean).length);

describe('MATERIAL_SHAPES', () => {
  it('carries all 35 of Material\'s shapes, each a closed outline in the unit square', () => {
    expect(MATERIAL_SHAPES).toHaveLength(35);
    for (const s of MATERIAL_SHAPES) {
      expect(s.outline.length).toBeGreaterThan(8);
      for (const [x, y] of s.outline) {
        expect(x).toBeGreaterThanOrEqual(-1e-9);
        expect(x).toBeLessThanOrEqual(1 + 1e-9);
        expect(y).toBeGreaterThanOrEqual(-1e-9);
        expect(y).toBeLessThanOrEqual(1 + 1e-9);
      }
      // longest side is exactly 1
      const xs = s.outline.map((p) => p[0]);
      const ys = s.outline.map((p) => p[1]);
      const w = Math.max(...xs) - Math.min(...xs);
      const h = Math.max(...ys) - Math.min(...ys);
      expect(Math.max(w, h)).toBeCloseTo(1, 6);
    }
  });

  it('draws the diamond symmetric on the grid, widest at the waist', () => {
    const r = rows(rasterise(byName('Diamond').outline, 24));
    expect(r).toEqual([...r].reverse());
    expect(Math.max(...r)).toBe(r[11]);
  });

  it('keeps Boom\'s spikes apart at 24 cells', () => {
    const g = rasterise(byName('Boom').outline, 24);
    // some row crosses the spikes as separate runs
    const runs = (row: boolean[]) =>
      row.reduce((n, v, i) => n + (v && !row[i - 1] ? 1 : 0), 0);
    expect(Math.max(...g.map(runs))).toBeGreaterThanOrEqual(4);
    // and a burst covers far less than the disc it fits in
    const filled = g.flat().filter(Boolean).length;
    const disc = rasterise(byName('Circle').outline, 24).flat().filter(Boolean).length;
    expect(filled).toBeLessThan(disc * 0.6);
  });

  it('draws Material\'s own Pixel circle when given their Circle at 14 cells', () => {
    // Their Pixel circle is hand-made; our rule applied to their Circle
    // must land on the same stairs, row for row.
    const circle = rows(rasterise(byName('Circle').outline, 14));
    const pixel = rows(rasterise(byName('Pixel circle').outline, 14));
    expect(circle).toEqual(pixel);
    expect(circle).toEqual([6, 10, 12, 12, 14, 14, 14, 14, 14, 14, 12, 12, 10, 6]);
  });

  it('pins three shapes at the grid the app draws on', () => {
    const at24 = (name: string) => rows(rasterise(byName(name).outline, 24));
    expect({
      diamond: at24('Diamond'),
      puffy: at24('Puffy'),
      heart: at24('Heart'),
    }).toMatchSnapshot();
  });

  it('merges horizontal runs into one rect each', () => {
    const d = gridToPath(
      [
        [true, true, false, true],
        [false, false, false, false],
      ],
      4
    );
    expect(d).toBe('M0 0h8v4h-8zM12 0h4v4h-4z');
  });
});
