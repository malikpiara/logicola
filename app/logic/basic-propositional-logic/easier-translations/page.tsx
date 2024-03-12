import { Sidebar } from '@/components/sidebar';
import Exercise from '@/components/exercise';

export default function EasierTranslations() {
  return (
    <>
      <div className='flex w-full h-screen overflow-scroll'>
        <Sidebar />
        <div className='p-4 w-full'>
          <h1 className='mb-6 text-3xl font-bold text-stone-900'>
            Quiz (6.1.a)
          </h1>
          <Exercise chapter={6.1} initialQuestionIdx={0} />
        </div>
      </div>
    </>
  );
}
