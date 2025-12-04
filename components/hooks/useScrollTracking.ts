'use client';

import { useEffect, useState, useRef, type RefObject } from 'react';

export type SectionId = 'beginning' | 'process' | 'specialties' | 'program' | 'testimonials';

export type SectionConfig = {
  id: SectionId;
  linkText: string;
  mobileLabel?: string;
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
};

export function useScrollTracking(sectionConfig: SectionConfig[]) {
  const [activeLinks, setActiveLinks] = useState<SectionId[]>([]);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTabsTop, setMobileTabsTop] = useState<number>(100);
  const [mobileScrollMargin, setMobileScrollMargin] = useState<number>(220);
  const [beginningScrollMargin, setBeginningScrollMargin] = useState<number>(220);

  const visitedSectionsRef = useRef<SectionId[]>([]);
  const mobileTabsRef = useRef<HTMLDivElement>(null);
  const beginningWrapperRef = useRef<HTMLDivElement>(null);

  const scrollMarginTop = isMobile ? mobileScrollMargin : 160;
  const scrollMarginTopBeginning = isMobile ? beginningScrollMargin : scrollMarginTop;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateActiveState = () => {
      const isCurrentlyMobile = typeof window !== 'undefined' ? window.innerWidth <= 929 : false;
      setIsMobile((prev) => (prev === isCurrentlyMobile ? prev : isCurrentlyMobile));

      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const baseTabsTop = Math.round(headerHeight + 16);
      const reducedSpacing = Math.max(baseTabsTop - headerHeight, 0);
      const halfSpacing = Math.round(reducedSpacing * 0.5);
      const adjustedTabsTop = Math.max(headerHeight + halfSpacing, headerHeight + 8);
      const tabsTop = isCurrentlyMobile ? adjustedTabsTop : baseTabsTop;
      const overlayOffset = Math.round(headerHeight + 24);
      const desiredScrollMargin = Math.max(overlayOffset, headerHeight + 16);
      const beginningMargin = desiredScrollMargin;
      const viewportHeight = window.innerHeight || 0;

      const baseThreshold = Math.max(
        viewportHeight * 0.35,
        isCurrentlyMobile ? desiredScrollMargin + 8 : headerHeight + 80,
      );
      const beginningEntryLine = desiredScrollMargin;
      const beginningExitLine = Math.max(headerHeight + 8, 8);

      const beginningRect = beginningWrapperRef.current?.getBoundingClientRect() ?? null;
      const beginningActiveMobile =
        isCurrentlyMobile &&
        beginningRect !== null &&
        beginningRect.top <= beginningEntryLine &&
        beginningRect.bottom >= beginningExitLine;

      const activeIds: SectionId[] = [];
      const nextVisited = [...visitedSectionsRef.current];

      sectionConfig.forEach(({ id, sectionRef, titleRef }) => {
        const titleNode = titleRef.current;
        if (!titleNode || !sectionRef.current) return;

        const titleTop = titleNode.getBoundingClientRect().top;

        const isBeginning = id === 'beginning';

        const threshold = baseThreshold;
        const isActive = isBeginning
          ? isCurrentlyMobile
            ? beginningActiveMobile
            : titleTop <= threshold
          : titleTop <= threshold;

        if (isActive) {
          activeIds.push(id);
          if (!nextVisited.includes(id)) {
            nextVisited.push(id);
          }
        }
      });

      // Ensure testimonials becomes active (and deactivates Program) once its container crosses the header offset line
      const testimonialsEntry = sectionConfig.find(({ id }) => id === 'testimonials');
      if (testimonialsEntry?.sectionRef.current) {
        const testimonialsTop = testimonialsEntry.sectionRef.current.getBoundingClientRect().top;
        const activationLine = desiredScrollMargin;
        if (testimonialsTop <= activationLine) {
          if (!activeIds.includes('testimonials')) {
            activeIds.push('testimonials');
          }
          if (!nextVisited.includes('testimonials')) {
            nextVisited.push('testimonials');
          }
        }
      }

      const resolvedCurrent = activeIds.length ? activeIds[activeIds.length - 1] : null;

      setActiveSection((prev) => (prev === resolvedCurrent ? prev : resolvedCurrent));

      if (isCurrentlyMobile) {
        setMobileTabsTop((prev) => (Math.abs(prev - tabsTop) <= 1 ? prev : tabsTop));
        setMobileScrollMargin((prev) =>
          Math.abs(prev - desiredScrollMargin) <= 1 ? prev : desiredScrollMargin,
        );
        setBeginningScrollMargin((prev) =>
          Math.abs(prev - beginningMargin) <= 1 ? prev : beginningMargin,
        );
      }

      if (
        nextVisited.length !== visitedSectionsRef.current.length ||
        nextVisited.some((id, index) => visitedSectionsRef.current[index] !== id)
      ) {
        visitedSectionsRef.current = nextVisited;
        setActiveLinks([...nextVisited]);
      }
    };

    updateActiveState();

    window.addEventListener('scroll', updateActiveState, { passive: true });
    window.addEventListener('resize', updateActiveState);

    return () => {
      window.removeEventListener('scroll', updateActiveState);
      window.removeEventListener('resize', updateActiveState);
    };
  }, [sectionConfig]);

  return {
    activeLinks,
    activeSection,
    isMobile,
    mobileTabsTop,
    scrollMarginTop,
    scrollMarginTopBeginning,
    mobileTabsRef,
    beginningWrapperRef,
  };
}
