---
title: 'Back to the original formula'
dek: "Building LogiCola's new design language from what I found reverse-engineering the 2008 original."
date: '2026-09-08'
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

Today, many students use Chromebooks or mobile devices. In August, more than 100 devices in
Asia visited LogiCola 3 in a single week and 72 of them did at least one exercise.
Of those, 66 came from the <span class="post-badge"><svg class="post-badge-flag" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path fill="#CE1126" d="M36 27c0 2.209-1.791 4-4 4H4c-2.209 0-4-1.791-4-4V9c0-2.209 1.791-4 4-4h28c2.209 0 4 1.791 4 4v18z"/><path fill="#0038A8" d="M32 5H4C1.791 5 0 6.791 0 9v9h36V9c0-2.209-1.791-4-4-4z"/><path fill="#EEE" d="M1.313 29.945l17.718-11.881L1.33 6.041C.519 6.773 0 7.822 0 9v18c0 1.171.512 2.214 1.313 2.945z"/><path fill="#FCD116" d="M16.07 16.52l.043 1.153 1.115.294-1.083.396.065 1.152-.712-.908-1.075.417.643-.957-.73-.893 1.11.316zM1.603 7.982l.866.763.98-.607-.458 1.059.88.745-1.148-.108-.437 1.066-.251-1.125-1.151-.086.993-.586zm.431 17.213l.574 1 1.124-.257-.774.854.594.989-1.052-.472-.757.871.123-1.148-1.061-.45 1.128-.238zM10 18c0 1.657-1.343 3-3 3s-3-1.344-3-3c0-1.657 1.343-3 3-3s3 1.343 3 3z"/><path d="M7.595 12.597l-.157 2.648-.244-.036.085-3.074L7 11.953l-.279.182.085 3.074-.244.036-.157-2.648-.353.218.329 2.697h1.238l.329-2.697zm-1.19 10.806l.157-2.648.244.036-.086 3.074.28.182.279-.182-.085-3.074.244-.036.157 2.648.353-.218-.329-2.698H6.381l-.329 2.698zm-3.647-2.004l1.985-1.759.146.196-2.233 2.113.068.327.327.069 2.113-2.235.197.147L3.6 22.242l.404.094 1.675-2.139-.438-.438-.438-.438-2.139 1.675zm8.484-6.799l-1.985 1.761-.146-.197 2.233-2.113-.068-.327-.327-.069-2.113 2.234-.197-.146 1.761-1.985-.404-.094-1.675 2.139.438.438.438.438 2.139-1.675zm-9.645 2.805l2.649.157-.037.244-3.074-.086-.182.28.182.279 3.074-.085.037.244-2.649.157.218.353 2.697-.329V17.38l-2.697-.328zm10.806 1.19l-2.649-.157.037-.244 3.074.085.182-.279-.182-.28-3.074.086-.037-.244 2.649-.157-.218-.353-2.698.328v1.239l2.698.329zM3.6 13.758l1.761 1.985-.197.146-2.113-2.234-.327.069-.068.327 2.233 2.113-.146.197L2.758 14.6l-.094.404 2.139 1.675.438-.438.438-.438-1.675-2.139zm6.8 8.484l-1.761-1.985.197-.147 2.113 2.235.327-.069.068-.327-2.233-2.113.146-.196 1.985 1.759.094-.403-2.139-1.675-.438.438-.438.438 1.675 2.139z" fill="#FCD116"/></svg> Philippines</span>. **Over half
of them were phones and tablets.** This is a signal I receive with
enthusiasm. The product seems to be delivering on the original promise
I made in 2024.

Today I'm releasing a new version that answers the feedback you shared through the [Hacker News
discussion](https://news.ycombinator.com/item?id=40297642),
[GitHub issues](https://github.com/malikpiara/logicola/issues?q=is%3Aissue%20state%3Aclosed) and
email. This release brings back _mastery learning_ through infinite translation drills and embeds some of
the playfulness from the original software with my own touch.

## On soul sucking design

The landing page [prioritised the wrong
goals](https://github.com/malikpiara/logicola/issues/45) and put more
emphasis on user acquisition through an email subscription form than it
did on the logic drills.

Other commenters noted the design felt [too modern and out of
place](https://news.ycombinator.com/item?id=40317838). My initial redesign made LogiCola 3 feel like enterprise software, a departure from the vibrancy of the old interface:

> Making the port look modern by using a modern look makes tons of sense. The soul sucking feeling it produces comes from the modern look's motivations, which is not the author's fault alone, but instead from the 'market and sell everything' era we current live within.

The colourful backgrounds that change on every refresh have been one of the defining elements of the original brand. I borrowed the colour treatment from the original, but assigned a unique palette to every set. Syllogistic and propositional logic wear different colours. This way, you'll always know where you are.

The Color dialog found in the 2008 program reveals nine colour schemes, each at three depths: Pastel, Moderate and Deep. Here are six of the schemes, with a background, a panel and a dark band along the foot. Roll the dice to see random ones, and try the three depths:

<div data-island="pastel-random"></div>

Here's the screen that used to open every exercise, against the one that opens it now. Drag the slider to compare.

<div data-island="before-after" data-before="/blog/then-and-now/start-then.png" data-after="/blog/then-and-now/start-now.png" data-alt="The screen that opens an exercise" data-width="2466" data-height="1558"></div>

Both the old headline, "Ready for a challenge?", and the description were taken directly from Khan Academy. Every set featured the same screen because they were afterthoughts for a release that was focused on bringing you logic practice. The new quiz window gives you context: which set and which type of logic drill you're in, before you advance.

The drills are on the front page now, so you can pick one and get started right away.

<div data-island="before-after" data-before="/blog/then-and-now/landing-then.png" data-after="/blog/then-and-now/landing-now.png" data-alt="The LogiCola front page" data-width="1440" data-height="900"></div>

## How the original made its colours

Each of the little screens in the last section is composed the
way the program composes a real one, from colours that are computed instead of handpicked. Every pastel is a
saturated hue pushed light. Every pair sets a hue against its complement on an RGB colour
wheel: aqua with rose, blue with cream, lime with magenta. And the dark
strip along the bottom is the background colour run through
[InvertRect](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-invertrect),
a Windows drawing function that performs a logical NOT on the colour
values of every pixel in a rectangle. Every bit flips. For a byte, that
is the same as taking it away from `FF`: `FF - CD = 32`, and
`FF - 00 = FF`. The strip is the exact complement of its own background, and
the black title text goes white by the same rule.

Here is the whole scheme, reconstructed
from the decompiled routine:

<div class="code2008"><pre><code>level      = 0xCD                    <i># Pastel (0xB9 Moderate, 0x91 Deep)</i>
background = rgb(level, 0xFF, 0xFF)  <i># Aqua</i>
panel      = rgb(0xFF, level, level) <i># Rose</i>
band       = ~background             <i># InvertRect</i></code></pre><span class="band"></span></div>

When you change the depth, only `level` changes; the pinned `FF` channels never
move, which is why deeper schemes grow more intense instead of going
muddy. The band follows wherever the background goes.

<div class="post-swatches">
<figure><div class="screen2008" style="--g:#CDFFFF;--p:#FFCDCD;--b:#320000"><span class="panel"></span><span class="band"></span></div><figcaption>Pastel · CD → 32</figcaption></figure>
<figure><div class="screen2008" style="--g:#B9FFFF;--p:#FFB9B9;--b:#460000"><span class="panel"></span><span class="band"></span></div><figcaption>Moderate · B9 → 46</figcaption></figure>
<figure><div class="screen2008" style="--g:#91FFFF;--p:#FF9191;--b:#6E0000"><span class="panel"></span><span class="band"></span></div><figcaption>Deep · 91 → 6E</figcaption></figure>
</div>

## How the new colours were chosen

While speaking with a friend, I realised I would never be able to give LogiCola 3 an identical voice to the original because I'm not Gensler. So instead of making a carbon copy, I decided to leave my own imprint while honouring the heritage. I spent the last winter reading books about eponymous fashion houses like Gucci, Chanel, Dior and Louis Vuitton. Chanel has had only three official successors. Reading about how they operated and how they drew inspiration from the original source, while keeping the brand relevant and authoring new products emboldened me to wear a similar hat.

I wanted to pick colours that evoked the original while bringing new excitement. And I was hoping to make every set rhyme, while keeping them different enough that you could tell them apart. The colour schemes had to work well together and in isolation.

Ruxandra Duru authored a [brilliant toolkit](https://medium.com/swlh/two-color-combinations-a-toolkit-feeb9e51765c) on how to combine two colours based on the amount of stimulation they can create. Later, she built a [tool that suggests pairs of colours based on a selected amount of stimulation](https://colormoods.co), along with Brian Li. Since this was exactly what I was trying to do, I ported the model behind it and started experimenting.

**Stimulation** comes out of three terms: overall intensity, the lightness gap between the two colours, and the distance between their hues. The end result tells us how much visual excitement a pair generates, ranging from sleep coma to hyper excitement. I aimed to create pairs that were in between both extremes.

To make the colour schemes of every set feel connected, I picked pairs within the 0.45–0.58 stimulation interval. I added white to every hue, to soften them and preferred pale surfaces over dark ones, to make the platform feel playful but not heavy. To create stronger cohesion between sets, I painted them with patterns that surface colours from the other sets. You can play with the Colour Lab below.

<div data-island="colour-studio"></div>

The score has one blind spot that matters for a study tool: it knows nothing about legibility. A pair can sit inside the interval and still be hard to read, something friends pointed out when I showed them the product. So I checked contrast first and only kept pairs that clear the WCAG AA floor of 4.5:1.

## Where the pixels come from

Another element I borrowed to give LogiCola 3 more personality was the original design made by Vitor Abreu while we were both studying at CODE University in Berlin. Vitor designed a logo, along with assets for social media.

The brand my friend Vitor envisioned had a retro feel. The logo is anchored by the pixelisation of the soda can. I leaned on that detail to shape every aspect of the new user interface, from the buttons to the icons. The social media covers featured a pattern made of rounded rectangles. The new pattern keeps the old one's idea and pixelises the shapes. The new colours are the ones you clicked through in the colour section.

<div data-island="before-after" data-before="/blog/the-new-logicola/x-then.png" data-after="/blog/the-new-logicola/x-now.png" data-alt="The LogiCola profile on X" data-width="1200" data-height="675"></div>

The colour scheme picked in 2024 (gold, violet, green, red) was inspired by hues often associated with the Catholic Church. Logic has been a foundational part of the core curriculum for Catholic education for centuries and many students using the product were Catholic. Gensler himself was a Jesuit priest. It was a fun nod, but to make the brand more consistent, I retired it.

The social media covers inspired me to do a deeper exploration of pattern design, to expand the expressiveness of the brand and tie everything together. Every exercise now opens on a pattern. Easy and hard drills have different patterns so you can tell them apart.

The process behind picking the patterns took days and multiple iterations. Here are the generators that survived. Three of them are currently being used:

<div data-island="pattern-gallery"></div>

## Designing a retro user interface

HackerNoon has an open-source [pixel icon library](https://pixeliconlibrary.com) that captures the essence of the early personal computer era. LogiCola was a perfect home for them. Their SVG files also helped me make sure the app is light and performant in places where the internet connection is slow or limited.

![The pixel glyphs LogiCola uses, and one of them enlarged](/blog/the-new-logicola/icons.png)

I looked to Google's [Material shape library](https://m3.material.io/styles/shape/overview-principles) to explore how shapes could be used to add flair to the interface in a thoughtful way. Following the decision of using pixelised artefacts, I redrew Google's shapes. The result is below.

<div data-island="material-shapes"><img src="/blog/the-new-logicola/material.png" alt="Material's shape library, every shape drawn at 96 px on the 4 px grid, with the diamond marked as the one that was picked" width="1520" height="1617"></div>

Through this approach, I arrived at components like the buttons and the badge, used throughout the platform to signal new content. I went through multiple shapes and sat with them for a while. In the end, I picked the diamond turned on its side and stretched to hold the word.

![Four NEW badge silhouettes: pill, pixel pill, sprite with a lip, and the diamond](/blog/the-new-logicola/badge-variants.png)

Here is the primary button under different shapes.

<div data-island="silhouettes"></div>

## Install it or use it offline

Following my promise to make LogiCola accessible anywhere, I paid more attention to the mobile and desktop versions this time around. You can now install LogiCola on your device and practise logic drills even when you don't have an internet connection, as long as you have opened it before. You can use the browser like you would before.

<div data-island="install"><p>Install LogiCola from your browser: on iPhone and iPad, tap Share, then Add to Home Screen; on Android and desktop Chrome, choose Install LogiCola from the browser menu; in Safari on a Mac, choose File, then Add to Dock.</p></div>

Most of the efforts to make LogiCola 3 work on mobile were made before. But the offline mode had never been properly implemented. I used this opportunity to refine the app and to introduce an icon that is still able to stand out among other apps without having to scream.

![The installed app icon, before and after](/blog/the-new-logicola/icon-pair.png)

Vitor designed three icons in 2024: a soda can with bubbles, a simpler soda can that now sits on the browser tab, and a logotype. Below are some of the variations I played with before settling on the one in use today.

![The three marks across the eight colour pairs at dock size: the 2024 bubbled can, the favicon can and the wordmark, with the picked cell marked](/blog/the-new-logicola/icon-marks.png)

## Better feedback

Another source of confusion came from how the options in a quiz were marked after you submitted an answer. I gave the same red outline to every option that was wrong. This meant it was impossible to tell which one was actually submitted by you. Seeing so many options turn red was also discouraging.

As a user on Hacker News pointed out:

> I'm taking one of the tests and the feedback seems strange: although it
> appears I got it right, because the selected answer turns green, many of
> the other answers turn red (which usually indicates a failure) and
> other unselected answers also turn green. It's
> [confusing](https://news.ycombinator.com/item?id=40317602).

Here is the screen that comment was written about and the same screen now.

<div data-island="before-after" data-before="/blog/then-and-now/exercise-then.png" data-after="/blog/then-and-now/exercise-now.png" data-alt="A Set Q question screen" data-width="2466" data-height="1558"></div>

When you pick a wrong option, the visual cue now goes beyond colour and includes marking that option with a different shape (an X). And you can try again, instead of getting the answer revealed right away.

Here's what the states for an option look like now:

![The four states of an option, in the two moments they belong to](/blog/the-new-logicola/pills.png)

One of the limitations of the earlier versions of LogiCola was the lack of support for picking multiple options. Definitions (Set Q) can be wrong in more than one way, but you could only pick one. You can select more than one correct answer now, and the exercise tells you when a question allows it.

> Few quiz questions require more than one selected answer, it [is] impossible
> to select more than one (...)
> — [issue #47](https://github.com/malikpiara/logicola/issues/47).

<div data-island="phone-states" data-before="/blog/the-new-logicola/phone-picked.png" data-after="/blog/the-new-logicola/phone-checked.png" data-alt="Set Q on a phone, two answers" data-width="679" data-height="1450"></div>

Above you can see what picking and checking an answer looks like now on mobile.
[Set Q](/informal/definitions/quiz), the same set that issue was
filed against, is live. Give it a try.

## A guide for every set

For anyone who learned logic from a different book, nothing on the page said what counted as a well-formed formula (wff, a formula that follows the syntax rules of that logical system).

The parentheses drew several comments:

> You may want to check how you normalize or distinguish the logical representations. (...) These pairs are the
> [same](https://news.ycombinator.com/item?id=40319634), the extra parentheses don't change the meaning of the statements but only the ones with the extra parentheses are marked as correct.

The pair in question was `(R ^ L) v N`, marked incorrect, against `((R ^ L) v N)`, marked correct. In Gensler's system every binary connective takes its own parentheses. So the two expressions are not the same formula in this system: one is well-formed and one is not. A student who never learns about the precedence of logical operators can join any two wffs by wrapping them and never be wrong.

Most sets now have a reference guide that you can check whenever you want to understand the notation or a concept that is a key to the completion of an exercise.

<div data-island="clip" data-src="/blog/the-new-logicola/guide-open.mp4" data-poster="/blog/the-new-logicola/guide-open.png" data-alt="A translation question whose four options differ only in which letters are underlined; the Guide opens beside it with the rules for forming an imperative wff" data-width="1532" data-height="1080"><a href="/blog/the-new-logicola/guide-open.mp4">Watch the Guide open beside a translation question (video, 6 seconds)</a></div>

Guides open beside the questions and they are resizable, so you can keep your focus on the exercise and understand the shape of a valid answer without interrupting your flow.

## Better accessibility

Despite setting out to make LogiCola more accessible, my considerations did not go beyond geography, operating systems and internet connection.

Many people could not reach the drills at all, because the
menu ignored their screen reader:

> I'm using [Firefox] on Windows with a screen reader and when I press the
> chapters button on the web page, absolutely nothing
> [happens](https://news.ycombinator.com/item?id=40317716), so it is not
> clear how I'm supposed to test the website.

The navigation also vanished when the pointer strayed:

> The button appears to be hover only, which [is
> bad](https://news.ycombinator.com/item?id=40320473). On top of that, it
> expands content down to show the chapters, but if you move over and then
> down (instead of down then over), you exit the hover area and it closes. There are no visual
> indications of the boundaries of the hover area.

The navigation is a real menu now: a button that opens
a list of links, works from the keyboard, and tells a screen reader what
it is.

The same standard now applies inside the drills. Every set's colours were
checked for contrast before they were allowed in. A wrong pick is marked
by shape as well as colour. There are still many accessibility challenges I haven't addressed yet, but I'm aware of them now thanks to your feedback.

## Infinitely generated questions

One of the commenters on Hacker News
[noted](https://news.ycombinator.com/item?id=40326302) the platform was
too focused on language and philosophical logic, failing to address
mathematical logic. Back then, only propositional translations and
informal logic (meanings and definitions) exercises were online. Since
then, I added [syllogistic](/syllogistic/translations/basic/quiz),
[modal](/modal/translations/basic/quiz),
[deontic](/deontic/translations/imperative/quiz) and
[belief](/belief/translations/basic/quiz) translations into the mix.

Everything built up to 2025 was done by hand and required
studying the original software and Gensler's textbook up close.
Routledge sent me a physical copy of the textbook.
And by reverse engineering the 2008 program with Ghidra and AI tools, I gained a deeper understanding of the original and wrote generators that will
give you endless practice in translations and explain every mistake you
make right away.

The translation drills now run on templates. Most come from what I learned from the decoded source code from 2008. There are also new templates authored by me based on gaps of the original program. Here is one of Set C's 34 templates as the program stores it:

<div class="code2008"><pre><code>*21 R:Gk.Only if you’re $B are you $D.Only if $j, $q
                <i># template 21, an untraced R:Gk., then the two prompts</i>
c:a($q ⊃ $j)    <i># the options begin; a is the answer</i>
b($j ≡ $q)
d$j ⊃ $q        <i># d, the bare formula</i>
c($d)           <i># c is d, wrapped</i>
R(~$j ⊃ ~$q)    <i># the contrapositive of a; untraced</i>
j:y             <i># a jump: the record ends</i></code></pre></div>

$B and $D are adjectives, drawn fresh each time; their first letters
become $j and $q. I decoded records like this one and rebuilt each as a
generator that draws new names every time; the rule, the options and
the hints stay his. Press Draw another.

<div data-island="template-roll" data-num="21" data-letters="abdc"><p>One of Set C's templates, drawn fresh each time: the wording changes and the logic does not.</p></div>

**Fixed-length quizzes are gone.** They have been replaced by a point system that works like the original. Your score climbs as you answer, takes a hit when you miss, and you finish only when you reach 100 points.

This shape has a name in the learning literature: mastery learning, the idea Bloom proposed in 1968. The meta-analysis that followed ([Kulik, Kulik and Bangert-Drowns, 1990](https://doi.org/10.3102/00346543060002265)) found mastery-based courses raise exam performance by about half a standard deviation, with the largest gains going to the weakest students.

The interface has a progress bar now, so you know how far along you are. To inject personality and make the platform feel more alive, I introduced micro-transitions and animations that were inspired by video games like Mega Man and Street Fighter.

Here are six of the directions I prototyped with AI tools. Press **Miss** to try them.

<div data-island="damage-bar"></div>

To make decisions about what made it into the product, I ran in-person tests where I tried to gauge people's reactions. Through some iterations, option A (flash after taking damage) won. You can see it on the desktop and mobile versions of the app.

What started out as a preservation effort without a map became a modernisation, built from the original's own formula. LogiCola 3 has gained new design elements, but it also gained new templates and a lexicon revision that makes the language used in the drills more relatable to students in 2026. I ventured into territory that is deeply outside of my comfort zone because of AI tools we have at our disposal and because of your support.

### Thank you

This release exists because people took the time to write and share their feedback with me: gmdrd, Jtsummers, dexwiz, gostsamo, auggierose and gorjusborg on Hacker News; boxed, mnba, tessprime and rabuf on GitHub.

Vitor Abreu and Olena Diakonova set the brand foundation this work builds on. Ruxandra Duru expanded my understanding of colour theory, and Emil Kowalski taught me how to craft animations. Florian Grote and Sebastian Rosengrün, my professors at CODE University, gave me feedback and encouragement while I was a student there, and Ben Bachem read an early draft. Without the textbook Andrew Beck sent from Routledge, a generous donation from Professor Timothy Kearns, and the Ghidra MCP server that LaurieWired started and Benjamin Ethington expanded, this platform would not exist.

The pixel icons are HackerNoon's. LogiCola is built with Khan Academy's [KaTeX](https://katex.org) for the formulas, and this blog with Sebastian Sdorra's [Content Collections](https://www.content-collections.dev).
