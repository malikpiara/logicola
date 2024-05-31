import NoSSR from '@/components/NoSSR';
import Quiz from '@/components/quiz';
import { chapters } from '@/content';

const arraysAreSame = (array1: string[], array2: string[]) =>
  array1.length === array2.length &&
  array1.every((value, index) => value === array2[index]);

export interface QuizPageProps {
  params: { slugs: string[]; exercise: number };
}
export default function QuizPage({ params }: QuizPageProps) {
  const chapter = chapters.find((i) =>
    arraysAreSame(i.slugs.concat(['quiz']), params.slugs)
  );

  if (!chapter)
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
          path='/informal/definitions/'
          isQuestionActive={(index) => {
            return pathname === `/informal/definitions/${index + 1}`;
          }}
          initialQuestionIdx={0}
        /> */}
      <main className='p-4 w-full'>
        <NoSSR>
          <Quiz chapter={chapter.id} showExerciseId={false} />
        </NoSSR>
      </main>
    </div>
  );
}
