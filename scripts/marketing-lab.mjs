/**
 * Builds docs/marketing-lab.html — the blog + release-notes design lab.
 *
 * All three screens (blog index, blog post, release notes) render LIVE in
 * the browser from one set of controls; the generators and colour tables
 * are observed VERBATIM from docs/brand-lab.html at build time — the
 * same hand-port Malik's pins were judged on — and the clips come from
 * lib/pixel.ts via direct import (Node strips the types). If this lab and
 * the brand lab ever disagree, the brand lab wins.
 *
 * Decided so far (2026-08-13/14):
 *  - nav always shares the scheme ground; hero has NO card (the pattern's
 *    clearing is the panel);
 *  - subscribe control is one wide box with the button embedded right;
 *  - the gem silhouette (NewBadge) is app-only — marketing kind labels
 *    are square "abbreviation box" chips, emphasis by fill weight;
 *  - release categories are user-meaningful (New Feature / Improvement ×
 *    Web / Mobile), never internal subsystem names;
 *  - entry type, chips and dash separators always take the scheme ink;
 *    the content ground is an open dial (white vs scheme).
 *
 *   node --no-warnings scripts/marketing-lab.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pixel = await import(pathToFileURL(path.join(ROOT, 'lib/pixel.ts')));
const { spriteClip, ringBand } = pixel;

/* ---- clips (lib/pixel.ts) ------------------------------------------------ */

const SPRITE = spriteClip(0); // the app's pill silhouette, R=24 u=4
// 2px ring on the sprite silhouette, as the app draws it: an evenodd band
// painted on the wrapper's pseudo-element (docs/pixel-ui.md).
const RING_BAND = ringBand('sprite', 2);

/* ---- the wordmark -------------------------------------------------------- */

const markSrc = await fs.readFile(
  `${ROOT}/public/logicola-wordmark.svg`,
  'utf8'
);
const MARK_PATHS = [
  ...markSrc.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"/g),
].map((m) => [/^#f/i.test(m[2]) ? 'w' : 'g', m[1]]);
if (MARK_PATHS.length !== 16)
  throw new Error('wordmark parse: ' + MARK_PATHS.length);

/* ---- generators, verbatim from the brand lab ----------------------------- */

const labSrc = await fs.readFile(`${ROOT}/docs/brand-lab.html`, 'utf8');
const genStart = labSrc.indexOf('function mulberry32');
const genEndMark = labSrc.indexOf('3 · THE PLATFORMS');
if (genStart < 0 || genEndMark < 0)
  throw new Error('brand-lab.html extraction anchors missing');
let genSrc = labSrc.slice(genStart, genEndMark);
genSrc = genSrc.slice(0, genSrc.lastIndexOf('}') + 1); // through poolFor()

/* ---- content (mirrors content/blog + content/releases) ------------------- */

const POSTS = [
  {
    slug: 'the-new-logicola',
    title: 'The new LogiCola',
    dek: 'A colour system that gives every exercise set its own character, a scored run that keeps you honest, and drills that finally feel at home on your phone.',
    date: 'Aug 13, 2026',
    author: 'Malik Piara',
    category: 'Announcements',
  },
  {
    slug: 'set-r-informal-fallacies',
    title: 'Set R: Informal Fallacies',
    dek: 'A new exercise set on the ways an argument goes wrong — and the first to use multi-option questions.',
    date: 'Jul 15, 2026',
    author: 'Malik Piara',
    category: 'Product update',
  },
  {
    slug: 'introducing-logicola-3',
    title: 'Introducing LogiCola 3',
    dek: 'A brand new, open-source version of LogiCola — one that works everywhere. On Windows. On Mac. On Chromebooks. On your phone.',
    date: 'May 8, 2024',
    author: 'Malik Piara',
    category: 'Announcements',
    // Relative to docs/ — the app uses /blog/introducing-logicola-3/….
    cover:
      '../public/blog/introducing-logicola-3/street-fighter-evolution.jpeg',
  },
];

const RELEASES = [
  {
    title: 'Scored runs hit harder, fairer',
    date: 'Aug 12, 2026',
    cats: [{ t: 'Improvement' }, { t: 'Web' }, { t: 'Mobile' }],
    body: `<p>Two tuning passes on the scored run:</p><ul><li>The progress bar now <strong>flashes on a miss</strong>, so the cost of a wrong answer registers the moment it happens.</li><li>The run deficit is now <strong>bounded</strong> — a bad stretch can't dig a hole so deep that finishing the run stops feeling worthwhile.</li></ul>`,
  },
  {
    title: 'Every set now loads only itself',
    date: 'Aug 10, 2026',
    cats: [{ t: 'Improvement' }, { t: 'Web' }],
    body: `<p>Each exercise set's question generator now ships in its own chunk. Opening one quiz used to download the generators for <em>all</em> sets (~204&nbsp;KB of JavaScript); now you get exactly the set you asked for. Faster first question, especially on phones and campus Wi-Fi.</p>`,
  },
  {
    title: 'Level 5 unlocked',
    date: 'Aug 9, 2026',
    cats: [{ t: 'New Feature', solid: true }, { t: 'Web' }],
    body: `<p>The score ladder now goes to level 5, matching the classic program's top rank. The level dial stepped back from the quiz screen to keep the question front and centre — your level is still tracked, and the end screen tells you where you stand.</p>`,
  },
  {
    title: 'The redesign lands: a colour system per set',
    date: 'Aug 8, 2026',
    cats: [{ t: 'New Feature', solid: true }, { t: 'Web' }],
    body: `<p>The quiz screens picked up the new design language:</p><ul><li><strong>A palette per exercise set</strong> — each set gets its own pale surface and dark ink, derived in OKLCH and contrast-checked for WCAG.</li><li><strong>The pixel treatment</strong> — icons, badges and corners follow a bitmap grammar: straight edges stay straight, only curves rasterise.</li></ul>`,
  },
  {
    title: 'Better on your phone',
    date: 'Aug 8, 2026',
    cats: [{ t: 'Improvement' }, { t: 'Mobile' }],
    body: `<p>A round of fixes from testing on real devices: the installed app now draws <strong>edge to edge</strong>, and the Android status and navigation bars take on the current set's surface colour.</p>`,
  },
];

/* ---- the client ---------------------------------------------------------- */

// Authored as joined lines (no backticks) so it can be interpolated into
// the page template safely.
const CLIENT = [
  'const MARK_PATHS = ' + JSON.stringify(MARK_PATHS) + ';',
  'const SPRITE_CLIP = ' + JSON.stringify(SPRITE) + ';',
  'const POSTS = ' + JSON.stringify(POSTS) + ';',
  'const RELEASES = ' + JSON.stringify(RELEASES) + ';',
  'const HERO_W = 1200, HERO_H = 460;',
  '// Decided: no card — the clearing is the panel.',
  'const CLEARING = { x: 200, y: 80, w: 800, h: 300, r: 28 };',
  '',
  'function latticeOffset(w, h, scale) {',
  '  const t = 62 * scale;',
  '  const span = (len) => Math.ceil(len / t) * t + t;',
  '  return { ox: -(span(w) - w) / 2, oy: -(span(h) - h) / 2 };',
  '}',
  '',
  'function slugSeed(slug) {',
  '  let a = 7;',
  '  for (const ch of slug) a = (a * 31 + ch.charCodeAt(0)) | 0;',
  '  return (a >>> 0) % 100;',
  '}',
  '',
  'function markSvg(height, body, knock) {',
  '  const k = height / 190;',
  '  const w = Math.round(265 * k);',
  '  let out = \'<svg xmlns="http://www.w3.org/2000/svg" width="\' + w + \'" height="\' + height + \'" viewBox="0 0 265 190" style="display:block">\';',
  '  for (const p of MARK_PATHS) {',
  "    out += '<path d=\"' + p[1] + '\" fill=\"' + (p[0] === 'g' ? body : knock) + '\"/>';",
  '  }',
  "  return out + '</svg>';",
  '}',
  '',
  'const state = { scheme: "brandInk", pattern: "camo-giant", pool: "wide", scale: 1.94, seed: 99, rate: 75, form: "pill", content: "white" };',
  '',
  '// The pinned recipes (brand lab, 2026-08-13).',
  'const PRESETS = [',
  '  { label: "Lean · Brand inverted · camo XL", s: { scheme: "brandInk", pattern: "camo-giant", pool: "wide", scale: 1.94, seed: 99, rate: 75 } },',
  '  { label: "Pin · Brand cream · Everything", s: { scheme: "brand", pattern: "quilt", pool: "wide", scale: 2.08, seed: 7, rate: 55 } },',
  '  { label: "Pin · Set L · Sets full", s: { scheme: "setL", pattern: "quilt", pool: "setsMix", scale: 2.25, seed: 45, rate: 75 } },',
  '  { label: "Pin · Brand cream · Sets surfaces", s: { scheme: "brand", pattern: "quilt", pool: "sets", scale: 2.25, seed: 28, rate: 75 } },',
  '  { label: "Pin · Set N · camo XL", s: { scheme: "setN", pattern: "camo-giant", pool: "wide", scale: 2.6, seed: 53, rate: 55 } },',
  '  { label: "Pin · Set Q · camo XL", s: { scheme: "setQ", pattern: "camo-giant", pool: "wide", scale: 2.6, seed: 53, rate: 55 } },',
  '  { label: "Original · Sets full", s: { scheme: "brandOriginal", pattern: "quilt", pool: "setsMix", scale: 2.25, seed: 45, rate: 75 } },',
  '];',
  '',
  'const SCHEME_ORDER = ["brand", "brandInk", "brandMint", "brandOriginal", "setL", "setN", "setQ", "setC", "setA", "setJ", "setR"];',
  'const PATTERNS = [ { id: "quilt", label: "Quilt · pixel" }, { id: "camo-giant", label: "Camo · XL" } ];',
  'const POOL_OPTS = [',
  '  { id: "setsMix", label: "Sets · full" },',
  '  { id: "sets", label: "Sets · surfaces" },',
  '  { id: "surfaces", label: "Set surfaces" },',
  '  { id: "accents", label: "Shipped accents" },',
  '  { id: "inks", label: "Shipped inks" },',
  '  { id: "both", label: "Accents + inks" },',
  '  { id: "wide", label: "Everything" },',
  '  { id: "mono", label: "Mono" },',
  ']; ',
  'const FORM_OPTS = [',
  '  { id: "solid", label: "White · hairline" },',
  '  { id: "outline", label: "Ink outline" },',
  '  { id: "pill", label: "Answer pill" },',
  '  { id: "dash", label: "Pixel dash" },',
  '  { id: "blank", label: "Fill-in blank" },',
  '];',
  'const CONTENT_OPTS = [',
  '  { id: "white", label: "White" },',
  '  { id: "scheme", label: "Scheme ground" },',
  '];',
  '',
  'function btnColors(s) {',
  '  return { bg: s.ink, fg: s.type && s.type !== s.ink ? s.type : s.ground };',
  '}',
  '',
  '// In-post quiz widget (lab mock of the native QuizEmbed). The real one',
  '// reuses useQuizState + a client-side dynamic generator map; this mock',
  '// only demonstrates placement, materials and the interaction feel.',
  'const EMBED_Q = {',
  '  set: "Set R \\u00b7 Informal Fallacies",',
  '  prompt: "\\u201cPoliticians have been promising better schools for years, but my opponent \\u2014 who, remember, didn\\u2019t even grow up here \\u2014 now claims her plan will work. Everyone in this town knows it won\\u2019t.\\u201d",',
  '  ask: "Which fallacies appear? Select every one.",',
  '  options: [',
  '    { t: "Ad hominem", ok: true },',
  '    { t: "Appeal to the people", ok: true },',
  '    { t: "Straw man", ok: false },',
  '    { t: "Appeal to authority", ok: false },',
  '  ],',
  '};',
  'let embedSel = [];',
  'let embedChecked = false;',
  '',
  'function embedHtml(s, btn) {',
  '  const onWhite = state.content === "white";',
  '  const bg = onWhite ? s.ground : "#ffffff";',
  '  let out = \'<aside class="qe" style="background:\' + bg + \'">\' +',
  '    \'<p class="chiprow" style="margin-top:0"><span class="hl-chip hl-chip-new">Try it</span>\' +',
  '    \'<span class="qe-set" style="color:\' + s.type + \'">\' + EMBED_Q.set + "</span></p>" +',
  '    \'<p class="qe-prompt" style="color:\' + s.type + \'">\' + EMBED_Q.prompt + "</p>" +',
  '    \'<p class="qe-ask" style="color:\' + s.type + \'">\' + EMBED_Q.ask + "</p>";',
  '  EMBED_Q.options.forEach(function (o, i) {',
  '    const sel = embedSel.indexOf(i) >= 0;',
  '    let inner;',
  '    if (embedChecked && o.ok) {',
  '      inner = \'<span class="qe-opt" style="background:\' + s.ink + \';color:\' + bg + \'">\' + o.t + "</span>";',
  '    } else if (embedChecked && sel && !o.ok) {',
  '      inner = \'<span class="qe-opt" style="background:#fff;color:\' + s.type + \';opacity:.45;text-decoration:line-through">\' + o.t + "</span>";',
  '    } else if (sel) {',
  '      inner = \'<span class="qe-optwrap" style="color:\' + s.ink + \'"><span class="qe-opt" style="background:#fff;color:\' + s.type + \'">\' + o.t + "</span></span>";',
  '    } else {',
  "      inner = '<span class=\"qe-opt\" style=\"background:color-mix(in srgb, ' + s.ink + ' 14%, ' + bg + ');color:' + s.type + '\">' + o.t + \"</span>\";",
  '    }',
  '    out += \'<div class="qe-row" data-i="\' + i + \'">\' + inner + "</div>";',
  '  });',
  '  if (!embedChecked) {',
  '    out += \'<p class="qe-actions"><button type="button" id="qe-check" class="qe-btn" style="background:\' + btn.bg + \';color:\' + btn.fg + \'">Check answer</button></p>\';',
  '  } else {',
  '    const right = EMBED_Q.options.every(function (o, i) { return o.ok === (embedSel.indexOf(i) >= 0); });',
  '    out += \'<p class="qe-verdict" style="color:\' + s.type + \'">\' +',
  '      (right ? "Correct \\u2014 both fallacies caught." : "Not quite \\u2014 it attacks the opponent (ad hominem) and leans on \\u201ceveryone knows\\u201d (appeal to the people).") +',
  '      "</p>" +',
  '      \'<p class="qe-actions"><a id="qe-again" class="qe-link" style="color:\' + s.type + \'">Try again</a>\' +',
  '      \'<a class="qe-link qe-cta" style="color:\' + s.type + \'">Keep practising Set R \\u2192</a></p>\';',
  '  }',
  '  out += \'<p class="qe-note">Lab mock \\u2014 the shipped widget draws questions from the set\\u2019s own generator.</p></aside>\';',
  '  return out;',
  '}',
  '',
  'function wireEmbed() {',
  '  for (const row of document.querySelectorAll(".qe-row")) {',
  '    row.onclick = function () {',
  '      if (embedChecked) return;',
  '      const i = parseInt(row.dataset.i, 10);',
  '      const at = embedSel.indexOf(i);',
  '      if (at >= 0) embedSel.splice(at, 1); else embedSel.push(i);',
  '      render();',
  '    };',
  '  }',
  '  const check = document.getElementById("qe-check");',
  '  if (check) check.onclick = function () { embedChecked = true; render(); };',
  '  const again = document.getElementById("qe-again");',
  '  if (again) again.onclick = function () { embedChecked = false; embedSel = []; render(); };',
  '}',
  '',
  '// Post art: the real cover image when the post has one, generated',
  '// pattern art otherwise.',
  'function postArt(p, w, h, cls) {',
  '  if (p.cover) {',
  '    return \'<div class="art \' + cls + \'"><img src="\' + p.cover + \'" alt="" style="display:block;width:100%;height:100%;object-fit:cover"></div>\';',
  '  }',
  '  return \'<div class="art \' + cls + \'">\' + fieldSvg(w, h, { seedOffset: slugSeed(p.slug), scaleMul: cls === "art-hero" ? 0.9 : 0.8 }) + "</div>";',
  '',
  '}',
  '',
  '// A pattern field driven by the global recipe. scaleMul lets smaller',
  '// canvases (cards, bands) take proportionally smaller cells — the same',
  "// move as the LinkedIn cover's 0.6 multiplier.",
  'function fieldSvg(w, h, opts) {',
  '  opts = opts || {};',
  '  const s = SCHEMES[state.scheme];',
  '  const pool = poolFor(state.scheme, state.pool);',
  '  const sc = state.scale * (opts.scaleMul || 1);',
  '  const seed = (state.seed + (opts.seedOffset || 0)) % 100;',
  '  const off = latticeOffset(w, h, sc);',
  '  const clear = opts.clear',
  '    ? { x: opts.clear.x - off.ox, y: opts.clear.y - off.oy, w: opts.clear.w, h: opts.clear.h, r: opts.clear.r }',
  '    : null;',
  '  const body = patternBody(state.pattern, { w: w - off.ox * 2, h: h - off.oy * 2, ink: s.ink, pool: pool, scale: sc, seed: seed, clear: clear, rate: state.rate / 100 });',
  '  return \'<svg xmlns="http://www.w3.org/2000/svg" width="\' + w + \'" height="\' + h + \'" viewBox="0 0 \' + w + \' \' + h + \'" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:100%">\' +',
  "    '<rect width=\"' + w + '\" height=\"' + h + '\" fill=\"' + s.ground + '\"/>' +",
  "    '<g transform=\"translate(' + off.ox + ' ' + off.oy + ')\">' + body + '</g></svg>';",
  '}',
  '',
  'function chip(label, solid) {',
  '  return \'<span class="hl-chip\' + (solid ? " hl-chip-new" : "") + \'">\' + label + "</span>";',
  '}',
  '',
  '// Form treatments (see FORM_OPTS). Each is a different answer to "what',
  '// does an input slot look like in this grammar".',
  'function subscribeHtml(s, btn, maxW) {',
  '  var mw = "max-width:" + (maxW || "480px") + ";";',
  "  var btnHtml = '<span class=\"subwide-btn\" style=\"background:' + btn.bg + ';color:' + btn.fg + '\">Subscribe</span>';",
  '  if (state.form === "pill") {',
  "    return '<div class=\"subwide-wrap\" style=\"' + mw + 'color:' + s.ink + '\">' +",
  '      \'<div class="subwide" style="background:#fff;border:none;clip-path:\' + SPRITE_CLIP + \'">\' +',
  '      \'<span class="subwide-text">you@university.edu</span>\' + btnHtml + "</div></div>";',
  '  }',
  '  if (state.form === "blank") {',
  '    return \'<div class="subwide" style="\' + mw + \'background:transparent;border:none;padding:0;gap:16px">\' +',
  "      '<span class=\"subwide-text\" style=\"border-bottom:2px solid ' + s.ink + ';padding:12px 2px 12px 4px;color:' + s.type + ';opacity:.72\">you@university.edu</span>' +",
  '      btnHtml + "</div>";',
  '  }',
  '  var box = mw;',
  '  var text = "";',
  '  if (state.form === "solid") {',
  '    box += "background:#fff;border:1.5px solid #9c9c90";',
  '  } else if (state.form === "outline") {',
  '    box += "background:transparent;border:2px solid " + s.ink;',
  '    text = "color:" + s.type + ";opacity:.75";',
  '  } else {',
  '    box += "background:transparent;border:none;padding:8px 8px 8px 18px;" +',
  '      "background-image:" +',
  '      "repeating-linear-gradient(90deg," + s.ink + " 0 10px,transparent 10px 20px)," +',
  '      "repeating-linear-gradient(90deg," + s.ink + " 0 10px,transparent 10px 20px)," +',
  '      "repeating-linear-gradient(180deg," + s.ink + " 0 10px,transparent 10px 20px)," +',
  '      "repeating-linear-gradient(180deg," + s.ink + " 0 10px,transparent 10px 20px);" +',
  '      "background-size:100% 2px,100% 2px,2px 100%,2px 100%;" +',
  '      "background-position:0 0,0 100%,0 0,100% 0;background-repeat:no-repeat";',
  '    text = "color:" + s.type + ";opacity:.75";',
  '  }',
  '  return \'<div class="subwide" style="\' + box + \'">\' +',
  '    \'<span class="subwide-text" style="\' + text + \'">you@university.edu</span>\' + btnHtml + "</div>";',
  '}',
  '',
  '// The nav shares the ground of the surface it sits ON: the scheme',
  '// ground over the release-notes hero field, the content ground on the',
  '// blog pages (white nav on white content — Malik, 2026-08-14).',
  'function navHtml(s, btn, active, bg) {',
  '  const blogOn = active === "blog";',
  '  const link = function (label, on) {',
  '    if (on) return \'<a class="on" style="color:\' + s.type + \';box-shadow:0 2px 0 \' + s.ink + \'">\' + label + "</a>";',
  '    return "<a>" + label + "</a>";',
  '  };',
  '  return \'<header class="nav" style="background:\' + bg + \'">\' +',
  '    \'<div class="nav-mark">\' + markSvg(34, s.ink, bg) + "</div>" +',
  '    \'<nav class="nav-links" style="color:\' + s.type + \'">\' +',
  '    link("Blog", blogOn) + link("Release Notes", !blogOn) +',
  "    '<a class=\"cta\" style=\"background:' + btn.bg + ';color:' + btn.fg + '\">Practice</a></nav></header>';",
  '}',
  '',
  'function contentGround(s) {',
  '  return state.content === "white" ? "#ffffff" : s.ground;',
  '}',
  '',
  '// The newsletter card inverts against the content ground so it keeps',
  '// figure: scheme panel on white content, white panel on scheme content.',
  'function newsletterHtml(s, btn) {',
  '  const onWhite = state.content === "white";',
  '  const bg = onWhite ? s.ground : "#ffffff";',
  '  return \'<section class="news" style="background:\' + bg + \'">\' +',
  '    \'<div class="news-inner">\' +',
  '    \'<h2 class="display" style="color:\' + s.type + \'">FOLLOW THE RELEASES</h2>\' +',
  "    '<p style=\"color:' + s.type + ';opacity:.8\">New exercise sets, new features, the occasional essay \\u2014 straight to your inbox when they ship.</p>' +",
  '    subscribeHtml(s, btn, "560px") +',
  '    \'<p class="news-fine" style="color:\' + s.type + \';opacity:.6">No spam, and we never share your address.</p>\' +',
  '    "</div>" +',
  '    \'<div class="news-band">\' + fieldSvg(1120, 96, { scaleMul: 0.45, seedOffset: 11 }) + "</div></section>";',
  '}',
  '',
  'function postMeta(p) {',
  '  return \'<p class="byline">By \' + p.author + " \\u00b7 " + p.date + "</p>";',
  '}',
  '',
  'function renderBlog(s, btn) {',
  '  const f = POSTS[0];',
  '  let out = navHtml(s, btn, "blog", contentGround(s)) + \'<main class="page">\';',
  '  out += \'<section class="hero-split">\' +',
  '    postArt(f, 762, 508, "art-hero") +',
  '    \'<div class="hero-copy">\' + chip(f.category) +',
  '    \'<h1 class="display hero-title">\' + f.title + "</h1>" +',
  '    \'<p class="dek">\' + f.dek + "</p>" + postMeta(f) + "</div></section>";',
  '  out += \'<p class="label">Posts</p><section class="grid">\';',
  '  for (const p of POSTS.slice(1)) {',
  '    out += \'<article class="card">\' +',
  '      postArt(p, 640, 360, "art-card") +',
  '      \'<h2 class="display card-title"><a class="rn-link">\' + p.title + "</a></h2>" +',
  '      postMeta(p) + \'<p class="card-dek">\' + p.dek + "</p>" +',
  '      \'<p class="chiprow">\' + chip(p.category) + "</p></article>";',
  '  }',
  '  out += "</section>" + newsletterHtml(s, btn) + "</main>";',
  '  return out;',
  '}',
  '',
  'function renderPost(s, btn) {',
  '  const p = POSTS[0];',
  '  let out = navHtml(s, btn, "blog", contentGround(s)) + \'<main class="page page-narrow">\';',
  '  out += \'<p class="back">\\u2190&nbsp; Blog</p>\' +',
  '    \'<h1 class="display post-title">\' + p.title + "</h1>" +',
  '    \'<p class="dek">\' + p.dek + "</p>" +',
  '    \'<p class="byline">By \' + p.author + " \\u00b7 " + p.date + \' &nbsp;</p><p class="chiprow">\' + chip(p.category) + "</p>" +',
  '    \'<div class="art art-band">\' + fieldSvg(1120, 340, { seedOffset: slugSeed(p.slug), scaleMul: 0.6 }) + "</div>" +',
  '    \'<div class="prose">\' +',
  '    "<p>LogiCola 3 has a new face. Not a coat of paint \\u2014 a redesign that started from a question we kept running into: what should a logic drill <em>feel</em> like when you\'re on your third run of the evening?</p>" +',
  '    embedHtml(s, btn) +',
  '    \'<h2 class="display">A colour for every set</h2>\' +',
  '    "<p>Each exercise set now has its own palette: a pale surface and a dark chromatic ink, tuned as a pair. Syllogisms don\'t look like fallacies; translations don\'t look like proofs. The palettes were derived in OKLCH and checked against WCAG contrast requirements across every set.</p>" +',
  '    \'<h2 class="display">Scored runs</h2>\' +',
  '    "<p>The classic ten-question drill has grown into a scored run. Answer well and the run builds; miss, and the bar flashes and takes the hit. The scoring economies come from the original 2008 LogiCola.</p>" +',
  '    "</div>" + newsletterHtml(s, btn) + "</main>";',
  '  return out;',
  '}',
  '',
  'function renderRN(s, btn) {',
  '  let out = navHtml(s, btn, "rn", s.ground);',
  '  out += \'<section class="rn-hero">\' + fieldSvg(HERO_W, HERO_H, { clear: CLEARING }) +',
  "    '<div class=\"rn-clearing\" style=\"left:' + CLEARING.x + 'px;top:' + CLEARING.y + 'px;width:' + CLEARING.w + 'px;height:' + CLEARING.h + 'px\">' +",
  '    \'<p class="label" style="margin:0;color:\' + s.type + \'">Release notes</p>\' +',
  '    \'<h1 class="display rn-title" style="color:\' + s.type + \'">What\\u2019s new</h1>\' +',
  '    subscribeHtml(s, btn, "480px") + "</div></section>";',
  '  out += \'<main class="page">\';',
  '  for (const r of RELEASES) {',
  '    out += \'<article class="rn-row"><div class="rn-meta">\' +',
  '      \'<h2 class="display rn-h"><a class="rn-link">\' + r.title + "</a></h2>" +',
  '      \'<p class="byline">\' + r.date + "</p>" +',
  '      \'<p class="chiprow">\' + r.cats.map(function (c) { return chip(c.t, c.solid); }).join("") + "</p>" +',
  '      "</div>" +',
  '      \'<div class="prose rn-body">\' + r.body + "</div></article>";',
  '  }',
  '  out += newsletterHtml(s, btn) + "</main>";',
  '  return out;',
  '}',
  '',
  'function render() {',
  '  const s = SCHEMES[state.scheme];',
  '  const btn = btnColors(s);',
  '',
  '  const live = document.getElementById("lab-live");',
  '  live.style.setProperty("--hl-ground", state.content === "white" ? "#ffffff" : s.ground);',
  '  live.style.setProperty("--hl-ink", s.ink);',
  '  live.style.setProperty("--hl-type", s.type);',
  '',
  '  document.getElementById("lab-blog").innerHTML = renderBlog(s, btn);',
  '  document.getElementById("lab-post").innerHTML = renderPost(s, btn);',
  '  document.getElementById("lab-rn").innerHTML = renderRN(s, btn);',
  '',
  '  document.getElementById("hl-recipe").textContent =',
  '    (s.label || state.scheme) + " \\u00b7 " + state.pattern + " \\u00b7 " + state.pool +',
  '    " \\u00b7 scale " + state.scale.toFixed(2) + " \\u00b7 seed " + state.seed + " \\u00b7 accent " + state.rate + "%" +',
  '    " \\u00b7 form " + state.form + " \\u00b7 content " + state.content;',
  '',
  '  wireEmbed();',
  '',
  '  const rateEl = document.getElementById("hl-rate");',
  '  rateEl.disabled = state.pattern !== "quilt";',
  '  document.getElementById("hl-rate-note").textContent = state.pattern === "quilt"',
  '    ? "accent " + state.rate + "%"',
  '    : "camo mixes by noise; rate is inert";',
  '  document.getElementById("hl-scale-note").textContent = "scale " + state.scale.toFixed(2);',
  '  for (const host of document.querySelectorAll("[data-key]")) {',
  '    const key = host.getAttribute("data-key");',
  '    for (const b of host.querySelectorAll("button")) {',
  '      b.setAttribute("aria-pressed", String(state[key] === b.dataset.id));',
  '    }',
  '  }',
  '}',
  '',
  'function buildOpts(hostId, items, key) {',
  '  const host = document.getElementById(hostId);',
  '  host.setAttribute("data-key", key);',
  '  for (const it of items) {',
  '    const b = document.createElement("button");',
  '    b.className = "opt";',
  '    b.type = "button";',
  '    b.dataset.id = it.id;',
  '    b.textContent = it.label;',
  '    b.onclick = () => { state[key] = it.id; render(); };',
  '    host.append(b);',
  '  }',
  '}',
  '',
  'buildOpts("hl-scheme", SCHEME_ORDER.map((id) => ({ id: id, label: SCHEMES[id].label })), "scheme");',
  'buildOpts("hl-pattern", PATTERNS, "pattern");',
  'buildOpts("hl-pool", POOL_OPTS, "pool");',
  'buildOpts("hl-form", FORM_OPTS, "form");',
  'buildOpts("hl-content", CONTENT_OPTS, "content");',
  '',
  'const presetHost = document.getElementById("hl-presets");',
  'for (const p of PRESETS) {',
  '  const b = document.createElement("button");',
  '  b.className = "opt";',
  '  b.type = "button";',
  '  b.textContent = p.label;',
  '  b.onclick = () => { Object.assign(state, p.s); syncInputs(); render(); };',
  '  presetHost.append(b);',
  '}',
  '',
  'const scaleEl = document.getElementById("hl-scale");',
  'const rateEl2 = document.getElementById("hl-rate");',
  'const seedEl = document.getElementById("hl-seed");',
  'function syncInputs() { scaleEl.value = state.scale; rateEl2.value = state.rate; seedEl.value = state.seed; }',
  'scaleEl.oninput = () => { state.scale = parseFloat(scaleEl.value); render(); };',
  'rateEl2.oninput = () => { state.rate = parseInt(rateEl2.value, 10); render(); };',
  'seedEl.onchange = () => { state.seed = Math.max(0, parseInt(seedEl.value, 10) || 0); render(); };',
  'document.getElementById("hl-reroll").onclick = () => {',
  '  state.seed = Math.floor(Math.random() * 100);',
  '  syncInputs();',
  '  render();',
  '};',
  '',
  '// Programmatic hook (used by the capture scripts; harmless otherwise).',
  'window.headerLab = { set(patch) { Object.assign(state, patch); syncInputs(); render(); }, get() { return { ...state }; } };',
  '',
  'syncInputs();',
  'render();',
].join('\n');

/* ---- document ------------------------------------------------------------ */

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Marketing lab — blog &amp; release notes (PROPOSED 2026-08-14)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&family=Roboto+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  :root { --ink:#111; }
  * { box-sizing:border-box; margin:0; }
  body { background:#d9d9d2; font-family:'Roboto Flex',system-ui,sans-serif; color:var(--ink);
         padding:48px 24px 96px; }
  .lab-head { max-width:1200px; margin:0 auto 12px; font-family:'Roboto Mono',monospace; font-size:12px; color:#555; }
  .lab-head strong { color:#111 }
  .screen-label { max-width:1200px; margin:56px auto 10px; font-family:'Roboto Mono',monospace;
                  font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#555; }
  .frame { max-width:1200px; margin:0 auto; background:var(--hl-ground,#fff);
           box-shadow:0 2px 14px rgba(0,0,0,.13); overflow:hidden; }

  .display { font-stretch:151%; font-weight:800; letter-spacing:.01em; }

  /* nav — always on the scheme ground (decided 2026-08-13) */
  .nav { display:flex; align-items:center; justify-content:space-between; padding:18px 40px; }
  .nav-links { display:flex; align-items:center; gap:26px; font-family:'Roboto Mono',monospace;
               font-size:13.5px; font-weight:600; }
  .nav-links a { opacity:.75 }
  .nav-links a.on, .nav-links a.cta { opacity:1 }
  .nav-links .cta { font-weight:700; padding:9px 22px; clip-path:${SPRITE}; }

  .page { padding:28px 40px 56px; background:var(--hl-ground,#fff) }
  .page-narrow { padding-left:0; padding-right:0; max-width:820px; margin:0 auto; }

  /* pattern art. Ratios are named, not accidental: featured = 3:2 (the
     premium slot), cards = 16:9 (the ratio covers actually come in —
     a fixed-height slot was cropping real images to 2.58:1). */
  .art { clip-path:${SPRITE}; }
  .art-hero { aspect-ratio:3/2; height:auto }
  .art-card { aspect-ratio:16/9; height:auto }
  .art-band { height:280px; margin:30px 0 6px }

  /* blog index */
  .hero-split { display:grid; grid-template-columns:1.15fr 1fr; gap:44px; align-items:center; padding:16px 0 8px; }
  .hero-title { font-size:52px; line-height:1.03; margin:16px 0 0; color:var(--hl-type,#111) }
  .dek { font-size:19px; line-height:1.45; color:var(--hl-type,#444); opacity:.82; margin-top:16px }
  .byline { font-family:'Roboto Mono',monospace; font-size:12.5px; color:var(--hl-type,#666);
            opacity:.62; margin-top:12px }
  .label { font-family:'Roboto Mono',monospace; font-size:12px; font-weight:700; letter-spacing:.09em;
           text-transform:uppercase; color:var(--hl-type,#666); opacity:.7; margin:40px 0 16px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:36px; }
  .card-title { font-size:24px; margin-top:16px; color:var(--hl-type,#111) }
  .card-dek { color:var(--hl-type,#444); opacity:.82; line-height:1.5; margin-top:8px }
  .chiprow { display:flex; gap:6px; margin-top:14px }

  /* chips: the square "abbreviation box" (pixel-ui.md). The gem/NewBadge
     is app-only. NEW FEATURE emphasises by fill weight, never by shape. */
  .hl-chip { display:inline-flex; height:24px; align-items:center; padding:0 10px;
             font-family:'Roboto Mono',monospace; font-size:10px; font-weight:700;
             letter-spacing:.08em; text-transform:uppercase;
             background:color-mix(in srgb, var(--hl-ink) 14%, var(--hl-ground,#fff));
             color:var(--hl-type) }
  .hl-chip-new { background:var(--hl-ink); color:var(--hl-ground,#fff) }

  /* blog post */
  .back { font-family:'Roboto Mono',monospace; font-size:13px; font-weight:600; color:var(--hl-type,#666);
          opacity:.7; margin:6px 0 26px }
  .post-title { font-size:46px; line-height:1.05; color:var(--hl-type,#111) }
  .prose { margin-top:26px; font-size:17px; line-height:1.62; color:var(--hl-type,#222); }
  .prose p { margin:14px 0 }
  .prose h2 { font-size:24px; margin:30px 0 6px }
  .prose ul { margin:12px 0 12px 22px }
  .prose li { margin:7px 0 }

  /* subscribe control — one wide box, button embedded right (decided) */
  .subwide { display:flex; align-items:center; gap:12px; width:100%; margin-top:20px;
             background:#fff; border:1.5px solid #9c9c90; padding:6px 6px 6px 18px; }
  .subwide-text { flex:1; text-align:left; font-size:14.5px; color:#888; white-space:nowrap;
                  overflow:hidden }
  .subwide-btn { font-weight:700; font-size:14px; padding:11px 26px; clip-path:${SPRITE}; white-space:nowrap }
  .subwide-wrap { position:relative; width:100%; margin-top:20px }
  .subwide-wrap .subwide { margin-top:0 }
  .subwide-wrap::before { content:''; position:absolute; inset:0; background:currentColor;
                          clip-path:${RING_BAND}; pointer-events:none; z-index:2 }
  .subwide-wrap .subwide { position:relative; z-index:1 }

  /* in-post quiz widget (lab mock) */
  .qe { margin:28px 0; padding:28px 32px 18px; clip-path:${SPRITE} }
  .qe .chiprow { align-items:center }
  .qe-set { font-family:'Roboto Mono',monospace; font-size:12px; font-weight:600; opacity:.75;
            margin-left:6px }
  .qe-prompt { font-size:16.5px; line-height:1.55; margin-top:14px; font-style:italic }
  .qe-ask { font-family:'Roboto Mono',monospace; font-size:12.5px; font-weight:600; margin:14px 0 10px;
            opacity:.8 }
  .qe-row { margin:8px 0; cursor:pointer; user-select:none }
  .qe-opt { display:flex; align-items:center; padding:11px 18px; font-size:15px; font-weight:600;
            clip-path:${SPRITE} }
  .qe-optwrap { display:block; position:relative }
  .qe-optwrap::before { content:''; position:absolute; inset:0; background:currentColor;
                        clip-path:${RING_BAND}; pointer-events:none; z-index:2 }
  .qe-optwrap .qe-opt { position:relative; z-index:1 }
  .qe-actions { display:flex; align-items:center; gap:22px; margin-top:16px }
  .qe-btn { font-family:inherit; border:none; cursor:pointer; font-weight:700; font-size:14px;
            padding:11px 26px; clip-path:${SPRITE} }
  .qe-verdict { margin-top:16px; font-weight:700; font-size:15px }
  .qe-link { font-family:'Roboto Mono',monospace; font-size:13px; font-weight:700; cursor:pointer;
             text-decoration:underline; text-decoration-thickness:2px }
  .qe-note { font-family:'Roboto Mono',monospace; font-size:10.5px; opacity:.45; margin-top:16px }

  /* newsletter */
  .news { margin-top:52px; clip-path:${SPRITE}; }
  .news-inner { padding:36px 40px 28px }
  .news h2 { font-size:22px }
  .news p { margin-top:8px; max-width:560px }
  .news-fine { font-size:13px; margin-top:12px }
  .news-band { height:64px; overflow:hidden }
  .news-band svg { height:96px }

  /* release notes */
  .rn-hero { position:relative; }
  .rn-hero > svg { width:100%; height:auto }
  .rn-clearing { position:absolute; display:flex; flex-direction:column; align-items:center;
                 justify-content:center; text-align:center }
  .rn-title { font-size:58px; margin-top:10px }
  .rn-row { display:grid; grid-template-columns:300px 1fr; gap:48px; padding:32px 0; }
  .rn-row + .rn-row { background-image:repeating-linear-gradient(90deg,
      color-mix(in srgb, var(--hl-ink) 30%, transparent) 0 10px, transparent 10px 20px);
      background-size:100% 2px; background-repeat:no-repeat }
  .rn-h { font-size:26px; line-height:1.1; color:var(--hl-type,#111) }
  .rn-h .rn-link, .card-title .rn-link { cursor:pointer }
  .rn-h .rn-link:hover, .card-title .rn-link:hover { text-decoration:underline; text-decoration-thickness:2px }
  .rn-row .byline { margin-top:8px }
  .rn-row .chiprow { margin-top:16px }
  .rn-body { margin-top:2px; font-size:16px }

  /* controls */
  .hl-controls { max-width:1200px; margin:0 auto 14px; background:#1d1d1b; color:#ddd; padding:18px 22px 14px }
  .hl-row { display:flex; align-items:baseline; gap:14px; margin:7px 0 }
  .hl-cap { font-family:'Roboto Mono',monospace; font-size:11px; font-weight:700; letter-spacing:.09em;
            text-transform:uppercase; color:#888; flex:0 0 64px }
  .hl-opts { display:flex; flex-wrap:wrap; gap:6px }
  .opt { font-family:'Roboto Mono',monospace; font-size:11.5px; font-weight:600; color:#ccc;
         background:#2c2c29; border:1px solid #3a3a36; padding:5px 10px; cursor:pointer }
  .opt[aria-pressed="true"] { background:#EDEDE3; color:#111; border-color:#EDEDE3 }
  .hl-sliders { display:flex; flex-wrap:wrap; gap:18px; align-items:center }
  .hl-sliders label { display:flex; align-items:center; gap:8px; font-family:'Roboto Mono',monospace;
                      font-size:11.5px; color:#ccc }
  .hl-sliders input[type=range] { width:170px }
  .hl-sliders em { font-style:normal; color:#888; min-width:120px }
  .hl-seed input { width:56px; background:#2c2c29; color:#ddd; border:1px solid #3a3a36;
                   font-family:'Roboto Mono',monospace; font-size:12px; padding:4px 6px }
  .hl-recipe { font-family:'Roboto Mono',monospace; font-size:11px; color:#7a7a74; margin-top:10px }
</style>
</head>
<body>
<p class="lab-head"><strong>Marketing lab — blog &amp; release notes.</strong> Status: PROPOSED, 2026-08-14.
One set of controls drives all three screens. Hierarchy mirrors suno.com/blog + /release-notes; generators and
colour tables extracted verbatim from docs/brand-lab.html; clips from lib/pixel.ts. Locked: nav on scheme
ground, no hero card, wide subscribe box, square chips (gem is app-only), user-meaningful categories.
Open: scheme, pattern, pool, dials, form treatment, content ground.</p>

<div id="lab-live">
  <div class="hl-controls">
    <div class="hl-row"><span class="hl-cap">Pins</span><div id="hl-presets" class="hl-opts"></div></div>
    <div class="hl-row"><span class="hl-cap">Scheme</span><div id="hl-scheme" class="hl-opts"></div></div>
    <div class="hl-row"><span class="hl-cap">Pattern</span><div id="hl-pattern" class="hl-opts"></div></div>
    <div class="hl-row"><span class="hl-cap">Pool</span><div id="hl-pool" class="hl-opts"></div></div>
    <div class="hl-row"><span class="hl-cap">Form</span><div id="hl-form" class="hl-opts"></div></div>
    <div class="hl-row"><span class="hl-cap">Content</span><div id="hl-content" class="hl-opts"></div></div>
    <div class="hl-row">
      <span class="hl-cap">Dials</span>
      <div class="hl-sliders">
        <label><input id="hl-scale" type="range" min="1" max="3" step="0.01" value="1.94"><em id="hl-scale-note">scale 1.94</em></label>
        <label><input id="hl-rate" type="range" min="0" max="100" step="1" value="75"><em id="hl-rate-note">accent 75%</em></label>
        <label class="hl-seed">seed <input id="hl-seed" type="number" min="0" max="99" value="99"><button id="hl-reroll" class="opt" type="button">reroll</button></label>
      </div>
    </div>
    <p id="hl-recipe" class="hl-recipe"></p>
  </div>

  <p class="screen-label">1 · Blog index</p>
  <div class="frame" id="lab-blog"></div>

  <p class="screen-label">2 · Blog post</p>
  <div class="frame" id="lab-post"></div>

  <p class="screen-label">3 · Release notes</p>
  <div class="frame" id="lab-rn"></div>
</div>

<script>
${genSrc}
${CLIENT}
</script>
</body>
</html>
`;

await fs.writeFile(`${ROOT}/docs/marketing-lab.html`, html);
// The pre-push gate prettier-checks every non-gitignored file, so the
// generated page must leave here already formatted.
const { execSync } = await import('node:child_process');
execSync('pnpm exec prettier --write docs/marketing-lab.html', {
  cwd: ROOT,
  stdio: 'ignore',
});
console.log('wrote docs/marketing-lab.html', html.length, 'bytes (formatted)');
