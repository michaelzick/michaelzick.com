'use client';

import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import TrackedCtaLink from './TrackedCtaLink';

interface BookingCtaProps {
  location: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const variantClasses = {
  primary: 'btn cta-unified',
  secondary: 'btn-secondary cta-unified',
};

const BOOKING_CTA_LABEL = 'Book a Strategy Call';

export default function BookingCta({ location, className, variant = 'primary' }: BookingCtaProps) {
  return (
    <TrackedCtaLink
      href="https://calendly.com/michaelzick/45min"
      className={className || variantClasses[variant]}
      location={location}
      label={BOOKING_CTA_LABEL}
      eventName="book_free_session_click"
    >
      <span>{BOOKING_CTA_LABEL}</span>
      <OpenInNewWindowIcon className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />
    </TrackedCtaLink>
  );
}
