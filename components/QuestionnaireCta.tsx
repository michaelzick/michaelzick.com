'use client';

import TrackedCtaLink from './TrackedCtaLink';

interface QuestionnaireCTAProps {
  location: string;
  className?: string;
}

export default function QuestionnaireCta({ location, className }: QuestionnaireCTAProps) {
  return (
    <TrackedCtaLink
      href="/questionnaire"
      className={className || 'rainbow-glass-btn'}
      location={location}
      label="Take the Questionnaire"
      target="_self"
    >
      Take the Questionnaire
    </TrackedCtaLink>
  );
}
