# Draft — "Random is a feeling" (the repetition fix)

Article-length material, 2026-08-20. Can run standalone or fold into
the Acheron essay. Everything measured here is reproducible from the
tests in `content/generators.test.ts`.

## The bug report that wasn't a bug

In user testing, "diabetic" appeared twice within three questions. The
code was working exactly as designed: every draw was independent and
uniform, the statistical gold standard. That was the problem.

With 10 questions drawing from a 77-noun pool, the birthday paradox
does the rest: **some word repeated within a 3-question window in 18%
of quizzes** (measured over 2,000 generated quizzes; adjectives, drawn
more often, repeated somewhere in 29%). Every fifth quiz looked cheap —
not because the randomness was broken, but because it wasn't.

## Random is a feeling, not a distribution

People systematically read true randomness as broken. Kahneman and
Tversky called it belief in the law of small numbers: we expect short
sequences to look like the long-run distribution, so genuine
independence — with its streaks and repeats — reads as a rigged deck.
The canonical industry story is Spotify, which replaced its
statistically-correct shuffle after users insisted it wasn't random:
the same artist twice in a row was proof of a bug. Spotify's fix, like
Fisher–Yates before it and ours after it, was to ship _spread_ and
call it shuffle — because spread is what "random" means to a person.

So the generator now draws uniformly but refuses any word it has
handed out in the last k draws from that pool (k = min(12, half the
pool)). Same for the sentence _templates_ — the structures themselves
no longer repeat back-to-back, which user testing had also flagged.

After: word repeats within 3 questions, **18% → 0.0%**. Same template
consecutively, ~50% of quizzes → **0.0%**. Same seed still yields the
same quiz; determinism, offline mode and the snapshot tests are all
untouched. The whole mechanism is one function, `pickFresh` in
`lib/rng.ts`.

## The accidental learning-science upgrade

Here is the part we didn't design on purpose. Spreading templates apart
is called **interleaving** in the learning literature, and it is one of
the most robust effects cognitive psychology has to offer: a
meta-analysis of 59 studies (Brunmair & Richter, 2019, _Psychological
Bulletin_) puts it at g = 0.42 overall — blocked practice (AAABBB)
loses to interleaved practice (ABCACB) because switching forces the
learner to _discriminate between problem types_ instead of settling
into one procedure.

A translation drill is a discrimination task in exactly this sense: the
student's job is telling "only As are Bs" from "As are the only Bs".
When the same template repeats back-to-back, question n+1 inherits its
form from question n and the discrimination is free. Spread the
templates and every question re-asks "which form is this?" — which is
the skill being graded.

So one fix serves two masters that usually fight: the UX change (feel
less repetitive) and the pedagogy change (interleave problem types)
are, for once, the same change. We would be overclaiming to promise
g = 0.42 from template spreading alone — the meta-analysis studies
interleave _categories_ under deliberate manipulation, not adjacency in
a drill — but the direction is unambiguous and the mechanism is exactly
ours.

## What we'll watch (hypotheses, not claims)

Per the measurement rules in `vocabulary-experiment.md` — Set R ships in
the same release, so nothing below can be attributed post hoc:

- `question_answered` correctness should not _drop_ (interleaving
  famously feels harder while working better — if correctness dips
  slightly while completion holds, that is the literature's signature,
  not a regression).
- `quiz_completed` and retry rate — the perceived-quality channel.
- If it's ever worth isolating: the freshness window is one parameter,
  and a PostHog flag could A/B window=0 against window=12. Cheap to
  run, honest to report.

## Sources

- Brunmair & Richter (2019), "Similarity matters: A meta-analysis of
  interleaved learning and its moderators", _Psych. Bulletin_.
- Tversky & Kahneman (1971), "Belief in the law of small numbers".
- Rohrer & Taylor (2007) on interleaved mathematics practice.
- Spotify's shuffle redesign (Poláček, "How to shuffle songs?",
  Spotify Labs 2014) — the canonical perceived-randomness case study.
