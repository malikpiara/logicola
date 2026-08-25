---
title: 'Every set now loads only itself'
date: '2026-08-10'
kind: 'improvement'
platforms: ['web']
draft: true
---

Each exercise set's question generator now ships in its own chunk.
Opening one quiz used to download the generators for _all_ sets
(~204 KB of JavaScript); now you get exactly the set you asked for.
Faster first question, especially on phones and campus Wi-Fi.
