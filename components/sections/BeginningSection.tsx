'use client';

import type { RefObject } from 'react';
import { FadeInSection } from '../FadeInSection';
import QuestionnaireCta from '../QuestionnaireCta';
import BookingCta from '../BookingCta';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

interface BeginningSectionProps {
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
  wrapperRef: RefObject<HTMLDivElement>;
  scrollMarginTop: number;
  isVisible: boolean;
}

export function BeginningSection({
  sectionRef,
  titleRef,
  wrapperRef,
  scrollMarginTop,
  isVisible
}: BeginningSectionProps) {
  const { setRef: setCopyRef, visibleStates: copyVisible } = useFadeInOnScroll(4, 0.35);

  return (
    <div id="beginning-section" ref={wrapperRef}>
      <section
        id="beginning"
        ref={sectionRef}
        className="bg-light-grey pt-12 pb-20 text-default-grey"
        style={{ scrollMarginTop }}
      >
        <div className="mx-auto max-w-4xl space-y-8 px-6 text-left md:px-8">
          <h2
            ref={setCopyRef(0)}
            className={`font-headline text-5xl font-bold leading-[1.05] md:text-8xl transition-all duration-700 ease-out ${copyVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            How long will you do the same things
          </h2>
          <h3
            ref={setCopyRef(1)}
            className={`font-headline text-3xl font-bold leading-tight md:text-5xl transition-all duration-700 ease-out delay-150 ${copyVisible[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            expecting different results?
          </h3>
          <h2
            ref={setCopyRef(2)}
            className={`font-headline text-4xl font-bold leading-tight md:text-6xl transition-all duration-700 ease-out delay-500 ${copyVisible[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            Isn&apos;t that insanity or something?
          </h2>
          <div
            ref={setCopyRef(3)}
            className={`mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center transition-all duration-700 ease-out delay-700 ${copyVisible[3] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <BookingCta location="beginning-intro" />
            <QuestionnaireCta
              location="beginning-intro"
              className="rainbow-glass-btn !border-default-grey !text-default-grey hover:!text-default-grey"
            />
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden py-56"
        style={{
          backgroundImage: "url('/img/lake_reflection_2500.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden="true"></div>
        <div className="relative w-full mx-auto p-8 mt-[-88px] md:mt-[-112px]">
          <h2
            ref={titleRef}
            className="font-headline text-center text-5xl font-bold text-white leading-[1.05] md:text-8xl"
          >
            <span
              className={`block transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
            >
              What Keeps You Safe,
            </span>
            <span
              className={`block transition-all duration-700 ease-out delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
            >
              Keeps You In Place.
            </span>
          </h2>
        </div>
        <svg
          className="absolute bottom-0 left-0 h-[160px] w-full"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 C480,160 960,160 1440,0 L1440,160 L0,160 Z" fill="rgb(var(--dark-blue))" />
        </svg>
      </section>

      <section className="bg-dark-blue pt-20 pb-14 text-white">
        <FadeInSection className="mx-auto max-w-[1400px] px-6 text-center md:px-8">
          <h2 className="font-headline text-4xl font-bold tracking-tight leading-tight md:text-5xl lg:text-6xl">
            It&apos;s Time To Get In Touch With Reality.
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-6 md:flex-row">
            <BookingCta location="beginning" />
            <QuestionnaireCta location="beginning" />
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
