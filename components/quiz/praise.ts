import { praiseStrings } from '@/content/lexicons';

/**
 * What the end screen says when a run reaches 100.
 *
 * These are Gensler's own words. `content/lexicons.ts` carries all thirty
 * praise strings the 2008 program shipped, verbatim; this is a
 * five-line subset of them, and `praise.test.ts` asserts every entry is
 * still one of his once the exclamation mark is removed. That test is the
 * point of this file existing rather than the array being inlined — it
 * makes it impossible to quietly invent a line and attribute it to him.
 *
 * TWO DELIBERATE DEPARTURES FROM 2008, both Malik's, 2026-08-23.
 *
 * The first is scale. These were PER-ANSWER applause — thirty of them exist
 * because you met one after every correct answer — and lexicons.ts records
 * that "the scored end screen replaced" them. Moving one to the end screen
 * makes it a much larger claim, said once per completed exercise rather
 * than thirty times a run. Malik's judgement is that the claim is now
 * proportionate: completing an exercise is genuinely hard, where answering
 * one problem is not.
 *
 * The second is the exclamation mark, which 2008 did not use. Same reason:
 * a mark that fires thirty times a run cannot afford one; a mark that fires
 * once can.
 *
 * WHY THESE FIVE AND NOT THE OTHER TWENTY-FIVE. They are the person-
 * directed ones — they praise the learner rather than the answer. That is
 * the opposite of what the points delta was argued on (task-directed
 * feedback over self-directed), and the difference is the size of the
 * event: "Sharp student" after one correct translation is flattery, after a
 * completed exercise it is a fair description. Malik is revisiting the
 * success screen in a later release, so treat this as a resting state.
 */
export const END_SCREEN_PRAISE = [
  'Logic whiz!',
  'A logic brain!',
  'Sharp student!',
  'Pretty smart!',
  'What a brain!',
] as const;

/**
 * One line for one run.
 *
 * Rolled once per end screen from a seed the caller holds, so a re-render
 * never swaps the headline mid-read — the same reason `PatternLayer` seeds
 * its scatter once per mount rather than per render.
 */
export function praiseFor(seed: number): string {
  const pool = END_SCREEN_PRAISE;
  return pool[Math.abs(seed) % pool.length]!;
}

/** The 2008 line each entry is built from — used by the fidelity test. */
export function withoutBang(line: string): string {
  return line.replace(/!$/, '');
}

/** Re-exported so the test reads one import; the source stays lexicons.ts. */
export { praiseStrings };
