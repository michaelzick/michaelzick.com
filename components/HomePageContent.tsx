'use client';

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';

type SectionId = 'beginning' | 'process' | 'specialties' | 'program';

type SectionConfig = {
  id: SectionId;
  linkText: string;
  mobileLabel?: string;
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
};

function LinkTab({
  href,
  label,
  variant,
  isActive,
}: {
  href: string;
  label: string;
  variant: 'desktop' | 'mobile';
  isActive: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const baseClasses =
    'pointer-events-auto block transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dark-blue';

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visibilityClasses =
    variant === 'desktop'
      ? isVisible
        ? 'translate-x-0 opacity-100'
        : 'translate-x-4 opacity-0'
      : isVisible
        ? 'opacity-100'
        : 'opacity-0';

  const desktopStateClasses = isActive
    ? 'bg-dark-blue/70 text-white border-white/40 opacity-95 hover:bg-dark-blue/80'
    : 'bg-dark-blue/30 text-white border-white/25 opacity-80 hover:bg-dark-blue/50';

  const mobileStateClasses = isActive
    ? 'bg-dark-blue/70 text-white border-white/35 opacity-95'
    : 'bg-dark-blue/30 text-white border-white/20 opacity-80';

  const desktopWidthClass = isActive ? 'w-[8em]' : 'w-[7em]';
  const desktopBaseClasses =
    'text-center rounded-lg px-4 py-2 shadow-lg backdrop-blur-md font-semibold transition-all duration-300 border';
  const mobileBaseClasses =
    'flex-1 px-2 pb-[0.475rem] pt-[0.375rem] text-xs font-semibold text-center border transition-all duration-300 backdrop-blur-md first:rounded-l-lg last:rounded-r-lg';

  const variantClasses =
    variant === 'desktop'
      ? `${desktopWidthClass} ${desktopBaseClasses} ${desktopStateClasses}`
      : `${mobileBaseClasses} ${mobileStateClasses}`;

  return (
    <a href={href} className={`${baseClasses} ${variantClasses} ${visibilityClasses}`}>
      {label}
    </a>
  );
}

export default function HomePageContent() {
  const beginningSectionRef = useRef<HTMLElement>(null);
  const processSectionRef = useRef<HTMLElement>(null);
  const specialtiesSectionRef = useRef<HTMLElement>(null);
  const programSectionRef = useRef<HTMLElement>(null);
  const beginningWrapperRef = useRef<HTMLDivElement>(null);

  const beginningTitleRef = useRef<HTMLHeadingElement>(null);
  const processTitleRef = useRef<HTMLHeadingElement>(null);
  const specialtiesTitleRef = useRef<HTMLHeadingElement>(null);
  const programTitleRef = useRef<HTMLHeadingElement>(null);

  const sectionConfig = useMemo<SectionConfig[]>(
    () => [
      {
        id: 'beginning',
        linkText: 'Beginning',
        mobileLabel: 'Beginning',
        sectionRef: beginningSectionRef,
        titleRef: beginningTitleRef,
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
      beginningSectionRef,
      beginningTitleRef,
    ],
  );

  const [visibleTitles, setVisibleTitles] = useState<Record<SectionId, boolean>>({
    beginning: false,
    process: false,
    specialties: false,
    program: false,
  });
  const [activeLinks, setActiveLinks] = useState<SectionId[]>([]);
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const visitedSectionsRef = useRef<SectionId[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTabsTop, setMobileTabsTop] = useState<number>(120);
  const [mobileScrollMargin, setMobileScrollMargin] = useState<number>(220);
  const [beginningScrollMargin, setBeginningScrollMargin] = useState<number>(220);
  const mobileTabsRef = useRef<HTMLDivElement>(null);
  const scrollMarginTop = isMobile ? mobileScrollMargin : 160;
  const scrollMarginTopBeginning = isMobile ? beginningScrollMargin : scrollMarginTop;

  const renderLinks = (variant: 'desktop' | 'mobile') => {
    const configs =
      variant === 'desktop'
        ? sectionConfig.filter(({ id }) => activeLinks.includes(id))
        : sectionConfig;

    return configs.map(({ id, linkText, mobileLabel }) => (
      <LinkTab
        key={`${id}-${variant}`}
        href={`#${id}`}
        label={variant === 'mobile' && mobileLabel ? mobileLabel : linkText}
        variant={variant}
        isActive={activeSection === id}
      />
    ));
  };

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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateActiveState = () => {
      const isCurrentlyMobile = typeof window !== 'undefined' ? window.innerWidth <= 929 : false;
      setIsMobile((prev) => (prev === isCurrentlyMobile ? prev : isCurrentlyMobile));

      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const tabsHeight = mobileTabsRef.current?.getBoundingClientRect().height ?? 0;
      const desiredTop = Math.round(headerHeight + 16);
      const desiredScrollMargin = Math.round(headerHeight + tabsHeight);
      const beginningMargin = Math.max(headerHeight + tabsHeight, 0);
      const viewportHeight = window.innerHeight || 0;

      const baseThreshold = Math.max(
        viewportHeight * 0.35,
        isCurrentlyMobile ? desiredScrollMargin + 8 : headerHeight + 80,
      );
      const beginningEntryLine = headerHeight + tabsHeight + 8;
      const beginningExitLine = headerHeight + 8;

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

  return (
    <div className="relative flex flex-col">
      <div className="pointer-events-none fixed right-4 top-1/3 z-40 flex flex-col items-end space-y-3 max-[929px]:hidden">
        {renderLinks('desktop')}
      </div>

      <div
        className="pointer-events-none fixed inset-x-4 z-40 hidden max-[929px]:flex"
        style={{ top: isMobile ? '100px' : `${mobileTabsTop}px` }}
      >
        <div
          ref={mobileTabsRef}
          className="pointer-events-auto flex w-full overflow-hidden rounded-lg border border-dark-blue/20 bg-transparent shadow-lg backdrop-blur"
        >
          {renderLinks('mobile')}
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative flex h-screen items-end text-white"
        style={{
          backgroundImage: "url('/img/homepage_mountains.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto p-8">
          <h2 className="text-4xl md:text-6xl text-right">Peak Performance Coach</h2>
        </div>
      </section>

      {/* Where Do You Go From Here */}
      <div id="beginning-section" ref={beginningWrapperRef}>
        <section
          id="beginning"
          ref={beginningSectionRef}
          className="relative overflow-hidden py-56"
          style={{
            scrollMarginTop: scrollMarginTopBeginning,
            backgroundImage: "url('/img/lake_reflection_2500.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative w-full mx-auto p-8 mt-[-88px] md:mt-[-112px]">
            <h2
              ref={beginningTitleRef}
              className={`text-center text-5xl font-bold text-white transition-opacity duration-700 ease-out md:text-8xl ${visibleTitles.beginning ? 'opacity-100' : 'opacity-0'
                }`}
            >
              Where Do You Go From Here?
            </h2>
          </div>
          <svg
            className="absolute bottom-0 left-0 h-[160px] w-full"
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,0 C480,160 960,160 1440,0 L1440,160 L0,160 Z" fill="rgb(var(--light-grey))" />
          </svg>
        </section>

        {/* Intro Section */}
        <section className="bg-light-grey pt-12 pb-24 text-4xl text-default-grey">
          <div className="mx-auto max-w-5xl space-y-8 px-2.5 text-center md:px-0">
            <h2>You’ve tried things – many things probably, but you’re still in the same place. You know you can achieve more but something is holding you back.</h2>
            <h2>Perhaps what you need is someone who’s been through the same things as you but has found the knowledge, practices, and resources to change.</h2>
          </div>
        </section>
      </div>

      {/* Process Section */}
      <section
        id="process"
        ref={processSectionRef}
        className="bg-gray-100 pt-16 pb-24 text-default-grey"
        style={{ scrollMarginTop }}
      >
        <div className="mx-auto max-w-[1400px]">
          <h2
            ref={processTitleRef}
            className={`mb-12 text-center text-5xl transition-opacity duration-700 ease-out ${visibleTitles.process ? 'opacity-100' : 'opacity-0'
              }`}
          >
            How My Process is Different
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <img
                src="/img/mountains_2500.webp"
                alt="Mountains"
                className="w-full rounded-lg object-cover shadow-md"
              />
              <h3 className="px-2.5 text-4xl font-semibold md:px-0">Identifying Meanings and Beliefs</h3>
              <p className="px-2.5 text-lg md:px-0">Meanings and beliefs are like the programming language of our life. They provide a filter through which external information and experiences pass.</p>
            </div>
            <div className="space-y-4 text-center">
              <img
                src="/img/ocean_2500.webp"
                alt="Feelings"
                className="h-100 w-full rounded-lg object-cover shadow-md"
              />
              <h3 className="px-2.5 text-4xl font-semibold md:px-0">Working Through Feelings, Experientially</h3>
              <p className="px-2.5 text-lg md:px-0">While analyzing the “why” and the “what” around our thoughts and behaviors is useful, behaviors rarely change without working through the feelings.</p>
            </div>
            <div className="space-y-4 text-center">
              <img
                src="/img/dark_mountains_2500.webp"
                alt="Action"
                className="h-100 w-full rounded-lg object-cover shadow-md"
              />
              <h3 className="px-2.5 text-4xl font-semibold md:px-0">Taking Consistent, Conscious Action</h3>
              <p className="px-2.5 text-lg md:px-0">Through identifying beliefs and processing feelings you can enter a new state of consciousness and awareness. This is where true behavioral change happens.</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="specialties"
        ref={specialtiesSectionRef}
        className="bg-dark-blue px-6 pb-12 pt-16 text-white md:px-8 md:pt-20 md:pb-16"
        style={{ scrollMarginTop }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2
                ref={specialtiesTitleRef}
                className={`text-[55px] font-semibold transition-opacity duration-700 ease-out ${visibleTitles.specialties ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                Specialties:
              </h2>
              <ul className="list-disc space-y-4 pl-6 text-[30px]">
                <li>Nice Guy Syndrome</li>
                <li>Relationships &amp; dating</li>
                <li>Finding your purpose</li>
                <li>Codependency</li>
                <li>Belief reprogramming</li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 text-[30px] font-medium text-default-grey shadow-md">
                Certified as a Life &amp; Relationship Coach by Life Purpose Institute.
              </div>
              <div className="rounded-lg bg-white p-6 text-[30px] font-medium text-default-grey shadow-md">
                Certified by Dr. Robert Glover, author of “No More Mr. Nice Guy” and renowned therapist.
              </div>
              <div className="rounded-lg bg-white p-6 text-[30px] font-medium text-default-grey shadow-md">
                Established in the Los Angeles mental health and recovery community since 2015.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="program"
        ref={programSectionRef}
        className="bg-[rgb(var(--light-grey))] px-6 pb-24 pt-12 text-default-grey md:px-8 md:pt-16 md:pb-32"
        style={{ scrollMarginTop }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-col gap-12 md:flex-row md:items-start">
          <div className="space-y-6 md:w-1/2">
            <h2
              ref={programTitleRef}
              className={`text-[45px] font-semibold transition-opacity duration-700 ease-out ${visibleTitles.program ? 'opacity-100' : 'opacity-0'
                }`}
            >
              Individual Coaching Program
            </h2>
            <h3 className="text-[35px] font-medium">The details:</h3>
            <ul className="list-disc space-y-2 pl-6 text-[23px]">
              <li>
                Work with a certified coach to <strong>significantly improve</strong> your life and relationships
              </li>
              <li>
                <strong>Powerful</strong> homework assignments that dive deep; we’ll leave no stone unturned
              </li>
              <li>
                <strong>Unlimited emails</strong> between sessions (subject to availability)
              </li>
              <li>6-month program to start; variable after that</li>
              <li>Free Belief Reprogramming Workbook</li>
            </ul>
            <a
              href="https://calendly.com/michaelzick/45min"
              target="_blank"
              className="btn mt-6 inline-block text-xl"
            >
              Book a Free Session
            </a>
          </div>
          <div className="mt-10 flex md:mt-0 md:w-1/2 md:justify-end">
            <img
              src="/img/waterfall_2500.webp"
              alt="Waterfall cascading over rocks"
              className="max-h-[480px] w-full rounded-lg object-cover shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="py-24 bg-gray-800 text-white">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-5xl">Subscribe to My Newsletter</h2>
          <h3 className="text-3xl">You’ll receive a FREE Belief Reprogramming Workbook (a $97 value) and early access to free courses. No spam; unsubscribe at any time.</h3>
          <a href="https://link.michaelzick.com/sign-up" target="_blank" className="btn">Subscribe</a>
        </div>
      </section> */}
    </div>
  );
}
