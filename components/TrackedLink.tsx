'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { trackLinkClick } from '../lib/analytics';

type TrackedLinkProps = {
  href: string;
  label: string;
  location: string;
  section?: string;
  variant?: 'desktop' | 'mobile';
  className?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
};

export default function TrackedLink({
  href,
  label,
  location,
  section,
  variant,
  className,
  target,
  rel,
  children,
}: TrackedLinkProps) {
  const isInternal = href.startsWith('/') && !href.startsWith('//');
  const resolvedRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

  const handleClick = () => {
    trackLinkClick({
      location,
      label,
      href,
      section,
      variant,
      pagePath: window.location.pathname,
    });
  };

  if (isInternal && (!target || target === '_self')) {
    return (
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target={target} rel={resolvedRel} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
