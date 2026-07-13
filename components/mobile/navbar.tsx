'use client';
import Link from 'next/link';
import { useState } from 'react';
import NavTopic from '../navTopic';
import { usePathname } from 'next/navigation';
import { quizCatalog } from '@/lib/quizCatalog';

const Navbar = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setDropdownVisible((isVisible) => !isVisible);
  };

  const closeMenu = () => {
    setDropdownVisible(false);
  };

  const splitIndex = Math.ceil(quizCatalog.length / 2);

  if (pathname.includes('quiz')) {
    return null;
  }

  return (
    <nav className='bg-white border-gray-200 md:hidden'>
      <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4'>
        <Link
          href='/'
          className='flex items-center space-x-3 rtl:space-x-reverse'
        >
          <span className='self-center text-2xl font-bold text-gray-900 whitespace-nowrap font-stretch'>
            LogiCola
          </span>
        </Link>

        <button
          type='button'
          className='motion-button inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-stone-200'
          onClick={toggleMenu}
          aria-expanded={isDropdownVisible}
          aria-controls='mega-menu-full-dropdown'
        >
          <span className='sr-only'>Open main menu</span>
          <svg
            className='w-5 h-5'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 17 14'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M1 1h15M1 7h15M1 13h15'
            />
          </svg>
        </button>
      </div>
      <div
        id='mega-menu-full-dropdown'
        onMouseLeave={closeMenu}
        data-state={isDropdownVisible ? 'open' : 'closed'}
        className='mobile-menu border-gray-200 shadow-sm bg-gray-50 md:bg-white absolute w-full z-50'
      >
        <div className='grid max-w-screen-xl px-4 py-5 mx-auto text-gray-900 sm:grid-cols-2 md:px-6 shadow-sm'>
          <ul>
            {quizCatalog.slice(0, splitIndex).map((subSet) => (
              <NavTopic
                key={subSet.quizPath}
                chapter={subSet.chapter}
                title={subSet.title}
                path={subSet.quizPath}
                newLabel={subSet.isNew || false}
              />
            ))}
          </ul>
          <ul>
            {quizCatalog.slice(splitIndex).map((subSet) => (
              <NavTopic
                key={subSet.quizPath}
                chapter={subSet.chapter}
                title={subSet.title}
                path={subSet.quizPath}
                newLabel={subSet.isNew || false}
              />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
