import type { RefObject } from 'react';

interface SpecialtiesSectionProps {
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
  scrollMarginTop: number;
  isVisible: boolean;
}

export function SpecialtiesSection({ sectionRef, titleRef, scrollMarginTop, isVisible }: SpecialtiesSectionProps) {
  return (
    <section
      id="specialties"
      ref={sectionRef}
      className="bg-dark-blue px-6 pb-12 pt-16 text-white md:px-8 md:pt-20 md:pb-16"
      style={{ scrollMarginTop }}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2
              ref={titleRef}
              className={`text-[55px] font-semibold transition-opacity duration-700 ease-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
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
              Certified by Dr. Robert Glover, author of &quot;No More Mr. Nice Guy&quot; and renowned therapist.
            </div>
            <div className="rounded-lg bg-white p-6 text-[30px] font-medium text-default-grey shadow-md">
              Established in the Los Angeles mental health and recovery community since 2015.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
