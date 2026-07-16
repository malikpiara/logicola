import Link from 'next/link';
import { X } from 'lucide-react';
import Navbar from '../navbar';

const ExerciseNavbar = () => {
  return (
    <>
      <nav className='bg-white border-gray-200 md:hidden'>
        <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4'>
          {/* The label is the link's only accessible name — its content is a
              bare icon, which leaves screen readers (and the AI agents that
              read the same accessibility tree) announcing an unnamed link. */}
          <Link
            href='/'
            aria-label='Exit quiz and return to the home page'
            className='motion-button flex items-center space-x-3 rounded-md p-2 rtl:space-x-reverse'
          >
            <span className='self-center text-2xl font-bold text-gray-900 whitespace-nowrap font-stretch'>
              <X aria-hidden='true' />
            </span>
          </Link>
        </div>
      </nav>
      <Navbar />
    </>
  );
};

export default ExerciseNavbar;
