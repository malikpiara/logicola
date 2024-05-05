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
        <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-28'>
          <div className='flex sm:gap-10 flex-col sm:flex-row'>
            <div>
              <Mascot />
            </div>
            <div className='mt-4 sm:mt-16'>
              <h1 className='text-center sm:text-left mb-4 text-4xl font-extrabold tracking-tight leading-none text-primary md:text-5xl lg:text-5xl font-stretch'>
                {header.title}
              </h1>
              <p className='text-center sm:text-left text-lg font-normal text-gray-500 lg:text-xl'>
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
