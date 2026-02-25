'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { trackEvent, trackLinkClick } from '../lib/analytics';

type TrackedCtaLinkProps = {
  href: string;
  location: string;
  label?: string;
  eventName?: string;
  className?: string;
  target?: string;
  rel?: string;
  section?: string;
  children: ReactNode;
};

function resolveEventName(href: string, label: string, eventName?: string) {
  if (eventName) return eventName;
  if (href.startsWith('/questionnaire') || /questionnaire|start here/i.test(label)) {
    return 'questionnaire_click';
  }
  if (/calendly\.com/i.test(href) || /book a free session/i.test(label)) {
    return 'book_free_session_click';
  }
  return 'cta_click';
}

export default function TrackedCtaLink({
  href,
  location,
  label = 'Book a Free Session',
  eventName,
  className,
  target,
  rel,
  section = 'cta',
  children,
}: TrackedCtaLinkProps) {
  const isInternal = href.startsWith('/') && !href.startsWith('//');
  const resolvedTarget = target ?? (isInternal ? '_self' : '_blank');
  const resolvedRel = resolvedTarget === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

  const handleClick = () => {
    trackLinkClick({
      location,
      label,
      href,
      section,
      pagePath: window.location.pathname,
    });
    trackEvent(resolveEventName(href, label, eventName), {
      location,
      label,
      href,
      page_path: window.location.pathname,
    });
  };

  if (isInternal && resolvedTarget === '_self') {
    return (
      <Link
        href={href}
        className={className}
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={resolvedTarget}
      rel={resolvedRel}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
