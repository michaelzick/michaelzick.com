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
      className={className || 'rainbow-glass-btn cta-unified'}
      location={location}
      label="Start Here"
      eventName="questionnaire_click"
      target="_self"
    >
      Start Here
    </TrackedCtaLink>
  );
}
