'use client';

import Link from 'next/link';
import * as sets from '@/content/sets';
import type { Set } from '@/content/types';
import { getAllSubSets } from '@/utils/getAllSubsets';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import NavTopic from './navTopic';

const Navbar = () => {
  const allSets: Set[] = Object.values(sets);
  const allSubSets = getAllSubSets(allSets);
  const splitIndex = Math.ceil(allSubSets.length / 2);

  return (
    <nav className='bg-white border-gray-200 hidden md:block'>
      <div className='mx-auto max-w-screen-xl p-4'>
        {/* Create a 3-column grid */}
        <div className='grid grid-cols-3 items-center'>
          {/* Left Column: Exercises */}
          <div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className='text-primaryColor hover:bg-gray-200 hover:text-primaryColor font-mono font-semibold'>
                    Exercises
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='md:w-screen font-mono'>
                    <div className='grid gap-3 p-4 md:grid-cols-2'>
                      <div>
                        <ul className='grid gap-3 p-4'>
                          {allSubSets.slice(0, splitIndex).map((item) => (
                            <NavTopic
                              key={item.id}
                              chapter={item.name}
                              title={item.title}
                              path={`/${item.slugs.join('/')}/quiz`}
                              newLabel={item.isNew}
                            />
                          ))}
                        </ul>
                      </div>
                      <div>
                        <ul className='grid gap-3 p-4'>
                          {allSubSets.slice(splitIndex).map((item) => (
                            <NavTopic
                              key={item.id}
                              chapter={item.name}
                              title={item.title}
                              path={`/${item.slugs.join('/')}/quiz`}
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

          {/* Center Column: Logo */}
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

          {/* Right Column: Donate */}
          <div className='justify-self-end'>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    href='https://github.com/sponsors/malikpiara'
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink className='text-gray-500 hover:bg-gray-200 hover:text-primaryColor block py-2 px-3 rounded md:hover:text-primaryColor font-mono font-semibold'>
                      Donate
                    </NavigationMenuLink>
                  </Link>
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
