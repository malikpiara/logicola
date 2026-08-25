import Link from 'next/link';
import {
  MARKETING_THEME,
  markSvg,
  themeButton,
  SPRITE_CLIP,
} from '@/lib/marketingTheme';

/**
 * The marketing pages' own nav (lab screens 1–3): wordmark, Blog,
 * Release Notes, Practice. Decided 2026-08-14: the nav shares the ground
 * of the surface it sits on — the content ground on blog pages, the
 * scheme ground over the release-notes hero field.
 */
export function MarketingNav({ active }: { active: 'blog' | 'releases' }) {
  const t = MARKETING_THEME;
  const bg = active === 'releases' ? t.ground : t.contentGround;
  const btn = themeButton();

  const link = (href: string, label: string, on: boolean) => (
    <Link
      href={href}
      className='motion-colors font-mono text-[13.5px] font-semibold'
      style={
        on
          ? { color: t.type, boxShadow: `0 2px 0 ${t.ink}` }
          : { color: t.type, opacity: 0.72 }
      }
    >
      {label}
    </Link>
  );

  return (
    <header
      className='flex items-center justify-between px-6 py-4 sm:px-10'
      style={{ background: bg }}
    >
      <Link href='/' aria-label='LogiCola home'>
        <span dangerouslySetInnerHTML={{ __html: markSvg(34, t.ink, bg) }} />
      </Link>
      <nav className='flex items-center gap-5 sm:gap-7'>
        {link('/blog', 'Blog', active === 'blog')}
        {link('/release-notes', 'Release Notes', active === 'releases')}
        <Link
          href='/'
          className='motion-button px-5 py-2 font-mono text-[13.5px] font-bold'
          style={{ background: btn.bg, color: btn.fg, clipPath: SPRITE_CLIP }}
        >
          Practice
        </Link>
      </nav>
    </header>
  );
}
