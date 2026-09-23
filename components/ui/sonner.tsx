'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

// No next-themes: there is no ThemeProvider anywhere, so useTheme only
// ever returned the library default, and the toast classes below force
// black-on-white regardless (React pass, 2026-09-08).
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme='light'
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-black group-[.toaster]:text-white group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
