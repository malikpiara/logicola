'use client';

import { ReactNode, useEffect, useState } from 'react';

export interface NoSSRProps {
  children: ReactNode;
}

export default function NoSSR({ children }: NoSSRProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
