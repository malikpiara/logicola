/**
 * Stage A inventory tool for T1.5 (Set A).
 *
 * Reads the current setA.ts and classifies each prompt against the
 * 23 canonical 2008 templates (the Set A fidelity audit). Prints:
 *   - per-subset template histogram
 *   - duplicate IDs
 *   - prompts that don't fit any of the 23 templates (LC3 extensions)
 *   - which templates are still missing
 */

import { setA } from '../content/sets/setA';

interface Template {
  id: string;
  name: string;
  match: (prompt: string) => boolean;
}

const templates: Template[] = [
  {
    id: '*0',
    name: '"$J is a $C person in $p"',
    match: (p) => /^[A-Z][a-z]+ is a \w+ person in /.test(p),
  },
  {
    id: '*1',
    name: '"$J is the $C one in $p"',
    match: (p) => /^[A-Z][a-z]+ is the \w+ one in /.test(p),
  },
  {
    id: '*2',
    name: '"I\'m a $B $A in $p"',
    match: (p) => /^I[’']?m a \w+ \w+ in /.test(p),
  },
  {
    id: '*3',
    name: '"I\'m the $Best $A in $p"',
    match: (p) => /^I[’']?m the \w+ \w+ in /.test(p),
  },
  {
    id: '*4',
    name: '"This $A isn\'t a $C person"',
    match: (p) => /^This \w+ isn[’']?t a \w+ person/.test(p),
  },
  {
    id: '*5',
    name: '"This $A isn\'t the most $C person"',
    match: (p) =>
      /^(This|The) \w+ isn[’']?t the (most|\w+est) \w+ ?(person)?/.test(p),
  },
  {
    id: '*6',
    name: '"You aren\'t a $B $A"',
    match: (p) => /^You aren[’']?t a \w+ \w+/.test(p),
  },
  {
    id: '*7',
    name: '"You aren\'t the $Best $A"',
    match: (p) => /^You aren[’']?t the \w+ \w+/.test(p),
  },
  {
    id: '*8',
    name: '"All $As in $p $D people who are $C"',
    match: (p) => /^All \w+ in [A-Z]/.test(p) && / people who are /.test(p),
  },
  {
    id: '*9',
    name: '"Some $As don\'t $D any $C people"',
    match: (p) => /^Some \w+ don[’']?t \w+ any /.test(p),
  },
  {
    id: '*10',
    name: '"Some $D $As are $C"',
    match: (p) =>
      /^Some \w+ \w+ are \w+/.test(p) &&
      !/don[’']?t/.test(p) &&
      !/aren[’']?t/.test(p),
  },
  {
    id: '*11',
    name: '"No $D $A is $C"',
    match: (p) => /^No \w+ \w+ is \w+/.test(p) && !/^No one /.test(p),
  },
  {
    id: '*12',
    name: '"$S $C people are $As"',
    match: (p) => /^(Some|All) \w+ people are \w+/.test(p),
  },
  {
    id: '*13',
    name: '"Whoever is $C is $D"',
    match: (p) => /^Whoever is \w+ is \w+/.test(p),
  },
  {
    id: '*14',
    name: '"Whoever is $C isn\'t $D"',
    match: (p) => /^Whoever is \w+ isn[’']?t \w+/.test(p),
  },
  {
    id: '*15',
    name: '"No one is $B unless he or she is $D"',
    match: (p) => /^No one is \w+ unless /.test(p),
  },
  {
    id: '*16',
    name: '"Not all $As are $B"',
    match: (p) => /^Not all \w+ are \w+/.test(p),
  },
  {
    id: '*17',
    name: '"It isn\'t true that some $As are $B"',
    match: (p) => /^It isn[’']?t true that som[er]+ \w+/.test(p),
  },
  {
    id: '*18',
    name: '"A person isn\'t $B unless he or she is $D"',
    match: (p) => /^A person isn[’']?t \w+ unless /.test(p),
  },
  {
    id: '*19',
    name: '"People who are $As are $B"',
    match: (p) => /^People who are \w+ are \w+/.test(p),
  },
  {
    id: '*20',
    name: '"People who are $As aren\'t $B"',
    match: (p) => /^People who are \w+ aren[’']?t \w+/.test(p),
  },
  {
    id: '*21',
    name: '"One or more $As are $B"',
    match: (p) => /^One or more \w+ are \w+/.test(p),
  },
  {
    id: '*22',
    name: '"It is false that some $As aren\'t $C"',
    match: (p) => /^It is false that some \w+ aren[’']?t \w+/.test(p),
  },
];

interface Outcome {
  matched: string;
  prompt: string;
  id: string;
}

function classify(prompt: string): string {
  for (const t of templates) {
    if (t.match(prompt)) return t.id;
  }
  return 'UNMATCHED';
}

for (const subset of setA.subSets) {
  console.log(`\n=== ${subset.title} (${subset.questions.length} qs) ===`);
  const histo: Record<string, Outcome[]> = {};
  const seen = new Map<string, number>();

  for (const q of subset.questions) {
    const t = classify(q.prompt);
    histo[t] = histo[t] ?? [];
    histo[t]!.push({ matched: t, prompt: q.prompt, id: q.id });
    seen.set(q.id, (seen.get(q.id) ?? 0) + 1);
  }

  // Histogram
  const order = templates.map((t) => t.id).concat('UNMATCHED');
  for (const t of order) {
    const items = histo[t];
    if (!items?.length) continue;
    console.log(`  ${t.padEnd(6)} ${items.length} qs`);
  }

  // Duplicate IDs
  const dups = [...seen.entries()].filter(([, n]) => n > 1);
  if (dups.length) {
    console.log(
      `  DUPLICATE IDs: ${dups.map(([id, n]) => `${id} (×${n})`).join(', ')}`
    );
  }

  // Unmatched prompts
  const unmatched = histo['UNMATCHED'] ?? [];
  if (unmatched.length) {
    console.log(`  --- UNMATCHED (${unmatched.length}) ---`);
    for (const u of unmatched) {
      console.log(`    [${u.id}] ${JSON.stringify(u.prompt)}`);
    }
  }
}

// Coverage summary
const allMatched = new Set<string>();
for (const subset of setA.subSets) {
  for (const q of subset.questions) {
    const t = classify(q.prompt);
    if (t !== 'UNMATCHED') allMatched.add(t);
  }
}

const allTemplates = templates.map((t) => t.id);
const used = allTemplates.filter((t) => allMatched.has(t));
const missing = allTemplates.filter((t) => !allMatched.has(t));

console.log(`\n=== COVERAGE ===`);
console.log(`Used (${used.length}/23): ${used.join(', ')}`);
console.log(`Missing (${missing.length}/23): ${missing.join(', ')}`);
