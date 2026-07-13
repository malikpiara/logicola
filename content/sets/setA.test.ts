/**
 * Set A — Syllogistic Translations snapshot + structural invariants.
 *
 * T1.5 Stage D (May 9, 2026): pins the verified-correct static
 * content as a baseline before Stage E swaps in a generator. The
 * snapshot will be re-baselined against `generateSetA(42)` in Stage
 * F; until then it tracks the static export.
 *
 * Property tests guard against structural breakage independent of
 * the snapshot (duplicate IDs, malformed correctId references,
 * empty prompts, etc.) so a future edit that introduces a
 * regression fires a specific failure rather than just a snapshot
 * diff.
 */

import { describe, expect, it } from 'vitest';
import { setA } from './setA';

describe('setA', () => {
  it('matches snapshot', () => {
    expect(setA).toMatchSnapshot();
  });

  it('has exactly two subsets (Easy / Hard)', () => {
    expect(setA.subSets.length).toBe(2);
    expect(setA.subSets[0]!.title).toMatch(/Easy/i);
    expect(setA.subSets[1]!.title).toMatch(/Hard/i);
  });

  it('Easy subset has 55 questions (50 original + 5 added in T1.5 *12)', () => {
    expect(setA.subSets[0]!.questions.length).toBe(55);
  });

  it('Hard subset has 50 questions (47 originals retained after the 3 P3 typo removals + 3 added in T1.5 *1)', () => {
    expect(setA.subSets[1]!.questions.length).toBe(50);
  });

  it('every question has a non-empty prompt', () => {
    for (const subSet of setA.subSets) {
      for (const q of subSet.questions) {
        expect(
          q.prompt.trim().length,
          `[${subSet.name}] ${q.id}`
        ).toBeGreaterThan(0);
      }
    }
  });

  it('every question has exactly 4 options', () => {
    for (const subSet of setA.subSets) {
      for (const q of subSet.questions) {
        expect(q.options.length, `[${subSet.name}] ${q.id}`).toBe(4);
      }
    }
  });

  it('every option has a non-empty label', () => {
    for (const subSet of setA.subSets) {
      for (const q of subSet.questions) {
        for (const o of q.options) {
          expect(
            o.label.trim().length,
            `[${subSet.name}] ${q.id} option ${o.id}`
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  it('every question has unique option ids 0..3', () => {
    for (const subSet of setA.subSets) {
      for (const q of subSet.questions) {
        const ids = q.options.map((o) => o.id);
        expect(
          new Set(ids).size,
          `[${subSet.name}] ${q.id} has duplicate option ids`
        ).toBe(4);
        expect([...ids].sort((a, b) => a - b)).toEqual([0, 1, 2, 3]);
      }
    }
  });

  it('every correctId references a valid option id', () => {
    for (const subSet of setA.subSets) {
      for (const q of subSet.questions) {
        const optionIds = new Set(q.options.map((o) => o.id));
        for (const cid of q.correctId) {
          expect(
            optionIds.has(cid),
            `[${subSet.name}] ${q.id}: correctId ${cid} not in options`
          ).toBe(true);
        }
      }
    }
  });

  it('every question has at least one correct answer', () => {
    for (const subSet of setA.subSets) {
      for (const q of subSet.questions) {
        expect(q.correctId.length, `[${subSet.name}] ${q.id}`).toBeGreaterThan(
          0
        );
      }
    }
  });

  /**
   * Per-subset uniqueness guard. Each subset's `1.x` IDs must be
   * unique within that subset. (The T1.5 audit caught a duplicate
   * `1.25` in the Easy subset; this test ensures it can't recur.)
   * Subsets share the `1.x` namespace by design — the route
   * dispatches by slug, not by parent-set ID.
   */
  it('question ids are unique within each subset', () => {
    for (const subSet of setA.subSets) {
      const ids = subSet.questions.map((q) => q.id);
      const unique = new Set(ids);
      const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
      expect(
        unique.size,
        `[${subSet.name}] duplicate ids: ${[...new Set(duplicates)].join(', ')}`
      ).toBe(ids.length);
    }
  });

  /**
   * Syllogistic-letter convention: every option's label uses only
   * letters, spaces, and the relation words "is", "is not", "all",
   * "some", "no", "not". Catches accidental special characters,
   * KaTeX leakage from other sets, etc.
   */
  it('every option label parses as a syllogistic form', () => {
    const validToken = /^([A-Za-z]|all|some|no|is|not)$/i;
    for (const subSet of setA.subSets) {
      for (const q of subSet.questions) {
        for (const o of q.options) {
          const tokens = o.label.trim().split(/\s+/);
          for (const t of tokens) {
            expect(
              validToken.test(t),
              `[${subSet.name}] ${q.id} option ${o.id} (${JSON.stringify(o.label)}): unexpected token ${JSON.stringify(t)}`
            ).toBe(true);
          }
        }
      }
    }
  });

  /**
   * No prompts shared across the entire set. Catches the audit-
   * identified duplicate-prompt issue (T1.5 fixed Hard q1.5/q1.17
   * sharing "People who aren't backpackers aren't rich").
   */
  it('prompts are unique within each subset', () => {
    for (const subSet of setA.subSets) {
      const seen = new Map<string, string[]>();
      for (const q of subSet.questions) {
        const key = q.prompt
          .trim()
          .toLowerCase()
          .replace(/[.,!?]+$/, '');
        seen.set(key, [...(seen.get(key) ?? []), q.id]);
      }
      const dups = [...seen.entries()].filter(([, ids]) => ids.length > 1);
      expect(
        dups,
        `[${subSet.name}] duplicate prompts: ${dups.map(([p, ids]) => `${ids.join(',')} share "${p}"`).join('; ')}`
      ).toEqual([]);
    }
  });
});
