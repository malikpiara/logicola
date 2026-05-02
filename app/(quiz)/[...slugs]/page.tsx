import Quiz from '@/components/quiz';
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

  const subSet = await loadPublishedQuizSubSet(slugs);

  if (!subSet) {
    notFound();
  }

  return (
    <div className='flex w-full h-screen'>
      {/* <ExerciseSidebar
          chapter={3}
          path={params.slugs.slice(0, -1)}
          isQuestionActive={(index) => {
            return pathname === `/informal/definitions/${index + 1}`;
          }}
          initialQuestionIdx={0}
        /> */}
      <main className='p-4 w-full'>
        <Quiz subSet={subSet} />
      </main>
    </div>
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

  return {
    title: (publishedQuiz?.title || 'Not found') + ' | Logicola',
  };
}
