import ExerciseSidebar from '@/components/exerciseSidebar';
import NoSSR from '@/components/NoSSR';
import Quiz from '@/components/quiz';

export default function QuizPage({ params }: { params: { exercise: number } }) {
  return (
    <>
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
            <Quiz chapter={1} showExerciseId={false} />
          </NoSSR>
        </main>
      </div>
    </>
  );
}
