'use client';

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

export default function BookingCta({ location, className, variant = 'primary' }: BookingCtaProps) {
  return (
    <TrackedCtaLink
      href="https://calendly.com/michaelzick/45min"
      className={className || variantClasses[variant]}
      location={location}
      label="Book Your Free 45-Min Session"
      eventName="book_free_session_click"
    >
      Book Your Free 45-Min Session
    </TrackedCtaLink>
  );
}
