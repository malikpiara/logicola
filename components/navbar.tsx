'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import NavTopic from './navTopic';
import { quizCatalog } from '@/lib/quizCatalog';

const Navbar = () => {
  const splitIndex = Math.ceil(quizCatalog.length / 2);

  return (
    // `quiz-pane-push` yields to the quiz's right-hand reference sheet so the
    // navbar shifts with the page body instead of the sheet sliding over it.
    // Inert everywhere else: the offset variable is only set while that sheet
    // is open (see globals.css).
    <nav className='quiz-pane-push bg-white border-gray-200 hidden md:block'>
      <div className='mx-auto max-w-screen-xl p-4'>
        <div className='grid grid-cols-3 items-center'>
          <div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className='text-primaryColor hover:bg-gray-200 hover:text-primaryColor font-mono font-semibold'>
                    Exercises
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='xl:w-[1250px] lg:w-[1000px] md:w-[800px] font-mono'>
                    <div className='grid gap-3 p-4 md:grid-cols-2'>
                      <div>
                        <ul className='grid gap-3 p-4'>
                          {quizCatalog.slice(0, splitIndex).map((item) => (
                            <NavTopic
                              key={item.quizPath}
                              chapter={item.chapter}
                              title={item.title}
                              path={item.quizPath}
                              newLabel={item.isNew}
                            />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <ul className='grid gap-3 p-4'>
                          {quizCatalog.slice(splitIndex).map((item) => (
                            <NavTopic
                              key={item.quizPath}
                              chapter={item.chapter}
                              title={item.title}
                              path={item.quizPath}
                              newLabel={item.isNew}
                            />
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className='justify-self-center'>
            <Link
              href='/'
              className='flex items-center space-x-3 rtl:space-x-reverse'
            >
              <span className='self-center text-2xl font-bold text-gray-900 whitespace-nowrap font-stretch'>
                LogiCola
              </span>
            </Link>
          </div>

          <div className='justify-self-end'>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href='https://github.com/sponsors/malikpiara'
                      className='motion-button text-gray-500 hover:bg-gray-200 hover:text-primaryColor block py-2 px-3 rounded md:hover:text-primaryColor font-mono font-semibold'
                    >
                      Donate
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
