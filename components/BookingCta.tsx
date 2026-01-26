'use client';

import TrackedCtaLink from './TrackedCtaLink';

interface BookingCtaProps {
  location: string;
  className?: string;
}

export default function BookingCta({ location, className }: BookingCtaProps) {
  return (
    <TrackedCtaLink
      href="https://calendly.com/michaelzick/45min"
      className={className || 'btn text-xl'}
      location={location}
      label="Book a Free Session"
    >
      Book a Free Session
    </TrackedCtaLink>
  );
}
