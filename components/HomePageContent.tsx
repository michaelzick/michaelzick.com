'use client';

import { useMemo, useRef } from 'react';
import Link from 'next/link';
import { useScrollTracking } from './hooks/useScrollTracking';
import { useTitleVisibility } from './hooks/useTitleVisibility';
import { NavigationTabs } from './navigation/NavigationTabs';
import { HeroSection } from './sections/HeroSection';
import { BeginningSection } from './sections/BeginningSection';
import { TrustStripe } from './sections/TrustStripe';
import { ProcessSection } from './sections/ProcessSection';
import { SpecialtiesSection } from './sections/SpecialtiesSection';
import { ProgramSection } from './sections/ProgramSection';
import { TestimonialsCarouselSection } from './sections/TestimonialsCarouselSection';
import { FadeInSection } from './FadeInSection';
import BookingCta from './BookingCta';
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

  const sectionConfig = useMemo<SectionConfig[]>(() => [
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
  ], []);

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

      <TrustStripe />

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
        id="home-cta"
        className="bg-default-grey text-white px-6 pt-12 pb-16 md:px-8 md:pt-16 md:pb-24"
      >
        <div className="mx-auto max-w-[1200px] text-center space-y-8">
          <FadeInSection>
            <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
              Ready to Stop Letting Approval Run the Room?
            </h2>
            <p className="mt-4 text-xl leading-relaxed text-white/80 md:text-2xl">
              Book a free 45-minute session. We will name the loop, find the next honest move, and see whether this work is a fit.
            </p>
          </FadeInSection>
          <FadeInSection className="flex flex-col items-center gap-4">
            <BookingCta location="home-bottom" />
            <p className="text-base text-white/60">
              Not ready to book?{' '}
              <Link
                href="/contact"
                className="font-semibold text-white/80 underline decoration-white/40 underline-offset-4 transition hover:text-white"
              >
                Send a direct message
              </Link>
            </p>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
