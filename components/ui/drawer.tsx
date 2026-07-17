'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib/utils';

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/40 duration-200 ease-[var(--ease-out-quart)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out',
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

interface DrawerContentExtraProps {
  /**
   * Optional click handler attached to the drawer's grabber bar.
   * When provided, the grabber becomes a `<button>` and fires on a
   * pure click (no drag), in addition to its native vaul drag
   * behaviour. Used to let users tap the grabber to cycle through
   * snap points without having to drag.
   */
  onGrabberClick?: () => void;
  disableOpenAnimation?: boolean;
  /**
   * Which edge the sheet is attached to. Must match the `direction`
   * prop on the Drawer root. 'bottom' (the default) is the original
   * mobile sheet with its horizontal grabber; 'right' is a
   * full-height side sheet — the caller supplies its own edge
   * handle there (e.g. a resize grip), so no grabber is rendered.
   */
  side?: 'bottom' | 'right';
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> &
    DrawerContentExtraProps
>(
  (
    {
      className,
      children,
      onGrabberClick,
      disableOpenAnimation = false,
      side = 'bottom',
      ...props
    },
    ref
  ) => (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          side === 'bottom'
            ? 'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background'
            : 'fixed inset-y-0 right-0 z-50 flex flex-col rounded-l-[10px] border bg-background',
          'outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0',
          !disableOpenAnimation &&
            (side === 'bottom'
              ? 'motion-panel duration-200 ease-[var(--ease-out-quart)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-6 data-[state=closed]:slide-out-to-bottom-5'
              : 'duration-200 ease-[var(--ease-out-quart)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right-6 data-[state=closed]:slide-out-to-right-5'),
          className
        )}
        {...props}
      >
        {side === 'bottom' &&
          (onGrabberClick ? (
            <button
              type='button'
              onClick={onGrabberClick}
              aria-label='Cycle drawer snap point'
              className='block mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted cursor-grab transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400'
            />
          ) : (
            <div className='mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted cursor-grab' />
          ))}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
);
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
