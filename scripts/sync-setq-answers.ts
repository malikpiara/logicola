/**
 * One-shot script: sync Set Q answer strings to the 2008 canonical
 * source where LC3 is missing the parenthetical hint.
 *
 * Two passes:
 *   1. Normalize prompts on both sides aggressively (strip all
 *      punctuation, lowercase, collapse whitespace) so smart quotes,
 *      apostrophe styles, and period placement don't break matches.
 *   2. For each LC3 question, only update its `answer` if:
 *      a. LC3 currently has no parenthetical `(...)` AND 2008 has one
 *         (clear pedagogical regression to fix), OR
 *      b. LC3 lacks a trailing period that 2008 has (cosmetic
 *         normalization).
 *      Otherwise, LC3's hand-edited richer version (em-dashes,
 *      restored apostrophes, etc.) is preserved.
 *
 * Usage:
 *   npx tsx scripts/sync-setq-answers.ts            # dry run, prints diff
 *   npx tsx scripts/sync-setq-answers.ts --apply    # writes proposed edits
 */

import { readFileSync, writeFileSync } from 'fs';
import { setQ } from '../content/sets/setQ';

const APPLY = process.argv.includes('--apply');
const SETQ_PATH = '/Users/malik/Code/logicola/content/sets/setQ.ts';
const JSON_PATH =
  '/Users/malik/Code/logicola-ghidra/notes/exercises/2008/parsed/set_Q_definitions.json';

interface Example {
  id: number;
  definition: string;
  flaw_ids: number[];
  answer_raw: string;
}

interface ParsedJson {
  examples: Example[];
}

const data = JSON.parse(readFileSync(JSON_PATH, 'utf8')) as ParsedJson;

/**
 * Aggressive normalization: keep only letters, digits, spaces.
 *
 * The 2008 parsed JSON uses CP1252 byte 0x92 for apostrophes,
 * which decodes as U+FFFD when read as UTF-8. Strip all
 * apostrophe-like variants (ASCII, smart quotes, CP1252, replacement
 * char) BEFORE the alphanumeric filter so "doesnt" doesn't become
 * "doesn t".
 */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/['‘’�]/g, '')
    .replace(/["“”]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean parsing artifacts in answer_raw and rebuild apostrophes.
 *
 *   "1 (whales arent fish)."          → "1 (whales aren't fish)."
 *   "2 o(consider green apples)."     → "2 (consider green apples)."
 *   "and 2  oif you consider..."      → "and 2 — if you consider..."
 *
 * The lone-`o` artifact is a parser glitch: the 2008 binary's answer
 * field has a non-printable separator that the parser rendered as
 * `o`. It appears between flaws/clauses where the original would
 * have a punctuation mark — `(` or em-dash.
 */
function cleanAnswer(raw: string): string {
  // Strip the U+FFFD replacement character that the parser produced
  // for CP1252 0x92 (right-single-quote). This collapses "doesn?t"
  // back to "doesnt" so the contractions table below can replace
  // it with "doesn't".
  let out = raw.replace(/�/g, '');
  // Lone-`o` artifact before parenthetical: "2 o(" → "2 ("
  out = out.replace(/(\d)\s+o\(/g, '$1 (');
  // Lone-`o` artifact before lowercase word in middle of sentence,
  // preceded by 2 spaces (em-dash artifact): "  oif" → " — if"
  out = out.replace(/  o([a-z])/g, ' — $1');
  // Restore common contractions
  const contractions: Record<string, string> = {
    arent: "aren't",
    dont: "don't",
    doesnt: "doesn't",
    isnt: "isn't",
    cant: "can't",
    wont: "won't",
    wasnt: "wasn't",
    werent: "weren't",
    hasnt: "hasn't",
    havent: "haven't",
    hadnt: "hadn't",
    wouldnt: "wouldn't",
    couldnt: "couldn't",
    shouldnt: "shouldn't",
  };
  for (const [bare, contracted] of Object.entries(contractions)) {
    out = out.replace(new RegExp(`\\b${bare}\\b`, 'g'), contracted);
  }
  return out;
}

function canonicalAnswer(raw: string): string {
  const cleaned = cleanAnswer(raw).replace(/\.$/, '');
  return `This violates ${cleaned}.`;
}

const byPrompt = new Map<string, { example: Example; canonical: string }>();
for (const ex of data.examples) {
  byPrompt.set(normalize(ex.definition), {
    example: ex,
    canonical: canonicalAnswer(ex.answer_raw),
  });
}

interface Decision {
  id: string;
  prompt: string;
  current: string;
  proposed: string;
  reason: 'add-parenthetical' | 'add-period' | 'unchanged' | 'preserve-lc3';
}

const subset = setQ.subSets[0]!;
const decisions: Decision[] = [];
const unmatched: string[] = [];

for (const q of subset.questions) {
  const key = normalize(q.prompt);
  const hit = byPrompt.get(key);
  if (!hit) {
    unmatched.push(`${q.id}: ${q.prompt}`);
    continue;
  }

  const lc3 = q.answer;
  const target = hit.canonical;
  const lc3HasParen = /\(/.test(lc3);
  const targetHasParen = /\(/.test(target);
  const lc3EndsPeriod = /\.\s*$/.test(lc3);

  let proposed = lc3;
  let reason: Decision['reason'] = 'unchanged';

  if (lc3.trim() === target) {
    reason = 'unchanged';
  } else if (!lc3HasParen && targetHasParen) {
    // LC3 missing parenthetical hint that 2008 has — clear win
    proposed = target;
    reason = 'add-parenthetical';
  } else if (!lc3EndsPeriod && lc3.trim() + '.' === target) {
    // Pure missing-period case
    proposed = lc3.trim() + '.';
    reason = 'add-period';
  } else if (lc3HasParen) {
    // LC3 already has its own parenthetical — preserve it
    reason = 'preserve-lc3';
  } else if (!lc3EndsPeriod) {
    // No paren, just missing period
    proposed = lc3.trim() + '.';
    reason = 'add-period';
  }

  decisions.push({
    id: q.id,
    prompt: q.prompt,
    current: lc3,
    proposed,
    reason,
  });
}

const byReason = decisions.reduce<Record<string, number>>((acc, d) => {
  acc[d.reason] = (acc[d.reason] ?? 0) + 1;
  return acc;
}, {});

console.log(`Total LC3 questions: ${subset.questions.length}`);
console.log(`Unmatched:           ${unmatched.length}`);
for (const [r, n] of Object.entries(byReason)) {
  console.log(`  ${r.padEnd(20)} ${n}`);
}
console.log();

if (unmatched.length > 0) {
  console.log("=== UNMATCHED PROMPTS (won't be touched) ===");
  for (const u of unmatched) console.log('  ', u);
  console.log();
}

const changes = decisions.filter(
  (d) => d.reason === 'add-parenthetical' || d.reason === 'add-period'
);
console.log(`=== ${changes.length} PROPOSED CHANGES ===`);
for (const d of changes) {
  console.log(`[${d.id}] (${d.reason}) ${d.prompt}`);
  console.log(`  FROM: ${JSON.stringify(d.current)}`);
  console.log(`  TO:   ${JSON.stringify(d.proposed)}`);
}

console.log();
const preserved = decisions.filter((d) => d.reason === 'preserve-lc3');
if (preserved.length > 0) {
  console.log(
    `=== ${preserved.length} preserved (LC3 already has parenthetical) ===`
  );
  for (const d of preserved) {
    console.log(`  [${d.id}] ${d.current}`);
  }
}

if (APPLY && changes.length > 0) {
  console.log();
  console.log('Applying changes...');
  let src = readFileSync(SETQ_PATH, 'utf8');
  for (const d of changes) {
    const idPattern = `id: '${d.id}'`;
    const idIdx = src.indexOf(idPattern);
    if (idIdx === -1) {
      console.error(`  ! Could not locate id ${d.id}`);
      continue;
    }
    const answerStart = src.indexOf('answer: ', idIdx);
    if (answerStart === -1) {
      console.error(`  ! Could not locate answer for ${d.id}`);
      continue;
    }
    // Find end of the answer value: the closing string quote followed by ","
    // Look for ",\n" or "," after the answer keyword
    const afterAnswer = src.indexOf('\n', answerStart);
    if (afterAnswer === -1) continue;
    // Find the line with the closing comma at the same or next ~3 lines
    let endOfStmt = afterAnswer;
    // The answer value may span multiple lines; scan forward until we hit
    // a line ending with `,` or `},`
    let scan = answerStart;
    while (scan < src.length) {
      const lineEnd = src.indexOf('\n', scan);
      if (lineEnd === -1) break;
      const line = src.slice(scan, lineEnd);
      if (/,\s*$/.test(line) || /\}\s*,?\s*$/.test(line)) {
        endOfStmt = src.lastIndexOf(',', lineEnd);
        break;
      }
      scan = lineEnd + 1;
    }
    if (endOfStmt < answerStart) {
      console.error(`  ! Could not locate end-of-stmt for ${d.id}`);
      continue;
    }
    const escaped = JSON.stringify(d.proposed);
    const replacement = `answer: ${escaped}`;
    src = src.slice(0, answerStart) + replacement + src.slice(endOfStmt);
    console.log(`  ✓ ${d.id}`);
  }
  writeFileSync(SETQ_PATH, src);
  console.log(`Wrote ${SETQ_PATH}`);
}
