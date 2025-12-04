'use client';

import type { ReactNode, RefObject } from 'react';
import { FadeInSection } from '../FadeInSection';

interface ProgramSectionProps {
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
  scrollMarginTop: number;
  isVisible: boolean;
}

export function ProgramSection({ sectionRef, titleRef, scrollMarginTop, isVisible }: ProgramSectionProps) {
  const detailItems: ReactNode[] = [
    <>
      Work with a certified coach to <strong>significantly improve</strong> your life and relationships.
    </>,
    <>
      <strong>Powerful</strong> homework assignments that dive deep; we&apos;ll leave no stone unturned.
    </>,
    <>
      <strong>Unlimited emails</strong> between sessions (subject to availability).
    </>,
    <>6-month program to start; variable after that.</>,
    <>Free Belief Reprogramming Workbook.</>,
  ];

  return (
    <section
      id="program"
      ref={sectionRef}
      className="relative overflow-hidden bg-cover bg-center px-6 pb-16 pt-12 text-white md:px-8 md:pt-16 md:pb-20"
      style={{ scrollMarginTop, backgroundImage: 'url("/img/waterfall_2500.webp")' }}
    >
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1200px]">
        <FadeInSection className="space-y-6 max-w-[700px]">
          <h2 ref={titleRef} className="text-[45px] font-semibold">
            Individual Coaching Program
          </h2>
          <h3 className="text-[35px] font-medium">The details:</h3>
          <ul className="list-none space-y-4 p-0 text-[23px]">
            {detailItems.map((item, index) => (
              <li
                key={index}
                className="rounded-lg bg-white/95 p-5 font-medium leading-relaxed text-default-grey shadow-md ring-1 ring-white/15 backdrop-blur-sm"
              >
                {item}
              </li>
            ))}
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
