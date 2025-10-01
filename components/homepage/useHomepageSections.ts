'use client';

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';

export type SectionId = 'where' | 'process' | 'specialties' | 'program';

export type SectionConfig = {
  id: SectionId;
  linkText: string;
  mobileLabel?: string;
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
};

export type SectionRefs = {
  sections: {
    where: RefObject<HTMLElement>;
    process: RefObject<HTMLElement>;
    specialties: RefObject<HTMLElement>;
    program: RefObject<HTMLElement>;
  };
  titles: {
    where: RefObject<HTMLHeadingElement>;
    process: RefObject<HTMLHeadingElement>;
    specialties: RefObject<HTMLHeadingElement>;
    program: RefObject<HTMLHeadingElement>;
  };
  beginningSectionRef: RefObject<HTMLDivElement>;
  mobileTabsRef: RefObject<HTMLDivElement>;
};

export type UseHomepageSectionsResult = {
  refs: SectionRefs;
  desktopTabs: SectionConfig[];
  mobileTabs: SectionConfig[];
  visibleTitles: Record<SectionId, boolean>;
  activeSection: SectionId | null;
  isMobile: boolean;
  mobileTabsTop: number;
  scrollMarginTop: number;
  scrollMarginTopWhere: number;
};

const INITIAL_VISIBLE_TITLES: Record<SectionId, boolean> = {
  where: false,
  process: false,
  specialties: false,
  program: false,
};

const DESKTOP_OFFSET = 70;
const MOBILE_OFFSET = 55;

export function useHomepageSections(): UseHomepageSectionsResult {
  const whereSectionRef = useRef<HTMLElement>(null);
  const processSectionRef = useRef<HTMLElement>(null);
  const specialtiesSectionRef = useRef<HTMLElement>(null);
  const programSectionRef = useRef<HTMLElement>(null);
  const beginningSectionRef = useRef<HTMLDivElement>(null);

  const whereTitleRef = useRef<HTMLHeadingElement>(null);
  const processTitleRef = useRef<HTMLHeadingElement>(null);
  const specialtiesTitleRef = useRef<HTMLHeadingElement>(null);
  const programTitleRef = useRef<HTMLHeadingElement>(null);
  const mobileTabsRef = useRef<HTMLDivElement>(null);

  const sectionConfig = useMemo<SectionConfig[]>(
    () => [
      {
        id: 'where',
        linkText: 'Beginning',
        mobileLabel: 'Beginning',
        sectionRef: whereSectionRef,
        titleRef: whereTitleRef,
      },
      {
        id: 'process',
        linkText: 'Process',
        mobileLabel: 'Process',
        sectionRef: processSectionRef,
        titleRef: processTitleRef,
      },
      {
        id: 'specialties',
        linkText: 'Specialties',
        mobileLabel: 'Specialties',
        sectionRef: specialtiesSectionRef,
        titleRef: specialtiesTitleRef,
      },
      {
        id: 'program',
        linkText: 'Program',
        mobileLabel: 'Program',
        sectionRef: programSectionRef,
        titleRef: programTitleRef,
      },
    ],
    [],
  );

  const [visibleTitles, setVisibleTitles] = useState<Record<SectionId, boolean>>(INITIAL_VISIBLE_TITLES);
  const [activeLinks, setActiveLinks] = useState<SectionId[]>([]);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const visitedSectionsRef = useRef<SectionId[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTabsTop, setMobileTabsTop] = useState<number>(120);
  const [mobileScrollMargin, setMobileScrollMargin] = useState<number>(220);
  const [beginningScrollMargin, setBeginningScrollMargin] = useState<number>(220);

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

    return () => {
      sectionConfig.forEach(({ titleRef }) => {
        const node = titleRef.current;
        if (node) titleObserver.unobserve(node);
      });
      titleObserver.disconnect();
    };
  }, [sectionConfig]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateActiveState = () => {
      const isCurrentlyMobile = window.innerWidth <= 929;
      setIsMobile((prev) => (prev === isCurrentlyMobile ? prev : isCurrentlyMobile));

      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const tabsHeight = mobileTabsRef.current?.getBoundingClientRect().height ?? 0;
      const desiredTop = Math.round(headerHeight + 16);
      const activeOffset = isCurrentlyMobile ? MOBILE_OFFSET : DESKTOP_OFFSET;

      const desiredScrollMargin = Math.round(headerHeight + tabsHeight + activeOffset);
      const beginningMargin = Math.max(headerHeight + tabsHeight + activeOffset, 0);
      const viewportHeight = window.innerHeight || 0;

      const baseThreshold = Math.max(
        viewportHeight * 0.35,
        isCurrentlyMobile ? desiredScrollMargin + 8 : headerHeight + 80,
      );
      const beginningEntryLine = headerHeight + tabsHeight + 8;
      const beginningExitLine = headerHeight + 8;

      const beginningRect = beginningSectionRef.current?.getBoundingClientRect() ?? null;
      const beginningActiveMobile =
        isCurrentlyMobile &&
        beginningRect !== null &&
        beginningRect.top <= beginningEntryLine &&
        beginningRect.bottom >= beginningExitLine;

      const activeIds: SectionId[] = [];
      const nextVisited = [...visitedSectionsRef.current];

      sectionConfig.forEach(({ id, sectionRef, titleRef }) => {
        const sectionNode = sectionRef.current;
        const titleNode = titleRef.current;
        if (!sectionNode || !titleNode) return;

        const titleTop = titleNode.getBoundingClientRect().top;
        const isBeginning = id === 'where';

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

      const resolvedCurrent = activeIds.length ? activeIds[activeIds.length - 1] : null;
      setActiveSection((prev) => (prev === resolvedCurrent ? prev : resolvedCurrent));

      if (isCurrentlyMobile) {
        setMobileTabsTop((prev) => (Math.abs(prev - desiredTop) <= 1 ? prev : desiredTop));
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

  const scrollMarginTop = isMobile ? mobileScrollMargin : 160 + DESKTOP_OFFSET;
  const scrollMarginTopWhere = isMobile ? beginningScrollMargin : 160 + DESKTOP_OFFSET;

  const desktopTabs = useMemo(
    () => sectionConfig.filter(({ id }) => activeLinks.includes(id)),
    [sectionConfig, activeLinks],
  );

  const mobileTabs = sectionConfig;

  return {
    refs: {
      sections: {
        where: whereSectionRef,
        process: processSectionRef,
        specialties: specialtiesSectionRef,
        program: programSectionRef,
      },
      titles: {
        where: whereTitleRef,
        process: processTitleRef,
        specialties: specialtiesTitleRef,
        program: programTitleRef,
      },
      beginningSectionRef,
      mobileTabsRef,
    },
    desktopTabs,
    mobileTabs,
    visibleTitles,
    activeSection,
    isMobile,
    mobileTabsTop,
    scrollMarginTop,
    scrollMarginTopWhere,
  };
}
