'use client';

import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';
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
  smoothScroll?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

function resolveEventName(href: string, label: string, eventName?: string) {
  if (eventName) return eventName;
  if (href.startsWith('/questionnaire') || /questionnaire|start here|assessment/i.test(label)) {
    return 'questionnaire_click';
  }
  if (
    /calendly\.com/i.test(href)
    || /book (a|your) free/i.test(label)
    || /strategy call/i.test(label)
  ) {
    return 'book_free_session_click';
  }
  return 'cta_click';
}

function getHashTargetId(href: string) {
  if (!href.startsWith('#') || href.length === 1) {
    return null;
  }

  try {
    return decodeURIComponent(href.slice(1));
  } catch {
    return href.slice(1);
  }
}

export default function TrackedCtaLink({
  href,
  location,
  label = 'Book a Strategy Call',
  eventName,
  className,
  target,
  rel,
  section = 'cta',
  smoothScroll = false,
  onClick,
  children,
}: TrackedCtaLinkProps) {
  const isInternal = href.startsWith('/') && !href.startsWith('//');
  const resolvedTarget = target ?? (isInternal ? '_self' : '_blank');
  const resolvedRel = resolvedTarget === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
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
    onClick?.();

    const hashTargetId = getHashTargetId(href);
    if (
      smoothScroll
      && resolvedTarget === '_self'
      && hashTargetId
      && event.button === 0
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const targetElement = document.getElementById(hashTargetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', href);
      }
    }
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
