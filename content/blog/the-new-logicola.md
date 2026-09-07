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

The landing page [prioritised the wrong
goals](https://github.com/malikpiara/logicola/issues/45) and put more
emphasis on user acquisition through an email subscription form than it
did on the logic drills:

> The front page looks like you need to sign up, or that it's a newsletter
> signup page. It spends a third of the page on the newsletter and the real
> content is hidden behind a tiny "chapters" menu at the top. The front page
> should be two big buttons for the two chapters so you can click through
> and start
> [directly](https://github.com/malikpiara/logicola/issues/45).

Other commenters noted the design felt [too modern and out of
place](https://news.ycombinator.com/item?id=40317838). My initial redesign made LogiCola 3 feel like enterprise software and was a departure from the original user interface.

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

The front page got the same treatment, and the fix is the shape the
reporter asked for. Drag the line.

<div data-island="before-after" data-before="/blog/then-and-now/landing-then.png" data-after="/blog/then-and-now/landing-now.png" data-alt="The LogiCola front page" data-width="1440" data-height="900"></div>

The drills are the front page now. You land, you see the exercises, you
pick one.

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

The social media covers inspired me to do a deeper exploration of pattern design, to expand the expression of the brand and tie everything together. Now, the start screen of every exercise features a pattern. They also serve another purpose: helping you tell easy and hard sets apart. I use different patterns for each.

The process behind picking the patterns took days and multiple iterations. Here are the generators that survived. Three of them are currently being used:

<div data-island="pattern-gallery"></div>

## Where the icons come from

Following my decision to inject a retro feel into LogiCola 3, it made sense to make the icons pixelated. HackerNoon has an open-source [pixel icon library](https://pixeliconlibrary.com) that captures the essence of Gensler's software. This enabled me to create a funkier user interface. The SVG files also helped me make sure the app is still light and performant in places where the internet connection is slow or limited.

![The pixel glyphs LogiCola uses, and one of them enlarged](/blog/the-new-logicola/icons.png)

## Retro-fying the UI

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

The gem then went onto every primary button in the drill. Here is that
button under the four silhouettes it was judged against.

<div data-island="silhouettes"></div>

## A new icon for mobile and desktop

Following my promise to make LogiCola accessible anywhere, I decided to pay more attention to the mobile and desktop versions this time around. Now you can install LogiCola on your device and practice logic drills even when you don't have an internet connection (as long as you opened a set/quiz before).

<div data-island="install"><p>Install LogiCola from your browser: on iPhone and iPad, tap Share, then Add to Home Screen; on Android and desktop Chrome, choose Install LogiCola from the browser menu; in Safari on a Mac, choose File, then Add to Dock.</p></div>

Most of the efforts to make LogiCola 3 work on mobile were made before. But the offline mode had never been properly implemented. I used this opportunity to refine the app and to introduce an icon that is still able to stand out among other apps without having to scream.

![The installed app icon, before and after](/blog/the-new-logicola/icon-pair.png)

Vitor designed 3 icons in 2024. A soda can with bubbles, a simpler soda can that we currently use on the browser tab, and a logotype. Below you can see some of the variations I played with before settling on the one we're using today.

![The three marks across the eight colour pairs at dock size: the 2024 bubbled can, the favicon can and the wordmark, with the picked cell marked](/blog/the-new-logicola/icon-marks.png)

## Better feedback

Another source of confusion came from how the options in a quiz were marked after you submitted an answer. I gave the same red outline to every option that was wrong. This meant it was impossible to tell which one was actually submitted by you. Seeing so many options turn red was also discouraging.

As a user on Hacker News pointed out:

> I'm taking one of the tests and the feedback seems strange: although it
> appears I got it right, because the selected answer turns green, many of
> the other answers turn red — which usually indicates a failure — and
> other unselected answers also turn green. It's
> [confusing](https://news.ycombinator.com/item?id=40317602).

Here is the screen that comment was written about and the same screen now.

<div data-island="before-after" data-before="/blog/then-and-now/exercise-then.png" data-after="/blog/then-and-now/exercise-now.png" data-alt="A Set Q question screen" data-width="2466" data-height="1558"></div>

The exercise tells you that you are allowed to select more than one answer. When you pick a wrong option, the visual cue now goes beyond colour and includes marking that option with a different shape (an X). Now, you can try again, instead of getting the answer revealed right away.

Here's what the states for an option look like now:

![The five states of an option, in the two moments they belong to](/blog/the-new-logicola/pills.png)

## Picking multiple options

One of the limitations of the earlier versions LogiCola was the lack of support for picking multiple options. Definitions (Set R) can be wrong in more than one way, but you could only pick one. Now you can select more than one correct answer.

> Few quiz questions require more than one selected answer. It's impossible
> to select more than one (...)
> — [issue #47](https://github.com/malikpiara/logicola/issues/47).

<div data-island="phone-states" data-before="/blog/the-new-logicola/phone-picked.png" data-after="/blog/the-new-logicola/phone-checked.png" data-alt="Set Q on a phone, two answers" data-width="679" data-height="1450"></div>

Above you can see what picking and checking an answer looks like now on mobile.
[Set R](/informal/definitions/quiz), the same set that issue was
filed against, is live. Give it a try.

## A guide for every set

For anyone who learned logic from a different book, nothing on the page said what counted as a [well-formed formula](https://news.ycombinator.com/item?id=40319634) (wff, the syntactical rules of that logical system).

I received multiple comments pertaining to the notation and to an extra pair of parentheses outside of propositional expressions:

> You may want to check how you normalize the logical representations.
> `(R ^ L) v N` is marked incorrect and `((R ^ L) v N)` is marked correct.
> These pairs are the
> [same](https://news.ycombinator.com/item?id=40319634).

In Gensler's system every binary connective takes its own parentheses. So the two expressions are not the same formula in this system: one is well-formed and one is not. A student who never learns about the precedence of logical operators can join any two wff by wrapping them and never be wrong.

Now most sets have a reference guide that you can check whenever you want to understand the notation or a concept that is a key to the completion of an exercise.

<div data-island="clip" data-src="/blog/the-new-logicola/guide-open.mp4" data-poster="/blog/the-new-logicola/guide-open.png" data-alt="A translation question whose four options differ only in which letters are underlined; the Guide opens beside it with the rules for forming an imperative wff" data-width="1532" data-height="1080"><a href="/blog/the-new-logicola/guide-open.mp4">Watch the Guide open beside a translation question (video, 6 seconds)</a></div>

Guides open beside the questions and they are resizable. This way, you can keep your focus on the exercises and understand the shape of a valid answer without interrupting your flow.

## Better accessibility

Despite setting out to make LogiCola more accessible, my considerations did not go beyond geography, operating systems and internet connection.

Many people could not reach the drills at all because the
menu ignored their screen reader. This essentially meant they couldn't use LogiCola 3 at all:

> I'm using Firefox on Windows with a screen reader and when I press the
> chapters button on the web page, absolutely nothing
> [happens](https://news.ycombinator.com/item?id=40317716).

Additionally, the navigation also vanished when the
pointer strayed:

> The button appears to be hover only, which [is
> bad](https://news.ycombinator.com/item?id=40320473). On top of that, it
> expands content down to show the chapters, but if you move over and then
> down, you exit the hover area and it closes. There are no visual
> indications of the boundaries of the hover area.

The navigation is a real menu now: a button that opens
a list of links, works from the keyboard, and tells a screen reader what
it is.

The same standard now applies inside the drills. Every set's colours were
checked for contrast before they were allowed in. A wrong pick is marked
by shape as well as colour. There are still many accessibility challanges that were left unaddressed, but I'm aware of them now thanks to your feedback.

## Infinitely generated questions

Fixed-length quizzes are gone. They have been replaced by a point system that works like the original. Your score climbs as you answer, takes a hit when you miss, and you finish only when you reach 100 points.

This shape has a name in the learning literature: mastery learning, the idea Bloom proposed in 1968. The meta-analysis that followed ([Kulik, Kulik and Bangert-Drowns, 1990](https://doi.org/10.3102/00346543060002265)) found mastery-based courses raise exam performance by about half a standard deviation, with the largest gains going to the weakest students.

Now the interface has a progress bar, so you can see how far along you are. To inject personality and make the platform feel more alive, I introduced micro-transitions and animations that were inspired by video games and the good old days of the internet.

Here are six of the directions I prototyped with Claude. Press **Miss** to try them.

<div data-island="damage-bar"></div>

To make decisions about what made it into the product, I ran in-person tests where I tried to gauge people's reactions. Through some iterations, option A (flash after taking damage) won.
