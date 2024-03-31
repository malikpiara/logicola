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
        <div className='p-4 w-full'>
          <NoSSR>
            <Quiz initialQuestionIdx={0} chapter={3} showExerciseId={false} />
          </NoSSR>
        </div>
      </div>
    </>
  );
}
