import type { Metadata } from 'next';
import { Roboto_Flex } from 'next/font/google';

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['wdth'],
});

// This was a verbatim copy of the root layout's metadata. Everything in it
// except the title was already inherited, and the title — 'Logicola' — only
// served to override the brand template and put a second page in competition
// with the homepage.
//
// Noindex because this renders one reader's own progress from local state: a
// crawler sees an empty shell, and no searcher wants someone else's scores.
// It's kept out of the sitemap for the same reason.
export const metadata: Metadata = {
  title: 'Your Progress',
  robots: { index: false, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={`antialiased min-h-screen bg-white text-primaryColor w-full ${robotoFlex.className}`}
    >
      {children}
    </main>
  );
}
