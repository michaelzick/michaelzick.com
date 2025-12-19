'use client';

import type { RefObject } from 'react';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

interface SpecialtiesSectionProps {
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
  scrollMarginTop: number;
  isVisible: boolean;
}

export function SpecialtiesSection({ sectionRef, titleRef, scrollMarginTop, isVisible }: SpecialtiesSectionProps) {
  const specialties = [
    'Separating fact from fiction',
    'Nice Guy Syndrome',
    'Relationships & dating',
    'Somatic regulation',
    'Belief reprogramming',
  ];
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
          <div className="order-2 md:order-1">
            <img
              src="/img/grey-suit-blue-shirt.webp"
              alt="Michael in a grey suit and blue shirt"
              className="h-[400px] w-full rounded-lg object-cover object-top shadow-md sm:h-[480px] md:h-[638px]"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2
              ref={titleRef}
              className={`font-headline text-[55px] font-semibold transition-opacity duration-700 ease-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
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
                    className={`grid grid-cols-[auto_1fr] gap-x-6 border-b border-white/20 py-7 md:py-8 transition-all duration-700 ease-out ${
                      specialtyVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
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
