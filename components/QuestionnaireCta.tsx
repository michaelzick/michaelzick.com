'use client';

import TrackedCtaLink from './TrackedCtaLink';

interface QuestionnaireCTAProps {
  location: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const variantClasses = {
  primary: 'btn cta-unified',
  secondary: 'btn-secondary cta-unified',
};

export default function QuestionnaireCta({ location, className, variant = 'secondary' }: QuestionnaireCTAProps) {
  return (
    <TrackedCtaLink
      href="/questionnaire"
      className={className || variantClasses[variant]}
      location={location}
      label="Take the Approval Pattern Audit"
      eventName="questionnaire_click"
      target="_self"
    >
      Take the Approval Pattern Audit
    </TrackedCtaLink>
  );
}
