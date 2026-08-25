# Site copy review — 2026-08-24

Every user-facing string on the site, read against Gensler's own
register. The standard and its primary-source quotations live in
[copy-voice-gensler.md](copy-voice-gensler.md) — recovered from the
2008 program itself, not inferred from his books.

Malik's prompt: "will reach you when it ships" doesn't sound like
language written for professors or students. It doesn't, and it turned
out not to be one line.

---

## The benchmark is already on the site

The end screen's praise strings — **Logic whiz!** · **A logic brain!**
· **Sharp student!** · **Pretty smart!** · **What a brain!** — are
Gensler's, verbatim, confirmed byte-for-byte in the 2008 binary. They
are the most authentically-his copy we ship, and they show the
register: short, warm, unexcited, a bit old-fashioned, addressed to a
person. Everything below is measured against them.

---

## 1. "Ships" is systemic, not a slip — FIX

Four user-facing places tell a student that writing "ships". A
professor deciding whether to assign this reads a software-release
metaphor; Gensler's own release notes say _Added_, _Fixed_,
_Improved_, and his program says a thing "is here", never that it
shipped.

| Where                                              | Now                                                                                      | Proposed                                                                  |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `components/footer.tsx:224`                        | "…the occasional essay — straight to your inbox when they ship."                         | "…the occasional essay, sent when there's something new."                 |
| `components/marketing/newsletterForm.tsx:97`       | "You're on the list — we'll email you when something worth knowing ships."               | "You're on the list. We'll write when there's something worth your time." |
| `app/(marketing)/release-notes/page.tsx:120`       | "No release notes yet — subscribe above and the first one will reach you when it ships." | "Nothing here yet. Subscribe above and you'll hear about the first one."  |
| `app/(marketing)/release-notes/page.tsx:22` (meta) | "…every feature, improvement and fix as it ships, on one page."                          | "…every feature, improvement and fix, on one page."                       |

## 2. The offline page is the most developer-facing text we have — FIX

`app/offline/page.tsx:8` currently says:

> Published quizzes remain available after the app has been installed
> and synced while online. This page appears when you open a route
> that is not part of the offline quiz bundle.

"Route" and "bundle" are not words a logic student has for a website,
and "published quizzes" is our internal noun. Gensler's equivalent
sentence would say what happened and what to do:

> The exercises you've already opened still work without a
> connection. This page isn't one of them — reconnect and reload, and
> it will come back.

## 3. The masthead argues; Gensler instructs — MALIK'S CALL

`components/landing/exercisesCatalog.tsx:71-73`:

> **Master Formal Logic** — "Generate endless, error-free exercises
> with smart step-by-step hints. Works offline, directly in your
> browser."

Three things sit outside the register. _Master_ is a promise about the
reader's outcome. _Generate_ and _smart_ describe our machinery.
_Error-free_ is a claim about our software's quality that an
instructor has no way to check and no reason to trust on assertion —
and it is the one claim on the page that a single wrong answer key
would falsify. His own framing was always the subject, not the tool
("Syllogistic logic studies arguments whose validity depends on…").

Two directions, both his register, for Malik to pick between:

- **Instructional:** "Practise the logic in Gensler's _Introduction to
  Logic_." / "Thirteen drills, from syllogisms to informal fallacies.
  Free, and they work offline."
- **Plain-offer:** "Logic exercises that check your work." / "The
  drills from Gensler's _Introduction to Logic_, rebuilt for the
  browser — with his hints when you get one wrong."

I'd take the second: "check your work" is the actual product, and
naming the hints as _his_ is the strongest thing we can say.

## 4. Two errors — FIX

- `app/(site)/progress/page.tsx:88` — heading reads **"Migraton to
  Logicola 3"** (missing an _i_). Page is noindexed, so it's cheap to
  fix and embarrassing to leave.
- `components/footer.tsx:406` — copyright reads **"Logicola"** where
  the site brands as **"LogiCola"** everywhere else, including two
  lines above it.

## 5. Copy-paste residue in set headers — FIX

`content/sets/setN.ts:9`, `setJ.ts:15`, `setL.ts:8` carry the
set-level header **"What is wrong with this definition?"** — Set Q's
question — on three _translation_ sets. Every subset overrides it, so
no student sees it today; it is a trap for whoever adds the next
subset and forgets to override.

## 6. Smaller register notes — MALIK'S CALL

- **"Ready for a challenge?"** (`startScreen.tsx:153`) and **"Test
  your knowledge on this chapter and see how much you already know!"**
  (`:78`) are both fallbacks that only appear when a set supplies no
  title or description. They are quiz-app register rather than his.
  His start-of-exercise voice was an instruction: "Highlight the
  exercise set you want to do."
- **"Hurray! Keep going!"** / **"Oh no! Try again."**
  (`endScreen.tsx:111-112`) — "Hurray" and "Oh no" are more animated
  than anything in his vocabulary; his equivalents are
  "Congratulations on completing the exercise!" and "Sorry, try
  again." The second is worth adopting verbatim.
- **FAQ** reads well and sounds like a person, which is right. One
  factual note: it says "LogiCola is open source" twice — true again
  under AGPL, and it would have been false for the few hours the
  project sat on PolyForm.
- **`app/(site)/syllogistic/page.tsx:33-38`** is the best copy on the
  site — because it is Gensler's, near-verbatim from the help screens.
  Treat it as the model.

---

## What I'd change without asking, and what I wouldn't

**Apply now:** §1 (ships), §2 (offline), §4 (errors), §5 (residue).
These are register mistakes and outright bugs, and none of them
touches voice-level decisions.

**Malik's call:** §3 (masthead) and §6 (start/end screens). Those are
the brand's voice, and the headline in particular is a positioning
decision, not a copy edit.
