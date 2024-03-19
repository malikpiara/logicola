import Exercise from '@/components/exercise';
import ExerciseSidebar from '@/components/exerciseSidebar';
import { usePathname } from 'next/navigation';

export default function ExercisePage({
  params,
}: {
  params: { exercise: number };
}) {
  //const pathname = usePathname();
  let pickRandExerciseNum: number = Math.floor(Math.random() * (60 - 1) + 1);
  return (
    <>
      <div className='flex w-full h-screen overflow-scroll'>
        {/* <ExerciseSidebar
          chapter={3}
          path='/informal/definitions/'
          isQuestionActive={(index) => {
            return pathname === `/informal/definitions/${index + 1}`;
          }}
          initialQuestionIdx={0}
        /> */}
        <div className='p-4 w-full'>
          <h1 className='mb-6 text-3xl font-bold text-stone-900'>Quiz</h1>
          {/* We're subtracting 1 from the parameters because the index of the exercises starts at 0 */}
          <Exercise chapter={3} initialQuestionIdx={pickRandExerciseNum} />
        </div>
      </div>
    </>
  );
}
