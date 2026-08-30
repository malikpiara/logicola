import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publishedPosts, formatDate } from '@/lib/marketingContent';
import { MarketingNav } from '@/components/marketing/marketingNav';
import { Chip } from '@/components/marketing/chip';
import { MARKETING_THEME, SETS } from '@/lib/marketingTheme';
import { SITE_URL } from '@/lib/site';
import { QuizEmbed } from '@/components/blog/quizEmbed';
import { BeforeAfter } from '@/components/blog/beforeAfter';
import { SilhouetteDial } from '@/components/blog/silhouetteDial';
import { SetPalettes } from '@/components/blog/setPalettes';
import { DamageBar } from '@/components/blog/damageBar';
import { ColourStudio } from '@/components/blog/colourStudio';
import { PastelRandom } from '@/components/blog/pastelRandom';

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
  | { kind: 'embed'; embed: string; count: number; fallbackHtml: string }
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
    twitter: { card: 'summary_large_image' },
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
