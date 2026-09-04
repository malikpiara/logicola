# Session handover — 2026-09-04

Release article (`content/blog/the-new-logicola.md`) editing pass on
`color-system-exploration`, plus the icon pass it forced. Ship date is
close; Malik is reviewing chapter by chapter.

## Article — decided and applied

- **Colour chapter**: C/J measurement paragraph, the Set R navy anecdote,
  the studio bullets, the two-constraints block and the Gensler closer are
  all cut. Malik rewrote the opening (fashion-house frame, brief, Color
  Moods); one legibility paragraph follows the studio island.
- **Vitor's brand → Patterns**: Malik's rewrite. Patterns section ends on
  the gallery island; "survived" means the cull before the seventeen.
- **Icons**: Malik's rewrite. Still owed (his call): the rule stated
  there (the Buttons chapter says "the rule from the icons section"), the
  six in-house topic icons, and the figure's third row.
- **Badges and pills**: trimmed to CSS-shapes-first + Material as the
  trigger. Material link fixed to `/styles/shape/overview-principles`;
  the "Web is not currently available" line lives on Material's
  shape-morph page, so the article states the observable instead.
- **Buttons** (Malik's heading): rewritten around the can's real corner —
  two-step stairs with rounded step edges, i.e. the gem with its rounding
  kept. The notch (`corner-shape: superellipse(-2.4)`) was a pre-release
  try, cut because it "looked too much like a Duracell battery" (Malik).
  Lives after Badges and pills on purpose (the gem is born there).
- **One app, four icons**: trimmed to before/after + what the icon lab
  compared; the three-bug forensics and the cropper aphorism are gone.
- **"These pairs are the same"**: `guide.png` replaced by the clip island
  (`guide-open.mp4`, poster from the GIF's first frame). The recording is
  the imperative set, so the paragraph is now about the Guides in general
  ("most drills", since only subsets 1·2·3·4·6·12·18 have one).
- **Then-and-now sliders**: the four 2498px screenshots were cropped 32px
  on the right to drop a baked-in scrollbar / gutter; markers say 2466.

## Code

- **Silhouette island** re-pointed at the primary button: Pill · Notch ·
  Gem (shipped) · Sprite (shipped). The lab's 9px chamfer "logo" entry
  matched neither the can nor anything shipped and is off the dial.
- **Clip island**: the whole stage is the toggle; pixel play/pause glyphs.
- **Icon pass**: no `lucide-react` import remains and the dependency is
  removed. Nav caret and mobile hamburger are library glyphs; the
  progress page uses the topic icons; a stepped ∀ was added for
  `quantificational`. `docs/pixel-ui.md` § Iconography records it.

## Open

- **Site buttons still wear the sprite** (Donate, marketing nav, newsletter
  pill) while every drill CTA is the gem. Decide: gem everywhere (Malik
  leaning, per the article's claim) or state the split as a rule.
- Badges and pills, Icons, Buttons prose: Malik's voice pass still to do.
- Progress page is a stale green mock, unlinked; icons fixed, page not.
- Chevron rotation on the nav trigger snaps (transition targets
  `transform`, Tailwind's `rotate-180` sets `rotate`).

## Tooling notes

- Turbopack served stale `globals.css` three times today, surviving Malik's
  own restarts; only stop → `rm -rf .next` → start fixes it. Next 16
  refuses a second `next dev` in one directory.
- A hidden Browser pane collapses the viewport to ~48px; use the
  chrome-devtools MCP for real screenshots (its screenshot `filePath`
  refuses the scratchpad — attach inline).
