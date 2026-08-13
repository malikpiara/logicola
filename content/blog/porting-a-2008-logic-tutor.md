---
title: 'Porting a 2008 logic tutor to the browser'
dek: 'LogiCola taught logic on Windows for decades. Bringing it to the web means translating the pedagogy, not just the exercises.'
date: '2026-07-28'
category: 'essays'
draft: true
---

Harry Gensler wrote LogiCola as the drill companion to his
_Introduction to Logic_, and for decades it did its job the same way:
you installed a small Windows program, picked a set, and practised until
the score said you were ready. Thousands of students learned formal
logic against that loop.

LogiCola 3 is our port of that loop to the browser. No installer, no
Windows requirement, nothing to configure — if you have a phone or a
laptop, you have LogiCola. But "port" is doing careful work in that
sentence, and this post is about what we mean by it.

## The exercises are the easy part

Transcribing questions is straightforward. The hard part is everything
around them: which answer counts as right, how hints escalate, how a
score accumulates, when a level unlocks. LogiCola's 2008 engine encoded
all of that in a compact internal language, and rather than approximate
it, we treat that engine as the specification. Each set's scoring
economy — the weights, the penalties, the thresholds — is derived from
the original, not re-invented. When LogiCola 3 says you've reached a
level, it means the same thing the classic program meant.

## Fidelity has a user

That standard isn't nostalgia. LogiCola is used in university courses,
and instructors calibrated years of teaching against how the original
behaved. A port that quietly regraded questions or reweighted scores
would break something invisible but real: the trust between the tool
and the course built around it.

## What the browser buys

Staying faithful on the inside is what lets us change the outside.
The web version works on the phone in your pocket, updates for everyone
the moment we ship, and meets modern accessibility standards — screen
readers, keyboard navigation, contrast — that a 2008 Windows binary
never could. The [classic LogiCola](https://harrycola.com/lc/index.htm)
remains available, and we think of the two as the same curriculum
wearing different clothes.

The goal is simple to state: keep what made LogiCola work, and remove
every reason not to use it.
