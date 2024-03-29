'use client';
import Exercise from '@/components/exercise';
import ExerciseSidebar from '@/components/exerciseSidebar';
import { usePathname } from 'next/navigation';

export default function ExercisePage({
  params,
}: {
  params: { exercise: number };
}) {
  const pathname = usePathname();
  return (
    <>
      <div className='flex w-full h-screen overflow-scroll'>
        <ExerciseSidebar
          chapter={6.1}
          path='/basic-propositional-logic/easier-translations/'
          isQuestionActive={(index) => {
            return (
              pathname ===
              `/basic-propositional-logic/easier-translations/${index + 1}`
            );
          }}
          initialQuestionIdx={0}
        />
        <div className='p-4 w-full'>
          <h1 className='mb-6 text-3xl font-bold text-gray-900'>
            Quiz (6.1.a)
          </h1>
          {/* We're subtracting 1 from the parameters because the index of the exercises starts at 0 */}
          <Exercise
            chapter={6.1}
            initialQuestionIdx={params.exercise - 1}
            showExerciseId={true}
          />
        </div>
      </div>
    </>
  );
}
