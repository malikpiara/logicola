import { Sidebar } from '@/components/sidebar';
import TableOfContent from '@/components/tableOfContent';

export default function Logic() {
  return (
    <>
      <div className='flex w-full h-full overflow-scroll'>
        <Sidebar />
        <div className='p-4 w-full'>
          <TableOfContent chapter={6} />
          <TableOfContent chapter={7} />
        </div>
      </div>
    </>
  );
}
