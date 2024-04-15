'use client';
import Link from 'next/link';
import { useState } from 'react';
import Logo from './logo';
import NavTopic from './navTopic';
import { Content } from '@/types';

const Navbar = ({ chapters }: { chapters: Content['chapters'] }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleMenu = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <nav className='border-gray-200 bg-white'>
      <div className='mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4'>
        <Link
          href='/'
          className='flex items-center space-x-3 rtl:space-x-reverse'
        >
          <Logo />
          <span className='self-center whitespace-nowrap text-2xl font-semibold text-gray-800'>
            LogiCola
          </span>
          <span className='me-2 rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800'>
            Beta
          </span>
        </Link>

        <button
          type='button'
          className='inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-stone-200 md:hidden '
        >
          <span className='sr-only'>Open main menu</span>
          <svg
            className='h-5 w-5'
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
        <div
          className={`w-full items-center justify-between font-semibold md:order-1 md:flex md:w-auto`}
        >
          <ul className='mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse'>
            <li>
              <button
                type='button'
                onMouseEnter={toggleMenu}
                id='mega-menu-full-dropdown-button'
                data-collapse-toggle='mega-menu-full-dropdown'
                className='flex w-full items-center justify-between rounded px-3 py-2 text-black opacity-50 hover:bg-gray-200 hover:opacity-100 md:w-auto md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-primary'
              >
                Chapters{' '}
                <svg
                  className='ms-2.5 h-2.5 w-2.5'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 10 6'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m1 1 4 4 4-4'
                  />
                </svg>
              </button>
            </li>

            <li>
              <Link
                href='https://github.com/sponsors/malikpiara'
                className='block rounded px-3 py-2 text-black opacity-50 hover:bg-gray-200 hover:opacity-100 md:p-0 md:hover:bg-transparent md:hover:text-primary'
              >
                Donate
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        id='mega-menu-full-dropdown'
        onMouseLeave={toggleMenu}
        className={`${
          !isDropdownVisible && 'hidden'
        } absolute z-50 w-full border-gray-200 bg-gray-50 shadow-sm md:bg-white`}
      >
        <ul className='mx-auto grid max-w-screen-xl px-4 py-5 text-gray-900 shadow-sm sm:grid-cols-2 md:px-6'>
          {Object.entries(chapters).map(([slug, chapter]) => (
            <NavTopic
              key={slug}
              chapter={`Chapter ${chapter.index}`}
              title={chapter.title}
              path={`/${slug}`}
              badge={chapter.displayBadge}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
