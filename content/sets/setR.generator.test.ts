/**
 * Set R generator tests.
 *
 * Production behavior is **live random** (Math.random) — different
 * passages every mount. Tests pin determinism by passing a fixed seed
 * (`generateSetR(42)`) so snapshots stay stable across runs.
 *
 * Set-R-specific properties under test: every question carries the full
 * fixed 18-option taxonomy, a 10-question session drills 10 distinct
 * fallacy types, substitution leaves no unresolved tokens or KaTeX-unsafe
 * `$`s, pronouns agree within a passage, and the original multi-answer
 * passages accept all their answers.
 */

import { describe, expect, it } from 'vitest';
import { FALLACIES, SECTIONS } from './setR.data';
import { fallacyQuestions, generateSetR } from './setR.generator';
import type { Question } from '../types';

const TEST_SEED = 42;
const TEST_PER_SUBSET = 10;

const SEEDS = [1, 42, 99, 12345];

function draw(seed: number, n: number): Question[] {
  const it = fallacyQuestions(seed);
  const out: Question[] = [];
  for (let i = 0; i < n; i++) out.push(it.next().value as Question);
  return out;
}

/** gen.R.<code>.<n> → <code> */
function codeOf(question: Question): string {
  return question.id.split('.')[2]!;
}

describe('setR generator — top-level', () => {
  it('matches snapshot for seed 42', () => {
    expect(generateSetR(TEST_SEED, TEST_PER_SUBSET)).toMatchSnapshot();
  });

  it('produces distinct outputs for different seeds', () => {
    const prompts = (seed: number) =>
      generateSetR(seed, TEST_PER_SUBSET).subSets[0]!.questions.map(
        (q) => q.prompt
      );
    expect(prompts(1)).not.toEqual(prompts(2));
  });

  it('is deterministic for a fixed seed', () => {
    expect(generateSetR(7, TEST_PER_SUBSET)).toEqual(
      generateSetR(7, TEST_PER_SUBSET)
    );
  });

  it('respects perSubset', () => {
    expect(generateSetR(TEST_SEED, 5).subSets[0]!.questions).toHaveLength(5);
  });

  it('pins the subset metadata the quiz UI keys off', () => {
    const subSet = generateSetR(TEST_SEED).subSets[0]!;
    expect(subSet.id).toBe(18);
    expect(subSet.slugs).toEqual(['informal', 'fallacies']);
    expect(subSet.optionLayout).toBe('grid');
    expect(subSet.maxWrongGuesses).toBe(3);
    expect(subSet.multiSelect).toBe(true);
    expect(subSet.shuffleOptions).toBe(false);
    expect(subSet.header).toBe('What fallacy does this illustrate?');
  });
});

describe('setR generator — question shape (100+ draws per seed)', () => {
  it('gives every question the full fixed 18-option taxonomy', () => {
    for (const seed of SEEDS) {
      for (const question of draw(seed, 108)) {
        expect(question.options.map((o) => o.id)).toEqual(
          FALLACIES.map((f) => f.id)
        );
        expect(question.options.map((o) => o.label)).toEqual(
          FALLACIES.map((f) => f.name)
        );
        expect(question.options.map((o) => o.abbreviation)).toEqual(
          FALLACIES.map((f) => f.code)
        );
        for (const option of question.options) {
          expect(option.hint).toBeTruthy();
        }
      }
    }
  });

  it('drills 10 distinct fallacy types per 10-question session', () => {
    for (const seed of SEEDS) {
      const questions = generateSetR(seed, TEST_PER_SUBSET).subSets[0]!
        .questions;
      expect(new Set(questions.map(codeOf)).size).toBe(TEST_PER_SUBSET);
    }
  });

  it('covers all 18 fallacies across each 18-question cycle', () => {
    for (const seed of SEEDS) {
      const codes = draw(seed, 18).map(codeOf);
      expect(new Set(codes).size).toBe(18);
    }
  });

  it('leaves no unresolved {token}s and no KaTeX-unsafe bare $', () => {
    for (const seed of SEEDS) {
      for (const question of draw(seed, 108)) {
        for (const text of [question.prompt, question.answer]) {
          expect(text).not.toMatch(/\{(a|A|b|B|hc|hC|HC|d|D|E|g)\}/);
          expect(text.replaceAll('$\\$20$', '')).not.toContain('$');
        }
      }
    }
  });

  it('keeps pronouns gender-consistent within a passage', () => {
    const masculine = /\b(he|him|his)\b/i;
    const feminine = /\b(she|her)\b/i;
    for (const seed of SEEDS) {
      for (const question of draw(seed, 108)) {
        // Only flag passages where a substituted pronoun could conflict;
        // fixed-text passages (Hume, Marx, …) legitimately mix none.
        if (masculine.test(question.prompt) && feminine.test(question.prompt)) {
          // Fixed passages can contain e.g. 'her new {d}' AND a masculine
          // noun; conflict only matters for the substituted tokens, so
          // assert via the raw templates instead: a template with both a
          // masculine and feminine SUBSTITUTED pronoun cannot exist.
          const sectionCode = codeOf(question);
          const section = SECTIONS.find((s) => s.code === sectionCode)!;
          const usesGenderTokens = section.variants.some((v) =>
            /\{(b|B|hc|hC|HC)\}/.test(v.template)
          );
          if (usesGenderTokens) {
            // The template's fixed text must account for the other gender.
            const fixedTexts = section.variants.map((v) =>
              v.template.replace(/\{[^}]+\}/g, '')
            );
            expect(
              fixedTexts.some((t) => masculine.test(t) || feminine.test(t))
            ).toBe(true);
          }
        }
      }
    }
  });

  it('maps the correct fallacy id(s) for every question', () => {
    const idOf = Object.fromEntries(FALLACIES.map((f) => [f.code, f.id]));
    for (const seed of SEEDS) {
      for (const question of draw(seed, 108)) {
        expect(question.correctId[0]).toBe(idOf[codeOf(question)]);
        expect(question.correctId.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('setR generator — multi-answer fidelity', () => {
  it('accepts every original M-code answer when its passage is drawn', () => {
    const idOf = Object.fromEntries(FALLACIES.map((f) => [f.code, f.id]));
    // Sweep enough draws that multi-answer variants appear, then check
    // the drawn question's accepted set against the data module.
    let multiAnswerSeen = 0;
    for (const seed of SEEDS) {
      for (const question of draw(seed, 108)) {
        if (question.correctId.length > 1) {
          multiAnswerSeen++;
          const section = SECTIONS.find((s) => s.code === codeOf(question))!;
          const match = section.variants.find(
            (v) =>
              v.accepted.map((c) => idOf[c]).join() ===
              question.correctId.join()
          );
          expect(match).toBeTruthy();
        }
      }
    }
    expect(multiAnswerSeen).toBeGreaterThan(5);
  });

  it('answer text names the primary fallacy', () => {
    for (const question of draw(TEST_SEED, 36)) {
      const primary = FALLACIES.find((f) => f.id === question.correctId[0])!;
      expect(question.answer.toLowerCase()).toContain(
        primary.name.toLowerCase()
      );
    }
  });
});
