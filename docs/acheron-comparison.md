# Acheron — four states of LogiCola, compared

For the release essay and professor conversations. Facts pinned from git
(2026-08-21): "Aug 2025" = commit 317c6a4; "deployed" = origin/main;
"Acheron" = the current working tree. Gensler 2008 = the decoded LCEXE
binary + shipped help.

|                       | Gensler 2008                   | LC3, Aug 2025               | Deployed (main)                                 | **Acheron**                                                           |
| --------------------- | ------------------------------ | --------------------------- | ----------------------------------------------- | --------------------------------------------------------------------- |
| Platform              | Windows desktop                | web + mobile                | web + mobile + offline                          | web + mobile + offline                                                |
| Drills                | 18 sets                        | 8 sets, static              | 12 drills, 6 generated                          | **13 drills** (+ Informal Fallacies)                                  |
| Set A questions       | infinite (generated)           | **101 fixed** (memorizable) | infinite                                        | infinite                                                              |
| Set A templates       | 23 (24 slots)                  | —                           | 23, **\*12 mis-ported**                         | **33**, mis-port restored (\*23) + 9 new lessons                      |
| Square of opposition  | 2 of 4 contradictories         | —                           | 2 of 4                                          | **all 4** (\*24/\*25)                                                 |
| Idioms: only/none-but | drilled at 2×                  | absent                      | **absent** (the mis-port)                       | restored at ~1.4× + "any" (\*31) + inversions (\*30)                  |
| Wrong-answer hints    | per-template (\*e block)       | minimal                     | 67% of options; **blank slots**                 | **100%**, guard-enforced                                              |
| Informal fallacies    | 124 passages                   | none                        | none                                            | **191 passages**, dated provenance                                    |
| Lexicon               | ~230 entries, frozen 2008      | same                        | same, minus nothing                             | **~560 live entries**, two-layer, evidence per word                   |
| Vocabulary method     | author's ear                   | untouched                   | untouched                                       | Ngrams + wordfreq + **Brysbaert prevalence** (student cohort)         |
| Grammar engine        | "beautifulest", hardcoded "a"  | inherited                   | **"a accidental" live** (290 prompts)           | articles by sound, superlatives, gerunds, 3sg — attestation-checked   |
| Repetition            | uniform random                 | fixed list                  | **18% of quizzes repeat a word in 3 questions** | 0.0% — freshness windows + template interleaving                      |
| Personalization       | student's own city in one hint | none                        | PostHog cities in places                        | cities + realm-coherent fantasy + **mottos as content**               |
| Register              | "he or she" (1985–2008)        | inherited                   | inherited                                       | **singular they** — matching Gensler's own 2017 exercises             |
| Pedagogy docs         | textbook                       | none                        | none                                            | vocabulary-experiment.md: hypothesis, power table, measurement design |
| Tests                 | none                           | minimal                     | snapshot-level                                  | **520**, incl. rendered-output guards                                 |

## Ten lines for a professor

1. Every drill is infinite and non-memorizable — no two students, and no
   two attempts, see the same quiz (Aug 2025's Set A was 101 fixed
   questions).
2. The signature hard idiom of syllogistic translation — _only / none
   but_, the one place the letters switch — was silently lost in the
   port and is restored, with Gensler's own NFL-example hint.
3. The square of opposition is now fully drilled: all four quantified
   forms and all four contradictories.
4. New lessons Gensler taught in the book but never drilled: the
   conditional bridge to quantificational logic, verb-predicate
   rephrasing, "no one is A without being B", the two faces of "any".
5. Every wrong answer now teaches: 100% hint coverage, most of the
   texts Gensler's own, each traceable to the 2008 binary or the
   textbook (and labelled when they're ours).
6. Informal Fallacies is an entirely new drill on the web: 191
   passages, every modern addition dated and sourced, political
   material balanced by construction and pinned by tests.
7. The vocabulary was rebuilt on evidence — word frequency, 70-year
   trend, and what 18–23-year-olds actually know — with every
   retirement and addition carrying its figures in the source.
8. Question order interleaves problem types (no template repeats
   back-to-back), aligning the drill with one of the most robust
   effects in learning science (Brunmair & Richter 2019, g = 0.42).
9. Grammar is now generated correctly — articles by sound, real
   superlatives and gerunds — fixing errors live in the classic port
   ("is a accidental property") and in Gensler's own 2008 engine
   ("beautifulest").
10. All of it is guarded by 520 automated tests, many of which read the
    rendered English the student sees — because that is where every
    historical bug lived.

## Honesty constraints for marketing (do not cross)

- Learning-outcome claims are HYPOTHESES until measured — the essay may
  claim direction (literature-backed), never size. Set R ships in the
  same release, so no post-hoc attribution of traffic or scores.
- "Since 1985" claims are verified for the 2008 build only.
- The prevalence data is native-speaker; the L2 story (Malik's caveat)
  cuts the other way and stays in any careful telling.
