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
[GitHub issues](https://github.com/malikpiara/logicola/issues?q=is%3Aissue%20state%3Aclosed) or via
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
did on the logic drills. My initial redesign made LogiCola 3 feel like enterprise software and was a departure from the original user interface.

The original software is vibrant and full of personality. One of the main sources driving that feeling is the colourful backgrounds that change on every refresh. The Color dialog found in the 2008 program reveals nine colour schemes, each at three depths: Pastel, Moderate and Deep.

Here are six of the schemes, with a background, panel and a dark band along the foot. Roll for the random ones, and try the three depths:

<div data-island="pastel-random"></div>

I decided to borrow the colour treatment from the original, but instead
of making the colours change every time, I assigned a unique palette to
every set. Syllogistic and
propositional logic wear different colours. This way, you'll always know where you are.

Here is the screen that opened every exercise a year ago, against
the one that opens it now.

<div data-island="before-after" data-before="/blog/then-and-now/start-then.png" data-after="/blog/then-and-now/start-now.png" data-alt="The screen that opens an exercise" data-width="2466" data-height="1558"></div>

Both the old headline, "Ready for a challenge?" and the description were taken directly from Khan Academy. Every set featured the same screen because they were afterthoughts for a release that was focused on bringing you logic practice. The new quiz window gives you context. You can see the set and type of logic before advancing to the exercises.

## How the original made its colours

Each of the little screens in the last section is composed the
way the program composes a real one, from colours read out of its own
arithmetic. Every pastel is a
saturated hue pushed light. Every pair sets a hue against its opposite:
aqua with rose, blue with cream, lime with magenta. And the dark
strip along the bottom is the ground colour run through
[InvertRect](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-invertrect),
a Windows drawing function that performs a logical NOT on the colour
values of every pixel in a rectangle. Every bit flips, so each channel
becomes its opposite: hex `CD` turns into `32`. The strip is the exact
complement of its own ground, and the black title text flips to white
on the way.

The depth dial is one byte. Here is the whole scheme, reconstructed
from the decompiled routine:

<div class="code2008"><pre><code>level  = 0xCD                    <i># Pastel (0xB9 Moderate, 0x91 Deep)</i>
ground = rgb(level, 0xFF, 0xFF)  <i># Aqua</i>
panel  = rgb(0xFF, level, level) <i># Rose</i>
band   = ~ground                 <i># InvertRect</i></code></pre><span class="band"></span></div>

Turn the dial and only `level` changes; the pinned `FF` channels never
move, which is why deeper schemes grow more intense instead of going
muddy. The band follows wherever the ground goes.

<div class="post-swatches">
<figure><div class="screen2008" style="--g:#CDFFFF;--p:#FFCDCD;--b:#320000"><span class="panel"></span><span class="band"></span></div><figcaption>Pastel · CD</figcaption></figure>
<figure><div class="screen2008" style="--g:#B9FFFF;--p:#FFB9B9;--b:#460000"><span class="panel"></span><span class="band"></span></div><figcaption>Moderate · B9</figcaption></figure>
<figure><div class="screen2008" style="--g:#91FFFF;--p:#FF9191;--b:#6E0000"><span class="panel"></span><span class="band"></span></div><figcaption>Deep · 91</figcaption></figure>
</div>

The randomizer you rolled in the last section is the program's own Random option, following the decompiled routine.

## How the new colours were chosen

While speaking with a friend, I realised I would never be able to give LogiCola 3 an identical voice to the original because I'm not Gensler. So instead of making a carbon copy, I decided to leave my own imprint while honouring the heritage. I spent the last winter reading books about eponymous fashion houses like Gucci, Chanel, Dior and Louis Vuitton. Chanel has had only three official successors. Reading about how they operated and how they drew inspiration from the original source, while keeping the brand relevant and authoring new products emboldened me to follow a similar path.

I wanted to pick colours that evoked the original while bringing new excitement. And I was hoping to make every set rhyme, while keeping them different enough that you could tell them apart. Additionally, the colours had to belong together and to form a cohesive brand.

Ruxandra Duru authored a [brilliant toolkit](https://medium.com/swlh/two-color-combinations-a-toolkit-feeb9e51765c) on how to combine two colours based on the amount of stimulation they can create. She later proceeded to build a [tool that suggests pairs of colours based on a selected amount of stimulation](https://colormoods.co), along with Brian Li. Since this was exactly what I was trying to do, I ported the model behind it and started experimenting.

**Stimulation** comes out of three terms with unequal weights: overall intensity, the lightness gap between the two colours, and the distance between their hues. The end result tells us how much visual excitement a pair generates, ranging from sleep coma to hyper excitement. I aimed to create pairs that were in between both extremes.

To make the colour schemes of every set feel connected, I picked pairs within the 0.45–0.58 stimulation interval. I added white to every hue, to soften them and preferred pale surfaces over dark ones, to make the platform feel playful but not heavy. To create stronger cohesion between sets, I painted them with patterns that surface colours from the other sets. You can play with the Colour Lab below.

<div data-island="colour-studio"></div>

The score has one blind spot that matters for a study tool: it knows nothing about legibility. A pair can sit inside the interval and still be hard to read, something friends pointed out when I showed them the product. So I checked contrast first and only kept pairs that clear the WCAG AA floor of 4.5:1.

## Where the pixels come from

Another element I borrowed to give LogiCola 3 more personality was the original design made by Vitor Abreu while we were both studying at CODE University in Berlin. Vitor designed a logo, along with assets for social media.

The brand my friend Vitor envisioned had a retro feel. The logo is anchored by the pixelisation of the soda can. I leaned on that detail to shape every aspect of the new user interface, from the buttons to the icons. The social media covers featured a pattern made of rounded rectangles. These covers were my inspiration for the pattern experiments you will see below.

Drag the line to see Vitor's 2024 design and the new version.

<div data-island="before-after" data-before="/blog/the-new-logicola/x-then.png" data-after="/blog/the-new-logicola/x-now.png" data-alt="The LogiCola profile on X" data-width="1200" data-height="675"></div>

Everything I designed was built on top of Vitor's work. The new pattern draws inspiration from the old one, but makes the shapes pixelised. The new colours are the ones you clicked through in the colour section.

The colour scheme he picked in 2024 (gold, violet, green, red) was inspired by colours often associated with the Catholic church. Logic has been a foundational part of the core curriculum for Catholic education for centuries and many students using the product were Catholic. Gensler himself was a Jesuit priest. It was a fun nod, but in order to create a brand that felt more consistent, I decided to reverse the decision.

## Patterns

The social media covers inspired me to do a deeper exploration of pattern design, to expand the expression of the brand and in order to tie everything together. Now, the start screen of every exercise features a pattern. They also serve another purpose: helping you tell easy and hard sets apart. I use different patterns for each.

The process behind picking the patterns took days and multiple iterations. Here are the generators that survived. Three of them are currently being used:

<div data-island="pattern-gallery"></div>

## Where the icons come from

Following my decision to inject a retro feel into LogiCola 3, it made sense to make the icons pixelated. HackerNoon has an open-source [pixel icon library](https://pixeliconlibrary.com) that captures the essence of Gensler's software. This enabled me to create a funkier user interface. The SVG files also helped me make sure the app is still light and performant in places where the internet connection is slow or limited.

![The pixel glyphs LogiCola uses, and one of them enlarged](/blog/the-new-logicola/icons.png)

## Badges and pills

A silhouette is a few lines of CSS now. `clip-path` takes a polygon, and
the newer `corner-shape` property reshapes a corner without one; the
notched button that was tried was a single declaration. Every answer
pill is one polygon: a quarter-circle of radius 24 sampled onto a
four-pixel grid, four stairs, written once and stretched, so a two-word
option and a two-line one wear the same corner.

Selecting one changes its colour and never its size. The ring is part of
the same polygon, a band spliced into the outline, and the pill inside it
shrinks by exactly the ring's width, so nothing on the screen moves when
you make up your mind. The gap between ring and pill is not styling
either. A set's ink and its accent sit only 1.6 to 2.7 to 1 apart in
contrast, and the accessibility standard asks for 3:1 between adjacent
marks, so those two colours are not allowed to touch. Put the surface
between them and each is measured against the surface instead, which
both clear comfortably. The gap is load-bearing.

The chip beside each option is where Google's
[Material shape library](https://m3.material.io/styles/shape/overview-principles)
came in. Its shapes ship for Compose and Android, not the web, so they
could be looked at and never installed. Three were tried: the puffy
diamond, a clam-shell arch, and the wavy progress indicator as a square
wave. The diamond stayed, redrawn onto the four-pixel grid, and having to
redraw it is what stopped it looking borrowed. A shape you can install
arrives at someone else's resolution. One you have to redraw arrives at
yours.

![Material's puffy diamond and wavy indicator, and what the grid made of each](/blog/the-new-logicola/material.png)

![The chip's construction: eight rows of 2, 4, 6, 8, 8, 6, 4 and 2 cells](/blog/the-new-logicola/chip-construction.png)

Eight rows, 2·4·6·8·8·6·4·2 cells: a pixel diamond with one extra row at
the waist, which is the difference between puffy and merely
lozenge-shaped. It also echoes the ◇ of the modal logic sets.

The NEW tag got the same treatment: four silhouettes, one variable.

![Four NEW badge silhouettes: pill, pixel pill, sprite with a lip, and the gem](/blog/the-new-logicola/badge-variants.png)

The gem won: an elongated octagon with two-step chamfers, the diamond
idea adapted to a shape that has to hold text. Its magenta is Set C and
Set L's accent rather than a colour chosen for the badge. It was drawn at
24px and shipped at 20: the stairs still read at that height, and it
stopped shouting.

## Buttons

Vitor's can has one detail that runs through everything else: its
corners are stairs, two steps each, with the edge of every step
softened. The primary button was the first thing to reach for that
corner, and the first try used a single new CSS property,
`corner-shape`, which can notch a corner in one declaration but cannot
step it. The notched button looked too much like a Duracell battery.

Apply the rule from the icons section to the can's corner and the gem
falls out: the steps are straight edges and stay, the softening is a
curve and goes. Here is the same button under four silhouettes. Turn the
dial.

<div data-island="silhouettes"></div>

Gem is the can's corner drawn straight: two-step stairs on the
four-pixel grid, the shape the NEW badge had just settled on, stretched
to hold a label. Sprite is the answer pills' quantised round; on the
drill's button it rhymes with the answers instead of the can, the wrong
rhyme for the one solid-ink object on the screen. Gem went on every
primary button inside the drill. The site's own buttons, Donate among
them, still wear the sprite.

## One app, four icons

Installing the app raises a question the browser never asks: what does it
look like on a home screen next to everything else you own? The answer
used to be a dark can on a mint plate, drawn before the palette existed.

![The installed app icon, before and after](/blog/the-new-logicola/icon-pair.png)

The colours on the bubbled can didn't work, so the lab compared three
marks, that can, the bare favicon can and the wordmark, across the same
eight colour pairs, at three sizes down to 16 pixels. Two whole families
died on measurement. The sets' tab colours fail as grounds: they were
engineered to sit mid-value between light and dark chrome, and an icon
ground wants one extreme. An ink ground under that set's own accent fails
too, because two darks fight. What survives is one structure, a dark
chromatic ground with a pale mark, which also holds its edge on a light
dock, a dark dock and a photo wallpaper, where the old pale green
dissolved into the first. The pair is chartreuse on maroon, Set C's
surface under Set A's ink, so the icon stays inside the catalogue like
everything else.

The mark then splits by surface. The can, small and dense, takes the
browser tab and the iOS home screen; the wordmark takes everything the
manifest feeds, Android's launcher and an installed desktop app. One part
of that plan wasn't achievable: macOS reads the same manifest entry as
Android, so the two share a mark by construction, and the wordmark took
both. The tab icon keeps its magenta, because a bare mark has to survive
light and dark tab strips and the new pair is invisible on one of them.

![The same mark as four files: any, maskable, and how Android and iOS crop them](/blog/the-new-logicola/app-icons.png)

That shared entry is the maskable one, which is why the manifest carries
four files: a plated pair for the platforms that show an icon whole, and
a full-bleed pair for the ones that crop it to a circle, each fitted so
the artwork's furthest corner stays inside the safe zone. iOS, outside
the manifest, gets its own: square and unrounded, because it applies its
own squircle.

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

Here is the screen that comment was written about, just after checking
an answer, and the same moment now.

<div data-island="before-after" data-before="/blog/then-and-now/exercise-then.png" data-after="/blog/then-and-now/exercise-now.png" data-alt="A Set Q question screen" data-width="2466" data-height="1558"></div>

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

<div data-island="phone-states" data-before="/blog/the-new-logicola/phone-picked.png" data-after="/blog/the-new-logicola/phone-checked.png" data-alt="Set Q on a phone, two answers" data-width="679" data-height="1450"></div>

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
itself, and that's the fairer complaint.

Finally, there were many accessibility issues that prevented people
from [using the navigation
properly](https://news.ycombinator.com/item?id=40320473) and kept
people with visual impairments from [using the platform with screen
readers](https://news.ycombinator.com/item?id=40317716). For people not
acquainted with Gensler's pedagogy, it was not clear what made a
[well-formed formula](https://news.ycombinator.com/item?id=40319634)
(WFF: what are the grammatical and syntactical rules of that logical
system?).

<div data-island="clip" data-src="/blog/the-new-logicola/guide-open.mp4" data-poster="/blog/the-new-logicola/guide-open.png" data-alt="A translation question whose four options differ only in which letters are underlined; the Guide opens beside it with the rules for forming an imperative wff" data-width="1532" data-height="1080"><a href="/blog/the-new-logicola/guide-open.mp4">Watch the Guide open beside a translation question (video, 6 seconds)</a></div>

That is what the Guide is for. Most drills now carry one, a click away
from every question, with the rules for what counts as a well-formed
formula in that set's own notation: the parentheses in propositional
logic, the underlining in imperative logic, which is the set in the
recording. It opens beside the question rather than on top of it, and it
resizes, because you want it open _while_ you answer rather than instead
of answering.

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
