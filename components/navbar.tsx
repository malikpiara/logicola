'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ExercisesMenu } from '@/components/nav/exercisesMenu';
import { LogoMark } from '@/components/logoMark';
import { spriteClip } from '@/lib/pixel';

/**
 * Desktop nav. Inks are SET L since 2026-08-17 (the landing decision,
 * docs/landing-lab.html LP11, extended to the chrome): wordmark and
 * trigger in the plum type, Donate as a plum gem with a mint label (the
 * footer button's exact pair, 12.67:1). This retires the bar's LAST
 * drift green — `text-primaryColor` (#17a34a) was one of the three
 * greens the 2026-08-14 handover flagged as circulating.
 *
 * The GROUND is conditional (Malik, same day): on the LANDING PAGE the
 * bar adopts the mint and fuses with the masthead below it — the
 * marketing lab's decided rule, "nav shares the ground it sits on".
 * Everywhere else it stays white: the bar also rides over the quiz
 * pages' set surfaces, where a scheme ground would clash. Hover fills
 * follow the ground (a white-tint hover reads as a smudge on mint).
 *
 *   - The dropdown is the nav lab's decided master–detail panel
 *     (docs/nav-lab.html § 1 + § 4a): topic rail → drills with
 *     descriptions, contained card, PIXEL silhouette corners (D12) with
 *     the lightened drop-shadow. The shadow lives on the Viewport (an
 *     ancestor) because a clip-path on the card would cut a box-shadow
 *     off with the corners — pixel-ui.md's sibling-layer rule.
 *   - The coloured ink never carries small text on the bar (the lab's
 *     1.4.3 role split): plum IS the type colour here, so every run
 *     passes on white (14.88:1; the muted Blog tier 6.06:1).
 */
const Navbar = () => {
  const onLanding = usePathname() === '/';
  return (
    // `quiz-pane-push` yields to the quiz's right-hand reference sheet so the
    // navbar shifts with the page body instead of the sheet sliding over it.
    // Inert everywhere else: the offset variable is only set while that sheet
    // is open (see globals.css).
    // relative z-50: the Exercises menu must open ABOVE the quiz's
    // reference pane (z-30) — the pane never sits under the bar itself
    // (quiz-pane-push shifts it), so the raise can't occlude anything.
    <nav
      className='quiz-pane-push border-gray-200 hidden md:block relative z-50'
      style={
        {
          background: 'var(--nav-ground)',
          '--nav-ground': onLanding ? '#CFF6DD' : '#ffffff',
          '--nav-hover': onLanding ? '#C6E7D6' : '#F3F0F6',
        } as React.CSSProperties
      }
    >
      {/* px-4 sm:px-6 — the app's de-facto container gutters (footer,
          FAQ, landing); the bar's old p-4 left its logo 8px off every
          section edge at ≥sm (alignment pass, 2026-08-17) */}
      <div className='mx-auto max-w-screen-xl px-4 py-4 sm:px-6'>
        <div className='grid grid-cols-3 items-center'>
          <div>
            <NavigationMenu viewportClassName='rounded-none border-0 bg-transparent shadow-none [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.10))_drop-shadow(0_8px_18px_rgba(0,0,0,0.10))]'>
              <NavigationMenuList>
                <NavigationMenuItem>
                  {/* bg-transparent: the shadcn trigger bakes in bg-background
                      (white) — invisible on the old white bar, a stray pill on
                      the mint one. The open/hover fill comes from --nav-hover. */}
                  <NavigationMenuTrigger className='bg-transparent data-[state=open]:bg-[var(--nav-hover)] text-[#3F0167] hover:bg-[var(--nav-hover)] hover:text-[#3F0167] focus:bg-[var(--nav-hover)] font-mono font-semibold'>
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
              aria-label='LogiCola — home'
              className='inline-flex items-center'
            >
              {/* the can instead of the text wordmark (Malik, 2026-08-17);
                  knockout = the bar's own ground via --nav-ground, so the
                  lettering stays a hole on mint and white alike */}
              <LogoMark
                height={36}
                body='#3F0167'
                knockout='var(--nav-ground)'
              />
            </Link>
          </div>

          <div className='justify-self-end'>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href='/blog'
                      className='motion-button text-[#715790] hover:bg-[var(--nav-hover)] hover:text-[#3F0167] block py-2 px-3 rounded md:hover:text-[#3F0167] font-mono font-semibold'
                    >
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href='https://github.com/sponsors/malikpiara'
                      className='motion-button ml-2 inline-flex items-center bg-[#3F0167] px-5 py-2.5 font-mono text-[13.5px] font-bold tracking-[0.02em] text-[#CFF6DD]'
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
