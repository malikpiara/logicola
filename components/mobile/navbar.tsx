'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ExercisesSheet,
  type SheetVariant,
} from '@/components/mobile/exercisesSheet';

/**
 * Mobile nav: the bar stays as it was (white, text wordmark — Malik,
 * 2026-08-14: header untouched for now); the burger opens the exercises
 * BOTTOM SHEET from the nav lab instead of the old flat 13-row dropdown.
 *
 * Two lab variants ride two routes for the Vercel preview:
 *   '/'            → 3d-f (chip tiles, cream world throughout)
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

  return (
    <nav className='bg-white border-gray-200 md:hidden'>
      <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4'>
        <Link
          href='/'
          className='flex items-center space-x-3 rtl:space-x-reverse'
        >
          <span className='self-center text-2xl font-bold text-gray-900 whitespace-nowrap font-stretch'>
            LogiCola
          </span>
        </Link>

        <button
          type='button'
          className='motion-button inline-flex items-center p-2 w-11 h-11 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-stone-200'
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
