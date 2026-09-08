import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { publishedPosts, formatDate } from '@/lib/marketingContent';
import { SETS, coverPool } from '@/lib/marketingTheme';
import { patternBody } from '@/lib/patterns';

/**
 * The link card — direction G from docs/og-lab.html (Malik, 2026-09-08:
 * "D for the OG. But the quilt maybe needs the same treatment and scale
 * as the footer"; on the full-bleed frame: "Same footer treatment means
 * only on the bottom and with higher scale"; on E against G: "Let's go
 * with G but increase the top padding/margin of the band").
 *
 * G IS E WITHOUT THE PLATE AS AN OBJECT: the card is cream, like the
 * blog page, with plum type straight on it, and the mint appears only
 * as the band's own ground — the footer under the page, not a sticker
 * on mint. The plate div stays for layout; it is the same cream as the
 * canvas.
 *
 * The brand work deferred this surface (docs/brand-decisions.md,
 * 2026-08-12: "it is the one surface that genuinely wants a headline on
 * it"); the first card was cream, a green wordmark in the default sans,
 * and the title. This one is the footer's composition: mint ground, the
 * title on a cream plate, and ONE band of the footer's quilt along the
 * bottom edge — plum on Set L mint, the covers' nine at rate 0.75, seed
 * 45, the recipe in components/footer.tsx bandSvg. The page's last
 * object, a profile's first object and the link card are the same
 * pattern.
 *
 * THE BAND IS LAID THE FOOTER'S WAY: centred across, rows from the
 * band's top, so the second row is cut by the canvas edge and nowhere
 * else (footer.tsx: "the cut lands on the band's BOTTOM edge"). Scale
 * 2.00 is the covers' own (docs/brand-lab.html, decided 2026-08-12):
 * 124px cells, 1.24 rows in the 154px band — the footer's "row and a
 * fifth" at card size. 1.5 shows too much of row two and reads busy;
 * 2.4 shows one row and reads as a border, the case the footer
 * rejected. Both are in the lab.
 *
 * Type is the site's display register — Roboto Flex at wdth 151, weight
 * 800, tracking -0.01em, the post h1's exact setting — as a static
 * instance, because Satori reads no variable axes
 * (assets/og/RobotoFlex-Display.ttf, instanced with fontTools from the
 * OFL variable font; licence beside it). The mono is IBM Plex Mono
 * Medium (OFL): the site's `ui-monospace` is a system face Satori
 * cannot see.
 */
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const W = size.width;
const H = size.height;

const GROUND = SETS.L.surface; // #CFF6DD, the footer's mint
const INK = SETS.L.ink; // #3F0167, the footer's plum
const PLATE = '#EDEDE3'; // the brand cream
const QUILT_SCALE = 2; // the covers' scale (brand lab, 2026-08-12)
const QUILT_RATE = 0.75;
const QUILT_SEED = 45; // the covers' seed, fixed forever (footer.tsx)

const PLATE_RECT = { x: 72, y: 64, w: W - 144, h: 388 };
/** The band: mint from 32px under the text block to the canvas edge,
 *  the quilt's first row a further 16px down (plus the generator's own
 *  cell padding), so the shapes sit in the mint rather than on its edge
 *  — the "top padding" Malik asked for on G. */
const BAND_GAP = 32;
const BAND_TOP_PAD = 16;
const BAND = {
  y: PLATE_RECT.y + PLATE_RECT.h + BAND_GAP,
  h: H - (PLATE_RECT.y + PLATE_RECT.h + BAND_GAP),
};

function fieldSvg(): string {
  const t = 62 * QUILT_SCALE;
  const span = (len: number) => Math.ceil(len / t) * t + t;
  // Centred across (the overflow split evenly, as the brand lab's cover
  // offset does); NOT centred down — rows lay from the band's top.
  const ox = -(span(W) - W) / 2;
  const body = patternBody('quilt', {
    w: W - ox * 2,
    h: BAND.h + t,
    ink: INK,
    pool: coverPool(GROUND, INK),
    scale: QUILT_SCALE,
    seed: QUILT_SEED,
    rate: QUILT_RATE,
    clear: null,
  });
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="${W}" height="${H}" fill="${PLATE}"/>` +
    `<rect y="${BAND.y}" width="${W}" height="${BAND.h}" fill="${GROUND}"/>` +
    `<g transform="translate(${ox} ${BAND.y + BAND_TOP_PAD})">${body}</g>` +
    '</svg>'
  );
}

/** Two lines at most at 936px: the lab's rule, from the h1's metrics. */
function titleSize(title: string): number {
  return title.length <= 28 ? 84 : 68;
}

async function font(file: string): Promise<ArrayBuffer> {
  const buf = await readFile(path.join(process.cwd(), 'assets', 'og', file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

/** One image per post, with the post's own alt text (the static `alt`
 *  export can only say "LogiCola blog post" for every post). */
export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = publishedPosts.find((candidate) => candidate.slug === slug);
  return [
    {
      id: 'card',
      alt: post ? `${post.title} — LogiCola blog` : 'LogiCola blog',
      size,
      contentType,
    },
  ];
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
  id: string;
}) {
  const { slug } = await params;
  const post = publishedPosts.find((candidate) => candidate.slug === slug);
  const title = post?.title ?? 'LogiCola Blog';
  const meta = post
    ? `${formatDate(post.date)} · logicola.org`
    : 'logicola.org';
  const [display, mono] = await Promise.all([
    font('RobotoFlex-Display.ttf'),
    font('IBMPlexMono-Medium.ttf'),
  ]);
  const field = `data:image/svg+xml;base64,${Buffer.from(fieldSvg()).toString('base64')}`;
  const fontSize = titleSize(title);

  return new ImageResponse(
    <div
      style={{
        width: W,
        height: H,
        display: 'flex',
        position: 'relative',
        backgroundColor: PLATE,
      }}
    >
      <img
        src={field}
        width={W}
        height={H}
        alt=''
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <div
        style={{
          position: 'absolute',
          left: PLATE_RECT.x,
          top: PLATE_RECT.y,
          width: PLATE_RECT.w,
          height: PLATE_RECT.h,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '44px 60px',
          backgroundColor: PLATE,
          color: INK,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontFamily: 'IBMPlexMono',
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 1.44,
          }}
        >
          LOGICOLA · BLOG
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'RobotoFlexDisplay',
            fontSize,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: -0.01 * fontSize,
            maxWidth: PLATE_RECT.w - 120,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'IBMPlexMono',
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: 0.26,
          }}
        >
          {meta}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'RobotoFlexDisplay',
          data: display,
          weight: 800,
          style: 'normal',
        },
        { name: 'IBMPlexMono', data: mono, weight: 500, style: 'normal' },
      ],
    }
  );
}
