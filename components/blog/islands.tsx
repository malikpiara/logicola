'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { IslandKey } from './islandKeys';
import type { InstallAppTheme } from './installApp';

/**
 * The island registry, behind a CLIENT-side `next/dynamic` boundary
 * (React pass, 2026-09-08). Every post shares the one `[slug]` route,
 * and a route pays for every client module statically reachable from
 * it — so with the islands imported statically in page.tsx, a post with
 * no markers still shipped all of them (measured on the production
 * build: 111 KB raw / 39 KB gz of island code on
 * /blog/introducing-logicola-3, which renders none). `import()` inside a
 * client module is the only real async boundary — see
 * components/quiz/generated/index.tsx for the build measurements — so
 * each island is now its own chunk, fetched when a post renders it.
 *
 * ssr stays on (the default): the server HTML and the accessibility
 * tree are unchanged; the template roll keeps its own ssr:false boundary
 * inside its wrapper, since its draw is random.
 *
 * Keys are the `data-island` value (./islandKeys.ts); the marker's other
 * data-attrs arrive as `attrs`, parsed here rather than on the server
 * so the page passes strings only. The install island's colours come
 * from the server page — the marketing theme is server-only — and are
 * the one non-attr prop.
 */
const BeforeAfter = dynamic(() =>
  import('./beforeAfter').then((m) => m.BeforeAfter)
);
const SilhouetteDial = dynamic(() =>
  import('./silhouetteDial').then((m) => m.SilhouetteDial)
);
const DamageBar = dynamic(() => import('./damageBar').then((m) => m.DamageBar));
const ColourStudio = dynamic(() =>
  import('./colourStudio').then((m) => m.ColourStudio)
);
const PastelRandom = dynamic(() =>
  import('./pastelRandom').then((m) => m.PastelRandom)
);
const PatternGallery = dynamic(() =>
  import('./patternGallery').then((m) => m.PatternGallery)
);
const Clip = dynamic(() => import('./clip').then((m) => m.Clip));
const PhoneStates = dynamic(() =>
  import('./phoneStates').then((m) => m.PhoneStates)
);
const InstallApp = dynamic(() =>
  import('./installApp').then((m) => m.InstallApp)
);
const TemplateRoll = dynamic(() =>
  import('./templateRoll').then((m) => m.TemplateRoll)
);
const MaterialShapesDial = dynamic(() =>
  import('./materialShapes').then((m) => m.MaterialShapesDial)
);

export interface IslandProps {
  attrs: Record<string, string>;
  /** Only the install island reads it. */
  install?: InstallAppTheme;
}

const num = (v: string | undefined, fallback: number) =>
  v === undefined ? fallback : Number(v);

const ISLANDS: Record<IslandKey, ComponentType<IslandProps>> = {
  'before-after': ({ attrs: a }) => (
    <BeforeAfter
      before={a.before ?? ''}
      after={a.after ?? ''}
      alt={a.alt ?? 'Comparison'}
      width={num(a.width, 1440)}
      height={num(a.height, 900)}
    />
  ),
  silhouettes: () => <SilhouetteDial />,
  'damage-bar': () => <DamageBar />,
  'colour-studio': () => <ColourStudio />,
  'pastel-random': () => <PastelRandom />,
  'pattern-gallery': () => <PatternGallery />,
  clip: ({ attrs: a }) => (
    <Clip
      src={a.src ?? ''}
      poster={a.poster}
      alt={a.alt ?? 'A screen recording'}
      width={num(a.width, 1440)}
      height={num(a.height, 900)}
      max={a.max ? Number(a.max) : undefined}
    />
  ),
  'phone-states': ({ attrs: a }) => (
    <PhoneStates
      before={a.before ?? ''}
      after={a.after ?? ''}
      alt={a.alt ?? 'A phone'}
      width={num(a.width, 679)}
      height={num(a.height, 1450)}
    />
  ),
  install: ({ install }) => (install ? <InstallApp theme={install} /> : null),
  'template-roll': ({ attrs: a }) => (
    <TemplateRoll num={num(a.num, 21)} letters={a.letters} />
  ),
  'material-shapes': () => <MaterialShapesDial />,
};

export function Island({ kind, ...props }: IslandProps & { kind: IslandKey }) {
  const Component = ISLANDS[kind];
  return <Component {...props} />;
}
