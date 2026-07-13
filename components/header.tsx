import Image from 'next/image';
import mascotPic from '@/public/mascot.png';

const header = {
  title: 'Master Formal Logic',
  description:
    'Generate endless, error-free exercises with smart step-by-step hints. Works offline, directly in your browser.',
};

export function Header() {
  return (
    <>
      <header className='bg-white motion-enter'>
        <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-28'>
          <div className='flex sm:gap-10 flex-col sm:flex-row'>
            <div>
              <Mascot />
            </div>
            <div className='mt-4 sm:mt-16'>
              <h1 className='text-center sm:text-left mb-4 text-4xl font-extrabold tracking-tight leading-none text-primaryColor md:text-5xl lg:text-5xl font-stretch'>
                {header.title}
              </h1>
              <p className='text-center sm:text-left text-lg font-normal text-gray-500 lg:text-xl'>
                {header.description}
              </p>
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
