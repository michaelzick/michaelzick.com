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
import { FadeInSection } from './FadeInSection';
import ContactForm from './ContactForm';
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
        id: 'process',
        linkText: 'Process',
        mobileLabel: 'Process',
        sectionRef: processSectionRef,
        titleRef: processTitleRef,
      },
      {
        id: 'specialties',
        linkText: 'Framework',
        mobileLabel: 'Framework',
        sectionRef: specialtiesSectionRef,
        titleRef: specialtiesTitleRef,
      },
      {
        id: 'program',
        linkText: 'Protocol',
        mobileLabel: 'Protocol',
        sectionRef: programSectionRef,
        titleRef: programTitleRef,
      },
      {
        id: 'testimonials',
        linkText: 'Reviews',
        mobileLabel: 'Reviews',
        sectionRef: testimonialsSectionRef,
        titleRef: testimonialsTitleRef,
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

      <TestimonialsCarouselSection
        sectionRef={testimonialsSectionRef}
        titleRef={testimonialsTitleRef}
        scrollMarginTop={scrollMarginTop}
        isVisible={visibleTitles.testimonials}
      />

      <section
        id="home-contact"
        className="bg-default-grey text-white px-6 pt-12 pb-16 md:px-8 md:pt-16 md:pb-24"
      >
        <div className="mx-auto max-w-[1200px] space-y-10">
          <FadeInSection>
            <h2 className="text-[48px] font-semibold leading-tight md:text-[56px] text-left">
              Let&apos;s Connect
            </h2>
            <p className="text-[28px] leading-snug text-white md:text-[32px]">
              Message me and get a free Belief Reprogramming Workbook.
            </p>
          </FadeInSection>

          <FadeInSection className="bg-gray-100 text-black rounded-xl p-4 sm:p-8 md:p-10 shadow-2xl ring-1 ring-black/5">
            <ContactForm />
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
