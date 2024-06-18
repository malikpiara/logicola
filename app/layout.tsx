import type { Metadata } from 'next';
import { Roboto_Flex } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import MobileNavbar from '@/components/mobile/navbar';
import { Footer } from '@/components/footer';
import { CSPostHogProvider } from '@/components/providers';
import thumbnail from '../public/thumbnail.jpg';
import ExerciseNavbar from '@/components/mobile/exerciseNavbar';

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['wdth'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://logicola.org'),
  title: 'Logicola',
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
    icon: '/next.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <CSPostHogProvider>
        <body
          className={`antialiased min-h-screen bg-white text-primaryColor ${robotoFlex.className}`}
        >
          <ExerciseNavbar />
          <MobileNavbar />

          <Navbar />
          <main className={`flex`}>{children}</main>
          <Footer />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
