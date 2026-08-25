import type { Metadata } from 'next';
import {
  releaseEntries,
  formatDate,
  type ReleaseNote,
} from '@/lib/marketingContent';
import { MarketingNav } from '@/components/marketing/marketingNav';
import { Chip } from '@/components/marketing/chip';
import { NewsletterForm } from '@/components/marketing/newsletterForm';
import {
  MARKETING_THEME,
  fieldSvg,
  themeButton,
  SPRITE_CLIP,
  RING_BAND,
} from '@/lib/marketingTheme';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Release Notes',
  description:
    "What's new in LogiCola: every feature, improvement and fix, on one page.",
  alternates: {
    canonical: '/release-notes',
    types: {
      'application/rss+xml': [
        { url: '/release-notes/feed.xml', title: 'LogiCola Release Notes' },
      ],
    },
  },
};

const KIND_LABELS: Record<ReleaseNote['kind'], string> = {
  'new-feature': 'New Feature',
  improvement: 'Improvement',
  fix: 'Fix',
};

const PLATFORM_LABELS: Record<string, string> = {
  web: 'Web',
  mobile: 'Mobile',
};

export default function ReleaseNotesPage() {
  const t = MARKETING_THEME;
  const btn = themeButton();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'LogiCola Release Notes',
    url: `${SITE_URL}/release-notes`,
    description: metadata.description,
    publisher: { '@type': 'Organization', name: 'LogiCola' },
    hasPart: releaseEntries.map((entry) => ({
      '@type': 'Article',
      headline: entry.title,
      datePublished: entry.date,
      url: `${SITE_URL}/release-notes#${entry.anchor}`,
    })),
  };

  return (
    <>
      <MarketingNav active='releases' />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* The hero: the quiz start screen's construction — the pattern
          wears around a cleared centre and there is NO card; the type
          sits directly on the ground (decided 2026-08-13). */}
      <section className='relative h-[420px] md:h-[460px]'>
        <div
          className='absolute inset-0'
          dangerouslySetInnerHTML={{
            __html: fieldSvg(1200, 460, {
              clear: { x: 200, y: 80, w: 800, h: 300, r: 28 },
            }),
          }}
        />
        <div className='absolute inset-0 flex flex-col items-center justify-center px-6 text-center'>
          <p
            className='font-mono text-xs font-bold uppercase tracking-[.09em]'
            style={{ color: t.type }}
          >
            Release notes
          </p>
          <h1
            className='mt-2 font-stretch text-5xl font-extrabold md:text-[58px]'
            style={{ color: t.type }}
          >
            What&rsquo;s new
          </h1>
          <div className='w-full max-w-[480px]'>
            <NewsletterForm
              source='release_notes_hero'
              theme={{
                ink: t.ink,
                buttonBg: btn.bg,
                buttonFg: btn.fg,
                spriteClip: SPRITE_CLIP,
                ringClip: RING_BAND,
              }}
            />
          </div>
        </div>
      </section>

      <main className='mx-auto max-w-[1200px] px-6 pb-14 sm:px-10'>
        {/* With nothing published the page was a masthead over a white
            void, which reads as a failed load rather than an empty
            shelf (2026-08-24, after Malik unpublished every note). */}
        {releaseEntries.length === 0 && (
          <p
            className='py-16 text-center text-lg'
            style={{ color: t.type, opacity: 0.75 }}
          >
            Nothing here yet. Subscribe above and you&apos;ll hear about the
            first one.
          </p>
        )}
        {releaseEntries.map((entry, index) => (
          <section
            key={entry.anchor}
            id={entry.anchor}
            className={`grid gap-4 py-8 md:grid-cols-[300px_1fr] md:gap-12 ${
              index > 0 ? 'mk-dash-top' : ''
            }`}
          >
            <div>
              <h2
                className='font-stretch text-[26px] font-extrabold leading-[1.1]'
                style={{ color: t.type }}
              >
                <a
                  href={`#${entry.anchor}`}
                  className='hover:underline decoration-2'
                >
                  {entry.title}
                </a>
              </h2>
              <p
                className='mt-2 font-mono text-[12.5px]'
                style={{ color: t.type, opacity: 0.62 }}
              >
                {formatDate(entry.date)}
              </p>
              <p className='mt-4 flex flex-wrap gap-1.5'>
                <Chip solid={entry.kind === 'new-feature'}>
                  {KIND_LABELS[entry.kind]}
                </Chip>
                {entry.platforms.map((platform) => (
                  <Chip key={platform}>
                    {PLATFORM_LABELS[platform] ?? platform}
                  </Chip>
                ))}
              </p>
            </div>
            <div
              className='prose max-w-none prose-headings:font-stretch'
              style={
                {
                  '--tw-prose-body': t.type,
                  '--tw-prose-headings': t.type,
                  '--tw-prose-bold': t.type,
                  '--tw-prose-links': t.ink,
                  '--tw-prose-bullets': t.ink,
                  color: t.type,
                } as React.CSSProperties
              }
              dangerouslySetInnerHTML={{ __html: entry.html }}
            />
          </section>
        ))}
      </main>
    </>
  );
}
