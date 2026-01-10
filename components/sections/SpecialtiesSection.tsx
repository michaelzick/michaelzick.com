'use client';

import Image from 'next/image';
import type { RefObject } from 'react';
import TrackedCtaLink from '../TrackedCtaLink';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

interface SpecialtiesSectionProps {
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
  scrollMarginTop: number;
  isVisible: boolean;
}

export function SpecialtiesSection({ sectionRef, titleRef, scrollMarginTop, isVisible }: SpecialtiesSectionProps) {
  const specialties = [
    'Restructuring Beliefs',
    'Healing Self-Sabotage',
    'Somatic Regulation',
    'Nature-Based Modalities',
    'Relationships & Dating',
  ];
  const { setRef: setImageRef, visibleStates: imageVisible } = useFadeInOnScroll(1, 0.3);
  const { setRef: setSpecialtyRef, visibleStates: specialtyVisible } = useFadeInOnScroll(specialties.length, 0.3);

  return (
    <section
      id="specialties"
      ref={sectionRef}
      className="bg-dark-blue px-6 pb-12 pt-16 text-white md:px-8 md:pt-20 md:pb-16"
      style={{ scrollMarginTop }}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid items-start gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div
            ref={setImageRef(0)}
            className={`order-2 md:order-1 transition-all duration-700 ease-out ${
              imageVisible[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-md sm:h-[480px] md:h-[638px]">
              <Image
                src="/img/grey-suit-blue-shirt.webp"
                alt="Michael in a grey suit and blue shirt"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <TrackedCtaLink
              href="https://calendly.com/michaelzick/45min"
              className="btn mt-4 w-full text-base !px-6 !py-3 md:hidden"
              location="specialties_mobile"
            >
              Book a Free Session
            </TrackedCtaLink>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2
              ref={titleRef}
              className={`font-headline text-[55px] font-semibold transition-opacity duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            >
              Specialties:
            </h2>
            <ul className="list-none border-t border-white/25 p-0">
              {specialties.map((item, index) => {
                const itemNumber = String(index + 1).padStart(2, '0');
                return (
                  <li
                    key={item}
                    ref={setSpecialtyRef(index)}
                    className={`grid grid-cols-[auto_1fr] gap-x-6 border-b border-white/20 py-7 md:py-8 transition-all duration-700 ease-out ${specialtyVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      }`}
                  >
                    <span className="mt-2 font-mono text-xs font-semibold tracking-[0.35em] text-white/70">
                      {itemNumber}
                    </span>
                    <p className="text-[26px] font-semibold leading-snug text-white md:text-[30px]">{item}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
