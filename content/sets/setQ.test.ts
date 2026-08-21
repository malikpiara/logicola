/**
 * Set Q — Meanings and Definitions snapshot test.
 *
 * Set Q is the **only Phase-1 set without a generator** (flat list of
 * 60 hardcoded definitions, no template structure — see
 * the Set Q fidelity audit). The snapshot here pins the static export
 * itself; future changes to setQ.ts must `vitest -u` to acknowledge
 * the change and surface a reviewable diff.
 *
 * Property tests guard against structural breakage (correctId
 * referencing nonexistent option ids, empty prompts, duplicate IDs,
 * etc.) independently of the snapshot.
 */

import { describe, expect, it } from 'vitest';
import { setQ } from './setQ';

describe('setQ', () => {
  it('matches snapshot', () => {
    expect(setQ).toMatchSnapshot();
  });

  it('has exactly one subset', () => {
    expect(setQ.subSets.length).toBe(1);
  });

  it('has the canonical 60 plus the dated 2026 specimens', () => {
    // Gensler's sixty (ids 3.1–3.60) are at canonical parity and stay
    // untouched; entries past 3.60 are dated additions (see the comment
    // block above id 3.61). Both halves are pinned so neither drifts
    // silently.
    const ids = setQ.subSets[0]!.questions.map((q) => q.id);
    expect(ids.filter((id) => Number(id.split('.')[1]) <= 60)).toHaveLength(60);
    expect(setQ.subSets[0]!.questions.length).toBe(111);
  });

  it('every question has a non-empty prompt', () => {
    for (const q of setQ.subSets[0]!.questions) {
      expect(q.prompt.trim().length, `question ${q.id} prompt`).toBeGreaterThan(
        0
      );
    }
  });

  it('every question has 7 flaw-category options', () => {
    for (const q of setQ.subSets[0]!.questions) {
      expect(q.options.length, `question ${q.id} options`).toBe(7);
    }
  });

  it('every correctId references a valid option id', () => {
    for (const q of setQ.subSets[0]!.questions) {
      const optionIds = new Set(q.options.map((o) => o.id));
      for (const cid of q.correctId) {
        expect(
          optionIds.has(cid),
          `question ${q.id}: correctId ${cid} not in options`
        ).toBe(true);
      }
    }
  });

  it('every question has at least one correct answer', () => {
    for (const q of setQ.subSets[0]!.questions) {
      expect(
        q.correctId.length,
        `question ${q.id} has no correct answer`
      ).toBeGreaterThan(0);
    }
  });

  it('every question has a non-empty answer explanation', () => {
    for (const q of setQ.subSets[0]!.questions) {
      expect(
        q.answer.trim().length,
        `question ${q.id} has empty answer`
      ).toBeGreaterThan(0);
    }
  });

  it('question IDs are unique', () => {
    const ids = setQ.subSets[0]!.questions.map((q) => q.id);
    const unique = new Set(ids);
    expect(unique.size, 'duplicate question ids').toBe(ids.length);
  });

  it('uses US English spelling (per Tier-1 polish)', () => {
    // Per the Set Q fidelity audit, two questions had UK 'analyses' that
    // were corrected to US 'analyzes' to match Gensler's textbook style.
    for (const q of setQ.subSets[0]!.questions) {
      expect(q.prompt, `question ${q.id} contains UK 'analyses'`).not.toMatch(
        /\banalyses\b/
      );
    }
  });

  /**
   * 0-based / 1-based indexing coherence guard.
   *
   * LC3 stores `correctId` as 0-based option indices (idiomatic for
   * JS arrays); the `answer` string uses 2008-style 1-based flaw
   * numbers (e.g., "This violates 2 (...)" means flaw 2 of the
   * displayed 7-option list, which is option-index 1).
   *
   * The invariant that holds across all 60 canonical questions:
   *
   *     ∀ q.correctId.map(id => id + 1) ⊆ flawNumbersIn(q.answer)
   *     ∀ flawNumbersIn(q.answer)        ⊆ q.correctId.map(id => id + 1)
   *
   * Any future edit that violates this — accidentally double-shifting
   * the index, forgetting to update one side, or copy-pasting between
   * 1-based 2008 source and 0-based LC3 — will break this test
   * loudly.
   *
   * "flawNumbersIn" extracts every digit 1–7 from the answer string,
   * so parentheticals and hedged mentions count too. This is
   * deliberately strict: every mentioned flaw is a flaw the user is
   * told about, and Gensler's design treats hedged ones as
   * acceptable answers.
   */
  it('correctId (0-based) and answer numbers (1-based) stay in sync', () => {
    for (const q of setQ.subSets[0]!.questions) {
      const expected = new Set(q.correctId.map((id) => id + 1));
      const mentioned = new Set(
        (q.answer.match(/\d+/g) ?? [])
          .map(Number)
          .filter((n) => n >= 1 && n <= 7)
      );

      const missing = [...expected].filter((n) => !mentioned.has(n));
      const extras = [...mentioned].filter((n) => !expected.has(n));

      expect(
        missing,
        `${q.id}: correctId ${JSON.stringify(q.correctId)} expects flaw numbers ${[
          ...expected,
        ].join(
          ', '
        )} mentioned in answer ${JSON.stringify(q.answer)}, but missing: ${missing.join(', ')}`
      ).toEqual([]);

      expect(
        extras,
        `${q.id}: answer ${JSON.stringify(q.answer)} mentions flaw numbers not in correctId ${JSON.stringify(q.correctId)}: ${extras.join(', ')}`
      ).toEqual([]);
    }
  });
});
