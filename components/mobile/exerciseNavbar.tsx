'use client';
import Link from 'next/link';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ExerciseNavbar = () => {
  const pathname = usePathname();
  if (pathname.includes('quiz'))
    return (
      <nav className='bg-white border-gray-200 md:hidden '>
        <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4'>
          <Link
            href='/'
            className='flex items-center space-x-3 rtl:space-x-reverse'
          >
            <span className='self-center text-2xl font-bold text-gray-900 whitespace-nowrap font-stretch'>
              <X />
            </span>
          </Link>
        </div>
      </nav>
    );
};

export default ExerciseNavbar;
