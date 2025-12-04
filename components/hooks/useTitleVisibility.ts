'use client';

import { useEffect, useState } from 'react';
import type { SectionConfig, SectionId } from './useScrollTracking';

export function useTitleVisibility(sectionConfig: SectionConfig[]) {
  const [visibleTitles, setVisibleTitles] = useState<Record<SectionId, boolean>>({
    beginning: false,
    process: false,
    specialties: false,
    program: false,
    testimonials: false,
  });

  useEffect(() => {
    const titleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section-id') as SectionId | null;
          if (!sectionId) return;
          if (entry.isIntersecting) {
            setVisibleTitles((prev) => {
              if (prev[sectionId]) return prev;
              return { ...prev, [sectionId]: true };
            });
          }
        });
      },
      { threshold: 0.6 },
    );

    sectionConfig.forEach(({ id, titleRef }) => {
      const node = titleRef.current;
      if (node) {
        node.setAttribute('data-section-id', id);
        titleObserver.observe(node);
      }
    });

    return () => titleObserver.disconnect();
  }, [sectionConfig]);

  return visibleTitles;
}
