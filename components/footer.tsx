import Link from 'next/link';
import { TrackedFooterLink } from './trackedFooterLink';
import { NewBadge } from './newBadge';
import { CurrentYear } from './currentYear';
import { NewsletterForm } from '@/components/marketing/newsletterForm';
import {
  markSvg,
  SPRITE_CLIP,
  RING_BAND,
  coverPool,
} from '@/lib/marketingTheme';
import { PixelTip } from '@/components/ui/pixelTip';
import { patternBody } from '@/lib/patterns';
import { gemClip } from '@/lib/pixel';

/**
 * The site footer — the footer lab's judged state (docs/footer-lab.html,
 * Malik's favourite structure, 2026-08-14) on SET L mint/plum — which
 * was also the lab's favourite GROUND, shipped provisionally on cream
 * until the scheme call. Malik took that call for the homepage on
 * 2026-08-17 (docs/landing-lab.html LP11: the landing grounds in
 * Set L, and the other sections follow), so the provisional cream is
 * retired here. Structure unchanged: subscribe-first banner → brand
 * block (the can + the mission line) + three link columns → bottom bar
 * with the pixel social icons in white gem chips → the fine camo band
 * closing the page.
 *
 * Every scheme-dependent value below is a named token so any later
 * swap stays a constant swap; the derived tiers come from the labs'
 * ensure-contrast loop and each carries its measured ratio. The can is
 * now the scheme's plum on mint (12.67:1) — the cream footer's "legal
 * but faint" green-can caveat retires with the cream.
 *
 * The subscribe control reuses the shipped NewsletterForm — the decided
 * "answer pill" — posting to /api/newsletter with source 'footer'. The
 * band is the social covers' own quilt on the nine, plum on mint — see
 * bandSvg below for the scale and why it crops. It supersedes the
 * footer lab's camo recipe, whose "deep-register colour only, never a
 * pale surface on a pale ground" rule was the brand lab's forced
 * inversion applied to a surface that carries no text; the covers
 * settled that question the other way.
 */
const GROUND = '#CFF6DD'; // Set L mint (quizColors L surface, verbatim)
const TYPE = '#3F0167'; // Set L plum · 12.67:1 on the mint
/** column heads — 5.16:1 on mint */
const HEAD = '#715790';
/** links + mission — 8.06:1 on mint */
const LINK = '#5C327F';
/** copyright / fine print — 5.99:1 on mint */
const FINE = '#6A4B8A';
/** hairline: mint mixed 14% toward the type ink */
const HAIR = '#BBD4CC';
/** the answer pill's button: ink fill, ground text (btnColors' rule —
 *  type equals ink in this scheme, so the ground carries the label;
 *  mint on plum 12.67:1). Local on purpose: marketingTheme's button
 *  still speaks the blog's cream scheme. */
const BUTTON = { bg: TYPE, fg: GROUND };

const GEM = gemClip();

/** The publisher's page for Gensler's textbook, bare. Kept separate from
 *  the linked URL below because it is what we send to PostHog: the
 *  campaign decoration is for Routledge's analytics, not ours, and saved
 *  insights already filter on this exact string. */
const BOOK_URL =
  'https://www.routledge.com/Introduction-to-Logic/Gensler/p/book/9781138910591';
/** What we actually link to. The UTM triple + placement lets Routledge
 *  attribute the sale to LogiCola in their own reporting — the Referer
 *  header alone gives them the bare origin, and browsers drop or trim it
 *  under stricter privacy settings, so the referral would otherwise land
 *  in their "direct" bucket. utm_content names the placement so a second
 *  copy of this link (landing, FAQ) stays distinguishable from the
 *  footer's. (Malik, 2026-08-18) */
const GET_THE_BOOK_URL =
  `${BOOK_URL}?utm_source=logicola.org&utm_medium=referral` +
  '&utm_campaign=get-the-book&utm_content=footer_resources';
const REDDIT_URL = 'https://www.reddit.com/r/Logicola/';
// Used by both the "Follow us" list and the icon row, like REDDIT_URL above.
const X_URL = 'https://x.com/LogicolaThree';
const GITHUB_URL = 'https://github.com/malikpiara/logicola';
const LINKEDIN_URL = 'https://www.linkedin.com/company/logicola';
// Malik's personal account — Logicola has no Bluesky of its own yet, so the
// maintainer's handle stands in for it here (Malik, 2026-08-18).
const BLUESKY_URL = 'https://bsky.app/profile/malikpiara.bsky.social';

/** The band: 1600×56 once, `slice`-cropped at any viewport so the
 *  features keep their proportion instead of squeezing (the LinkedIn
 *  cover's lesson).
 *
 *  THE COVER RECIPE, AT A ROW AND A THIRD (Malik, 2026-08-24, from
 *  docs/footer-band-lab.html). The band was camo at 0.35 reading a
 *  single magenta — camo takes only `pool[0]`, so two colours and a
 *  ground was the most it could ever show. It now runs the quilt the
 *  social covers run, on the nine, at rate 0.75: the page's last object
 *  and a profile's first object are the same pattern.
 *
 *  0.72 IS A CROP, DELIBERATELY. A cell is `62 × scale` and rows lay
 *  from y=0, so whole-row scales are the family `h / (62 × N)` — 0.90
 *  for one row, 0.45 for two. Both were judged and both lost: one row
 *  of 56px shapes reads as a border rather than a quilt (a quilt needs
 *  a second axis before the eye sees a field), and two rows shrink the
 *  cell to 28px, well under the covers' own. 0.74 keeps a 46px cell and
 *  carries 1.21 rows, so the second row shows as a 10px sliver. The cut
 *  lands on the band's BOTTOM edge — the bottom of the page — where a
 *  pattern running off-canvas is what a cover does anyway.
 *
 *  SHAPE SIZE AND SECOND-ROW VISIBILITY ARE ONE DIAL, pulling opposite
 *  ways: the sliver is `56 − 62 × scale`, so every pixel of cell costs
 *  a pixel of row two. It closes entirely at 0.90 — which is the
 *  one-row border again — and the cell falls below the covers' own
 *  register under ~0.70. 0.74 sits where both still read. Wanting
 *  bigger shapes AND more of row two means raising the band's HEIGHT,
 *  which is the one thing the original brief fixed (Malik, 2026-08-24).
 *
 *  Seed 45 is the covers' seed, and it is fixed forever: a short window
 *  onto a large-featured field is largely decided by its seed, so this
 *  number is part of the design, not an arbitrary default. */
function bandSvg() {
  const body = patternBody('quilt', {
    w: 1600,
    h: 56,
    ink: TYPE,
    pool: coverPool(GROUND, TYPE),
    scale: 0.74,
    seed: 45,
    clear: null,
    rate: 0.75,
  });
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="56" viewBox="0 0 1600 56" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:56px">` +
    `<rect width="1600" height="56" fill="${GROUND}"/>` +
    body +
    '</svg>'
  );
}

function SocialChip({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    // Icon-only link → plain tooltip naming it (docs/pixel-ui.md §
    // Tooltips; NN/g's consistency rule — every icon-only control gets
    // one, not just some). Above the chip: the footer sits at the
    // page's bottom edge.
    <PixelTip tip={label} side='top'>
      <Link
        href={href}
        aria-label={label}
        className='motion-colors -m-[7px] inline-flex h-11 w-11 items-center justify-center'
        style={{ color: TYPE }}
      >
        {/* 30px white gem chip inside a 44px tap box: the figure move that
          keeps the icons off the band's colour (footer lab, Malik's
          catch), and the HIG tap floor. */}
        <span
          className='inline-flex h-[30px] w-[30px] items-center justify-center bg-white'
          style={{ clipPath: GEM }}
        >
          {children}
        </span>
      </Link>
    </PixelTip>
  );
}

/**
 * A footer entry that is named but not yet written (Malik, 2026-08-24:
 * the legal pages).
 *
 * NOT A LINK, deliberately. These were `<Link href='#'>`, which is the
 * worst of both: it announces as a link, takes focus and a click, and
 * then does nothing — 3.2.4's "consistent identification" broken at the
 * cheapest possible place. A span with `aria-disabled` is honest.
 *
 * THE TOOLTIP CANNOT BE THE ONLY CARRIER. PixelTip is desktop-only by
 * construction — Radix never opens it on touch, and the content is
 * hidden under `(hover: none)` besides — so its own docstring forbids
 * putting anything essential in it. The state therefore travels three
 * ways: the tip for pointers, a visually-hidden suffix for assistive
 * tech, and the dimmed tier for everyone (HEAD, 5.16:1 on the mint —
 * an already-measured token, so no new colour to justify).
 */
function ComingSoon({ children }: { children: React.ReactNode }) {
  return (
    <PixelTip tip='Coming soon' side='top'>
      <span
        aria-disabled='true'
        className='cursor-not-allowed'
        style={{ color: HEAD }}
      >
        {children}
        <span className='sr-only'> — coming soon</span>
      </span>
    </PixelTip>
  );
}

export function Footer() {
  return (
    <footer
      className='mt-4'
      style={{ background: GROUND, '--mk-type': TYPE } as React.CSSProperties}
    >
      {/* subscribe-first: the newsletter opens the footer */}
      <div className='mx-auto max-w-screen-xl px-4 pb-2 pt-12 sm:px-6'>
        {/* mixed case, not caps (Malik, 2026-08-17 — one rule for every
            display title on the page) */}
        <h2
          className='font-stretch text-2xl font-extrabold leading-tight'
          style={{ color: TYPE }}
        >
          Follow the releases
        </h2>
        <p
          className='mt-1.5 max-w-[60ch] text-[15px] leading-normal'
          style={{ color: LINK }}
        >
          New exercise sets, new features, the occasional essay — straight to
          your inbox when there&apos;s something new.
        </p>
        <NewsletterForm
          source='footer'
          theme={{
            ink: TYPE,
            buttonBg: BUTTON.bg,
            buttonFg: BUTTON.fg,
            spriteClip: SPRITE_CLIP,
            ringClip: RING_BAND,
          }}
        />
      </div>

      <div className='mx-auto max-w-screen-xl px-4 pb-10 pt-10 sm:px-6'>
        <div className='grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-10'>
          <div className='col-span-2 md:col-span-1'>
            <Link href='https://logicola.org' className='inline-flex'>
              <span
                aria-label='LogiCola'
                role='img'
                dangerouslySetInnerHTML={{
                  __html: markSvg(44, TYPE, GROUND),
                }}
              />
            </Link>
            <p
              className='mt-3 max-w-[36ch] text-[14.5px] leading-normal'
              style={{ color: LINK }}
            >
              Free logic practice in your browser — a remake of Harry Gensler’s
              LogiCola, kept alive to honour his legacy.
            </p>
          </div>
          <div>
            <h2
              className='mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.08em]'
              style={{ color: HEAD }}
            >
              Resources
            </h2>
            <ul
              className='space-y-3.5 text-[14.5px] font-medium'
              style={{ color: TYPE }}
            >
              <li>
                <Link
                  href='/blog'
                  className='motion-colors inline-flex items-center gap-2 hover:underline'
                >
                  Blog <NewBadge />
                </Link>
              </li>
              <li>
                <Link
                  href='/release-notes'
                  className='motion-colors inline-flex items-center gap-2 hover:underline'
                >
                  Release Notes <NewBadge />
                </Link>
              </li>
              <li>
                <Link
                  href='https://harrycola.com/lc/index.htm'
                  className='motion-colors hover:underline'
                >
                  Classic Logicola
                </Link>
              </li>
              <li>
                <TrackedFooterLink
                  href={GET_THE_BOOK_URL}
                  eventName='book_cta_clicked'
                  properties={{
                    link_text: 'Get the Book',
                    link_url: BOOK_URL,
                    link_location: 'footer_resources',
                    destination_domain: 'routledge.com',
                    resource_type: 'book',
                  }}
                  className='motion-colors hover:underline'
                >
                  Get the Book
                </TrackedFooterLink>
              </li>
              <li>
                <Link
                  href='/keyboard'
                  className='motion-colors hover:underline'
                >
                  LaTeX Keyboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2
              className='mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.08em]'
              style={{ color: HEAD }}
            >
              Follow us
            </h2>
            <ul
              className='space-y-3.5 text-[14.5px] font-medium'
              style={{ color: TYPE }}
            >
              {/* Keep this link reachable from every page: under AGPL
                  §13 the repo link is what offers a network service's
                  users its source. The LABEL is not part of that — it
                  says GitHub because that is what a reader is looking
                  for (Malik, 2026-08-24, reverting a rename of mine). */}
              <li>
                <Link
                  href={GITHUB_URL}
                  className='motion-colors hover:underline'
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link href={X_URL} className='motion-colors hover:underline'>
                  X
                </Link>
              </li>
              <li>
                <Link
                  href={BLUESKY_URL}
                  className='motion-colors inline-flex items-center gap-2 hover:underline'
                >
                  Bluesky <NewBadge />
                </Link>
              </li>
              <li>
                <Link
                  href={REDDIT_URL}
                  className='motion-colors inline-flex items-center gap-2 hover:underline'
                >
                  Reddit <NewBadge />
                </Link>
              </li>
              <li>
                <Link
                  href={LINKEDIN_URL}
                  className='motion-colors hover:underline'
                >
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2
              className='mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.08em]'
              style={{ color: HEAD }}
            >
              Legal
            </h2>
            <ul
              className='space-y-3.5 text-[14.5px] font-medium'
              style={{ color: TYPE }}
            >
              <li>
                <ComingSoon>Privacy Policy</ComingSoon>
              </li>
              <li>
                <ComingSoon>Terms &amp; Conditions</ComingSoon>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${HAIR}` }}>
        <div className='mx-auto flex max-w-screen-xl flex-wrap items-center gap-x-5 gap-y-3 px-4 pb-8 pt-4 sm:px-6'>
          <span className='text-sm' style={{ color: FINE }}>
            {/* Points HOME, not to logicola.com (2026-08-24 copy
                review): that domain is a squatter's parking page —
                "Logicola.com is for sale | HugeDomains", HTTP 404 —
                so every page of the site was sending readers to an
                ad for a domain we do not own. Casing is LogiCola,
                matching the brand two lines above. */}
            © <CurrentYear buildYear={new Date().getFullYear()} />{' '}
            <Link href='/' className='motion-colors hover:underline'>
              LogiCola
            </Link>
            . Some Rights Reserved.
          </span>
          {/* Pixel icons from pixeliconlibrary.com (hackernoon/pixel-icon-
              library, icons/SVG/brands) — the smooth vendor glyphs traded
              for the brand's own bitmap grammar. See docs/pixel-ui.md. */}
          <div className='ml-auto flex gap-3'>
            <SocialChip href={REDDIT_URL} label='Logicola on Reddit'>
              <svg
                className='h-[18px] w-[18px]'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <rect x='14' y='15' width='1' height='1' />
                <rect x='13' y='12' width='2' height='2' />
                <rect x='9' y='12' width='2' height='2' />
                <rect x='9' y='15' width='1' height='1' />
                <path d='m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-3,5h-1v1h-1v2h-1v1h-2v1h-4v-1h-2v-1h-1v-3h-1v-1h-1v-2h1v-1h2v1h1v-1h3v-5h2v1h3v2h-2v-1h-2v3h2v1h1v-1h2v1h1v3Z' />
                <rect x='10' y='16' width='4' height='1' />
              </svg>
            </SocialChip>
            <SocialChip href={X_URL} label='Logicola on X'>
              <svg
                className='h-[18px] w-[18px]'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='m15.5,10v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-3v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1h-1v-2h-1v-1h-1v-1H1.5v1h1v1h1v1h1v2h1v1h1v2h1v1h1v2h1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h3v-1h1v-1h1v-1h1v-1h1v-1h1v-1h2v1h1v1h1v2h1v1h1v1h7v-1h-1v-1h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1h1Zm0,4v1h1v2h1v1h1v2h-3v-2h-1v-1h-1v-1h-1v-2h-1v-1h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1h-1v-2h3v1h1v2h1v1h1v2h1v1h1v1h1v2h1Z' />
              </svg>
            </SocialChip>
            <SocialChip href={BLUESKY_URL} label='Malik Piara on Bluesky'>
              <svg
                className='h-[18px] w-[18px]'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='M23 3V11H22V13H20V14H18V15H20V16H21V19H20V20H19V21H17V22H15V21H14V20H13V18H11V20H10V21H9V22H7V21H5V20H4V19H3V16H4V15H6V14H4V13H2V11H1V3H2V2H4V3H6V4H7V5H8V6H9V7H10V9H11V10H13V9H14V7H15V6H16V5H17V4H18V3H20V2H22V3H23Z' />
              </svg>
            </SocialChip>
            <SocialChip href={GITHUB_URL} label='Logicola on GitHub'>
              <svg
                className='h-[18px] w-[18px]'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <polygon points='23 9 23 15 22 15 22 17 21 17 21 19 20 19 20 20 19 20 19 21 18 21 18 22 16 22 16 23 15 23 15 18 14 18 14 17 15 17 15 16 17 16 17 15 18 15 18 14 19 14 19 9 18 9 18 6 16 6 16 7 15 7 15 8 14 8 14 7 10 7 10 8 9 8 9 7 8 7 8 6 6 6 6 9 5 9 5 14 6 14 6 15 7 15 7 16 9 16 9 18 7 18 7 17 6 17 6 16 4 16 4 17 5 17 5 19 6 19 6 20 9 20 9 23 8 23 8 22 6 22 6 21 5 21 5 20 4 20 4 19 3 19 3 17 2 17 2 15 1 15 1 9 2 9 2 7 3 7 3 5 4 5 4 4 5 4 5 3 7 3 7 2 9 2 9 1 15 1 15 2 17 2 17 3 19 3 19 4 20 4 20 5 21 5 21 7 22 7 22 9 23 9' />
              </svg>
            </SocialChip>
            <SocialChip href={LINKEDIN_URL} label='Logicola on LinkedIn'>
              <svg
                className='h-[18px] w-[18px]'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='m22,2v-1H2v1h-1v20h1v1h20v-1h1V2h-1Zm-9,10v8h-3v-11h3v1h1v-1h4v1h1v10h-3v-8h-3Zm-9-4v-3h3v3h-3Zm3,1v11h-3v-11h3Z' />
              </svg>
            </SocialChip>
          </div>
        </div>
      </div>

      <div aria-hidden='true' dangerouslySetInnerHTML={{ __html: bandSvg() }} />
    </footer>
  );
}
