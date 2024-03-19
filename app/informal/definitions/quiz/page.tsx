import ExerciseSidebar from '@/components/exerciseSidebar';
import Quiz from '@/components/quiz';

export default function QuizPage({ params }: { params: { exercise: number } }) {
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
          <Quiz initialQuestionIdx={0} chapter={3} showExerciseId={false} />
        </div>
      </div>
    </>
  );
}
