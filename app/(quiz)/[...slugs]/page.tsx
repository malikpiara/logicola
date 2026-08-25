import Quiz from '@/components/quiz';
import GeneratedQuizDispatcher from '@/components/quiz/generated';
import Navbar from '@/components/navbar';
import { findQuizCatalogEntry, quizRouteSlugs } from '@/lib/quizCatalog';
import { loadPublishedQuizSubSet } from '@/lib/publishedQuizLookup';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export interface QuizPageProps {
  params: Promise<{ slugs: string[] }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slugs } = await params;
  const publishedQuiz = findQuizCatalogEntry(slugs);

  if (!publishedQuiz) {
    notFound();
  }

  const loaded = await loadPublishedQuizSubSet(slugs);

  if (!loaded) {
    notFound();
  }

  // The dispatcher keys each set to its own dynamically-imported chunk —
  // the why lives in components/quiz/generated/index.tsx.
  const quiz =
    loaded.runtime === 'static' ? (
      <Quiz subSet={loaded.subSet} />
    ) : (
      <GeneratedQuizDispatcher
        setKey={loaded.setKey}
        subsetIndex={loaded.subsetIndex}
      />
    );

  return (
    <>
      {/* Below lg the quiz is FULL-BLEED: no site navbar (the in-card ✕
          is the exit — a full navbar of phone height reclaimed), no page
          padding, no white margins. The desktop keeps its framed card. */}
      <div className='hidden lg:block'>
        <Navbar />
      </div>
      <div className='flex w-full min-h-dvh lg:min-h-[calc(100vh-4rem)]'>
        {/* <ExerciseSidebar
            chapter={3}
            path={params.slugs.slice(0, -1)}
            isQuestionActive={(index) => {
              return pathname === `/informal/definitions/${index + 1}`;
            }}
            initialQuestionIdx={0}
          /> */}
        <main className='w-full p-0 lg:p-4'>{quiz}</main>
      </div>
    </>
  );
}

export function generateStaticParams() {
  return quizRouteSlugs.map((slugs) => ({ slugs }));
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { slugs } = await params;
  const publishedQuiz = findQuizCatalogEntry(slugs);

  if (!publishedQuiz) {
    return { title: 'Not found' };
  }

  return {
    // The root layout's `title.template` appends the brand, so this is just
    // the page's own claim. "Free Practice Quiz" is what the searcher is
    // actually after — the set name alone left most of the ~60 usable
    // characters unused.
    title: `${publishedQuiz.title} — Free Practice Quiz`,
    description: `${publishedQuiz.description} Free interactive practice from LogiCola 3.`,
    // Self-referencing canonical. Set per-route, never in the root layout:
    // a layout-level canonical would point every page at one URL and
    // deindex the rest.
    alternates: { canonical: publishedQuiz.quizPath },
  };
}
