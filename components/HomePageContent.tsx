'use client';

import { TabLink } from './homepage/TabLink';
import { useHomepageSections } from './homepage/useHomepageSections';

export default function HomePageContent() {
  const {
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
  } = useHomepageSections();

  return (
    <div className="relative flex flex-col">
      <div className="pointer-events-none fixed right-4 top-1/3 z-40 flex flex-col items-end space-y-3 max-[929px]:hidden">
        {desktopTabs.map(({ id, linkText }) => (
          <TabLink key={id} href={`#${id}`} label={linkText} variant="desktop" isActive={activeSection === id} />
        ))}
      </div>

      <div
        className="pointer-events-none fixed inset-x-4 z-40 hidden max-[929px]:flex"
        style={{ top: isMobile ? '100px' : `${mobileTabsTop}px` }}
      >
        <div
          ref={mobileTabsRef}
          className="pointer-events-auto flex w-full overflow-hidden rounded-lg border border-dark-blue/20 bg-transparent shadow-lg backdrop-blur"
        >
          {mobileTabs.map(({ id, linkText, mobileLabel }) => (
            <TabLink
              key={id}
              href={`#${id}`}
              label={mobileLabel ?? linkText}
              variant="mobile"
              isActive={activeSection === id}
            />
          ))}
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
      <div id="beginning-section" ref={beginningSectionRef}>
        <section
          id="where"
          ref={whereSectionRef}
          className="relative overflow-hidden py-56"
          style={{
            scrollMarginTop: scrollMarginTopWhere,
            backgroundImage: "url('/img/lake_reflection_2500.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative w-full mx-auto p-8 mt-[-88px] md:mt-[-112px]">
            <h2
              ref={whereTitleRef}
              className={`text-center text-5xl font-bold text-white transition-opacity duration-700 ease-out md:text-8xl ${
                visibleTitles.where ? 'opacity-100' : 'opacity-0'
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
            className={`mb-12 text-center text-5xl transition-opacity duration-700 ease-out ${
              visibleTitles.process ? 'opacity-100' : 'opacity-0'
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
                className={`text-[55px] font-semibold transition-opacity duration-700 ease-out ${
                  visibleTitles.specialties ? 'opacity-100' : 'opacity-0'
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
              className={`text-[45px] font-semibold transition-opacity duration-700 ease-out ${
                visibleTitles.program ? 'opacity-100' : 'opacity-0'
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
