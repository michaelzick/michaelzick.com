'use client';

import type { ReactNode } from 'react';
import { trackEvent } from '../lib/analytics';

type TrackedCtaLinkProps = {
  href: string;
  location: string;
  label?: string;
  className?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
};

export default function TrackedCtaLink({
  href,
  location,
  label = 'Book a Free Session',
  className,
  target = '_blank',
  rel = 'noopener noreferrer',
  children,
}: TrackedCtaLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={() =>
        trackEvent('book_free_session_click', {
          location,
          label,
          href,
          page_path: window.location.pathname,
        })
      }
    >
      {children}
    </a>
  );
}
