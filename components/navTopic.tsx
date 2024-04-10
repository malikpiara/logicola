import Link from 'next/link';

/* Improvements
Since the title, chapter and path are binded, we only need
to pick on prop and match the rest. That would be a more efficient design.

We also have to add a disabled status and an optional 'new' label.
*/

type TableOfContentProps = {
  title: string;
  chapter: string;
  path: string; // I think this can be improved and follow a pattern.
  badge?: string;
};

const NavTopic = ({ title, chapter, path, badge }: TableOfContentProps) => {
  return (
    <li>
      <Link href={path} className='block p-3 rounded-lg hover:bg-gray-200'>
        <div className='flex gap-3'>
          <div className='font-semibold'>{title}</div>
          {badge && (
            <span className='bg-green-600 text-white text-xs font-semibold me-2 px-2.5 py-1 rounded-md'>
              {badge}
            </span>
          )}
        </div>
        <span className='text-sm font-medium text-gray-500'>{chapter}</span>
      </Link>
    </li>
  );
};

export default NavTopic;
