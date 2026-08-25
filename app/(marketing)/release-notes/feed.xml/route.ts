import { releaseEntries } from '@/lib/marketingContent';
import { buildRssFeed } from '@/lib/feed';

export const dynamic = 'force-static';

export function GET() {
  const xml = buildRssFeed({
    title: 'LogiCola Release Notes',
    description: "What's new in LogiCola — every feature, improvement and fix.",
    pagePath: '/release-notes',
    feedPath: '/release-notes/feed.xml',
    items: releaseEntries.map((entry) => ({
      title: entry.title,
      path: `/release-notes#${entry.anchor}`,
      date: entry.date,
      description: entry.content.split('\n\n')[0] ?? entry.title,
      html: entry.html,
      categories: [entry.kind, ...entry.platforms],
    })),
  });

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
