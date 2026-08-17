import type { Metadata } from 'next';
import { ExercisesCatalog } from '@/components/landing/exercisesCatalog';
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
      {/* w-full is load-bearing: the (site) layout's <main> is display:flex,
          so without it this div shrinks to fit-content and the coloured
          sections stop short of the viewport edges (Malik's catch,
          2026-08-17 — "white margins left and right"). */}
      <div className='flex w-full flex-col'>
        {/* The old hero (mascot + green H1, components/header.tsx) was
            replaced 2026-08-17 by the masthead + exercises catalogue —
            docs/landing-lab.html, Malik's decided composition. The drills
            surface ON the frontpage; the exercises menu stays as global
            chrome but the landing no longer depends on it. */}
        <ExercisesCatalog />
        {/* The FAQ was redesigned in docs/faq-lab.html (2026-08-15) — copy,
            structure and tokens now live in components/faqSection.tsx. */}
        <FaqSection />
      </div>
    </>
  );
}
