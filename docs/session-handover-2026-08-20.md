# Handover — 2026-08-19/20 (Set R content, lexicon, two grammar bugs)

Written on branch `color-system-exploration`. Supersedes
`session-handover-2026-08-19.md`. One long thread: the content that
students actually read. Two live bugs fixed along the way, one of which
is shipping broken English in production right now.

## 1. Set R — 124 → 191 passages

Regenerated from the port. **Edit the port
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
live pools as (baseline − retired) + additions. Nine adjective
retirements, forty additions, each carrying its figure.

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
"est" — it shipped "beautifulest" (confirmed in the original program). Gensler's
_textbook_, where no parser constrains him, writes "nastiest" and
"biggest". So the engine's behaviour was a limitation, not a style, and
template \*5 was converted from its hardcoded "most" to `superlative()` on
that basis. **The original program is the source of truth for structure; the book
outranks it for English.**

Verified for the 2008 build only. The earliest binary
is 2003 and its templates are not recoverable — do
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

## Open

- **None of this is in production.** `main` has no Set R at all, 87
  adjectives, 20 places, and both grammar bugs. The branch is ~78 commits
  ahead and carries the whole colour/scoring redesign — the content work
  is separable if it should ship sooner.
- Nouns, verbs and names were never measured the way adjectives were.
  `logician` is the rarest word in the lexicon at 2.13 and is perfectly
  right for a logic app, which is an argument that frequency alone was
  never the test.
- `easygoing` (2.65) is now the rarest adjective in the pool, added by
  taste earlier in this same session.
- Set R has no places anywhere, unlike Set A.
- The essay drafted from all this is deferred until after the merge.
