import type { Metadata } from 'next';
import { Inter, Roboto_Slab } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import { content } from '@/content';

const inter = Inter({
  subsets: ['latin'],
});
//const roboto = Roboto_Slab({ weight: ['400', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
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
    images: '/malik_mini.jpeg',
    authors: ['Malik'],
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
      <body
        className={`antialiased min-h-screen h-screen bg-white text-primary ${inter.className}`}
      >
        <Navbar chapters={content.chapters} />
        <main className='w-full h-full flex'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
