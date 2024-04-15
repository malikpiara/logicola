import TopicTable from '@/components/topicTable';
import { content } from '@/content';

type Props = {
  params: {
    chapter: string;
  };
};

export function generateMetadata({ params }: Props) {
  const chapter = content.chapters[params.chapter];
  return {
    title: `Logicola | ${chapter.title}`,
    description: `Exercises for ${chapter.title}`,
  };
}

export default function ChapterPage({ params }: Props) {
  const chapter = content.chapters[params.chapter];

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  return (
    <>
      <div className='flex h-full w-full overflow-scroll'>
        <div className='w-full p-4'>
          <h1 className='mb-6 text-3xl font-bold text-gray-900'>
            Chapter {chapter.index + 1}: {chapter.title}
          </h1>
          <TopicTable subChapters={chapter.subChapters} />
        </div>
      </div>
    </>
  );
}
