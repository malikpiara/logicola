import type { Metadata, Viewport } from 'next';
import { ExercisesCatalog } from '@/components/landing/exercisesCatalog';
import { FaqSection } from '@/components/faqSection';

// Title and description come from the root layout — this is the page they
// were written for. Only the canonical is page-specific: it can't live in the
// layout, which would aim every route's canonical at the homepage.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * The Android status bar reads `theme-color`, and the root layout's
 * viewport says white — so the bar sat white over the mint landing
 * (Malik's catch, 2026-08-17). Mint here, on `/` only, matching the
 * navbar's conditional ground. `viewportFit` restated because a leaf
 * viewport wins per field — losing the root's edge-to-edge `cover`
 * would break the installed app's transparent bars (see app/layout.tsx).
 * The quiz keeps its own runtime swap (useQuizChrome).
 */
export const viewport: Viewport = {
  themeColor: '#CFF6DD',
  viewportFit: 'cover',
};

export default function Home() {
  return (
    <>
      {/* w-full is load-bearing: the (site) layout's <main> is display:flex,
          so without it this div shrinks to fit-content and the coloured
          sections stop short of the viewport edges (Malik's catch,
          2026-08-17 — "white margins left and right"). */}
      <div className='flex w-full flex-col'>
        {/* Pre-paint, parser-blocking on purpose (2026-08-24): marks
            <html> when a last drill exists so CSS can reserve the
            resume banner's box before anything below it paints — the
            inline-script-for-client-only-data pattern. Must stay ABOVE
            the catalogue in the tree. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{localStorage.getItem('logicola.last_drill')&&document.documentElement.setAttribute('data-lx-resume','')}catch(e){}",
          }}
        />
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
