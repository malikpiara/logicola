'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { cn } from '@/lib/utils';

/**
 * Pixel caret ('angle-down-solid', pixeliconlibrary.com) in place of the
 * lucide chevron — same size and rotate-on-open contract, but in the
 * brand's bitmap grammar. See docs/pixel-ui.md.
 */
const PixelChevronDown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox='0 0 24 24'
    fill='currentColor'
    aria-hidden='true'
  >
    <polygon points='5 7 7 7 7 8 8 8 8 9 9 9 9 10 10 10 10 11 11 11 11 12 13 12 13 11 14 11 14 10 15 10 15 9 16 9 16 8 17 8 17 7 19 7 19 8 20 8 20 10 19 10 19 11 18 11 18 12 17 12 17 13 16 13 16 14 15 14 15 15 14 15 14 16 13 16 13 17 11 17 11 16 10 16 10 15 9 15 9 14 8 14 8 13 7 13 7 12 6 12 6 11 5 11 5 10 4 10 4 8 5 8 5 7' />
  </svg>
);

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className='flex'>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'motion-colors flex flex-1 items-center justify-between py-4 font-medium hover:underline [&[data-state=open]>svg]:rotate-180',
        className
      )}
      {...props}
    >
      {children}
      <PixelChevronDown className='motion-chevron h-4 w-4 shrink-0' />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  // Transition, not keyframes (2026-08-24, plans/004): the FAQ is
  // type='multiple', and a re-click inside the old 190ms keyframe
  // restarted the panel from height 0 — keyframes can't retarget
  // mid-flight, transitions can. `forceMount` because Radix's Presence
  // only waits for animationend, so a transition-driven close needs the
  // content kept mounted. The animated grid lives on a CHILD of the
  // Radix Content on purpose: Radix's measurement pass writes inline
  // `transitionDuration: '0s'` on the Content node at every state flip
  // (verified live — the collapse snapped), which silently suppresses
  // any transition declared there. The child is selected via the
  // host's data-state and is out of Radix's reach; its delayed
  // `visibility` keeps closed panels out of focus order and the
  // accessibility tree.
  <AccordionPrimitive.Content
    ref={ref}
    forceMount
    className='faq-host text-sm'
    {...props}
  >
    <div className='faq-panel'>
      <div>
        <div className={cn('pb-4 pt-0', className)}>{children}</div>
      </div>
    </div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
