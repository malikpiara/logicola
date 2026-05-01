'use client';

import { ReactNode, useSyncExternalStore } from 'react';

export interface NoSSRProps {
  children: ReactNode;
}

function subscribe() {
  return () => {};
}

export default function NoSSR({ children }: NoSSRProps) {
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
