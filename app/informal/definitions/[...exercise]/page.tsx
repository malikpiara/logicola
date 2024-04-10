'use client';
import { Sidebar } from '@/components/sidebar';
import { usePathname } from 'next/navigation';

export default function ExercisePage({
  params,
}: {
  params: { exercise: number };
}) {
  const pathname = usePathname();
  return (
    <>
      <div className='flex w-full h-full overflow-scroll'>
        <Sidebar />
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
