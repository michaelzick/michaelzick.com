'use client';

import { LinkTab } from './LinkTab';
import type { SectionConfig, SectionId } from '../hooks/useScrollTracking';

interface NavigationTabsProps {
  sectionConfig: SectionConfig[];
  activeLinks: SectionId[];
  activeSection: SectionId | null;
  variant: 'desktop' | 'mobile';
}

export function NavigationTabs({ sectionConfig, activeLinks, activeSection, variant }: NavigationTabsProps) {
  const filteredConfig = sectionConfig.filter(({ id }) => id !== 'testimonials');

  const configs =
    variant === 'desktop'
      ? filteredConfig.filter(({ id }) => activeLinks.includes(id))
      : filteredConfig;

  return (
    <>
      {configs.map(({ id, linkText, mobileLabel }) => (
        <LinkTab
          key={`${id}-${variant}`}
          targetId={id}
          label={variant === 'mobile' && mobileLabel ? mobileLabel : linkText}
          variant={variant}
          isActive={activeSection === id}
        />
      ))}
    </>
  );
}
