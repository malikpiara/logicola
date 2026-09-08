import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publishedPosts, formatDate } from '@/lib/marketingContent';
import { MarketingNav } from '@/components/marketing/marketingNav';
import { Chip } from '@/components/marketing/chip';
import {
  MARKETING_THEME,
  SETS,
  SPRITE_CLIP,
  themeButton,
} from '@/lib/marketingTheme';
import { FOCUS_W, focusR, ringBand } from '@/lib/pixel';
import { SITE_URL } from '@/lib/site';
import { QuizEmbed } from '@/components/blog/quizEmbed';
import { BeforeAfter } from '@/components/blog/beforeAfter';
import { SilhouetteDial } from '@/components/blog/silhouetteDial';
import { SetPalettes } from '@/components/blog/setPalettes';
import { DamageBar } from '@/components/blog/damageBar';
import { ColourStudio } from '@/components/blog/colourStudio';
import { PastelRandom } from '@/components/blog/pastelRandom';
import { SectionRail } from '@/components/blog/sectionRail';
import { PatternGallery } from '@/components/blog/patternGallery';
import { PhoneStates } from '@/components/blog/phoneStates';
import { Clip } from '@/components/blog/clip';
import { InstallApp } from '@/components/blog/installApp';
import { TemplateRoll } from '@/components/blog/templateRoll';
import { MaterialShapesDial } from '@/components/blog/materialShapes';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Quiz-embed markers (2026-08-24): posts stay plain markdown→HTML (the
 * full-content-feed decision, 2026-08-13), and a post that wants a
 * drill inline writes a marker div whose inner link is the RSS/degraded
 * rendering. The page splits the compiled HTML at the markers and
 * mounts the matching client island between the segments — hydration
 * islands, not iframes, per the embed decision.
 */
const ISLAND_MARKER =
  /<div (data-quiz-embed|data-island)="([a-z0-9-]+)"((?:\s+data-[a-z-]+="[^"]*")*)\s*>([\s\S]*?)<\/div>/g;

type PostSegment =
  | { kind: 'html'; html: string }
  | {
      kind: 'embed';
      embed: string;
      count: number;
      pick?: string[];
      fallbackHtml: string;
    }
  | { kind: 'island'; island: string; attrs: Record<string, string> };

/**
 * The island registry. A figure that is better dragged, dialled or
 * clicked than looked at gets an entry here rather than a branch in the
 * renderer below — the post is a place to try things, and each new one
 * would otherwise cost this file another `else if`. Keys are the
 * `data-island` value; the marker's other data-attrs arrive as `attrs`.
 */
const ISLANDS: Record<
  string,
  (attrs: Record<string, string>) => React.ReactNode
> = {
  'before-after': (a) => (
    <BeforeAfter
      before={a.before ?? ''}
      after={a.after ?? ''}
      alt={a.alt ?? 'Comparison'}
      width={Number(a.width ?? 1440)}
      height={Number(a.height ?? 900)}
    />
  ),
  silhouettes: () => <SilhouetteDial />,
  'set-palettes': () => <SetPalettes />,
  'damage-bar': () => <DamageBar />,
  'colour-studio': () => <ColourStudio />,
  'pastel-random': () => <PastelRandom />,
  'pattern-gallery': () => <PatternGallery />,
  clip: (a) => (
    <Clip
      src={a.src ?? ''}
      poster={a.poster}
      alt={a.alt ?? 'A screen recording'}
      width={Number(a.width ?? 1440)}
      height={Number(a.height ?? 900)}
      max={a.max ? Number(a.max) : undefined}
    />
  ),
  'phone-states': (a) => (
    <PhoneStates
      before={a.before ?? ''}
      after={a.after ?? ''}
      alt={a.alt ?? 'A phone'}
      width={Number(a.width ?? 679)}
      height={Number(a.height ?? 1450)}
    />
  ),
  install: () => (
    <InstallApp
      theme={{
        buttonBg: themeButton().bg,
        buttonFg: themeButton().fg,
        ink: MARKETING_THEME.ink,
        spriteClip: SPRITE_CLIP,
        // Focus stands 2px off the silhouette, radius grown to match —
        // the option pills' own band (components/option.tsx).
        ringClip: ringBand('sprite', FOCUS_W, focusR(24)),
      }}
    />
  ),
  'template-roll': (a) => (
    <TemplateRoll num={Number(a.num ?? 21)} letters={a.letters} />
  ),
  'material-shapes': () => <MaterialShapesDial />,
};

function dataAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const m of raw.matchAll(/data-([a-z-]+)="([^"]*)"/g)) {
    attrs[m[1]!] = m[2]!;
  }
  return attrs;
}

function splitEmbeds(html: string): PostSegment[] {
  const segments: PostSegment[] = [];
  let cursor = 0;
  for (const match of html.matchAll(ISLAND_MARKER)) {
    if (match.index > cursor) {
      segments.push({ kind: 'html', html: html.slice(cursor, match.index) });
    }
    const [, markerKind, key, rawAttrs, inner] = match;
    if (markerKind === 'data-quiz-embed') {
      const attrs = dataAttrs(rawAttrs ?? '');
      segments.push({
        kind: 'embed',
        embed: key!,
        count: attrs.count ? Number(attrs.count) : 3,
        // data-pick="3.29,3.30": pin questions instead of drawing.
        pick: attrs.pick ? attrs.pick.split(',').map((s) => s.trim()) : undefined,
        fallbackHtml: inner ?? '',
      });
    } else if (key && ISLANDS[key]) {
      segments.push({
        kind: 'island',
        island: key,
        attrs: dataAttrs(rawAttrs ?? ''),
      });
    } else {
      // Unknown island key: pass the marker through untouched.
      segments.push({ kind: 'html', html: match[0] });
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < html.length) {
    segments.push({ kind: 'html', html: html.slice(cursor) });
  }
  return segments;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = publishedPosts.find((candidate) => candidate.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.dek,
    alternates: { canonical: post.url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.dek,
      url: post.url,
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: { card: 'summary_large_image', site: '@LogicolaThree' },
  };
}

const CATEGORY_LABELS = {
  announcements: 'Announcements',
  product: 'Product update',
  essays: 'Essay',
} as const;

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = publishedPosts.find((candidate) => candidate.slug === slug);
  if (!post) notFound();

  const t = MARKETING_THEME;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.dek,
    datePublished: post.date,
    dateModified: post.date,
    // The cover doubles as the article's image for rich results; the
    // link card (opengraph-image.tsx) is a separate, headline-led surface.
    ...(post.cover ? { image: `${SITE_URL}${post.cover}` } : {}),
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'LogiCola' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${post.url}` },
  };

  return (
    <>
      <MarketingNav active='blog' />
      <article className='mx-auto max-w-[820px] px-6 pb-14 pt-7 sm:px-8 motion-enter'>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Link
          href='/blog'
          className='motion-colors font-mono text-[13px] font-semibold hover:underline'
          style={{ color: t.type, opacity: 0.7 }}
        >
          ← Blog
        </Link>

        <h1
          className='mt-6 font-stretch text-4xl font-extrabold leading-[1.05] md:text-[46px]'
          style={{ color: t.type }}
        >
          {post.title}
        </h1>
        <p
          className='mt-4 text-lg leading-snug md:text-[22px]'
          style={{ color: t.type, opacity: 0.82 }}
        >
          {post.dek}
        </p>
        <p
          className='mt-3 font-mono text-[12.5px]'
          style={{ color: t.type, opacity: 0.62 }}
        >
          By {post.author} · {formatDate(post.date)}
        </p>
        <p className='mt-3.5 flex gap-1.5'>
          <Chip>{CATEGORY_LABELS[post.category]}</Chip>
        </p>

        {/* Covers render on the blog index cards only; the article page
            opens with the text itself (Malik, 2026-08-27). */}

        {/* Compiled at build time from content/blog markdown — our own
            content, so rendering the HTML string directly is safe. The
            typography plugin's palette is re-pointed at the theme. */}
        <SectionRail />
        <div
          className='post-prose prose prose-lg md:prose-xl mt-9 max-w-none prose-headings:font-stretch prose-a:decoration-1 prose-a:underline-offset-2'
          style={
            {
              /* Quote rule wears Set L's plum; <mark> wears Set C's
                 chartreuse (at 55% in CSS). Both from the catalogue — the
                 .post-prose rules in globals.css read these.
                 (Malik, 2026-08-28) */
              '--post-quote-ink': SETS.L.ink,
              '--post-mark': SETS.C.surface,
              /* Inline code wears Set C's ACCENT (Malik, 2026-09-01):
                 the post already reads in Set C — chartreuse marks, its
                 dark green ink — so data completes the set's own trio.
                 Literal because SETS mirrors brand-assets.mjs, which
                 carries no accents. */
              '--post-code': '#BD00AD',
              '--tw-prose-body': t.type,
              '--tw-prose-headings': t.type,
              '--tw-prose-bold': t.type,
              '--tw-prose-links': t.ink,
              '--tw-prose-quotes': t.type,
              '--tw-prose-bullets': t.ink,
              '--tw-prose-counters': t.type,
              '--tw-prose-captions': t.type,
              color: t.type,
              textRendering: 'optimizeLegibility',
              fontKerning: 'normal',
            } as React.CSSProperties
          }
        >
          {/* display:contents segment wrappers keep the typography
              plugin's descendant selectors matching across the split. */}
          {splitEmbeds(post.html).map((segment, index) =>
            segment.kind === 'html' ? (
              <div
                key={index}
                style={{ display: 'contents' }}
                dangerouslySetInnerHTML={{ __html: segment.html }}
              />
            ) : segment.kind === 'embed' ? (
              <QuizEmbed
                key={index}
                embed={segment.embed}
                count={segment.count}
                pick={segment.pick}
                fallbackHtml={segment.fallbackHtml}
              />
            ) : (
              <React.Fragment key={index}>
                {ISLANDS[segment.island]!(segment.attrs)}
              </React.Fragment>
            )
          )}
        </div>
      </article>
    </>
  );
}
