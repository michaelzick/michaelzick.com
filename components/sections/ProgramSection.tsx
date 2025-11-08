'use client';

import type { RefObject } from 'react';
import { FadeInSection } from '../FadeInSection';

interface ProgramSectionProps {
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
  scrollMarginTop: number;
  isVisible: boolean;
}

export function ProgramSection({ sectionRef, titleRef, scrollMarginTop, isVisible }: ProgramSectionProps) {
  return (
    <section
      id="program"
      ref={sectionRef}
      className="bg-[rgb(var(--light-grey))] px-6 pb-24 pt-12 text-default-grey md:px-8 md:pt-16 md:pb-32"
      style={{ scrollMarginTop }}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-12 md:flex-row md:items-start">
        <FadeInSection className="space-y-6 md:w-1/2">
          <h2
            ref={titleRef}
            className={`text-[45px] font-semibold transition-opacity duration-700 ease-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
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
              <strong>Powerful</strong> homework assignments that dive deep; we&apos;ll leave no stone unturned
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
        </FadeInSection>
        <div className="mt-10 flex md:mt-0 md:w-1/2 md:justify-end">
          <img
            src="/img/waterfall_2500.webp"
            alt="Waterfall cascading over rocks"
            className="max-h-[480px] w-full rounded-lg object-cover shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
