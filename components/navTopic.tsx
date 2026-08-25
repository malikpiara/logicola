import Link from 'next/link';
import { NewBadge } from './newBadge';

/* Improvements
Since the title, chapter and path are binded, we only need
to pick on prop and match the rest. That would be a more efficient design.

We also have to add a disabled status and an optional 'new' label.
*/

type TableOfContentProps = {
  title: string;
  chapter: string;
  path: string; // I think this can be improved and follow a pattern.
  newLabel?: boolean;
};

const NavTopic = ({ chapter, title, path, newLabel }: TableOfContentProps) => {
  return (
    <li>
      <Link
        href={path}
        className='motion-button block p-3 rounded-lg hover:bg-gray-200'
      >
        <div className='flex items-center gap-2.5'>
          <div className='font-semibold'>{title}</div>
          {newLabel && <NewBadge />}
        </div>
        <span className='font-medium text-gray-500'>{chapter}</span>
      </Link>
    </li>
  );
};

export default NavTopic;
