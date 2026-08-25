import { publishedPosts } from '@/lib/marketingContent';
import { buildRssFeed } from '@/lib/feed';

export const dynamic = 'force-static';

export function GET() {
  const xml = buildRssFeed({
    title: 'LogiCola Blog',
    description:
      'Announcements, product updates and essays from LogiCola. Free logic practice exercises in your browser.',
    pagePath: '/blog',
    feedPath: '/blog/feed.xml',
    items: publishedPosts.map((post) => ({
      title: post.title,
      path: post.url,
      date: post.date,
      description: post.dek,
      html: post.html,
      author: post.author,
      categories: [post.category],
    })),
  });

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
