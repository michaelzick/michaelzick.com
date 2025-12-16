'use client';

import type { ReactNode, RefObject } from 'react';
import { FadeInSection } from '../FadeInSection';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

interface ProgramSectionProps {
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
  scrollMarginTop: number;
  isVisible: boolean;
}

export function ProgramSection({ sectionRef, titleRef, scrollMarginTop, isVisible }: ProgramSectionProps) {
  const valueProps: ReactNode[] = [
    'Significantly improve your life and relationships.',
    'Homework assignments to build better habits.',
    'Emails between sessions for additional support.',
    '6-month duration to engrain new patterns.',
  ];
  const { setRef: setDetailRef, visibleStates: detailVisible } = useFadeInOnScroll(valueProps.length, 0.3);

  return (
    <section
      id="program"
      ref={sectionRef}
      className="relative overflow-hidden bg-cover bg-center px-6 pb-16 pt-12 text-white md:px-8 md:pt-16 md:pb-20"
      style={{ scrollMarginTop, backgroundImage: 'url("/img/waterfall_2500.webp")' }}
    >
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1200px]">
        <FadeInSection className="space-y-6">
          <h2 ref={titleRef} className="text-[56px] font-semibold leading-[1.05] tracking-tight md:text-[72px]">
            Individual Coaching Program
          </h2>
          <ul className="list-none border-t border-white/25 p-0">
            {valueProps.map((item, index) => {
              const itemNumber = String(index + 1).padStart(2, '0');
              return (
                <li
                  key={index}
                  ref={setDetailRef(index)}
                  className={`grid grid-cols-[auto_1fr] gap-x-6 border-b border-white/20 py-7 md:py-8 transition-all duration-700 ease-out ${
                    detailVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                >
                  <span className="mt-2 font-mono text-xs font-semibold tracking-[0.35em] text-white/70">
                    {itemNumber}
                  </span>
                  <p className="text-[28px] font-semibold leading-snug text-white md:text-[32px]">{item}</p>
                </li>
              );
            })}
          </ul>
          <a
            href="https://calendly.com/michaelzick/45min"
            target="_blank"
            className="btn mt-6 inline-block text-xl"
          >
            Book a Free Session
          </a>
        </FadeInSection>
      </div>
    </section>
  );
}
