# Does familiar vocabulary help students learn logic?

Status: **hypothesis, not a finding.** Written 2026-08-20, alongside the
lexicon modernisation. Nothing here has been measured yet. The point of
this document is to keep the claim honest until it has been.

## The claim, stated precisely

Weak form: replacing rare and dated words with common ones in the
substitution pools **does not hurt** learning.

Strong form: it **improves** performance on the target skill, because the
words are not the skill — a student translating "the most bashful
backpacker" into a wff spends working memory on `bashful` that should be
going to the form.

The strong form is what we would like to be true and what the marketing
would want to say. It is currently unevidenced.

## Why it is plausible

**Cognitive load theory (Sweller).** Total load is additive: intrinsic +
extraneous + germane. Linguistic complexity is a recognised source of
_extraneous_ load — it consumes working memory without contributing to
schema construction. Set A's job is building a schema for logical form;
every unfamiliar adjective is a tax on that.

This yields a **specific, falsifiable prediction**: the effect should be
_larger on the hard subsets than the easy ones_, because intrinsic load
is already higher there and there is less spare working memory. If an
effect appears equally in both, it is probably not cognitive load and we
should stop claiming it is.

**Mayer's personalization principle.** Learners do better with
conversational than formal style: 11 of 11 tests, median d = 1.11, and a
2025 meta-analysis over 181 studies reporting g = 0.70. Our shift from
Latinate to plain register is adjacent to this.

**But the fit is imperfect, and the essay must say so.** Mayer's
manipulations are mostly first- and second-person address ("your nose",
"you can see"), not Latinate-versus-plain word choice. Set A already uses
"I'm a…" and "You aren't…", so LogiCola may have been collecting that
effect since 1985 — our change is adjacent to the principle, not an
instance of it. And these are multimedia-lesson studies with transfer
tests, not drill exercises with per-question scoring. The literature
supports the _direction_. It does not license a claim about the _size_.

## Measurement design

Feasible with what is already built. The generators run client-side and
draw from pools; PostHog is wired; `question_answered` is instrumented
and unused (see `docs/stats.md`).

- **Assignment.** PostHog feature flag, split by session, choosing
  between the frozen 2008 pools (`baselines2008`) and the live ones. The
  two-layer structure in `content/lexicons.ts` exists precisely so both
  arms are available without branching the code.
- **Primary metric.** Per-question correctness from `question_answered`.
- **Secondary.** `quiz_completed` rate, retries, time-to-answer.
- **Pre-registered split.** Easy vs hard subsets, analysed separately.
  This is the test that distinguishes cognitive load from a general
  novelty or engagement effect.
- **Filter.** `properties.$host = 'logicola.org'`. A quarter of the
  events table is localhost and preview deploys.

## Power, at current traffic

`question_answered` ran 21,422 events in 24 days (~26,800/month).
Two-arm, 50/50, baseline p ≈ 0.60, 80% power, α = 0.05. The right-hand
column applies a design effect of 2 for clustering — questions within a
session are not independent observations.

| lift | n per arm | total  | months | months (clustered) |
| ---- | --------- | ------ | ------ | ------------------ |
| 5pp  | 1,470     | 2,941  | 0.1    | 0.2                |
| 3pp  | 4,129     | 8,257  | 0.3    | 0.6                |
| 2pp  | 9,335     | 18,670 | 0.7    | 1.4                |
| 1pp  | 37,513    | 75,025 | 2.8    | 5.6                |

So a 2-point effect is detectable in roughly six weeks. A 1-point effect
takes half a year and probably is not worth waiting for.

**Caveats on the power figures.** The design effect of 2 is a guess; if
intra-session correlation is high the true requirement is larger. The
baseline p = 0.60 is also a guess — measure it before committing, since
required n moves with it. And a null result at 2pp does not mean no
effect; it means no effect that size.

## What would make this dishonest

Attributing a traffic rise after launch to the vocabulary. Set R ships in
the same release and is an entire new drill set — it will move traffic on
its own, and there is no way to separate the two post hoc. We spent a day
writing passages about exactly this error; do not commit it in the
release notes.

## Why it matters commercially

If it holds, it is the strongest argument available for an instructor
switching from the classic version: not "it looks nicer" but "students
score better on the same exercises." That is a claim worth having
evidence for, and worth not making without it.

## Reading list

Ranked by how much each would change what we do next, not by importance
in the abstract. Chapter numbers given where a book is not worth reading
whole.

1. **Multimedia Learning (3rd ed.), ch. 13 — Richard E. Mayer.** _Book,
   one chapter, ~25pp._ The personalization principle in full, with the
   boundary conditions the summaries drop. Read it to find out precisely
   how far the Latinate→plain change sits from what Mayer actually
   manipulated — which is the weakest joint in the argument above.
2. **Cognitive load theory: research that teachers really need to
   understand — NSW CESE (2017).** _Report, free PDF, ~30pp._ The
   load-bearing theory, written for practitioners. This is the one that
   gives you the vocabulary to explain to a professor why unfamiliar
   words are a tax on the wrong thing.
3. **Trustworthy Online Controlled Experiments — Kohavi, Tang & Xu.**
   _Book, chs. 1–3 and 17._ We have the traffic to run this and every
   opportunity to run it badly. Ch. 17 is the pitfalls chapter; the
   clustering caveat in the power table above is exactly its territory.
4. **A meta-analysis of Mayer's multimedia learning research (2025).**
   _Paper._ The g = 0.70 figure, and more usefully where the principles
   stop holding. A drill is not a multimedia lesson; this is where you
   find out how much that matters.
   <https://www.sciencedirect.com/science/article/pii/S1747938X25000673>
5. **The Expertise Reversal Effect — Kalyuga, Ayres, Chandler & Sweller.**
   _Paper._ Predicts that scaffolding which helps novices can do nothing
   for — or actively hinder — advanced learners. Directly relevant: it is
   a second explanation for an easy/hard split, and would be mistaken for
   the cognitive-load story if we were not looking for it.

## Sources

- Sweller, cognitive load theory — intrinsic/extraneous/germane load are
  additive; linguistic complexity is extraneous.
- Mayer, personalization principle — _Multimedia Learning_, ch. 13.
- Meta-analysis of Mayer's principles across media types, 2025:
  <https://www.sciencedirect.com/science/article/pii/S1747938X25000673>
- NSW CESE, _Cognitive load theory: research that teachers really need to
  understand_ (2017) — the readable summary.
