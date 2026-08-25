import type { Metadata } from 'next';

/**
 * TEMPORARY route for judging the nav lab's mobile variant 3d-g on a
 * real device via the Vercel preview: the homepage, verbatim, but the
 * mobile navbar serves the "set world" sheet here (see
 * components/mobile/navbar.tsx). Delete once D13 is decided.
 */
export const metadata: Metadata = {
  title: 'LogiCola — nav preview',
  robots: { index: false, follow: false },
};

export { default } from '../page';
