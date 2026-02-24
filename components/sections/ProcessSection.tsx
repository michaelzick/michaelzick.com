'use client';

import Image from 'next/image';
import type { RefObject } from 'react';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

interface ProcessSectionProps {
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
  scrollMarginTop: number;
  isVisible: boolean;
}

export function ProcessSection({ sectionRef, titleRef, scrollMarginTop, isVisible }: ProcessSectionProps) {
  const { setRef: setCardRef, visibleStates: cardVisible } = useFadeInOnScroll(4, 0.35);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="bg-light-grey pt-16 pb-0 md:pb-24 text-default-grey"
      style={{ scrollMarginTop }}
    >
      <div className="mx-auto max-w-[1400px]">
        <h2
          ref={titleRef}
          className={`font-headline mb-12 text-center text-[40px] leading-tight md:text-5xl transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
          The Approval Addiction Recovery Loop
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div
            ref={setCardRef(0)}
            className={`space-y-4 text-center transition-all duration-700 ease-out ${cardVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <Image
              src="/img/mountains_2500.webp"
              alt="Spot the bid"
              width={2500}
              height={1656}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="w-full rounded-lg object-cover shadow-md aspect-[4/3] max-[767px]:rounded-none"
            />
            <h3 className="px-2.5 text-3xl font-semibold md:px-0">Spot the Bid for Approval</h3>
            <p className="px-2.5 text-lg md:px-0">Where are you over-explaining, over-giving, or trying to earn safety and validation?</p>
          </div>
          <div
            ref={setCardRef(1)}
            className={`space-y-4 text-center transition-all duration-700 ease-out ${cardVisible[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <Image
              src="/img/ocean_2500.webp"
              alt="Cancel covert contract"
              width={2500}
              height={1667}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="w-full rounded-lg object-cover shadow-md aspect-[4/3] max-[767px]:rounded-none"
            />
            <h3 className="px-2.5 text-3xl font-semibold md:px-0">Cancel the Covert Contract</h3>
            <p className="px-2.5 text-lg md:px-0">Break the hidden &quot;If I&apos;m good, you&apos;ll love me&quot; deal. Say what you want and own your needs.</p>
          </div>
          <div
            ref={setCardRef(2)}
            className={`space-y-4 text-center transition-all duration-700 ease-out pb-6 md:pb-0 ${cardVisible[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <Image
              src="/img/dark_mountains_2500.webp"
              alt="Build displeasure tolerance"
              width={2500}
              height={1668}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="w-full rounded-lg object-cover shadow-md aspect-[4/3] max-[767px]:rounded-none"
            />
            <h3 className="px-2.5 text-3xl font-semibold md:px-0">Build Displeasure Tolerance</h3>
            <p className="px-2.5 text-lg md:px-0">Learn to stay grounded and calm when she&apos;s unhappy, disappointed, or angry. Learn how to handle discomfort.</p>
          </div>
          <div
            ref={setCardRef(3)}
            className={`space-y-4 text-center transition-all duration-700 ease-out pb-6 md:pb-0 ${cardVisible[3] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
          >
            <Image
              src="/img/rear_view_2500.webp"
              alt="Choose from standards"
              width={2500}
              height={1667}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="w-full rounded-lg object-cover shadow-md aspect-[4/3] max-[767px]:rounded-none"
            />
            <h3 className="px-2.5 text-3xl font-semibold md:px-0">Choose from Standards</h3>
            <p className="px-2.5 text-lg md:px-0">Choose from wholeness, not scarcity. Women become an addition, not a regulator of your self-worth.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
