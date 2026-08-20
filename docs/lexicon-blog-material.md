# Blog material — the lexicon reform (Acheron)

Raw material for the release essay, gathered 2026-08-20. Facts checked;
voice is not final. Companion piece: `randomness-article.md`. The
measurement caveats in `vocabulary-experiment.md` still govern every
learning claim here — nothing below is a measured outcome yet.

## The one-line story

LogiCola's vocabulary was written between 1985 and 2008. We rebuilt it
with instruments instead of taste — and the instruments kept
disagreeing with us, which is the interesting part.

## The numbers

- 87 → 123 adjectives, 52 → 77 nouns, 8 → 66 names, 68 → 106 verbs,
  20 → 41 places. Thirteen retirements across all pools, every one
  carrying its evidence in `content/lexicons.ts`.
- Set R (Informal Fallacies): 124 → 191 passages, none of it on
  production `main` yet.

## Four ways a word goes stale (the taxonomy the data forced on us)

1. **Rare** — `bashful` runs 0.59 per million against a pool median of
   9.39. But it is _rising_. Rare is not dated.
2. **Falling** — `courteous` is common-ish and declining (×0.77 since
   1950). Only rare **and** falling reliably marks a word as gone;
   `tactful` was the one 2008 adjective failing both, and it had been
   waved through on intuition.
3. **Sense drift** — `frivolous` scores respectably because it became a
   legal term: "frivolous lawsuits" outruns "frivolous person" 51.1 to
   3.1 per billion. The frequency is real; the sense a drill needs is
   dead. The same test _vindicated_ a word: `stressed` looks mediocre
   blended, but "feeling stressed" went ×592 while the emphasis sense
   sat flat.
4. **Superseded names** — `Kiev` is neither rare nor falling; it names
   a renamed entity, and a superseded exonym reads as taking a side.
   Frequency data is structurally blind to this class, so it gets a
   denylist swept over rendered output, not a measurement.

**A fifth instrument, found late (Malik, 2026-08-21): Word-of-the-Year
lists.** Merriam-Webster, Oxford, and the other dictionaries' WOTY picks
are curated records of exactly when a word became culturally
load-bearing — the recency signal Ngrams (ends 2019) and wordfreq
(~2021) structurally cannot see. Gaslighting (M-W 2022) entered Set Q as
a specimen precisely because the dictionary itself flagged the
definitional crisis. Use the lists both ways: as candidates for
additions, and as dated evidence when defending one.

A fifth blind spot, found later: for a _living person_, corpus
frequency measures how long they have been famous, not how famous they
are. Haaland scores 1.97 against Neymar's 3.47.

## The reversals (blog gold — we were wrong in public, twice)

- `comical` was retired on intuition and reinstated when Ngrams showed
  it nearly tripled since 1950.
- `frantic` is the mirror: both instruments said keep (3.33, rising
  2.64×). Retired anyway — not for the word's health but for the
  company it kept. The 2008 pool ran 16% lurid (hideous, disgusting,
  miserable, filthy…), so a student met one every six draws. Editorial
  judgment overrode the measurement, and the file says so at length so
  nobody "fixes" it back.

## The Gensler continuation argument (the essay's spine)

Across 24 Latinate/plain synonym pairs, the 2003 core holds the
Latinate word alone 17 times and the plain word alone once. But the
head of the 2008 list is eighteen plain monosyllables — eleven added
that year. **Gensler diagnosed his own register problem and started
fixing it.** The modern additions continue his revision; they don't
overrule him. This is the difference between renovating a building and
demolishing it, and it is the frame the whole essay should hang on.

## The prevalence audit (the twist ending)

Brysbaert et al.'s word-prevalence norms (220,000 respondents asked "do
you know this word?", split by age) reframed everything:

- **Students know the retired words.** `bashful` 99.0% among 18–23s,
  `courteous` 100%, `tactful` 97.7%. The retirements cannot be sold as
  comprehension fixes. What the norms _do_ show: prevalence predicts
  word-processing **time** over and above frequency — known-but-rare
  words are slower. Fluency and register, not comprehension. (Caveat
  Malik holds, and it belongs in the essay: the norms measure native
  speakers. For L2 students — a real slice of the audience — the
  Latinate words we kept may be the _easier_ ones: cortês, frívolo,
  medíocre. Both populations are real; no single instrument covers
  both.)
- **One retirement was a comprehension fix**: `druggist`, known by only
  58.1% of 18–23s (92% of over-60s). The biggest generation gap in the
  file.
- **`logician` is known by 74.4% of student-age respondents.** A
  quarter of incoming users don't know the app's central profession —
  learnable in one exposure, kept on purpose, worth a line.
- **`expat` (56% among 18–23s) was kept anyway** — Malik's call, made
  with the number on the table, partly on the L2 argument above.
  Honesty about this beats hiding it.

## Grammar bugs the reform surfaced (three, same species)

Every one is an unwritten 2008 constraint broken the first time the
vocabulary moved, and none was caught by a test — all three were caught
by reading rendered output, which is why the guards now read rendered
output too:

1. Hardcoded "a" — held for eighteen years because no 2008 pool entry
   starts with a vowel. Fixing it also repaired "is a accidental
   property", live across 290 Set J prompts on production today.
2. `$Best` — the 2008 parser read one character after `$`, so it
   shipped "beautifulest". The textbook, where no parser constrains
   Gensler, writes "nastiest". The original program is truth for structure; the
   book outranks it for English.
3. `gerund()` — "verb + ing", commented "e-final verbs aren't in the
   pool". True in 2008; "hesitateing" reached committed snapshots the
   day the pool moved. A fourth (`upseting`) was found _latent_ by
   auditing every inflected form against attestation before any
   template could render it.

## The restoration nobody knew was needed (added later on 2026-08-20)

Auditing Set A against the original program found a mis-port hiding in plain
sight: template \*12 was supposed to be _"Only/None but C people are
As"_ — the one idiom where the letters switch (`all A is C`), drilled at
double weight — and the port had quietly replaced it with an unreversed
All/Some sentence. Valid logic, wrong lesson. The signature §2.4 idiom,
and Gensler's own NFL-example hint for it, are now restored as template
\*23. The kicker: the hint teaching the rule ("you only switch the
parts around with 'only' and 'none but'") had survived the port and was
being shown for mistakes on _other_ templates — the app was explaining
a rule it never let students practice.

Same audit, same day: 23 of 69 wrong answers used to show a _blank_
feedback slot (no hint existed); all are now covered, two of the three
new hint texts traceable to Gensler (§2.4 and the eight-forms doctrine),
one honestly ours.

## "He or she" → singular they (for the blog, per Malik)

Gensler's harder templates read "No one is brave unless **he or she**
is lively" — 9.2% of all Set A questions carried the phrase. As of
2026-08-20 they render with singular **they** ("…unless they are
lively"). The change is grading-safe (no wff letter derives from a
pronoun) and style-guide-backed: APA, AP and Chicago all accept
singular they, and it is how 2026 students actually write. Worth a
paragraph in the essay because it is the smallest possible example of
the whole project's thesis: the logic is Gensler's, frozen; the
English around it is alive and maintained. Gensler's own §2.4 offers
pronoun-free variants ("No one is A without being B") if a purist ever
objects — the alternative to modernising was never "unchanged", it was
"differently changed".

## Lines worth keeping

- "The instruments kept disagreeing with us, which is how you know
  they're instruments and not mirrors."
- "Rare and dated are different failures, and intuition can't tell
  them apart. `tactful` fooled everyone; the measurement didn't blink."
- "We retired one word against the evidence and kept another against
  the evidence, and wrote both decisions down. A lexicon you can't
  argue with is a lexicon nobody maintains."
