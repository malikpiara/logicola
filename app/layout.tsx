import type { Metadata, Viewport } from 'next';
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
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
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
        {children}
        <Toaster />
        <RegisterSW />
        <WebsiteAnalytics />
      </body>
    </html>
  );
}
