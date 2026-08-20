# Handover — 2026-08-19/20 (Set R content, lexicon, two grammar bugs)

Written on branch `color-system-exploration`. Supersedes
`session-handover-2026-08-19.md`. One long thread: the content that
students actually read. Two live bugs fixed along the way, one of which
is shipping broken English in production right now.

## 1. Set R — 124 → 191 passages

Regenerated from `logicola-ghidra/tools/port_set_r.py`. **Edit the port
script, never `setR.data.ts`.** The port reproduces the committed file
byte-for-byte; that was not true when this session started and took a
repair (the `label` tier, the doc comments and the `*must*` emphasis had
all been hand-added and would have been destroyed on the next re-port).

Every hand-authored passage emits `// Added YYYY-MM-DD`; undated means
2008 source. Four rules govern new material, recorded on
`PASSAGE_ADDITIONS`:

1. Attributions to a named person are things they actually said, sourced
   in `why`. Gensler names Marx, Einstein and Nietzsche — all historical,
   every attribution true.
2. Nothing partisan. Political texture comes from the rotating tokens.
3. Mark the INFERENCE, never the subject.
4. **Present tense, real case in the note.** Past tense leaks the answer:
   "so its technology must HAVE worked" hands the student the conclusion's
   truth value before they judge the reasoning.

Three new tokens: `{p}/{P}/{l}` (politician, carrying their own label and
pronouns), `{f}` (footballer), `{s}/{S}` (affiliation group). The last has
exactly one consumer and a comment saying not to add a second — a rotating
group only works where the fallacy is about group MEMBERSHIP, not about
what the group believes. A straw man passage using it was built and
removed for that reason.

## 2. Lexicon — measured, not tasted

`content/lexicons.ts` keeps the 2008 arrays frozen as `*2008` and composes
live pools as (baseline − retired) + additions. Ten adjective
retirements, forty-two additions, each carrying its figure.

`frantic` is the tenth retirement and the only one the evidence argues
against — 3.33, rising 2.64×, no rarer than words we kept. Malik retired
it anyway on the ground the instruments cannot reach: not the word's
health but the cluster it sat in. Recorded at length in `lexicons.ts`,
because the `comical` case ran the other way and the Ngram figure alone
would invite a "fix". Its replacement, `stressed`, is the exact inverse
of the `frivolous` finding — the collocation test that condemned that
word vindicates this one ("feeling stressed" 0.1 → 70.7 per billion,
592×, while the emphasis sense sits flat at 0.91×).

`quick` closes a gap open since 1985: `slow` has always been in the pool
and its antonym never was. It also thins the worst letter crowding — 19
of 118 adjectives began with C and 13 with S, against one apiece for J,
K, Q and U, and the wff letter IS the adjective's initial, so that
lopsidedness is something a student sees.

**Two instruments, and they mostly agree.** Google Books Ngrams for
_trend_ (is it declining?), `wordfreq` for _current frequency_ across
subtitles, social media, news and books. Install: `pip3 install --user
wordfreq`. Ngrams JSON is curl-able:
`books.google.com/ngrams/json?content=W&year_start=1948&year_end=2019&corpus=en-2019`.

Four findings worth keeping:

- **"Dated" and "rare" are different failures.** `bashful` is rare (0.59/M
  against a 9.39 median) but _rising_; `courteous` is common-ish but
  falling. Only the combination reliably marks a word as fallen out of
  use, and `tactful` — waved through on intuition — was the one word
  failing both.
- **Sense drift is a third failure.** `frivolous` scores respectably but
  runs 51.1 per billion as "frivolous lawsuits" against 3.1 as "frivolous
  person". It is a legal term now. The same test flags `colorful` and
  `notorious`, but those were NOT acted on: the test undercounts
  adjectives that prefer a specific noun ("notorious criminal").
- **A fourth failure neither instrument can see.** The 2008 place catalog
  shipped `Kiev`. It is not rare and not falling — it names a _renamed
  entity_, and a superseded name reads to a student as taking a side
  rather than as dated. Frequency data is structurally blind to this, so
  the class gets a denylist (`SUPERSEDED_EXONYMS` in
  `content/generators.test.ts`) that sweeps rendered output across all six
  generators. Burma, Saigon and Turkey are deliberately excluded: each is
  still used by people making a considered choice, so pinning one form
  would encode a position instead of correcting an error.
- **The register finding, which is the real one.** Across 24
  Latinate/plain synonym pairs the 2003 core holds the Latinate word alone
  17 times and the plain word alone once. But the head of the 2008 list is
  eighteen plain monosyllables, eleven added that year. **Gensler
  diagnosed this himself and started fixing it**; today's additions
  continue his revision rather than overriding it.

## 3. Two grammar bugs, both live in production

**The indefinite article.** Templates hardcoded `a`. This worked for
eighteen years because the 2008 pools contain _no vowel-initial entries at
all_ — a constraint nobody had written down. `lib/grammar.ts` now decides
by sound ("an honest logician", "a university"). It also fixes a
**pre-existing** bug: Set J templates \*26 and \*29 pick from
{contingent, accidental} and {necessary, essential} into that hardcoded
`a`, shipping "is a accidental property" across 290 distinct prompts since
`e6b67fc`. Still live on `main`.

**The superlative.** `superlative()` now handles y→i and consonant
doubling. Twelve live adjectives — nine of them Gensler's — rendered as
"the most friendly biologist". Every form was checked against corpus data:
`shyest` (1.56) beats `shiest` (0.00); `cowardliest` and `scholarliest`
are both 0.00 and are excluded via `NO_INFLECTION`.

**Provenance, which settled whether this was faithful.** The 2008 engine's
parser reads one character after `$`, so `$Best` was `$B` + the literal
"est" — it shipped "beautifulest" (`logicola-ghidra` 0121b7d). Gensler's
_textbook_, where no parser constrains him, writes "nastiest" and
"biggest". So the engine's behaviour was a limitation, not a style, and
template \*5 was converted from its hardcoded "most" to `superlative()` on
that basis. **The binary is the source of truth for structure; the book
outranks it for English.**

Verified for the 2008 build only. The earliest binary in the ghidra repo
is 2003 and its `LC.FIL` does not yield templates to a strings dump — do
not repeat this as "since 1985".

## 4. Three undocumented constraints, now enforced

- `RESERVED_NAME_INITIALS` — x/y/z are bound variables in Sets J, L, N;
  `i` is "I" in Set A; `u` is "you" in Set L; `v` reads as ∨. Gensler's
  eight names avoid all seven. Zara, Zendaya, Yoda, Vader and Wolverine
  each cleared every other check and would have shipped.
- `RESERVED_VERB_INITIALS` — `O` is the deontic operator. `overlook`
  produced `O∼O{u}p`.
- **Term initials are NOT restricted**, and the reasoning is recorded
  because the obvious inference is wrong: A/E/I/O name the categorical
  forms, but Gensler's own `verbsA` emits `all C is E`, so he did not
  treat those as collisions. A restriction was written and reversed.

## 5. Also

- Set Q's four imperial thresholds now carry both units.
- `content/quiz-catalog.json`: NEW badge on both syllogistic drills.
- `docs/vocabulary-experiment.md` — the learning-science hypothesis, its
  measurement design, a power table (a 2pp effect is detectable in ~6
  weeks at current `question_answered` volume) and a reading list. It is
  labelled hypothesis, not finding, and says what would make the claim
  dishonest.

## 6. The afternoon: freshness, realms, a third grammar bug

**pickFresh (lib/rng.ts).** Uniform independent draws repeated a word
within a 3-question window in 18% of quizzes ("diabetic" caught in user
testing) and the same template back-to-back in ~half. `pickFresh`
redraws against a recent-window per pool (k = min(12, ⌊pool/2⌋)); all
165 draw sites across six generators now use it, templates included —
which makes the anti-adjacency an accidental interleaving upgrade
(Brunmair & Richter 2019, g = 0.42). After: both figures 0.0%,
permanent rendered-output guards in `content/generators.test.ts`. The
letter helpers pass REJECT PREDICATES, not filtered copies — a filtered
array is a new identity and silently disables the memory. In production
all quizzes share `Math.random` as the memory key, so freshness
persists across retries by design. Offline verified: pure client logic,
`pnpm build` + manifest clean.

**Realms.** `FANTASY_REALM` (lexicons) maps fictional words →
marvel | dc | westeros; Set A draws places per-franchise via
`placeFor`/`placeForNoun`. The noun rule is deliberately ASYMMETRIC —
fantasy nouns strict, real nouns free: "all bachelors in Essos" is a
joke, "all Lannisters in Minneapolis" is a glitch (Malik's call).
`Stark` is excluded from the house nouns: House Stark + Tony Stark +
the adjective, three realms in one string. Measured dosage: fantasy
words touch only 2–5% of questions; no cross-realm pair in 16k
questions; 300-seed coherence test is permanent.

**gerund() — the third grammar bug, same species as the first two.**
Sets L and N each had a private `verb + 'ing'` whose comment said
e-final verbs "aren't in the current pool". The modern verb layer broke
that the day it landed: "hesitateing" and "argueing" reached committed
snapshots. Now one shared `gerund()` in lib/grammar.ts (e-drop,
`bingeing` exceptions, CVC doubling, `GERUND_DOUBLES` for final-stress
polysyllables — "upsetting" was found _latent_ by auditing every
inflected form for wordfreq attestation). A capitalized inline site in
setL was the second consumer. End-to-end sweep test added.

## 7. The prevalence audit (Brysbaert, 62k lemmas, by age)

Downloaded from OSF (g4xrt); age-split file has an 18–23 sheet — the
student cohort. Findings, all in `lexicon-blog-material.md`:
`druggist` retirement vindicated (58% known young); the retired
adjectives are all ≥93% known young, so the mechanism is FLUENCY and
REGISTER, not comprehension — with Malik's standing L2 caveat (the
norms are native-speaker; Latinate words are cognates for Romance
speakers, so the two audiences invert). `expat` = 56% known young and
KEPT, twice affirmed; recorded in lexicons.ts. `logician` = 74% young.
Verb pools measured for the first time: clean, nothing under 96.6%.

## 8. Vocabulary round 2 (approved as a slate)

18 words with figures inline in lexicons.ts: relatable, toxic, chill,
mindful; founder, gamer, influencer; follow (verbsA); scroll, binge,
vent, procrastinate, meditate, commute (verbsB); ghost, troll, block,
mute (transitive). Plus house class-nouns Lannister, Targaryen, Avenger
(the `Canadian` precedent). Deontic renders are the payoff: "It's wrong
for you to scroll."

## 9. Set A: the mis-port, the expansion, the dead test

The exploration of Gensler's sources found template \*12 was a MIS-PORT:
2008's `*12` is "Only/None but $C people are $As" with the REVERSED
answer (the §2.4 letters-switch idiom, drilled at 2× weight), which the
port silently replaced with an unreversed All/Some sentence. Restored as
template23 with Gensler's NFL hint; the All/Some variant stays as a
deliberate LC3 quantifier-choice drill. The ghidra audit docs that
caused the mis-port are corrected in that repo.

Same audit: 23 of 69 wrong options rendered a BLANK feedback slot —
filled (two Gensler-sourced hint texts, one ours, classHint/
individualHint applied to the subject slot), pinned by a coverage guard.
"he or she" (9.2% of prompts) → singular they — and Gensler's own 2017
exercises use "they" (his pronoun arc: she 2008-help → he or she → they).
The article-sweep test contained a literal 0x08 for \b and had NEVER
matched; repaired, narrowed against wff-quoting hints, proven live.

Then the expansion (Malik-approved slate): \*24/\*25 complete the
contradictories quartet, \*26/\*27 the conditional bridge to Set J,
\*28 without-being (the one genuinely post-2008 idiom), \*29 verb-
predicate rephrasing (EASY; verbsB's first Set A consumer). Surface
rotations on \*17/\*19/\*20/\*21, including Every/Each — first
excluded over third-person -s conjugation, then reversed on Malik's push
when the 3sg rule turned out to be pluralize's own (+es after sibilants,
y→ies): verbThirdPerson in lib/grammar.ts, all 41 verbsB forms
attestation-checked, and lexicons.test.ts bars the four irregulars
(go/do/have/be) from ever entering a pool. Only "any" stays excluded —
it flips meaning under negation, Gensler's own reason — and then
\*31 gave "any" that template: bare "Any A is B" → all (the
some-misreading is the trap) vs "Not any As are B" → no, which moved out
of \*17's rotation to get its own distractors. \*30 ships the
predicate-first inversion in two streams: ten authored allusions
(Beatitudes, Shakespeare, house mottos, one Age-of-Discovery homage
marked invented) with per-item letters, and GENERATED aphorisms — a
curated benedictory fronted slot over substantivized pool adjectives
("Lucky are the poetic"), which settled "can't we generate them?" with
a yes-if-curated. Hard pool grew again with the Malik-approved fantasy trio: \*32
(mottos as content — the deep-personalization move: "Lannisters always
pay their debts" IS the categorical sentence, eight authored items
pinned wff-by-wff in the test), the 10% dosage guard (measured: A 7.3%,
J 3.9%, L 4.5%, N 1.6% — tripping it means deciding, not raising the
number), and the pre-armed pair-coherence guard across all six
generators. Hard pool: 21 distinct templates, 22 entries. The A/B
experiment arm (fantasy on/off) remains the un-picked item from that
proposal.

The 2026-08-21 round: mottos M2 ("No evil shall escape my sight" — the
oath BEGINS with its quantifier) and M3 ("Banner is always angry",
second singular term); the ambiguous-name channel extended with Miles,
Gwen, Diana, Clark, Logan, Alfred (untagged, dosage-free — Diana is the
route around the W-ban); Hulk tagged marvel. "With great power comes
great responsibility" was REJECTED on Malik's challenge and the
concession is recorded in the MOTTOS comment: the maxim is normative
(deontic, Set L material), and the modal "a hero can be anyone" family
is Set J material — superhero rhetoric runs on modality and obligation,
so categorical mottos are the rare, vetted case. Kamala excluded: one
word, two people, across realms (Set R's Harris). Dosage after: 7.0%.

Franchise round 2 (2026-08-21): mottos "Barry is the fastest man alive"
(the family's first x-is-y — a superlative definite description as a
catchphrase, new singDef form), "Everyone at the TVA is a variant", and
"Loki is burdened with glorious purpose"; `run` joined verbsB; nine
realm places followed the TAGGED roster (Arkham, Krypton, Smallville /
Knowhere, Sakaar, the TVA / Casterly Rock, Dragonstone, Braavos) as
REALM-MATCHED-ONLY — free-roaming templates keep the marquee eight, so
the dosage guard's headroom survives (measured after: 6.6%). Central
City, Kamar-Taj and Themyscira excluded: their characters are
ambiguous-channel, which never draws realm places. The freshness gap Malik
caught got the real fix (2026-08-21): quoted pool words now FEED the
freshness memory via noteUsed/isRecent in lib/rng.ts — echoes on motto
items, both directions, both pools (adjectives AND class nouns; the
surviving 'Avenger, Avenger' repeat found the noun half) — and the test
exemption was REMOVED, which is the proof. Knowhere lasted a day (Zipf
1.54, Malik: too obscure). Buick and Dodge retired from Set R's cars on
a SECOND retirement criterion — alive as marques, globally illegible —
replaced by BMW, Audi, Volvo, Ferrari; Mercedes and Lexus excluded
because "{d}s" demands a bare -s plural and "Mercedess" is not a word. template23 is listed 2× in hardTemplates per
Gensler's own weighting — under pickFresh recency the effective share is
~1.4×, not 2×. Evidence that Gensler CHOSE not to build these: his 2008
help teaches nearly all of them, his changelog (harrycola.com, 2008–2020)
never touches Set A, and his 24-slot selector arithmetic (`C:wz%12`,
`Cm:ww+12`) spent its last slot doubling only/none-but instead.

## 9b. Docs and artifact

`lexicon-blog-material.md` (essay raw material), `randomness-article.md`
(standalone draft), and the LogiCola Lexicon artifact regenerated from
live exports. `vocabulary-experiment.md` deliberately NOT updated with
the prevalence correction — Malik wants the L2 framing settled first.

## Open

- **None of this is in production.** `main` has no Set R at all, 87
  adjectives, 20 places, and both grammar bugs. The branch is ~78 commits
  ahead and carries the whole colour/scoring redesign — the content work
  is separable if it should ship sooner.
- ~~Verbs never measured~~ — closed by the prevalence audit (§7).
  `logician` stays the rarest word (2.13 Zipf, 74% known young) and stays
  in, which is the standing proof that frequency alone was never the test.
- `easygoing` (2.65) is now the rarest adjective in the pool, added by
  taste earlier in this same session.
- Set R has no places anywhere, unlike Set A.
- The essay drafted from all this is deferred until after the merge.
