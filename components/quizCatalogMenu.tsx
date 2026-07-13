import { quizCatalog } from '@/lib/quizCatalog';
import NavTopic from './navTopic';

export default function QuizCatalogMenu() {
  const splitIndex = Math.ceil(quizCatalog.length / 2);
  const firstColumn = quizCatalog.slice(0, splitIndex);
  const secondColumn = quizCatalog.slice(splitIndex);

  return (
    <div className='grid gap-3 md:grid-cols-2'>
      <ul className='grid gap-3'>
        {firstColumn.map((item) => (
          <NavTopic
            key={item.quizPath}
            chapter={item.chapter}
            title={item.title}
            path={item.quizPath}
            newLabel={item.isNew}
          />
        ))}
      </ul>
      <ul className='grid gap-3'>
        {secondColumn.map((item) => (
          <NavTopic
            key={item.quizPath}
            chapter={item.chapter}
            title={item.title}
            path={item.quizPath}
            newLabel={item.isNew}
          />
        ))}
      </ul>
    </div>
  );
}
