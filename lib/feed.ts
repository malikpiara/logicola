import { SITE_URL } from '@/lib/site';

export interface FeedItem {
  title: string;
  /** Site-relative URL, e.g. '/blog/the-new-logicola'. */
  path: string;
  /** ISO date, e.g. '2026-08-13'. */
  date: string;
  description: string;
  /** Full-content HTML. Deliberate: a full feed is what makes the
   *  content ingestible by readers and AI crawlers without a visit. */
  html?: string;
  author?: string;
  categories?: string[];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// CDATA cannot contain the ']]>' terminator; split it across sections.
function cdata(value: string): string {
  return `<![CDATA[${value.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

export function buildRssFeed(options: {
  title: string;
  description: string;
  /** Site-relative path of the HTML page this feed mirrors. */
  pagePath: string;
  /** Site-relative path of the feed itself. */
  feedPath: string;
  items: FeedItem[];
}): string {
  const { title, description, pagePath, feedPath, items } = options;

  const entries = items
    .map((item) => {
      const url = `${SITE_URL}${item.path}`;
      return [
        '    <item>',
        `      <title>${escapeXml(item.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${new Date(`${item.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(item.description)}</description>`,
        ...(item.html
          ? [`      <content:encoded>${cdata(item.html)}</content:encoded>`]
          : []),
        ...(item.author
          ? [`      <dc:creator>${escapeXml(item.author)}</dc:creator>`]
          : []),
        ...(item.categories ?? []).map(
          (category) => `      <category>${escapeXml(category)}</category>`
        ),
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(`${SITE_URL}${pagePath}`)}</link>`,
    `    <atom:link href="${escapeXml(`${SITE_URL}${feedPath}`)}" rel="self" type="application/rss+xml"/>`,
    `    <description>${escapeXml(description)}</description>`,
    '    <language>en-US</language>',
    entries,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
