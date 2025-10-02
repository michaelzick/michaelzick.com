import type { RefObject } from 'react';

interface ProcessSectionProps {
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
  scrollMarginTop: number;
  isVisible: boolean;
}

export function ProcessSection({ sectionRef, titleRef, scrollMarginTop, isVisible }: ProcessSectionProps) {
  return (
    <section
      id="process"
      ref={sectionRef}
      className="bg-gray-100 pt-16 pb-24 text-default-grey"
      style={{ scrollMarginTop }}
    >
      <div className="mx-auto max-w-[1400px]">
        <h2
          ref={titleRef}
          className={`mb-12 text-center text-5xl transition-opacity duration-700 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
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
            <p className="px-2.5 text-lg md:px-0">While analyzing the &quot;why&quot; and the &quot;what&quot; around our thoughts and behaviors is useful, behaviors rarely change without working through the feelings.</p>
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
  );
}
