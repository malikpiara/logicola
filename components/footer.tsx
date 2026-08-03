import Link from 'next/link';
import { TrackedFooterLink } from './trackedFooterLink';
import { NewBadge } from './newBadge';
import { CurrentYear } from './currentYear';

const GET_THE_BOOK_URL =
  'https://www.routledge.com/Introduction-to-Logic/Gensler/p/book/9781138910591';
const REDDIT_URL = 'https://www.reddit.com/r/Logicola/';
// Used by both the "Follow us" list and the icon row, like REDDIT_URL above.
const X_URL = 'https://x.com/LogicolaThree';

export function Footer() {
  return (
    <footer className='p-4 mt-4 bg-white sm:p-6'>
      <div className='mx-auto max-w-screen-xl'>
        <div className='md:flex md:justify-between'>
          <div className='mb-6 md:mb-0'>
            <Link href='https://logicola.org' className='flex items-center'>
              <span className='self-center text-2xl font-bold whitespace-nowrap font-stretch'>
                LogiCola 3
              </span>
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3'>
            <div>
              <h2 className='mb-6 font-stretch text-sm font-semibold text-gray-900 uppercase'>
                Resources
              </h2>
              <ul className='text-gray-500'>
                <li className='mb-4'>
                  <Link
                    href='https://harrycola.com/lc/index.htm'
                    className='motion-colors hover:underline'
                  >
                    Classic Logicola
                  </Link>
                </li>
                <li className='mb-4'>
                  <TrackedFooterLink
                    href={GET_THE_BOOK_URL}
                    eventName='book_cta_clicked'
                    properties={{
                      link_text: 'Get the Book',
                      link_url: GET_THE_BOOK_URL,
                      link_location: 'footer_resources',
                      destination_domain: 'routledge.com',
                      resource_type: 'book',
                    }}
                    className='motion-colors hover:underline'
                  >
                    Get the Book
                  </TrackedFooterLink>
                </li>
                <li>
                  <Link
                    href='/keyboard'
                    className='motion-colors hover:underline flex gap-2'
                  >
                    Keyboard <NewBadge />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-6 font-stretch text-sm font-semibold text-gray-900 uppercase'>
                Follow us
              </h2>
              <ul className='text-gray-500'>
                <li className='mb-4'>
                  <Link
                    href='https://github.com/malikpiara/logicola'
                    className='motion-colors hover:underline'
                  >
                    GitHub
                  </Link>
                </li>
                <li className='mb-4'>
                  <Link href={X_URL} className='motion-colors hover:underline'>
                    X
                  </Link>
                </li>
                <li className='mb-4'>
                  <Link
                    href={REDDIT_URL}
                    className='motion-colors hover:underline'
                  >
                    Reddit
                  </Link>
                </li>
                <li>
                  <Link
                    href='https://www.linkedin.com/company/logicola'
                    className='motion-colors hover:underline'
                  >
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className='mb-6 text-sm font-semibold text-gray-900 uppercase font-stretch'>
                Legal
              </h2>
              <ul className='text-gray-500'>
                <li className='mb-4'>
                  <Link href='#' className='motion-colors hover:underline'>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href='#' className='motion-colors hover:underline'>
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className='my-6 border-gray-200 sm:mx-auto lg:my-8' />
        <div className='sm:flex sm:items-center sm:justify-between'>
          <span className='text-sm text-gray-500 sm:text-center '>
            © <CurrentYear buildYear={new Date().getFullYear()} />{' '}
            <Link
              href='https://logicola.com'
              className='motion-colors hover:underline'
            >
              Logicola
            </Link>
            . Some Rights Reserved.
          </span>
          {/* Pixel icons from pixeliconlibrary.com (hackernoon/pixel-icon-
              library, icons/SVG/brands) — the smooth vendor glyphs traded
              for the brand's own bitmap grammar. See docs/pixel-ui.md. */}
          <div className='flex mt-4 space-x-6 sm:justify-center sm:mt-0'>
            <Link
              href={REDDIT_URL}
              className='motion-colors text-gray-500 hover:text-gray-900'
              aria-label='Logicola on Reddit'
            >
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <rect x='14' y='15' width='1' height='1' />
                <rect x='13' y='12' width='2' height='2' />
                <rect x='9' y='12' width='2' height='2' />
                <rect x='9' y='15' width='1' height='1' />
                <path d='m22,9v-2h-1v-2h-1v-1h-1v-1h-2v-1h-2v-1h-6v1h-2v1h-2v1h-1v1h-1v2h-1v2h-1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1v-6h-1Zm-3,5h-1v1h-1v2h-1v1h-2v1h-4v-1h-2v-1h-1v-3h-1v-1h-1v-2h1v-1h2v1h1v-1h3v-5h2v1h3v2h-2v-1h-2v3h2v1h1v-1h2v1h1v3Z' />
                <rect x='10' y='16' width='4' height='1' />
              </svg>
            </Link>
            <Link
              href={X_URL}
              className='motion-colors text-gray-500 hover:text-gray-900'
              aria-label='Logicola on X'
            >
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='m15.5,10v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-3v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1h-1v-2h-1v-1h-1v-1H1.5v1h1v1h1v1h1v2h1v1h1v2h1v1h1v2h1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h3v-1h1v-1h1v-1h1v-1h1v-1h1v-1h2v1h1v1h1v2h1v1h1v1h7v-1h-1v-1h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1h1Zm0,4v1h1v2h1v1h1v2h-3v-2h-1v-1h-1v-1h-1v-2h-1v-1h-1v-1h-1v-2h-1v-1h-1v-2h-1v-1h-1v-2h3v1h1v2h1v1h1v2h1v1h1v1h1v2h1Z' />
              </svg>
            </Link>
            <a
              href='https://github.com/malikpiara/logicola'
              className='motion-colors text-gray-500 hover:text-gray-900'
              aria-label='Logicola on GitHub'
            >
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <polygon points='23 9 23 15 22 15 22 17 21 17 21 19 20 19 20 20 19 20 19 21 18 21 18 22 16 22 16 23 15 23 15 18 14 18 14 17 15 17 15 16 17 16 17 15 18 15 18 14 19 14 19 9 18 9 18 6 16 6 16 7 15 7 15 8 14 8 14 7 10 7 10 8 9 8 9 7 8 7 8 6 6 6 6 9 5 9 5 14 6 14 6 15 7 15 7 16 9 16 9 18 7 18 7 17 6 17 6 16 4 16 4 17 5 17 5 19 6 19 6 20 9 20 9 23 8 23 8 22 6 22 6 21 5 21 5 20 4 20 4 19 3 19 3 17 2 17 2 15 1 15 1 9 2 9 2 7 3 7 3 5 4 5 4 4 5 4 5 3 7 3 7 2 9 2 9 1 15 1 15 2 17 2 17 3 19 3 19 4 20 4 20 5 21 5 21 7 22 7 22 9 23 9' />
              </svg>
            </a>
            <Link
              href='https://www.linkedin.com/company/logicola'
              className='motion-colors text-gray-500 hover:text-gray-900'
              aria-label='Logicola on LinkedIn'
            >
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 24 24'
                aria-hidden='true'
              >
                <path d='m22,2v-1H2v1h-1v20h1v1h20v-1h1V2h-1Zm-9,10v8h-3v-11h3v1h1v-1h4v1h1v10h-3v-8h-3Zm-9-4v-3h3v3h-3Zm3,1v11h-3v-11h3Z' />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
