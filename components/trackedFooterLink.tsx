'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { AnalyticsProperties, captureAnalyticsEvent } from '@/lib/analytics';

interface TrackedFooterLinkProps {
  href: string;
  eventName: string;
  properties: AnalyticsProperties;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function TrackedFooterLink({
  href,
  eventName,
  properties,
  children,
  className,
  ariaLabel,
}: TrackedFooterLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={() => {
        void captureAnalyticsEvent(eventName, properties);
      }}
    >
      {children}
    </Link>
  );
}
