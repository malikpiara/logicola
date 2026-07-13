import Navbar from '@/components/navbar';
import MobileNavbar from '@/components/mobile/navbar';
import { Footer } from '@/components/footer';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MobileNavbar />
      <Navbar />
      <main className='flex'>{children}</main>
      <Footer />
    </>
  );
}
