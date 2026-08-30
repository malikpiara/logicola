---
title: 'Back to the original formula'
dek: "Building LogiCola's new design language from what I found reverse-engineering the 2008 original."
date: '2026-08-26'
category: 'announcements'
cover: '/blog/the-new-logicola/cover.png'
draft: false
---

Two years ago, I [set out to design and release an updated version of
LogiCola](/blog/introducing-logicola-3) with the goal of preserving
Professor Gensler's work and
introducing a more accessible solution that could be used by students
carrying any device or operating system. Since the original was built for
Windows, many students were not able to use
it.
Accessibility requirements also prevented many universities from
adopting LogiCola.

Today, many students use Chromebooks or mobile devices. Earlier this month, **more than a hundred devices in
Asia visited LogiCola 3** in a single week and **72 of them did at least one exercise**.
Sixty-six of those came from the Philippines. **Over half
of them were phones and tablets.** This is a signal I receive with
enthusiasm. The product seems to be delivering on the original promise
I made in 2024.

This week I'm releasing a new version that takes into consideration all
of the feedback you shared through the [Hacker News
discussion](https://news.ycombinator.com/item?id=40297642),
[GitHub issues](https://github.com/malikpiara/logicola/issues) or via
email. This release aims to address the personality issue and to embed some of
the playfulness from the original software while adding my own touch.

As I wrote in the
[2024 launch post](/blog/introducing-logicola-3):

> I have to admit, I'm not immensely proud of this first version, but (...)
> good software takes time to build. It takes patience. It takes
> iteration. It's a labour of love. The last version of LogiCola has been
> around for 16 years.
>
> I feel a great deal of responsibility. There is an existing audience, a
> set of expectations and an emotional relationship some people have with
> the original product that I don't want to break. This is the legacy of
> a man who has passed away and whose life's work I intend to honour. The
> software was quirky and had personality. I cannot wash that away.
>
> The version that is online feels clean and modern, but it
> doesn't have the original vibe. These are all challenges I'm aware and
> accounting for as I make decisions about the product. In a sense, it's
> like remaking a beloved game. Like Street Fighter. Some original
> elements have to be there for the game to be called Street Fighter.

### Philosophy or mathematics?

One of the commenters on Hacker News [
noted](https://news.ycombinator.com/item?id=40326302) the platform was
too focused on language and philosophical logic, failing to address
mathematical logic. Back then, only propositional translations and
informal logic (meanings and definitions) exercises were online. Since
then, I added syllogistic, modal, deontic and belief translations into
the mix.

Everything built up to 2025 was essentially done manually and required
studying the original software and Gensler's textbook up close.
Routledge very kindly sent a physical copy of the textbook.
And I was able to make a major breakthrough by reverse engineering the
2008 release with Ghidra and AI tools. I asked Claude to rename every
anonymous function after what it was doing. That enabled me to gain a
deeper understanding of the original and to write generators that will
give you endless practice in translations and explain every mistake you
make right away.

## On soul sucking design

Other commenters noted the design felt [too modern and out of
place](https://news.ycombinator.com/item?id=40317838). The
landing page [prioritised the wrong
goals](https://github.com/malikpiara/logicola/issues/45) and put more
emphasis on user acquisition through an email subscription form than it
did on the logic drills. My initial redesign made LogiCola feel like a SaaS product and
was a big departure from the original user interface.

Here is the screen that opened
every exercise a year ago, against the one that opens it now.

<div data-island="before-after" data-before="/blog/then-and-now/start-then.png" data-after="/blog/then-and-now/start-now.png" data-alt="The screen that opens an exercise" data-width="2498" data-height="1558"></div>

Both the old headline, "Ready for a challenge?" and the description were taken directly from Khan Academy. Every set featured the same screen because they were placeholders I couldn't prioritise on a first release. The new quiz window gives you context and tells you what to expect from an exercise.

Finally, there were many accessibility issues that prevented people
from [using the navigation
properly](https://news.ycombinator.com/item?id=40320473) and kept
people with visual impairments from [using the platform with screen
readers](https://news.ycombinator.com/item?id=40317716). For people not
acquainted with Gensler's pedagogy, it was not clear what made a
[well-formed formula](https://news.ycombinator.com/item?id=40319634)
(WFF: what are the grammatical and syntactical rules of that logical
system?).

## A colour for every set

Each exercise set now has its own palette: a pale surface, a dark
chromatic ink, and an accent, tuned as a trio. Syllogisms don't look like
fallacies; translations don't look like proofs. Where those palettes came
from is the longest answer in this post, and it starts in 2008.

The redesign didn't start from a blank palette. The 2008 program has a
Color dialog whose full title is "Color (previously Pastel Random)".
The parenthesis is Gensler's own release note: the feature began as
random pastels and grew names later. Nine named pairs plus Random, each
at three depths (Pastel, Moderate, Deep). The first name is the
screen's ground, the second is the panel that sits on it.

<div class="post-swatches">
<figure><div class="screen2008" style="--g:#CDFFFF;--p:#FFCDCD;--b:#320000"><span class="panel"></span><span class="band"></span></div><figcaption>Aqua/Rose<br>#CDFFFF · #FFCDCD</figcaption></figure>
<figure><div class="screen2008" style="--g:#FFCDCD;--p:#CDFFFF;--b:#003232"><span class="panel"></span><span class="band"></span></div><figcaption>Rose/Aqua<br>#FFCDCD · #CDFFFF</figcaption></figure>
<figure><div class="screen2008" style="--g:#CDCDFF;--p:#FFFFCD;--b:#323200"><span class="panel"></span><span class="band"></span></div><figcaption>Blue/Cream<br>#CDCDFF · #FFFFCD</figcaption></figure>
<figure><div class="screen2008" style="--g:#FFFFCD;--p:#CDCDFF;--b:#000032"><span class="panel"></span><span class="band"></span></div><figcaption>Cream/Blue<br>#FFFFCD · #CDCDFF</figcaption></figure>
<figure><div class="screen2008" style="--g:#CDFFCD;--p:#FFCDFF;--b:#320032"><span class="panel"></span><span class="band"></span></div><figcaption>Lime/Magenta<br>#CDFFCD · #FFCDFF</figcaption></figure>
<figure><div class="screen2008" style="--g:#FFCDFF;--p:#CDFFCD;--b:#003200"><span class="panel"></span><span class="band"></span></div><figcaption>Magenta/Lime<br>#FFCDFF · #CDFFCD</figcaption></figure>
</div>

Each little screen above is composed the way the program composes a real
one, from colours read out of its own arithmetic. Every pastel is a
saturated hue pushed light. Every pair is a complement. And the dark
strip along the bottom is not a colour at all. The program paints the
strip in the ground colour and calls InvertRect on it, so every screen
gets the exact complement of its own ground, with the black title text
flipping to white on the way. Three colours, reserved to work together,
and the third one was never chosen.

The depth dial is one byte. The pale channels sit at CD in Pastel, B9 in
Moderate and 91 in Deep, and the band follows wherever the ground goes,
because an inversion has no settings.

<div class="post-swatches">
<figure><div class="screen2008" style="--g:#CDFFFF;--p:#FFCDCD;--b:#320000"><span class="panel"></span><span class="band"></span></div><figcaption>Pastel · CD</figcaption></figure>
<figure><div class="screen2008" style="--g:#B9FFFF;--p:#FFB9B9;--b:#460000"><span class="panel"></span><span class="band"></span></div><figcaption>Moderate · B9</figcaption></figure>
<figure><div class="screen2008" style="--g:#91FFFF;--p:#FF9191;--b:#6E0000"><span class="panel"></span><span class="band"></span></div><figcaption>Deep · 91</figcaption></figure>
</div>

And Random, the old default, rolls pairs past the named six entirely.
Here it is, ported from the decompiled routine: the same pulls, the
same coin, the same byte wrap, and the band still arriving by
inversion. Roll it.

<div data-island="pastel-random"></div>

## How the colours were actually chosen

None of the new palettes were eyeballed. They were scored, using Ruxandra Duru's
two-colour framework and the model behind
[Color Moods](https://colormoods.co), the tool she made with Brian Li,
following her article _Two-Color Combinations: a Toolkit_. I ported that
model into the lab so a pair could be measured instead of argued about.

The master variable is **stimulation**, how much visual excitement a pair
generates, and it comes out of three dials with unequal weights:

`stimulation = (4 · intensity + 2 · lightness gap + 1 · hue distance) / 7`

The weights are the finding. Intensity dominates, and hue distance, the
thing classical colour theory spends most of its time on, is the weakest of
the three. A pair of intense colours is lively even when the hues are
neighbours; muted colours stay calm even as complements. It is the single
most useful thing I learned doing this, and it is the opposite of what I
assumed going in.

Then it stopped being theory. Sets C and J already existed: I had made
them by hand and by feel, before any of this measuring. So I measured
them. C scores **0.551**. J scores **0.540**. That number _is_ the
setting: LogiCola's stimulation region is about 0.54, and it had been
sitting in two hand-made palettes all along, never written down. Every
set generated afterwards targets the same region, which is why the seven
look related without being variations on one hue. They're siblings by
measurement rather than by recipe.

The band that shipped is 0.45–0.58 for anything you read against, with 0.6
and above reserved for marketing and motion. Past that you risk
**vibration**: two intense, far-apart hues at similar lightness buzzing
against each other. The insurance is a big lightness gap, which is the real
reason every set is a pale surface under a dark chromatic ink, rather than a
stylistic preference.

And then the case that taught me the limit of the whole exercise. Set R
paired with a navy scored 0.578 with vibration at zero: comfortably inside
the band, no warning anywhere in the instrument. It was still wrong. It
crossed the warm/cool divide and read as two separate worlds stapled
together. The number was fine and the pair was not. <mark>A measurement
tells you when to stop arguing about the thing it measures; it says
nothing at all about what you forgot to measure.</mark>

Reading about a measurement is not the same as watching it move, so here is
the instrument. This is the lab's Colour studio: the app's own pattern
layer drawing the field, the app's own option pills sitting on it, and the
model recomputing underneath every time you change a colour.

<div data-island="colour-studio"></div>

Some things worth trying, because each one taught me something:

**Lighten the ink.** Watch ΔL collapse and take stimulation down with it,
and notice that the contrast ratio fails AA well before the screen looks
obviously broken. Three constraints move on one control, which is why the
ink is never chosen on its own.

**Push both colours toward mid-value and pick opposing hues.** That's
vibration: the buzz you get from two intense, far-apart hues at similar
lightness. It's the failure the pale-surface-dark-ink structure exists to
make impossible.

**Try a warm surface with a cold ink.** The score will happily stay in
range while the temperature readout flips to "crossing", which is exactly
the case the number cannot see. That pair reads as two worlds stapled
together no matter what the arithmetic says.

**Press "Inks for this surface".** That isn't a random colour picker. It is
the generator the palettes came out of: it sweeps hue, saturation and
lightness, scores every candidate against the colour you have, and hands
back the eight that land nearest 0.54, the region Sets C and J turned out
to occupy, deduplicated so the list isn't one colour eight times.

Color Moods is a general tool for a general problem: any two colours, any
discipline. I had to tune its generator before it was any use here,
because this product has two constraints a general tool has no reason to
carry. Both corrections came from measuring the seven sets rather than from
theory, and both taught me something.

The first is that **stimulation is a taste metric with no term for
legibility**. Left to optimise the score alone, the generator would happily
hand me a near-white surface under a bright green ink: 0.54 on the nose, no
vibration warning, and a contrast ratio of 1.21:1. Beautiful arithmetic,
unreadable screen. So legibility is now checked first and separately: under
4.5:1, or a lightness gap below 0.5, a candidate never reaches the
ranking. Those floors are the shipped sets' own: they run 7.0:1 to 12.7:1 at
ΔL 0.57 to 0.78.

The second correction was about taste, and it genuinely surprised me. These
surfaces are pastels, and I had assumed a pastel was a desaturated colour. It
isn't. Measured, they run HSL saturation 0.68 to 1.00, nearly all of them
_fully_ saturated, at high lightness, which lands them at an OKLCH
chroma of only 0.05 to 0.12. <mark>A pastel is a saturated hue pushed
light</mark>, so sweeping low saturation to find one gives you grey mud
every time. It is also, to the byte, the recipe from the last chapter:
Gensler's pastels sit at full saturation, lightness 0.9. The search band
starts high now and caps chroma at the top end instead, which is why the
candidates come back looking like relatives of the seven.

None of that is a criticism of the tool. It's the ordinary work of taking a
general instrument and giving it your constraints. The constraints turned
out to be more interesting than the algorithm.

Nothing here is a mock-up of the drill. It is the drill's own components,
and the app's own pattern generators, being handed colours you chose.

So here are the seven. Every state in the drill reads a token fed by a
set's three colours, which means a whole set gets its look without anyone
making a new decision. Click through them.

<div data-island="set-palettes"></div>

The pair the site itself wears comes from Set L: mint under plum. That
mint is a near match for the pale aqua Gensler painted his own help
screens, close enough that the two are hard to tell apart side by side. I
didn't set out to land there. I got there by building the palette honestly
and noticing afterwards where it had arrived.

Then I pointed the instrument backwards. Gensler's own 2008 pastel pairs
score 0.47 to 0.51: inside the band, a shade calmer than mine. And the
structure repeats too. His InvertRect strip put a pale ground under its
exact dark complement, which is the same shape as a pale surface under a
dark chromatic ink. He got there by inverting, I got there by measuring,
and the product has had the same colour temperament for sixteen years.
It just took this release to write it down.

## The covers that started it

Everything so far happens once you're inside the drill. The covers on X
and LinkedIn are where the redesign started. Vitor Abreu, a friend and
fellow student from CODE University, drew them in 2024: a smooth quilt of
rounded rectangles, in that green, on the white ground the front page used
to have. His covers were the starting point for the pattern experiments
and the pixelated direction the next sections walk through. Two years
later, the system his quilt seeded comes back to redraw it.

Drag the line. Left is what's up there today; right is what replaces it.

<div data-island="before-after" data-before="/blog/the-new-logicola/x-then.png" data-after="/blog/the-new-logicola/x-now.png" data-alt="The LogiCola profile on X" data-width="1200" data-height="952"></div>

Nothing in the new one is new, and the sections that follow show why.
Even the quilt is Vitor's idea, redrawn at the grid's resolution. The
shape grammar it wears (straight edges ruler-straight, corners
quantised) is the next section, at a bigger cell than anywhere else in
the product. The colours are the ones you clicked through in the colour
chapter: six of the pale surfaces a set is known by, and three of the dark inks
its questions are written in. Set L isn't in the list because it isn't an
accent here; its mint is the ground and its plum is everything else.

Which is the test I'd apply to any brand that sits on top of a product.
<mark>A cover should be made of things the product already owns, or it is
a costume.</mark> A student who has spent an evening in Set N should
recognise that blue without being told why they recognise it.

<div data-island="before-after" data-before="/blog/the-new-logicola/li-then.png" data-after="/blog/the-new-logicola/li-now.png" data-alt="The LogiCola page on LinkedIn" data-width="2256" data-height="1132"></div>

It is not a picture of the app either. It's a crop of it: the band along the
foot of this page comes out of the same generator, from the same nine
colours, at the same rate. Scroll down and you are looking at the artwork,
smaller. That's the part I'd defend: the cover cannot drift away from the
product, because there is no second renderer for it to drift into.

The mark didn't change, and it shouldn't have. What changed is what it's
made of: the same can, cut from the plum the questions are written in and
knocked out on the mint that Set L wears.

![The LogiCola avatar, before and after](/blog/the-new-logicola/avatars.png)

One rule holds the two files together, and it's a division of labour
the app icons will repeat: the avatar carries the mark and nothing else, the cover
carries the pattern and nothing else. At the size a feed draws them, an
avatar with pattern in it and a cover with a logo on it compete for the same
job, and the reader gets two half-legible marks instead of one mark and one
field.

## The shapes came out of the bitmap

The face itself needed a grammar, and it is one rule long: straight
edges stay ruler-straight, and only curves rasterise, as regular
symmetric stairs. I got there by drawing the shape wrong several times
first. Turn the dial.

<div data-island="silhouettes"></div>

The crenellation is the one that taught me something. Random bites out of a
straight edge read as damage, as though the shape had been chewed. And here
is the part worth stealing: <mark>a bitmap look does not come from
irregularity. It comes from regularity at a coarse resolution.</mark>
Jitter is what damage looks like; quantisation is what a low-resolution
grid looks like. Aim at the second and the rest of the system falls out of
it: which edges may step, how a ring gets drawn, how small a badge can go
before its stairs stop reading.

## Seventeen patterns, three of them shipped

The field behind a start screen went through the same treatment as
everything else: build them all, then throw most of them away.

![Seventeen prototyped patterns, with the shipped ones marked](/blog/the-new-logicola/patterns.png)

Houndstooth, herringbone, three pinwheels, kilim diamonds, Andean steps,
candy stripes. Each is a real generator, not a swatch: every one of those
tiles is drawn by code that could have shipped. Three did: the quilt, which
now carries the covers and the footer band, and the two camos that dress the
start screens.

The interesting part is why the others lost, because it wasn't quality.
Houndstooth and herringbone are the best-looking things in that grid and
they were never in contention: they read as _fabric_, and a fabric is a
surface you look at rather than through. Kilim diamonds is too symmetrical:
it makes a focal point in the middle of a screen whose middle belongs to a
question. Candy stripes has a direction, and a direction on a study surface
becomes an arrow pointing at nothing.

What survived have a common property: they are fields without features. You
can crop them anywhere, at any size, and get the same texture, which is what
lets one generator serve a 1500px cover, a 112px footer band and the space
behind a question. A pattern with a motif can't do that. Move the crop and
you either cut the motif in half or centre it by accident.

The lesson is one I keep relearning: <mark>decoration that has to sit
under content should be judged on how it behaves at every crop, not on how
it looks at one.</mark>

## Where the icons come from

The icons are HackerNoon's [pixel icon library](https://pixeliconlibrary.com):
a free set drawn on a 24-unit grid, every glyph a polygon instead of a
curve.

![The pixel glyphs LogiCola uses, and one of them enlarged](/blog/the-new-logicola/icons.png)

I didn't reach for it to save drawing time. I reached for it because its
own glyphs had already answered the question I was stuck on: on their play
triangle the hypotenuse steps uniformly, one grid unit at a time, and
nothing anywhere jitters. The rule in the last section came out of reading
someone else's SVGs.

The same set does the footer's brand row, which matters more than it
sounds: a smooth GitHub mark beside seven stepped glyphs is the one
inconsistency a reader would actually notice, because brand marks are the
icons people already know the shape of.

Then a small mechanical thing with a large consequence: every glyph is
drawn in `currentColor`, so it takes the colour of the text it sits beside
rather than carrying one of its own. The lamp that opens a hint is the
hint's colour. The tick on a revealed answer is the badge's colour. Retune
a set's palette and the icons follow without anyone editing an icon. The
general version: <mark>let the system own the colour, and let the asset
own only the shape.</mark> An icon with a colour baked into it is a small
piece of your design system that has escaped.

A few of them are decisions rather than defaults. Hints open with a lamp
and not an exclamation mark, because a hint is guidance and not a
telling-off. The ✕ appears only on an option you actually chose. The Guide
opens under a book with a heart on the cover, over the plain book that was
equally available.

## Badges and pills

Every answer pill is one polygon. Its corner is a quarter-circle of radius
24 sampled onto a four-pixel grid: four stairs, always the same four. The
shape is written once and stretched, so a two-word option and a two-line
one wear an identical corner.

Selecting one is where that nearly came apart. A border cannot draw the
ring: the browser paints a border along the rectangle and the clip then
cuts the corners off it, so the stroke disappears on every step. A drop
shadow is worse: it traces the alpha channel, so a pill with no fill gets
its letterforms outlined instead of its silhouette. The ring is therefore
part of the same polygon, a band spliced into the outline, and the pill
inside it shrinks by exactly the ring's width. Choosing an answer changes
its colour and never its size; nothing on the screen moves when you make up
your mind. The rule underneath: once you clip a shape, everything painted
on its box is clipped with it, so anything that has to survive has to be
geometry rather than decoration laid on top.

The gap between the ring and the pill isn't styling either. A set's ink and
its accent sit only 1.6 to 2.7 to 1 apart in contrast, and the
accessibility standard asks for 3:1 between adjacent meaningful marks, so
those two colours are not allowed to touch. Put the surface between them
and each is measured against the surface instead, which both clear
comfortably. The gap is load-bearing.

The chip beside each option went through more versions than anything else
its size. It began as a square wearing the pills' own sprite corners, which
was fine and forgettable. What replaced it came from Google's
[Material shape library](https://m3.material.io/styles/shape/overview),
and that library is worth a detour, because I went to it three times and
kept one thing.

![Material's puffy diamond and wavy indicator, and what the grid made of each](/blog/the-new-logicola/material.png)

The puffy diamond became the chip. A clam-shell arch was tried at the same
size and cut. And M3 Expressive's wavy progress indicator got a square-wave
version that I rejected for the most useful reason on the list: it read as
ornament, and a progress bar has to read as information. A shape can obey
every rule you have written and still be the wrong shape, because your
rules are about form and the question was about meaning.

Here is the other part. Material's shape library has no web API. Their own
documentation says so plainly: _Web is not currently available_. So I
could look at the shapes and never consume them. Having to redraw the
diamond onto my own four-pixel grid is precisely what stopped it looking
borrowed. A design system you can install hands you someone else's
decisions at their resolution. One you have to redraw hands you their idea
at yours, and the redrawing is where it stops being theirs.

![The chip's construction: eight rows of 2, 4, 6, 8, 8, 6, 4 and 2 cells](/blog/the-new-logicola/chip-construction.png)

Eight rows, 2·4·6·8·8·6·4·2 cells: a straight-edged pixel diamond with one
extra row at the waist, which is the difference between puffy and merely
lozenge-shaped. It's filled rather than outlined for the same reason the
ring had to be redrawn, and filled is what the original used for its own
abbreviations anyway. It also echoes the ◇ of the modal logic sets, which I
didn't plan and wasn't going to argue with.

The NEW tag got the same treatment: four silhouettes, one variable.

![Four NEW badge silhouettes: pill, pixel pill, sprite with a lip, and the gem](/blog/the-new-logicola/badge-variants.png)

The gem won: an elongated octagon with two-step chamfers, the puffy-diamond
idea adapted to a shape that has to hold text. Its magenta is Set C and Set
L's accent rather than a colour chosen for the badge. It was drawn at 24px
and shipped at 20: the stairs still read at that height, and it stopped
shouting.

## One app, four icons

Installing the app raises a question the browser never asks: what does it
look like sitting on a home screen next to everything else you own? The
answer used to be a dark can on a mint plate, drawn before the palette
existed.

![The installed app icon, before and after](/blog/the-new-logicola/icon-pair.png)

The mark splits by surface. The can (small, dense, legible at 16px) takes
the browser tab and the iOS home screen. The wordmark takes everything the
manifest feeds: Android's launcher, an installed macOS or Windows app.
Chartreuse on maroon, which is Set C's surface over Set A's ink; the icon
stays inside the catalogue like everything else.

One part of that plan wasn't achievable. macOS Sonoma and later read the
manifest's `maskable` entry, the same entry Android's launcher reads, so
those two platforms share a mark by construction and no declaration can
separate them. I wanted the can on the Mac and the wordmark on Android; I
got one choice for both, and took the wordmark.

![The same mark as four files: any, maskable, and how Android and iOS crop them](/blog/the-new-logicola/app-icons.png)

Which is the real lesson of app icons, and it cost three bugs to learn:
<mark>an icon is not a picture, it is a contract with a cropper you don't
control.</mark>

One file was declared `"purpose": "any maskable"`, the exact case the
guidance warns against. A maskable icon reused as `any` carries the mask's
padding and floats; an `any` icon reused as maskable gets cropped. Android
had been quietly cutting into the mark for months. It's four files now.

There was no `apple-touch-icon` at all, so iOS did what iOS does in that
case and installed a screenshot of the page. It's a 180px square now, opaque
and deliberately unrounded: iOS applies its own squircle, and a pre-rounded
PNG shows you the old radius sitting inside the new one.

And the maskable safe-zone fit was computed once for the can and then
applied to every mark. The wordmark is 1.4:1 wide, so its furthest corner
sits at 233 pixels against a 205-pixel safe radius, and it needs scaling to
0.879 where the can gets away with 0.901. A safe zone is a circle, and a
circle does not care how wide your logo is; it cares about the corner.

## "It's confusing"

> I'm taking one of the tests and the feedback seems strange: although it
> appears I got it right, because the selected answer turns green, many of
> the other answers turn red — which usually indicates a failure — and
> other unselected answers also turn green. It's
> [confusing](https://news.ycombinator.com/item?id=40317602).

That was the first comment on the thread and it took me far too long to
act on. Red meant "not the answer", so a clean run painted six options red
on Set Q at the exact moment you got it right. On the phone grid of Set R,
the new fallacies set, it painted seventeen.

Here is the screen that comment was written about, and the same screen now.

<div data-island="before-after" data-before="/blog/then-and-now/exercise-then.png" data-after="/blog/then-and-now/exercise-now.png" data-alt="A Set Q question screen" data-width="2498" data-height="1558"></div>

A white card, grey outlines and a blue focus ring: the same neutral
furniture the front page had, carrying no signal about which set you were
in or what any colour meant. When the only colours on screen arrive at the
moment you check your answer, they had better mean exactly one thing each.
They didn't.

The error tone is now reserved for options you actually picked and got
wrong. An option you simply never touched recedes instead: same quiet
ground, the set's own ink, and it keeps its number.

![The five states of an option, in the two moments they belong to](/blog/the-new-logicola/pills.png)

Idle and spent are four percentage points of a transparent tint apart,
close enough that they look identical side by side. And they never appear
together, because one is before you answer and the other is after. The
recede is carried by the ground and the badge, never by making the words
harder to read; those labels are still content you came to see.

<mark>Receding and being wrong are different messages, and only one of
them is about you.</mark>

## "Cannot select more than one answer"

> Few quiz questions require more than one selected answer. It's impossible
> to select more than one, at least using my mobile Chrome browser.
> — [issue #47](https://github.com/malikpiara/logicola/issues/47), alongside
> [#10](https://github.com/malikpiara/logicola/issues/10), where
> multi-answer questions marked every option wrong.

The person who filed it did the work of pinning it down: the example they
gave was Set Q, meanings and definitions, question 3.1, a definition that
is wrong in two ways at once. Some of Gensler's questions genuinely have
more than one answer, and the drill had no way to say so.

![Set Q on a phone: two answers picked, then checked](/blog/the-new-logicola/phones.png)

That's the same set on a phone, which is where it was reported broken.
More than one answer can be right, you can pick up to three, and the rule
is stated above the list rather than left for you to discover.

The right-hand phone is the same screen after checking, and it carries the
other fix too. "Poor match in emotional tone" is marked, because I picked
it and it was wrong. "Too broad" keeps its ring, because it was one of the
answers. Everything I never touched has simply gone quiet: no red, no
green, no verdict on choices I didn't make.

(The question is Plato's definition of man, which Diogenes is supposed to
have refuted by plucking a chicken.)

Nearly everything above this point was a decision about how that screen
should look. Rather than take my word for any of it, the
[Set Q drill](/informal/definitions/quiz), the same set that issue was
filed against, is live: pick more than one answer, get one wrong on
purpose, and watch what does and doesn't turn red.

## "These pairs are the same"

> You may want to check how you normalize the logical representations.
> `(R ^ L) v N` is marked incorrect and `((R ^ L) v N)` is marked correct.
> These pairs are the
> [same](https://news.ycombinator.com/item?id=40319634).

This is my favourite thing that happened, because the person who reported
it went away and
[answered it themselves](https://news.ycombinator.com/item?id=40324902):
Gensler's system has no precedence order for the connectives. Every binary
connective takes its own parentheses, always. That isn't an oversight, it's
a teaching decision: a student who never learns a precedence table can
join any two formulas by writing them side by side and wrapping the result,
and will never be wrong.

So the drill was being faithful. What it wasn't doing was explaining
itself, and that's the fairer complaint. Here is the same question today,
with the Guide open beside it.

![A propositional translation question with the reference guide open](/blog/the-new-logicola/guide.png)

Four options that differ only in their brackets, and one click away, the
rule that decides between them: use a pair of parentheses for each of AND,
OR, IF-THEN, IFF. It opens beside the question rather than on top of it,
and it resizes, because you want it open _while_ you answer rather than
instead of answering.

I would generalise it this way. When a rule is unfamiliar enough that a
capable person files a bug against it, the rule isn't necessarily wrong and
neither is the person. <mark>The documentation is just in the wrong
building.</mark>

## "Absolutely nothing happens"

> I'm using Firefox on Windows with a screen reader and when I press the
> chapters button on the web page, absolutely nothing
> [happens](https://news.ycombinator.com/item?id=40317716).

This is the worst bug reported at launch and it isn't close. It doesn't
degrade the experience, it ends it. LogiCola is assigned coursework in real
universities; "absolutely nothing happens" means a student cannot do their
homework.

Someone else found the same door from the other side:

> The button appears to be hover only, which [is
> bad](https://news.ycombinator.com/item?id=40320473). On top of that, it
> expands content down to show the chapters, but if you move over and then
> down, you exit the hover area and it closes. There are no visual
> indications of the boundaries of the hover area.

A menu that exists only while a pointer rests inside an invisible rectangle
is not a menu. It's a trick that happens to work for people using a mouse
on a large screen. The navigation is keyboard- and screen-reader-operable
now, and accessibility stopped being something I got to at the end and
became something a change doesn't ship without.

A third person went straight past the menu to the reason it mattered:

> The front page looks like you need to sign up, or that it's a newsletter
> signup page. It spends a third of the page on the newsletter and the real
> content is hidden behind a tiny "chapters" menu at the top. The front page
> should be two big buttons for the two chapters so you can click through
> and start
> [directly](https://github.com/malikpiara/logicola/issues/45).

They were right, and the fix is the shape they asked for. Drag the line.

<div data-island="before-after" data-before="/blog/then-and-now/landing-then.png" data-after="/blog/then-and-now/landing-now.png" data-alt="The LogiCola front page" data-width="1440" data-height="900"></div>

The drills are the front page now. You land, you see the exercises, you
pick one. The newsletter moved to the bottom, where something you might
want later belongs.

## From fixed to a point system and infinitely generated questions

Fixed-length quizzes are gone. They have been replaced by a point system that works like the original. Your score climbs as you answer, takes a hit when you miss, and you finish only when you reach 100 points.

This shape has a name in the learning literature: mastery learning, the idea Bloom proposed in 1968. The meta-analysis that followed ([Kulik, Kulik and Bangert-Drowns, 1990](https://doi.org/10.3102/00346543060002265)) found mastery-based courses raise exam performance by about half a standard deviation, with the largest gains going to the weakest students.

The numbers underneath are the original's. Each set keeps the weights it always had, the ladder still tops
out where it always did, and the explanation you get when you miss is
Gensler's own. A score means what your instructor already thinks it means.

What I did decide was how a miss should _feel_. A wrong answer costs real
points, so the bar can react like a health bar taking damage instead of
politely re-easing its width. There are decades of games that already
know how to do that. Six directions got built, each borrowing a different
one. Press **Miss** and try them.

<div data-island="damage-bar"></div>

Mega Man's invulnerability flicker won. Street Fighter II's ghost drain is
direction B, and losing to Mega Man is the most on-brand outcome this
project has produced.

It won because it was tested, not because I argued for it. Each direction
went into a prototype and in front of real people in usability sessions, and
A is what came back. That is the whole point of building six: six directions
are only worth having if something other than my own taste gets to choose
between them.

The lab did surface one thing a session wouldn't. On desktop the bar isn't
the 10px capsule you're pressing above. It's a 6px hairline, and at that
size A's blink-off empties the bar completely rather than flickering it.
Direction G exists because of that: A's cadence wearing C's colour, so the
fill hard-cuts to ink instead of vanishing.

This is the part of the process I would most like to pass on. All six of
these are real implementations rather than sketches, and building six
working animations in an afternoon is a thing that only recently became
possible for one person. That doesn't make the decision for you. It just
means you arrive at a usability session with six things to test instead of
one thing to defend. The old question was "does this feel right?", answered
by whoever was most sure of themselves. The new one is "which of these six
did people actually notice?", answered by watching them. <mark>Everything
that hasn't been tested is an assumption or an opinion.</mark> Every design
decision in this post went through a lab like the one above: ugly,
throwaway, living in a `docs` folder. Those labs are the reason I can tell
you why a shape was chosen instead of only showing you the shape.

Of everything in this post, the scoring is the one part that can't be
touched. Redraw it and it stops being LogiCola.
