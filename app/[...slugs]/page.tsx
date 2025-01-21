import NoSSR from '@/components/NoSSR';
import Quiz from '@/components/quiz';
import * as sets from '@/content/sets';
import { Set, SubSet } from '@/content/types';
import { getAllSubSets } from '@/utils/getAllSubsets';
import { Metadata } from 'next';

const arraysAreSame = (array1: string[], array2: string[]) =>
  array1.length === array2.length &&
  array1.every((value, index) => value === array2[index]);

export interface QuizPageProps {
  params: { slugs: string[]; exercise: number };
}
export default function QuizPage({ params }: QuizPageProps) {
  const allSets: Set[] = Object.values(sets);
  const allSubSets: SubSet[] = getAllSubSets(allSets);

  const subSet = allSubSets.find((i) =>
    arraysAreSame(i.slugs.concat(['quiz']), params.slugs)
  );

  if (!subSet)
    return (
      <div className='flex w-full h-screen'>
        <main className='p-4 w-full'>
          <h1>Error: failed to find this quiz</h1>
        </main>
      </div>
    );

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
        <NoSSR>
          <Quiz subSet={subSet} />
        </NoSSR>
      </main>
    </div>
  );
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const allSets: Set[] = Object.values(sets);
  const allSubSets: SubSet[] = getAllSubSets(allSets);

  const subSet = allSubSets.find((i) =>
    arraysAreSame(i.slugs.concat(['quiz']), params.slugs)
  );

  return {
    title: (subSet?.title || 'Not found') + ' | Logicola',
  };
}
