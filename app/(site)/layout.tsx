import Navbar from '@/components/navbar';
import MobileNavbar from '@/components/mobile/navbar';
import { Footer } from '@/components/footer';
import { quizCatalog } from '@/lib/quizCatalog';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MobileNavbar quizCatalog={quizCatalog} />
      <Navbar quizCatalog={quizCatalog} />
      <main className='flex'>{children}</main>
      <Footer />
    </>
  );
}
