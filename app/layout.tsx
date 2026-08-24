import type { Metadata, Viewport } from 'next';
import { PixelTipProvider } from '@/components/ui/pixelTip';
import { Roboto_Flex } from 'next/font/google';
import './globals.css';
import thumbnail from '../public/thumbnail.jpg';
import { SITE_URL } from '@/lib/site';
import RegisterSW from '@/components/providers/service-worker';
import WebsiteAnalytics from '@/components/providers/website-analytics';
import { Toaster } from '@/components/ui/sonner';

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['wdth'],
  // 'optional' guarantees zero font-swap layout shift (2026-08-24, CLS
  // audit #3): the display headings run font-stretch 151%, and no
  // fallback face has a width axis — the swap re-wrapped every heading
  // and moved everything under it. With 'optional' the font is used
  // when it's already there (warm cache, fast connection — the common
  // case, since next/font preloads it) and the metric-adjusted
  // fallback keeps the page still when it isn't; it then applies from
  // the next navigation. The trade: a cold first paint can render
  // headings without the stretch. Judged the right side of the
  // stability/flash trade for a study tool.
  display: 'optional',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // The homepage's own title. `Logicola` alone spent 8 of ~60 usable
    // characters and carried no term anyone searches for — the original
    // software is gone, so "download logicola" and its cousins are the
    // queries this site should be answering.
    default: 'LogiCola 3 — Free Logic Practice Exercises in Your Browser',
    // Every other route supplies its own claim and gets the brand appended.
    template: '%s | LogiCola',
  },
  description:
    'LogiCola is a program to help students learn logic. This is a web version of the original software built by the late Professor Harry Gensler.',
  creator: 'Malik Piara',
  keywords: [
    'logic',
    'propositional logic',
    'introduction to logic',
    'download logicola',
  ],
  publisher: 'Malik Piara',
  openGraph: {
    images: [
      {
        url: thumbnail.src,
        width: thumbnail.width,
        height: thumbnail.height,
      },
    ],
    authors: ['Malik'],
  },
  twitter: {
    images: [
      {
        url: thumbnail.src,
        width: thumbnail.width,
        height: thumbnail.height,
      },
    ],
  },
  /**
   * Two marks, split by size (Malik, 2026-08-23 — docs/app-icon-lab.html).
   *
   *   the CAN       browser tab (this `icon`) and the iOS home screen
   *   the WORDMARK  everything the manifest feeds — Android's launcher,
   *                 an installed macOS or Windows app
   *
   * They are separate channels on purpose: `rel="icon"` and the manifest's
   * `icons[]` are read by different consumers, which is what makes the
   * split ordinary rather than a trick. iOS is a third channel again —
   * `apple-touch-icon` — and it had NO entry at all before this, so iOS
   * installed a screenshot of the page.
   *
   * What could NOT be split is macOS from Android: macOS Sonoma and later
   * read the manifest's `maskable` entry, which is the same entry
   * Android's launcher reads. So those two share a mark by construction,
   * and Malik's call was the wordmark for both.
   *
   * `/icon.svg` keeps the brand magenta rather than the icons' new
   * chartreuse-and-maroon, and that is deliberate: it is a BARE mark with
   * no plate, so it has to survive a tab strip we do not control. Measured
   * against light and dark chrome, maroon lands at 1.03:1 on dark and
   * chartreuse at 1.09:1 on light — both invisible on one side. The
   * magenta's worst case is 2.54:1. Giving the favicon a plate would fix
   * that and is the open follow-up; it also means reworking
   * `useQuizFavicon`, which today swaps the mark's single fill.
   */
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  /**
   * Draw edge to edge, under the system bars.
   *
   * This is the only mechanism that colours the INSTALLED app's bars
   * per set. An installed PWA is a WebAPK: Android baked the manifest's
   * theme_color / background_color (#ffffff) into the package at
   * install time and paints the status and navigation bars from those,
   * so a runtime `theme-color` swap — which the browser does honour —
   * never reaches the installed shell. With `cover` the bars turn
   * transparent and whatever the page paints beneath them is what the
   * user sees, so the quiz's own surface shows through.
   *
   * Everything that must stay clear of the bars pads itself with
   * `env(safe-area-inset-*)`, which resolves to 0 where there are no
   * insets — so this is inert on desktop and in the browser pane.
   */
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel='manifest' href='/manifest.json' />
      </head>
      <body
        className={`antialiased min-h-screen bg-white text-primaryColor ${robotoFlex.className}`}
      >
        {/* One tooltip provider for the whole app: Radix's delay
            grouping (300ms first, neighbors instant) lives here. */}
        <PixelTipProvider>{children}</PixelTipProvider>
        <Toaster />
        <RegisterSW />
        <WebsiteAnalytics />
      </body>
    </html>
  );
}
