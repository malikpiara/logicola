'use client';
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
          chapter={3}
          path='/informal/definitions/'
          isQuestionActive={(index) => {
            return pathname === `/informal/definitions/${index + 1}`;
          }}
          initialQuestionIdx={0}
        />
        <div className='p-4 w-full'>
          <h1 className='mb-6 text-3xl font-bold text-gray-900'>Quiz Q</h1>
          {/* We're subtracting 1 from the parameters because the index of the exercises starts at 0 */}
          {/*           <Exercise questions={content.chapters['informal']['definitions'].q} />
           */}{' '}
        </div>
      </div>
    </>
  );
}
