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
import { ExercisesMenu } from '@/components/nav/exercisesMenu';
import { spriteClip } from '@/lib/pixel';

/**
 * Desktop nav. The BAR is deliberately untouched for now — white ground,
 * text wordmark, green trigger (Malik, 2026-08-14: "implement 4a without
 * changing the background or the logo of the header"). What changed:
 *
 *   - The dropdown is the nav lab's decided master–detail panel
 *     (docs/nav-lab.html § 1 + § 4a): topic rail → drills with
 *     descriptions, contained card, PIXEL silhouette corners (D12) with
 *     the lightened drop-shadow. The shadow lives on the Viewport (an
 *     ancestor) because a clip-path on the card would cut a box-shadow
 *     off with the corners — pixel-ui.md's sibling-layer rule.
 *   - Donate wears the sprite-clipped gem CTA (the one bar change Malik
 *     asked for), deep teal with cream text — the coloured ink never
 *     carries small text on the bar (the lab's 1.4.3 role split).
 */
const Navbar = () => {
  return (
    // `quiz-pane-push` yields to the quiz's right-hand reference sheet so the
    // navbar shifts with the page body instead of the sheet sliding over it.
    // Inert everywhere else: the offset variable is only set while that sheet
    // is open (see globals.css).
    <nav className='quiz-pane-push bg-white border-gray-200 hidden md:block'>
      <div className='mx-auto max-w-screen-xl p-4'>
        <div className='grid grid-cols-3 items-center'>
          <div>
            <NavigationMenu viewportClassName='rounded-none border-0 bg-transparent shadow-none [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.10))_drop-shadow(0_8px_18px_rgba(0,0,0,0.10))]'>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className='text-primaryColor hover:bg-gray-200 hover:text-primaryColor font-mono font-semibold'>
                    Exercises
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='md:w-[780px] lg:w-[1000px] xl:w-[1120px]'>
                    <div style={{ clipPath: spriteClip(0) }}>
                      <ExercisesMenu />
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
                      href='/blog'
                      className='motion-button text-gray-500 hover:bg-gray-200 hover:text-primaryColor block py-2 px-3 rounded md:hover:text-primaryColor font-mono font-semibold'
                    >
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href='https://github.com/sponsors/malikpiara'
                      className='motion-button ml-2 inline-flex items-center bg-[#02302C] px-5 py-2.5 font-mono text-[13.5px] font-bold tracking-[0.02em] text-[#EDEDE3]'
                      style={{ clipPath: spriteClip(0) }}
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
