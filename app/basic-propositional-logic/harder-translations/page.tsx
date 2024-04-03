import { Sidebar } from '@/components/sidebar';
import Exercise from '@/components/exercise';

export default function HarderTranslations() {
  return (
    <>
      <div className='flex w-full h-screen overflow-scroll'>
        <Sidebar />
        <div className='p-4 w-full'>
          <h1 className='mb-6 text-3xl font-bold text-gray-900'>
            Quiz (6.8.a)
          </h1>
          <Exercise
            chapter={6.8}
            initialQuestionIdx={0}
            showExerciseId={true}
          />
        </div>
      </div>
    </>
  );
}
