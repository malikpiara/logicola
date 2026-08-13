import type { Metadata } from 'next';
import Link from 'next/link';
import { publishedPosts, formatDate, type Post } from '@/lib/marketingContent';
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

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Announcements, product updates and essays from LogiCola — free logic practice exercises in your browser.',
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': [
        { url: '/blog/feed.xml', title: 'LogiCola Blog' },
      ],
    },
  },
};

const CATEGORY_LABELS: Record<Post['category'], string> = {
  announcements: 'Announcements',
  product: 'Product update',
  essays: 'Essay',
};

/** Cover image when the post has one, generated pattern art otherwise.
 *  Ratios are named (featured 3:2, cards 16:9), corners take the sprite
 *  silhouette — see the lab's aspect review, 2026-08-14. */
function PostArt({
  post,
  featured = false,
}: {
  post: Post;
  featured?: boolean;
}) {
  const aspect = featured ? 'aspect-[3/2]' : 'aspect-video';
  return (
    <div
      className={`${aspect} w-full overflow-hidden`}
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
            __html: featured
              ? fieldSvg(762, 508, {
                  seedOffset: slugSeed(post.slug),
                  scaleMul: 0.9,
                })
              : fieldSvg(640, 360, {
                  seedOffset: slugSeed(post.slug),
                  scaleMul: 0.8,
                }),
          }}
        />
      )}
    </div>
  );
}

function Byline({ post }: { post: Post }) {
  return (
    <p
      className='mt-3 font-mono text-[12.5px]'
      style={{ color: 'var(--mk-type)', opacity: 0.62 }}
    >
      By {post.author} · {formatDate(post.date)}
    </p>
  );
}

export default function BlogIndexPage() {
  const t = MARKETING_THEME;
  const [featured, ...rest] = publishedPosts;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'LogiCola Blog',
    url: `${SITE_URL}/blog`,
    description: metadata.description,
    publisher: { '@type': 'Organization', name: 'LogiCola' },
    blogPost: publishedPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.dek,
      datePublished: post.date,
      author: { '@type': 'Person', name: post.author },
      url: `${SITE_URL}${post.url}`,
    })),
  };

  return (
    <>
      <MarketingNav active='blog' />
      <main className='mx-auto max-w-[1200px] px-6 pb-14 pt-7 sm:px-10 motion-enter'>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {featured && (
          <section className='grid items-center gap-8 py-2 md:grid-cols-[1.15fr_1fr] md:gap-11'>
            <Link href={featured.url} aria-label={featured.title}>
              <PostArt post={featured} featured />
            </Link>
            <div>
              <Chip>{CATEGORY_LABELS[featured.category]}</Chip>
              <h1
                className='mt-4 font-stretch text-4xl font-extrabold leading-[1.05] md:text-[52px] md:leading-[1.03]'
                style={{ color: t.type }}
              >
                <Link href={featured.url} className='hover:underline'>
                  {featured.title}
                </Link>
              </h1>
              <p
                className='mt-4 text-lg leading-snug'
                style={{ color: t.type, opacity: 0.82 }}
              >
                {featured.dek}
              </p>
              <Byline post={featured} />
            </div>
          </section>
        )}

        <p
          className='mb-4 mt-10 font-mono text-xs font-bold uppercase tracking-[.09em]'
          style={{ color: t.type, opacity: 0.7 }}
        >
          Posts
        </p>

        <section className='grid gap-9 sm:grid-cols-2'>
          {rest.map((post) => (
            <article key={post.slug}>
              <Link href={post.url} aria-label={post.title}>
                <PostArt post={post} />
              </Link>
              <h2
                className='mt-4 font-stretch text-2xl font-extrabold'
                style={{ color: t.type }}
              >
                <Link href={post.url} className='hover:underline decoration-2'>
                  {post.title}
                </Link>
              </h2>
              <Byline post={post} />
              <p
                className='mt-2 leading-normal'
                style={{ color: t.type, opacity: 0.82 }}
              >
                {post.dek}
              </p>
              <p className='mt-3.5 flex gap-1.5'>
                <Chip>{CATEGORY_LABELS[post.category]}</Chip>
              </p>
            </article>
          ))}
        </section>

        <NewsletterCard source='blog_index' />
      </main>
    </>
  );
}
