import NoSSR from '@/components/NoSSR';
import Quiz from '@/components/quiz';

export interface QuizPageProps {
  params: { exercise: number };
}
export default function QuizPage({}: QuizPageProps) {
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
            <Quiz chapter={6} showExerciseId={false} />
          </NoSSR>
        </main>
      </div>
    </>
  );
}
