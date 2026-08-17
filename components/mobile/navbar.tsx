'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ExercisesSheet,
  type SheetVariant,
} from '@/components/mobile/exercisesSheet';
import { LogoMark } from '@/components/logoMark';

/**
 * Mobile nav: white bar, SET L inks (2026-08-17 — the landing decision
 * extended to the chrome; plum wordmark and burger); the burger opens
 * the exercises BOTTOM SHEET from the nav lab instead of the old flat
 * 13-row dropdown.
 *
 * Two lab variants ride two routes for the Vercel preview:
 *   '/'            → 3d-f (chip tiles, the scheme chrome throughout —
 *                    mint since 2026-08-17)
 *   '/nav-preview' → 3d-g (chip rows, level 2 paints the whole sheet)
 * Collapse to one variant once D13 is judged on-device.
 */
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.includes('quiz')) {
    return null;
  }

  const variant: SheetVariant = pathname === '/nav-preview' ? 'g' : 'f';
  // On the landing page the bar adopts the mint and fuses with the
  // masthead ("nav shares the ground it sits on" — Malik, 2026-08-17);
  // everywhere else it stays white.
  const onLanding = pathname === '/';

  return (
    <nav
      className='border-gray-200 md:hidden'
      style={
        {
          background: 'var(--nav-ground)',
          '--nav-ground': onLanding ? '#CFF6DD' : '#ffffff',
          '--nav-hover': onLanding ? '#C6E7D6' : '#F3F0F6',
        } as React.CSSProperties
      }
    >
      {/* px-4 sm:px-6 matches the sections' gutters (alignment pass,
          2026-08-17); below sm this is the same 16px as before */}
      <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 py-4 sm:px-6'>
        <Link
          href='/'
          aria-label='LogiCola — home'
          className='inline-flex items-center'
        >
          {/* the can instead of the text wordmark (Malik, 2026-08-17) */}
          <LogoMark height={34} body='#3F0167' knockout='var(--nav-ground)' />
        </Link>

        <button
          type='button'
          className='motion-button inline-flex items-center p-2 w-11 h-11 justify-center text-sm text-[#3F0167] rounded-lg md:hidden hover:bg-[var(--nav-hover)] focus:outline-none focus:ring-2 focus:ring-[#0C8F4E]'
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-haspopup='dialog'
        >
          <span className='sr-only'>Open exercises menu</span>
          <svg
            className='w-5 h-5'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 17 14'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M1 1h15M1 7h15M1 13h15'
            />
          </svg>
        </button>
      </div>
      <ExercisesSheet variant={variant} open={open} onOpenChange={setOpen} />
    </nav>
  );
};

export default Navbar;
