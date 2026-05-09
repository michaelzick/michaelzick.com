'use client';

import { useEffect, useState, useRef, type RefObject } from 'react';

export type SectionId = 'process' | 'specialties' | 'program' | 'testimonials';

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
  const [mobileTabsVisible, setMobileTabsVisible] = useState(false);
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
      const headerRect = header?.getBoundingClientRect() ?? null;
      const headerHeight = headerRect?.height ?? 0;
      const headerBottom = headerRect?.bottom ?? headerHeight;
      const tabsTop = Math.round(headerBottom + 8);
      const mobileTabs = document.querySelector('[data-home-mobile-tabs]') as HTMLElement | null;
      const mobileTabsRect = mobileTabs?.getBoundingClientRect() ?? null;
      const mobileTabsHeight = mobileTabsRect && mobileTabsRect.height > 0 ? mobileTabsRect.height : 38;
      const hero = document.querySelector('[data-home-hero]');
      const heroBottom = hero?.getBoundingClientRect().bottom ?? 0;
      const viewportHeight = window.innerHeight || 0;
      const heroClearance = Math.min(120, viewportHeight * 0.15);
      const shouldShowMobileTabs = isCurrentlyMobile && (!hero || heroBottom <= headerBottom + heroClearance);
      const fixedChromeBottom = shouldShowMobileTabs
        ? Math.round(tabsTop + mobileTabsHeight)
        : Math.round(headerBottom);
      const overlayOffset = Math.round(
        headerBottom + (shouldShowMobileTabs ? mobileTabsHeight + 16 : 16),
      );
      const desiredScrollMargin = Math.max(overlayOffset, Math.round(headerBottom + 16));
      const beginningMargin = desiredScrollMargin;

      const activationFudge = 6;
      const baseThreshold = Math.max(
        viewportHeight * 0.35,
        isCurrentlyMobile ? desiredScrollMargin + 8 : headerHeight + 80,
      );

      const activeIds: SectionId[] = [];
      const nextVisited = [...visitedSectionsRef.current];

      sectionConfig.forEach(({ id, sectionRef, titleRef }) => {
        if (!sectionRef.current) return;

        const activationNode = isCurrentlyMobile ? sectionRef.current : titleRef.current;
        if (!activationNode) return;

        const activationTop = activationNode.getBoundingClientRect().top;
        const threshold = isCurrentlyMobile
          ? fixedChromeBottom + 12
          : baseThreshold + activationFudge;

        const isActive = activationTop <= threshold;

        if (isActive) {
          activeIds.push(id);
          if (!nextVisited.includes(id)) {
            nextVisited.push(id);
          }
        }
      });

      const resolvedCurrent = activeIds.length ? activeIds[activeIds.length - 1] : null;

      setActiveSection((prev) => (prev === resolvedCurrent ? prev : resolvedCurrent));

      if (isCurrentlyMobile) {
        setMobileTabsVisible((prev) => (prev === shouldShowMobileTabs ? prev : shouldShowMobileTabs));
        setMobileTabsTop((prev) => (Math.abs(prev - tabsTop) <= 1 ? prev : tabsTop));
        setMobileScrollMargin((prev) =>
          Math.abs(prev - desiredScrollMargin) <= 1 ? prev : desiredScrollMargin,
        );
        setBeginningScrollMargin((prev) =>
          Math.abs(prev - beginningMargin) <= 1 ? prev : beginningMargin,
        );
      } else {
        setMobileTabsVisible(false);
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
    mobileTabsVisible,
    scrollMarginTop,
    scrollMarginTopBeginning,
    mobileTabsRef,
    beginningWrapperRef,
  };
}
