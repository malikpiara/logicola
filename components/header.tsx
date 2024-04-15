import Image from 'next/image';
import mascotPic from '@/public/mascot.png';
import { EmailForm } from './emailForm';

const header = {
  title: 'LogiCola on every device',
  description:
    'The new and improved version works without emulators or installation. Designed to help students learn logic.',
};

export function Header() {
  return (
    <>
      <header className='bg-white animate-in'>
        <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-28 lg:py-16'>
          <div className='flex flex-col sm:flex-row sm:gap-10'>
            <div>
              <Mascot />
            </div>
            <div className='mt-4 sm:mt-16'>
              <h1 className='mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-primary sm:text-left md:text-5xl lg:text-5xl'>
                {header.title}
              </h1>
              <p className='text-center text-lg font-normal text-gray-500 sm:text-left lg:text-xl'>
                {header.description}
              </p>
              <EmailForm />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export function Mascot() {
  return (
    <Image
      src={mascotPic}
      alt='Mascot'
      width='600'
      height='600'
      priority
      placeholder='empty'
    />
  );
}
