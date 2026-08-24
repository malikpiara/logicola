# 001 — Make the guide-pane drag composite-only

- **Commit:** 02f1d7b
- **Severity:** HIGH
- **Category:** Performance
- **Estimated scope:** 3 files, ~60 lines

## Problem

Dragging the desktop guide pane's resize grip runs four layout
pipelines at pointer frequency: `setPaneWidth` re-renders the whole
~1,960-line quiz tree per `pointermove`; the new width rewrites the
inheritable `--quiz-pane-offset` on `<html>`, invalidating style for
every descendant; `.quiz-pane-push` then animates **`margin-right`** —
a Layout property — on both the navbar and the entire quiz card; and
the decorative pattern layer regenerates + re-parses hundreds of SVG
rects per frame. Rule: only `transform` and `opacity` stay on the
GPU; margin/width and per-frame React state trigger
Layout→Paint→Composite across the page.

## Where

| File                               | Lines         | What's there                                                        |
| ---------------------------------- | ------------- | ------------------------------------------------------------------- |
| `app/globals.css`                  | ~85–92        | `.quiz-pane-push` margin transition                                 |
| `components/quiz/index.tsx`        | ~1053–1059    | `setPaneWidth` per pointermove                                      |
| `components/quiz/index.tsx`        | ~1093–1103    | root `--quiz-pane-offset` write, deps `[isSheetVisible, paneWidth]` |
| `components/quiz/patternLayer.tsx` | ~114, 129–133 | ResizeObserver → rAF → `setSvg` full redraw                         |

### Current code

```css
/* app/globals.css:85 */
.quiz-pane-push {
  margin-right: var(--quiz-pane-offset, 0px);
  transition: margin-right 300ms var(--ease-out-quart);
}
```

```ts
// components/quiz/index.tsx:1053
function onPointerMove(moveEvent: PointerEvent) {
  const width = Math.min(
    720,
    Math.max(384, startWidth + (startX - moveEvent.clientX))
  );
  setPaneWidth(width);
}
```

```ts
// components/quiz/index.tsx:1093 (inside a useEffect)
root.style.setProperty('--quiz-pane-offset', `${paneWidth}px`);
```

## Target

1. **During the drag** (pointerdown → pointerup): hold the live width
   in a ref. In the move handler, write styles imperatively on exactly
   three nodes held in refs — the pane (`style.width`), the grip
   (`style.right`), and each `.quiz-pane-push` node
   (`style.marginRight`) — wrapped in one `requestAnimationFrame` so
   at most one layout pass runs per frame. No React state, no root
   variable writes, mid-drag.
2. **On pointerup:** one `setPaneWidth(ref.current)` commit (feeds
   `aria-valuenow` and persistence), one root
   `--quiz-pane-offset` write.
3. **Open/close** (not drag) keeps the existing 300ms
   `var(--ease-out-quart)` push, but on `transform`, not margin:

```css
.quiz-pane-push {
  transform: translateX(calc(var(--quiz-pane-offset, 0px) * -1));
  transition: transform 300ms var(--ease-out-quart);
}
```

Caveat the executor must check: `translateX` on the quiz card
moves content without reflowing text (line lengths stay those of
the un-pushed width). If pushed text must rewrap, keep
`margin-right` for the _open/close_ transition only (300ms,
occasional — acceptable), and still remove every per-frame write
per steps 1–2. State which branch you took in the PR description. 4. **Pattern layer:** while a drag is active (gate on a
`data-quiz-pane-resizing` attribute the drag handler sets on
`document.documentElement`), the ResizeObserver callback returns
without drawing; one redraw fires on pointerup. Resize events from
window resizes (no attribute) keep the current rAF behavior.

**Why these values:** 300ms quart is the existing documented push
timing — unchanged; everything else is removal of per-frame work, not
new motion.

## Conventions to follow

- The drag already suspends the push transition via
  `[data-quiz-pane-resizing]` CSS (`app/globals.css` ~90:
  `transition: none`) — extend that existing mechanism, don't invent a
  parallel flag.
- `components/quiz/countUp.tsx` is the house exemplar for
  imperative-write-through-ref animation (rAF writes `textContent`,
  never state).
- Dated comments in these files are project memory — preserve them and
  add your own with today's date.

## Steps

1. Add refs for the pane node, grip node, and pushed nodes in
   `components/quiz/index.tsx`; find pushed nodes by class once on
   drag start (`document.querySelectorAll('.quiz-pane-push')`).
2. Rewrite `onPointerMove` per Target 1 (ref + single rAF).
3. Move `setPaneWidth` + root-var write to `onPointerUp`.
4. Change `.quiz-pane-push` to the transform (or documented margin)
   form; verify the `[data-quiz-pane-resizing]` suspend rule still
   matches.
5. Gate `patternLayer.tsx`'s observer on the resizing attribute;
   redraw once on pointerup.
6. Run `pnpm eslint` and `pnpm test`.

## Out of scope

- The pane's snap/open/close behavior, widths (384–720), and the
  grip's keyboard resize path.
- vaul internals; `patches/vaul@1.1.2.patch`.
- Any other `.motion-*` class.

## Verification

**Build**

- [ ] `pnpm eslint` and `pnpm vitest run` pass.

**Behavior**

- [ ] React DevTools profiler during a drag: zero QuizSession commits
      until pointerup, exactly one after.
- [ ] `aria-valuenow` on the separator equals the final width after
      release.
- [ ] Pattern layer redraws once on release; window-resize redraw
      still works.

**Feel**

- [ ] DevTools Performance trace while dragging fast: no frame over
      16.7ms attributable to Layout/Recalc Style.
- [ ] Open/close the pane: the 300ms push still eases with the quart
      settle; record and scrub — no content jump at either end.

## Notes

Whether pushed text should rewrap during the push (margin) or slide
rigidly (transform) is a taste call the audit can't make from code —
present both to Malik if the difference is visible on the quiz card.
