import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { FaqSection } from '@/components/faqSection';

// Title and description come from the root layout — this is the page they
// were written for. Only the canonical is page-specific: it can't live in the
// layout, which would aim every route's canonical at the homepage.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <>
      <div className='flex flex-col m-auto'>
        <Header />
        {/* The FAQ was redesigned in docs/faq-lab.html (2026-08-15) — copy,
            structure and tokens now live in components/faqSection.tsx. */}
        <FaqSection />
      </div>
    </>
  );
}
