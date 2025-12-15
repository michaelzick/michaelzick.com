import type { RefObject } from 'react';

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
  return (
    <div id="beginning-section" ref={wrapperRef}>
      <section
        id="beginning"
        ref={sectionRef}
        className="relative overflow-hidden py-56"
        style={{
          scrollMarginTop,
          backgroundImage: "url('/img/lake_reflection_2500.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative w-full mx-auto p-8 mt-[-88px] md:mt-[-112px]">
          <h2
            ref={titleRef}
            className={`font-headline text-center text-5xl font-bold text-white transition-all duration-700 ease-out md:text-8xl ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            What Keeps You Safe, Keeps You Stuck
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

      <section className="bg-light-grey pt-12 pb-24 text-4xl text-default-grey">
        <div className="mx-auto max-w-5xl space-y-8 px-2.5 text-center md:px-0">
          <h2>You&apos;ve tried things – many things probably, but you&apos;re still in the same place. You know you can achieve more but something is holding you back.</h2>
          <h2>Perhaps what you need is someone who&apos;s been through the same things as you but has found the knowledge, practices, and resources to change.</h2>
        </div>
      </section>
    </div>
  );
}
