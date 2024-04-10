'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DynamicLink: React.FC<React.ComponentProps<typeof Link>> = ({
  href,
  children,
  ...props
}) => {
  const pathname = usePathname();

  // Construct the new path by appending '/edf' to the current path
  const newPath = `${pathname}/${href}`;

  return (
    <Link href={newPath} {...props}>
      {children}
    </Link>
  );
};

export default DynamicLink;
