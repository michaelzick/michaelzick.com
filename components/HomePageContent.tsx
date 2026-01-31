'use client';

import { useMemo, useRef } from 'react';
import { useScrollTracking } from './hooks/useScrollTracking';
import { useTitleVisibility } from './hooks/useTitleVisibility';
import { NavigationTabs } from './navigation/NavigationTabs';
import { HeroSection } from './sections/HeroSection';
import { BeginningSection } from './sections/BeginningSection';
import { ProcessSection } from './sections/ProcessSection';
import { SpecialtiesSection } from './sections/SpecialtiesSection';
import { ProgramSection } from './sections/ProgramSection';
import { TestimonialsCarouselSection } from './sections/TestimonialsCarouselSection';
import type { SectionConfig } from './hooks/useScrollTracking';

export default function HomePageContent() {
  const beginningSectionRef = useRef<HTMLElement>(null);
  const processSectionRef = useRef<HTMLElement>(null);
  const specialtiesSectionRef = useRef<HTMLElement>(null);
  const programSectionRef = useRef<HTMLElement>(null);
  const testimonialsSectionRef = useRef<HTMLElement>(null);

  const beginningTitleRef = useRef<HTMLHeadingElement>(null);
  const processTitleRef = useRef<HTMLHeadingElement>(null);
  const specialtiesTitleRef = useRef<HTMLHeadingElement>(null);
  const programTitleRef = useRef<HTMLHeadingElement>(null);
  const testimonialsTitleRef = useRef<HTMLHeadingElement>(null);

  const sectionConfig = useMemo<SectionConfig[]>(
    () => [
      {
        id: 'testimonials',
        linkText: 'Beginning',
        mobileLabel: 'Beginning',
        sectionRef: testimonialsSectionRef,
        titleRef: testimonialsTitleRef,
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
    [
      processSectionRef,
      processTitleRef,
      programSectionRef,
      programTitleRef,
      specialtiesSectionRef,
      specialtiesTitleRef,
      testimonialsSectionRef,
      testimonialsTitleRef,
    ],
  );

  const {
    activeLinks,
    activeSection,
    mobileTabsTop,
    scrollMarginTop,
    scrollMarginTopBeginning,
    mobileTabsRef,
    beginningWrapperRef,
  } = useScrollTracking(sectionConfig);

  const visibleTitles = useTitleVisibility(sectionConfig);

  return (
    <div className="relative flex flex-col">
      {/* Desktop Navigation */}
      <div className="pointer-events-none fixed right-4 top-1/3 z-40 flex flex-col items-end space-y-3 max-[929px]:hidden">
        <NavigationTabs
          sectionConfig={sectionConfig}
          activeLinks={activeLinks}
          activeSection={activeSection}
          variant="desktop"
        />
      </div>

      {/* Mobile Navigation */}
      <div
        className="pointer-events-none fixed inset-x-4 z-40 hidden max-[929px]:flex"
        style={{ top: `${mobileTabsTop}px` }}
      >
        <div
          ref={mobileTabsRef}
          data-home-mobile-tabs
          className="pointer-events-auto flex w-full overflow-hidden rounded-lg border border-dark-blue/20 bg-transparent shadow-lg backdrop-blur"
        >
          <NavigationTabs
            sectionConfig={sectionConfig}
            activeLinks={activeLinks}
            activeSection={activeSection}
            variant="mobile"
          />
        </div>
      </div>

      <HeroSection />

      <TestimonialsCarouselSection
        sectionRef={testimonialsSectionRef}
        titleRef={testimonialsTitleRef}
        scrollMarginTop={scrollMarginTop}
        isVisible={visibleTitles.testimonials}
      />

      <BeginningSection
        sectionRef={beginningSectionRef}
        titleRef={beginningTitleRef}
        wrapperRef={beginningWrapperRef}
        scrollMarginTop={scrollMarginTopBeginning}
        isVisible={true}
      />

      <ProcessSection
        sectionRef={processSectionRef}
        titleRef={processTitleRef}
        scrollMarginTop={scrollMarginTop}
        isVisible={visibleTitles.process}
      />

      <SpecialtiesSection
        sectionRef={specialtiesSectionRef}
        titleRef={specialtiesTitleRef}
        scrollMarginTop={scrollMarginTop}
        isVisible={visibleTitles.specialties}
      />

      <ProgramSection
        sectionRef={programSectionRef}
        titleRef={programTitleRef}
        scrollMarginTop={scrollMarginTop}
        isVisible={visibleTitles.program}
      />
    </div>
  );
}
