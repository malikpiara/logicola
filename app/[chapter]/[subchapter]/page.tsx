import { Sidebar } from '@/components/sidebar';
import { content } from '@/content';
import Exercise from '@/components/exercise';

export default function SubchapterPage({
  params: { chapter: chapterSlug, subchapter: subChapterSlug },
}: {
  params: { chapter: string; subchapter: string };
}) {
  const subChapter = content.chapters[chapterSlug].subChapters[subChapterSlug];

  return (
    <>
      <div className='flex w-full h-screen overflow-scroll'>
        <Sidebar />
        <div className='p-4 w-full'>
          <h1 className='mb-6 text-3xl font-bold text-gray-900'>
            {subChapter.title}
          </h1>
          <Exercise questions={subChapter.questions} />
        </div>
      </div>
    </>
  );
}
