'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import Option from '@/components/option';
import { PatternLayer } from '@/components/quiz/patternLayer';
import { EyeDropperIcon, PaintBrushIcon } from '@/components/quiz/pixelIcons';
import { PixelTip } from '@/components/ui/pixelTip';
import type { QuizPatternKind } from '@/lib/patterns';
import {
  stimulationOf,
  temperatureOf,
  suggestPartners,
  contrastRatio,
  hexToHsl,
  hslToHex,
  type Suggestion,
} from '@/lib/stimulation';
import { perceptualDist } from '@/lib/patterns';

/**
 * The mixer (Malik, 2026-08-29; plane form 2026-08-30). The native colour
 * input opened the OS dialog — unstyleable, abrupt, and outside the
 * studio's grammar. This picker is ours, in the shape every picker
 * shares — a saturation × brightness plane under a hue strip — with the
 * studio's argument drawn on it instead of enforced by it: the dashed
 * outline is the role's measured band, where the product's surfaces or
 * inks actually live, and it renders by inversion (mix-blend difference)
 * because marking a region by inverting it is the 2008 program's own
 * band trick. The plane roams the full space — the article's deliberate
 * failures are picks like any other — and the three 2008 depths are
 * one-click returns into the band. Hex field and eyedropper replicate
 * exact targets.
 */
/**
 * Chip words per role (Malik, 2026-08-31). The 2008 dialog's
 * Pastel/Moderate/Deep described grounds, so only the surface mixer can
 * wear them honestly: on the ink and accent bands the light end is
 * nowhere near pastel, and a genuinely pastel pick sat beside an
 * unpressed "Pastel" chip — vocabulary claiming something it didn't
 * mean. Ink and accent take plain relative words instead.
 */
const MIXER_DEPTHS = {
  surface: ['Pastel', 'Moderate', 'Deep'],
  ink: ['Light', 'Mid', 'Deep'],
  accent: ['Light', 'Mid', 'Deep'],
} as const;
/**
 * Per-role bands: surface/ink mirror lib/stimulation's measured bands;
 * accent is measured off the five shipped accents (L 0.20–0.40, S high).
 * `l` runs light→dark so depth t=0 is Pastel and t=1 is Deep, the 2008
 * dial's own order.
 */
const MIXER_BANDS = {
  surface: { s: [0.65, 1] as const, l: [0.9, 0.76] as const },
  ink: { s: [0.6, 1] as const, l: [0.24, 0.1] as const },
  accent: { s: [0.7, 1] as const, l: [0.4, 0.2] as const },
} as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** HSL↔HSV bridges: the plane renders in HSV — the two-gradient square
 *  every picker draws — while the model and the bands speak HSL. */
const hslToHsv = (s: number, l: number): [number, number] => {
  const v = l + s * Math.min(l, 1 - l);
  return [v === 0 ? 0 : 2 * (1 - l / v), v];
};
const hsvToHsl = (sv: number, v: number): [number, number] => {
  const l = v * (1 - sv / 2);
  return [l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l), l];
};

/**
 * Each role's band as a path on the plane (viewBox 0–100). The band is a
 * rectangle in HSL, but the HSL→HSV mapping bends its edges, so each
 * edge is sampled rather than drawn corner to corner.
 */
function bandPath(band: (typeof MIXER_BANDS)[keyof typeof MIXER_BANDS]) {
  const pt = (s: number, l: number) => {
    const [sv, v] = hslToHsv(s, l);
    return `${(sv * 100).toFixed(1)} ${((1 - v) * 100).toFixed(1)}`;
  };
  const N = 8;
  const edge = (f: (x: number) => [number, number], from: number) =>
    Array.from({ length: N + 1 - from }, (_, i) => pt(...f((i + from) / N)));
  return (
    'M' +
    [
      ...edge((x) => [lerp(band.s[0], band.s[1], x), band.l[0]], 0),
      ...edge((x) => [band.s[1], lerp(band.l[0], band.l[1], x)], 1),
      ...edge((x) => [lerp(band.s[1], band.s[0], x), band.l[1]], 1),
      ...edge((x) => [band.s[0], lerp(band.l[1], band.l[0], x)], 1),
    ].join(' L') +
    ' Z'
  );
}
const BAND_PATHS = {
  surface: bandPath(MIXER_BANDS.surface),
  ink: bandPath(MIXER_BANDS.ink),
  accent: bandPath(MIXER_BANDS.accent),
};

/**
 * The value's two notations (Malik, 2026-08-31): hex is the article's
 * own tongue, hsl() is the one Duru's model thinks in — the same three
 * axes the metrics below weigh. The swatch beside the field toggles
 * between them, DevTools' swatch-click convention.
 */
type Notation = 'hex' | 'hsl';

const fmtHsl = (hex: string) => {
  const [h, s, l] = hexToHsl(hex);
  return `hsl(${Number.isNaN(h) ? 0 : Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
};
const displayValue = (hex: string, notation: Notation) =>
  notation === 'hsl' ? fmtHsl(hex) : hex.toUpperCase();

/**
 * Liberal in both notations whatever the display mode: a bare or
 * #-prefixed hex, or a complete hsl(h s% l%) — commas or spaces, %
 * optional. Nothing parses until the text is whole (hex's sixth digit,
 * hsl's closing paren), so half-typed values never commit under the
 * caret.
 */
const parseColour = (text: string): string | null => {
  const t = text.trim();
  const hx = t.match(/^#?([0-9a-f]{6})$/i);
  if (hx) return '#' + hx[1];
  const hs = t.match(
    /^hsl\(\s*(\d{1,3})(?:deg)?[\s,]+(\d{1,3})%?[\s,]+(\d{1,3})%?\s*\)$/i
  );
  if (hs) {
    return hslToHex(
      Number(hs[1]) % 360,
      Math.min(100, Number(hs[2])) / 100,
      Math.min(100, Number(hs[3])) / 100
    );
  }
  return null;
};

/**
 * The value field (Malik, 2026-08-30; notations 2026-08-31). It keeps a
 * local draft, so it's actually typeable — the naive controlled input
 * dropped every keystroke that wasn't already a full #RRGGBB, and only
 * pasting worked — and it re-syncs when the colour or notation changes
 * from outside (derive-during-render, the same sanctioned pattern
 * pixelTip's suppression uses). Blur snaps back to canonical form.
 */
function ValueField({
  value,
  notation,
  onCommit,
  className,
  label,
}: {
  value: string;
  notation: Notation;
  onCommit: (hex: string) => void;
  className: string;
  label: string;
}) {
  const shown = displayValue(value, notation);
  const [draft, setDraft] = useState(shown);
  const [last, setLast] = useState(shown);
  if (shown !== last) {
    setLast(shown);
    setDraft(shown);
  }
  return (
    <input
      type='text'
      className={className}
      value={draft}
      maxLength={24}
      spellCheck={false}
      aria-label={label}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        setDraft(e.target.value);
        const hex = parseColour(e.target.value);
        if (hex && hex.toLowerCase() !== value.toLowerCase()) onCommit(hex);
      }}
      onBlur={() => setDraft(shown)}
    />
  );
}

function Mixer({
  role,
  value,
  notation,
  onNotation,
  onPick,
}: {
  role: keyof typeof MIXER_BANDS;
  value: string;
  notation: Notation;
  onNotation: (n: Notation) => void;
  onPick: (hex: string, settle: boolean) => void;
}) {
  const band = MIXER_BANDS[role];
  const [h0, s0, l0] = hexToHsl(value);
  // A grey has no hue of its own (hexToHsl reports NaN), so hue is the
  // mixer's own state: adopted from the colour whenever the colour knows
  // it, held steady when it doesn't — otherwise reaching the plane's
  // white or black edge would snap the whole plane to red.
  // Derive-during-render, no effect.
  const [hue, setHue] = useState(() => (Number.isNaN(h0) ? 0 : h0));
  const [prevH0, setPrevH0] = useState(h0);
  if (!Object.is(h0, prevH0)) {
    setPrevH0(h0);
    if (!Number.isNaN(h0)) setHue(h0);
  }

  const [sv, v] = hslToHsv(s0, l0);
  const t = clamp01((band.l[0] - l0) / (band.l[0] - band.l[1]));
  // The three words partition the band: any in-band lightness belongs
  // to its nearest depth, so a chip is always lit while the colour is
  // home — dots-with-dead-zones left #C0FDD4 (t≈0.2, plainly pastel)
  // claiming nothing (Malik, 2026-08-31). Saturation doesn't veto the
  // chips either; clicking one still pulls S back into the band. The
  // small slack past the band's ends keeps a just-outside pick named.
  const nearL = l0 <= band.l[0] + 0.08 && l0 >= band.l[1] - 0.08;

  const planeRef = useRef<HTMLDivElement>(null);
  const pickAt = (x: number, y: number) => {
    const [ns, nl] = hsvToHsl(clamp01(x), clamp01(y));
    onPick(hslToHex(hue, ns, nl), false);
  };
  const planePoint = (e: React.PointerEvent) => {
    const r = planeRef.current!.getBoundingClientRect();
    pickAt((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
  };

  // The EyeDropper API is Chromium-only; the button appears where it
  // exists. useSyncExternalStore with a false server snapshot keeps the
  // server and client first renders identical (no effect, no cascade).
  const canSample = useSyncExternalStore(
    () => () => {},
    () => 'EyeDropper' in window,
    () => false
  );
  const sample = () => {
    type ED = { open: () => Promise<{ sRGBHex: string }> };
    const Dropper = (window as unknown as { EyeDropper: new () => ED })
      .EyeDropper;
    new Dropper()
      .open()
      .then((r) => onPick(r.sRGBHex, true))
      .catch(() => {}); // user pressed Escape — not an error
  };

  return (
    <div className='cs-mix'>
      <div className='cs-mix-picker'>
        {/* Continuous input: drags and arrow steps commit without the
            tween, so the stage tracks 1:1. */}
        <div
          ref={planeRef}
          className='cs-plane'
          role='slider'
          tabIndex={0}
          aria-label='Colour plane — arrow keys move saturation and brightness'
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(v * 100)}
          aria-valuetext={`Saturation ${Math.round(sv * 100)}%, brightness ${Math.round(v * 100)}%`}
          style={{
            background: `linear-gradient(to top, #000, rgba(0, 0, 0, 0)), linear-gradient(to right, #fff, ${hslToHex(hue, 1, 0.5)})`,
          }}
          onPointerDown={(e) => {
            // Capture is an enhancement — the drag keeps tracking after
            // leaving the plane. A pointer gone before the handler runs
            // throws here, and must not cancel the pick itself.
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {}
            planePoint(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons & 1) planePoint(e);
          }}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 0.1 : 0.02;
            const moves: Record<string, [number, number]> = {
              ArrowLeft: [-step, 0],
              ArrowRight: [step, 0],
              ArrowUp: [0, step],
              ArrowDown: [0, -step],
            };
            const m = moves[e.key];
            if (!m) return;
            e.preventDefault();
            pickAt(sv + m[0], v + m[1]);
          }}
        >
          <svg
            className='cs-plane-band'
            viewBox='0 0 100 100'
            preserveAspectRatio='none'
            aria-hidden
          >
            <path d={BAND_PATHS[role]} />
          </svg>
          <span
            className='cs-plane-thumb'
            style={{
              left: `${(sv * 100).toFixed(2)}%`,
              top: `${((1 - v) * 100).toFixed(2)}%`,
              background: value,
            }}
          />
        </div>

        <input
          type='range'
          className='cs-mix-range'
          min={0}
          max={360}
          step={1}
          value={Math.round(hue)}
          aria-label='Hue in degrees'
          onChange={(e) => {
            const nh = Number(e.target.value);
            setHue(nh);
            onPick(hslToHex(nh, s0, l0), false);
          }}
        />
      </div>

      <div className='cs-mix-row'>
        {MIXER_DEPTHS[role].map((label, i) => (
          <button
            key={label}
            type='button'
            className='cs-mix-depth'
            aria-pressed={nearL && Math.round(t * 2) === i}
            onClick={() =>
              onPick(
                hslToHex(
                  hue,
                  Math.min(band.s[1], Math.max(band.s[0], s0)),
                  lerp(band.l[0], band.l[1], i / 2)
                ),
                true
              )
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className='cs-mix-now'>
        <PixelTip tip={notation === 'hex' ? 'Show as HSL' : 'Show as hex'}>
          <button
            type='button'
            className='cs-mix-swatch'
            style={{ background: value }}
            aria-label={
              notation === 'hex'
                ? 'Show the colour as HSL'
                : 'Show the colour as hex'
            }
            onClick={() => onNotation(notation === 'hex' ? 'hsl' : 'hex')}
          />
        </PixelTip>
        <ValueField
          className='cs-mix-hexin'
          value={value}
          notation={notation}
          onCommit={(hex) => onPick(hex, true)}
          label='Colour value — type or paste hex or HSL'
        />
        {canSample && (
          <PixelTip tip='Pick a colour from anywhere on screen'>
            <button
              type='button'
              className='cs-mix-sample'
              onClick={sample}
              aria-label='Pick a colour from anywhere on screen'
            >
              <EyeDropperIcon className='cs-mix-sample-icon' />
            </button>
          </PixelTip>
        )}
      </div>
    </div>
  );
}

/**
 * The Colour studio (Malik, 2026-08-26) — the lab's own instrument, in the
 * post. `docs/pattern-lab.html` puts three colour wells beside a live quiz
 * window and recomputes the pair's metrics on every change; this is that,
 * with the app's real `PatternLayer` drawing the field and the real `Option`
 * drawing the pills, so what you're adjusting is the actual screen and not a
 * picture of it.
 *
 * Metrics come from `lib/stimulation.ts` (the ported ColorMoods model, pinned
 * by `lib/stimulation.test.ts` against the scores recorded in
 * docs/color-system.md). Deliberately no pass/fail on stimulation: the two
 * colour docs disagree about the ceiling and never reconciled it, so the
 * figure reports the number and lets the reader judge.
 *
 *   <div data-island="colour-studio"></div>
 */

// `subject` names the set for the chips' tooltips (2026-09-02): the
// set-palettes island that used to spell the names out was cut as a
// duplicate of this studio, so the names ride on the letters here.
export const PRESETS = [
  {
    key: 'A',
    subject: 'Syllogistic',
    surface: '#FFABC6',
    ink: '#4A1040',
    accent: '#674900',
  },
  {
    key: 'C',
    subject: 'Propositional',
    surface: '#E7F099',
    ink: '#02302C',
    accent: '#BD00AD',
  },
  {
    key: 'J',
    subject: 'Modal',
    surface: '#E6ACF4',
    ink: '#1C3601',
    accent: '#674900',
  },
  {
    key: 'L',
    subject: 'Deontic',
    surface: '#CFF6DD',
    ink: '#3F0167',
    accent: '#BD00AD',
  },
  {
    key: 'N',
    subject: 'Belief',
    surface: '#9EDAFF',
    ink: '#4A1040',
    accent: '#8D0381',
  },
  {
    key: 'Q',
    subject: 'Definitions',
    surface: '#D9CCF9',
    ink: '#3E1060',
    accent: '#745400',
  },
  {
    key: 'R',
    subject: 'Fallacies',
    surface: '#E4BDF7',
    ink: '#751100',
    accent: '#824616',
  },
] as const;

const PATTERNS: { key: QuizPatternKind; label: string }[] = [
  { key: 'camo', label: 'Camo' },
  { key: 'camo-giant', label: 'Camo · giant' },
  { key: 'quilt', label: 'Quilt' },
];

// The mixer panel opens beside the wells so the stage it repaints stays
// visible — but only where a 272px panel fits beside them. Radix flips
// side only to the opposite side and shifts only along the align axis,
// so on narrow viewports the horizontal overflow is ours to prevent:
// below 640px the panel opens underneath instead. Media-query state via
// useSyncExternalStore, the resume-banner idiom; the server snapshot
// never renders (the portal mounts on open, client-only).
const WIDE_QUERY = '(min-width: 640px)';
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

export function ColourStudio() {
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE_QUERY).matches,
    () => true
  );
  const [surface, setSurface] = useState('#CFF6DD');
  const [ink, setInk] = useState('#3F0167');
  const [accent, setAccent] = useState('#BD00AD');
  // One notation shared by all three mixers, held here because the
  // popover unmounts on close and would forget its own.
  const [notation, setNotation] = useState<Notation>('hex');
  const [pattern, setPattern] = useState<QuizPatternKind>('camo');
  const [picks, setPicks] = useState<Suggestion[]>([]);
  const [mode, setMode] = useState<'ink' | 'surface'>('ink');

  /**
   * Discrete versus continuous input (Malik, 2026-08-29). A preset chip,
   * a candidate, or a pattern tab is a *click*: the stage should tween,
   * because an instant repaint reads as a glitch. The wells are
   * *continuous*: while a colour input drags, the stage must track 1:1,
   * because a transition would trail the pointer. Clicks raise this flag
   * for one tween's length; the wells never touch it.
   */
  const [tweening, setTweening] = useState(false);
  const tweenTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const discreteRef = useRef(false);
  const discrete = () => {
    discreteRef.current = true;
    setTweening(true);
    clearTimeout(tweenTimer.current);
    tweenTimer.current = setTimeout(() => {
      discreteRef.current = false;
      setTweening(false);
    }, 220);
  };

  /**
   * Pattern crossfade: the field remounts on every kind/colour change, so
   * a discrete change keeps the outgoing layer for one tween and fades
   * the incoming one over it. Continuous well drags skip all of this and
   * hard-swap, as they always did.
   */
  const layerKey = `${pattern}-${surface}-${ink}`;
  const [prevLayer, setPrevLayer] = useState<{
    key: string;
    kind: QuizPatternKind;
    surface: string;
    ink: string;
  } | null>(null);
  const lastLayer = useRef({ key: layerKey, kind: pattern, surface, ink });
  useEffect(() => {
    if (lastLayer.current.key === layerKey) return;
    if (discreteRef.current) {
      setPrevLayer(lastLayer.current);
      const t = setTimeout(() => setPrevLayer(null), 240);
      lastLayer.current = { key: layerKey, kind: pattern, surface, ink };
      return () => clearTimeout(t);
    }
    lastLayer.current = { key: layerKey, kind: pattern, surface, ink };
    setPrevLayer(null);
  }, [layerKey, pattern, surface, ink]);

  const m = useMemo(() => stimulationOf(surface, ink), [surface, ink]);
  const ratio = contrastRatio(surface, ink);
  const readable = ratio >= 4.5;
  // Only a true warm↔cool opposition counts. "Lukewarm" is the buffer
  // between them, so lukewarm+cool is adjacent, not a crossing — flagging
  // that as a fault marked the site's own Set L as broken.
  const tSurface = temperatureOf(surface);
  const tInk = temperatureOf(ink);
  const crossing =
    (tSurface === 'warm' && tInk === 'cool') ||
    (tSurface === 'cool' && tInk === 'warm');

  const apply = (p: (typeof PRESETS)[number]) => {
    discrete();
    setSurface(p.surface);
    setInk(p.ink);
    setAccent(p.accent);
    setPicks([]);
  };

  // Candidates are computed against one anchor colour (the surface in
  // 'ink' mode, the ink in 'surface' mode). Changing the anchor silently
  // invalidates them, so it clears the row; changing the *other* colour —
  // which is what adopting a candidate does — keeps the list, because
  // trying several candidates in a row is the point.
  const changeSurface = (v: string) => {
    setSurface(v);
    if (mode === 'ink' && picks.length) setPicks([]);
  };
  const changeInk = (v: string) => {
    setInk(v);
    if (mode === 'surface' && picks.length) setPicks([]);
  };

  /**
   * The lab's own generator: fix one colour, sweep HSL, keep what lands near
   * LogiCola's 0.54 region, drop anything that buzzes, dedupe perceptually.
   * Not random — every candidate here scores like Sets C and J do.
   */
  const suggest = (which: 'ink' | 'surface') => {
    setMode(which);
    setPicks(
      suggestPartners(
        which === 'ink' ? surface : ink,
        0.54,
        which,
        perceptualDist
      )
    );
  };

  const well = (
    label: string,
    role: keyof typeof MIXER_BANDS,
    value: string,
    onChange: (v: string) => void
  ) => (
    <div className='cs-well'>
      <span>{label}</span>
      <Popover.Root>
        {/* Tooltip OUTSIDE the popover trigger: both are asChild, so the
            props merge down the chain onto the one real button. */}
        <PixelTip tip='Mix this colour'>
          <Popover.Trigger asChild>
            <button
              type='button'
              className='cs-pick'
              style={{
                background: value,
                color:
                  contrastRatio(value, '#ffffff') >= 3 ? '#fff' : '#14110f',
              }}
              aria-label={`${label}: open the colour mixer`}
            >
              <PaintBrushIcon className='cs-pick-icon' />
            </button>
          </Popover.Trigger>
        </PixelTip>
        <Popover.Portal>
          {/* Beside the wells where it fits (the stage it repaints stays
              visible while you pick), underneath on narrow screens — see
              the WIDE_QUERY note above. */}
          <Popover.Content
            className='cs-pop'
            side={wide ? 'right' : 'bottom'}
            align='start'
            sideOffset={8}
            collisionPadding={12}
          >
            <Mixer
              role={role}
              value={value}
              notation={notation}
              onNotation={setNotation}
              onPick={(hex, settle) => {
                if (settle) discrete();
                onChange(hex);
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {/* The at-rest readout stays hex — the article's own notation —
          whatever the mixer is showing; it still accepts pasted HSL. */}
      <ValueField
        className='cs-hex'
        value={value}
        notation='hex'
        onCommit={(hex) => {
          discrete();
          onChange(hex);
        }}
        label={`${label} hex`}
      />
    </div>
  );

  return (
    <figure className='not-prose cs-wrap'>
      <div className='cs-controls'>
        {well('Surface', 'surface', surface, changeSurface)}
        {well('Ink', 'ink', ink, changeInk)}
        {well('Accent', 'accent', accent, setAccent)}
      </div>

      <div className='cs-rows'>
        <div className='cs-row'>
          <span className='cs-lab'>Start from</span>
          {PRESETS.map((p) => (
            <PixelTip key={p.key} tip={`Set ${p.key} · ${p.subject}`}>
              <button
                type='button'
                className='cs-chip'
                onClick={() => apply(p)}
                style={{ background: p.surface, color: p.ink }}
                aria-label={`Load Set ${p.key}, ${p.subject}`}
              >
                {p.key}
              </button>
            </PixelTip>
          ))}
        </div>
        <div className='cs-row'>
          <span className='cs-lab'>Suggest</span>
          <button
            type='button'
            className='cs-chip is-wide'
            aria-pressed={picks.length > 0 && mode === 'ink'}
            onClick={() => suggest('ink')}
          >
            Inks for this surface
          </button>
          <button
            type='button'
            className='cs-chip is-wide'
            aria-pressed={picks.length > 0 && mode === 'surface'}
            onClick={() => suggest('surface')}
          >
            Surfaces for this ink
          </button>
        </div>

        {/* Always rendered so surfacing candidates never shifts the stage
            below — the space is reserved, and the empty row teaches the
            feature before it's used. */}
        <div className='cs-row cs-picks'>
          {/* One word so the 82px label never wraps — a two-line label
              regrows the row and shifts the stage, the exact jump the
              reserved row exists to prevent. The pressed Suggest button
              above carries the full provenance. */}
          <span className='cs-lab'>
            {picks.length === 0
              ? 'Candidates'
              : mode === 'ink'
                ? 'Inks'
                : 'Surfaces'}
          </span>
          {picks.length === 0 ? (
            <span className='cs-picks-empty'>
              press a Suggest button to fill this row
            </span>
          ) : (
            picks.map((c) => {
              const adopted =
                c.hex.toLowerCase() ===
                (mode === 'ink' ? ink : surface).toLowerCase();
              return (
                /* The swatch is a bare colour — the tip carries its
                   numbers (was a title attr; PixelTip is the app's own
                   tooltip). The aria-label keeps them for readers. */
                <PixelTip
                  key={c.hex}
                  tip={`${c.hex.toUpperCase()} · stimulation ${c.score.toFixed(2)} · ${c.contrast.toFixed(1)}:1`}
                >
                  <button
                    type='button'
                    className='cs-swatch'
                    aria-pressed={adopted}
                    style={{ background: c.hex }}
                    aria-label={`Use ${c.hex}, stimulation ${c.score.toFixed(2)}, contrast ${c.contrast.toFixed(1)} to 1`}
                    onClick={() => {
                      discrete();
                      if (mode === 'ink') changeInk(c.hex);
                      else changeSurface(c.hex);
                    }}
                  />
                </PixelTip>
              );
            })
          )}
        </div>

        <div className='cs-row'>
          <span className='cs-lab'>Pattern</span>
          {PATTERNS.map((p) => (
            <button
              key={p.key}
              type='button'
              className='cs-chip is-wide'
              aria-pressed={pattern === p.key}
              onClick={() => {
                discrete();
                setPattern(p.key);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* The quiz window itself — the app's own pattern layer and options. */}
      <div
        className={`quiz-immersive cs-stage${tweening ? ' is-tweening' : ''}`}
        style={
          {
            '--quiz-surface': surface,
            '--quiz-fg': ink,
            '--quiz-accent': accent,
            background: surface,
            color: ink,
          } as React.CSSProperties
        }
      >
        {prevLayer && (
          <PatternLayer
            key={`prev-${prevLayer.key}`}
            kind={prevLayer.kind}
            surface={prevLayer.surface}
            ink={prevLayer.ink}
            treatment='panel'
            className='cs-pattern is-prev'
          />
        )}
        <PatternLayer
          key={layerKey}
          kind={pattern}
          surface={surface}
          ink={ink}
          treatment='panel'
          className='cs-pattern'
        />
        <div className='cs-panel'>
          <p className='cs-eyebrow'>Your set</p>
          {/* A <p>, not a heading: the island is an illustration and must
              not add a section to the post's outline (SEO pass, 2026-09-08). */}
          <p className='cs-title'>Meanings and Definitions</p>
          <p className='cs-dek'>
            Spot what is wrong with a definition — too broad, too narrow,
            circular, or worse.
          </p>
          <div className='cs-list'>
            <Option
              immersive
              index={1}
              showIndex
              label='Too broad'
              isSelected={false}
              isCorrect={false}
              showSolution={false}
              onClick={() => {}}
            />
            <Option
              immersive
              index={2}
              showIndex
              label='Poor match in emotional tone'
              isSelected
              isCorrect
              showSolution={false}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Each term wears a PixelTip definition — the metrics are the
          model's jargon, and a dotted underline is the standard "a
          definition lives here" cue. Supplementary only: the prose
          around the island explains the model in full, so the
          desktop-only tips cost touch readers nothing essential. */}
      <dl className='cs-meta' aria-live='polite'>
        <div>
          <PixelTip
            tip='The pair’s combined saturation, weighted by hue.'
            side='top'
          >
            <dt className='cs-term'>σ intensity</dt>
          </PixelTip>
          <dd>{m.sigma.toFixed(2)}</dd>
        </div>
        <div>
          <PixelTip tip='The lightness gap between ink and surface.' side='top'>
            <dt className='cs-term'>ΔL</dt>
          </PixelTip>
          <dd>{m.dL.toFixed(2)}</dd>
        </div>
        <div>
          <PixelTip
            tip='How far apart the two hues sit on the colour wheel.'
            side='top'
          >
            <dt className='cs-term'>hue Δ</dt>
          </PixelTip>
          <dd>{Math.round(m.theta * 180)}°</dd>
        </div>
        <div>
          <PixelTip
            tip='The ColorMoods score for the pair — the sets I picked land near 0.54.'
            side='top'
          >
            <dt className='cs-term'>stimulation</dt>
          </PixelTip>
          <dd>{m.score.toFixed(3)}</dd>
        </div>
        <div>
          <PixelTip
            tip='Shimmer between saturated near-opposites — past 0.20 a pair buzzes.'
            side='top'
          >
            <dt className='cs-term'>vibration</dt>
          </PixelTip>
          <dd className={m.vibr > 0.2 ? 'is-off' : undefined}>
            {m.vibr.toFixed(2)}
            {m.vibr > 0.2 && <i>buzzing</i>}
          </dd>
        </div>
        <div>
          <PixelTip
            tip='A true warm-plus-cool crossing can make a pair feel restless.'
            side='top'
          >
            <dt className='cs-term'>temperature</dt>
          </PixelTip>
          <dd className={crossing ? 'is-warn' : undefined}>
            {tSurface} + {tInk}
            {crossing && <i>crossing</i>}
          </dd>
        </div>
        <div>
          <PixelTip
            tip='WCAG contrast — 4.5:1 is the AA floor for body text.'
            side='top'
          >
            <dt className='cs-term'>ink on surface</dt>
          </PixelTip>
          <dd className={readable ? 'is-ok' : 'is-off'}>
            {ratio.toFixed(2)}:1<i>{readable ? 'AA' : 'fails AA'}</i>
          </dd>
        </div>
      </dl>
    </figure>
  );
}
