import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publishedPosts, formatDate } from '@/lib/marketingContent';
import { MarketingNav } from '@/components/marketing/marketingNav';
import { Chip } from '@/components/marketing/chip';
import { NewsletterCard } from '@/components/marketing/newsletterCard';
import {
  MARKETING_THEME,
  fieldSvg,
  slugSeed,
  SPRITE_CLIP,
} from '@/lib/marketingTheme';
import { SITE_URL } from '@/lib/site';

interface PostPageProps {
  params: Promise<{ slug: string }>;
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
          className='mt-4 text-lg leading-snug'
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

        <div
          className='mt-7 h-[280px] w-full overflow-hidden'
          style={{ clipPath: SPRITE_CLIP }}
        >
          {post.cover ? (
            // Local static covers of known size; next/image adds nothing here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover}
              alt=''
              className='block h-full w-full object-cover'
            />
          ) : (
            <div
              className='h-full w-full'
              dangerouslySetInnerHTML={{
                __html: fieldSvg(1120, 340, {
                  seedOffset: slugSeed(post.slug),
                  scaleMul: 0.6,
                }),
              }}
            />
          )}
        </div>

        {/* Compiled at build time from content/blog markdown — our own
            content, so rendering the HTML string directly is safe. The
            typography plugin's palette is re-pointed at the theme. */}
        <div
          className='prose mt-7 max-w-none prose-headings:font-stretch'
          style={
            {
              '--tw-prose-body': t.type,
              '--tw-prose-headings': t.type,
              '--tw-prose-bold': t.type,
              '--tw-prose-links': t.ink,
              '--tw-prose-quotes': t.type,
              '--tw-prose-bullets': t.ink,
              '--tw-prose-counters': t.type,
              '--tw-prose-captions': t.type,
              color: t.type,
            } as React.CSSProperties
          }
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <NewsletterCard source='blog_post' />
      </article>
    </>
  );
}
