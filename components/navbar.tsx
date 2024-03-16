'use client';
import Link from 'next/link';
import { useState } from 'react';
import Logo from './logo';

const Navbar = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleMenu = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <nav className='bg-white border-stone-200'>
      <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4'>
        <a href='/' className='flex items-center space-x-3 rtl:space-x-reverse'>
          <Logo />
          <span className='self-center text-2xl font-semibold text-gray-800 whitespace-nowrap'>
            LogiCola
          </span>
          <span className='bg-stone-100 text-stone-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-md'>
            Beta
          </span>
        </a>

        <button
          type='button'
          className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-stone-500 rounded-lg md:hidden hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-200 '
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
        <div
          className={`items-center justify-between font-medium w-full md:flex md:w-auto md:order-1`}
        >
          <ul className='flex flex-col p-4 md:p-0 mt-4 border border-stone-100 rounded-lg bg-stone-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white'>
            <li>
              <button
                type='button'
                onMouseEnter={toggleMenu}
                id='mega-menu-full-dropdown-button'
                data-collapse-toggle='mega-menu-full-dropdown'
                className='flex items-center justify-between w-full py-2 px-3 text-black opacity-50 rounded md:w-auto hover:bg-stone-200 md:hover:bg-transparent md:border-0 md:hover:text-primary hover:opacity-100 md:p-0'
              >
                Chapters{' '}
                <svg
                  className='w-2.5 h-2.5 ms-2.5'
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
              <a
                href='/answers'
                className='block py-2 px-3 text-black opacity-50 rounded hover:bg-stone-200 hover:opacity-100 md:hover:bg-transparent md:hover:text-primary md:p-0'
              >
                Answers
              </a>
            </li>
            <li>
              <a
                href='/contact'
                className='block py-2 px-3 text-black opacity-50 rounded hover:bg-stone-200 hover:opacity-100 md:hover:bg-transparent md:hover:text-primary md:p-0'
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        id='mega-menu-full-dropdown'
        onMouseLeave={toggleMenu}
        className={`${
          !isDropdownVisible && 'hidden'
        } border-stone-200 shadow-sm bg-stone-50 md:bg-white absolute w-full z-50`}
      >
        <div className='grid max-w-screen-xl px-4 py-5 mx-auto text-stone-900 sm:grid-cols-2 md:px-6 shadow-sm'>
          <ul>
            <li>
              <a
                href='/logic/basic-propositional-logic'
                className='block p-3 rounded-lg hover:bg-stone-200'
              >
                <div className='font-semibold'>Basic Propositional Logic</div>
                <span className='text-sm text-stone-500'>Chapter 6</span>
              </a>
            </li>
            <li>
              <a
                href='/logic'
                className='block p-3 rounded-lg hover:bg-stone-200 opacity-30 cursor-not-allowed'
              >
                <div className='font-semibold'>Quantificational Logic</div>
                <span className='text-sm text-stone-500'>Chapter 8</span>
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a
                href='/logic'
                className='block p-3 rounded-lg hover:bg-stone-200 opacity-30 cursor-not-allowed'
              >
                <div className='font-semibold'>Propositional Proofs</div>
                <span className='text-sm text-stone-500'>Chapter 7</span>
              </a>
            </li>
            <li>
              <a
                href='/logic'
                className='block p-3 rounded-lg hover:bg-stone-200 opacity-30 cursor-not-allowed'
              >
                <div className='font-semibold'>Relations and Identity</div>
                <span className='text-sm text-stone-500'>Chapter 9</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
