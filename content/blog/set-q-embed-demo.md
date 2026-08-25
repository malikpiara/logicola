---
title: 'Quiz embeds: the authoring reference'
dek: 'How to put a drill inside a blog post — kept as a draft, never published.'
date: '2026-08-24'
category: 'product'
draft: true
---

This draft documents the quiz-embed marker for future announcement
posts (built 2026-08-24 for the Set Q announcement; see
`components/blog/quizEmbed.tsx` for the registry).

Place the marker anywhere in the body. The inner link is what RSS
readers and unknown-key fallbacks render; on the site, the page
replaces the whole div with the live drill island:

<div data-quiz-embed="informal-definitions" data-count="3"><a href="/informal/definitions/quiz">Try the Set Q drill →</a></div>

`data-count` caps the sample at that many questions (default 3,
max 10). Available embed keys live in the `EMBEDS` registry —
one dynamic chunk per key, so a bank ships only on posts that
use it.
