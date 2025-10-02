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
  const configs =
    variant === 'desktop'
      ? sectionConfig.filter(({ id }) => activeLinks.includes(id))
      : sectionConfig;

  return (
    <>
      {configs.map(({ id, linkText, mobileLabel }) => (
        <LinkTab
          key={`${id}-${variant}`}
          href={`#${id}`}
          label={variant === 'mobile' && mobileLabel ? mobileLabel : linkText}
          variant={variant}
          isActive={activeSection === id}
        />
      ))}
    </>
  );
}
