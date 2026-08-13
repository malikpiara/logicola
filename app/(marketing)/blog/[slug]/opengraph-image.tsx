import { ImageResponse } from 'next/og';
import { publishedPosts, formatDate } from '@/lib/marketingContent';

// The brand work explicitly deferred the link card (docs/brand-decisions.md,
// 2026-08-12: "it is the one surface that genuinely wants a headline on
// it"). This is that surface: cream ground, brand green wordmark, the
// headline doing the talking. Replaces public/thumbnail.jpg for posts.

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'LogiCola blog post';

export function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = publishedPosts.find((candidate) => candidate.slug === slug);
  const title = post?.title ?? 'LogiCola Blog';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        backgroundColor: '#EDEDE3',
        color: '#111111',
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 700,
          color: '#05A24B',
          letterSpacing: 2,
        }}
      >
        LogiCola
      </div>
      <div
        style={{
          fontSize: title.length > 48 ? 68 : 84,
          fontWeight: 700,
          lineHeight: 1.05,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', fontSize: 30, color: '#444444' }}>
        {post ? `${formatDate(post.date)} · logicola.org` : 'logicola.org'}
      </div>
    </div>,
    size
  );
}
