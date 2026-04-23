'use client';

import Image from 'next/image';
import type { ReactNode, RefObject } from 'react';
import { FadeInSection } from '../FadeInSection';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

interface ProgramSectionProps {
  sectionRef: RefObject<HTMLElement>;
  titleRef: RefObject<HTMLHeadingElement>;
  scrollMarginTop: number;
  isVisible: boolean;
}

export function ProgramSection({ sectionRef, titleRef, scrollMarginTop }: ProgramSectionProps) {
  const valueProps: ReactNode[] = [
    'Stop auditioning for approval and calling it being a good man.',
    'Break the people-pleasing and enmeshment loop before it becomes resentment.',
    'Hold boundaries without anger, collapse, or a courtroom-length explanation.',
    'Become the chooser again. Stay connected without handing over your frame.',
  ];
  const { setRef: setDetailRef, visibleStates: detailVisible } = useFadeInOnScroll(valueProps.length, 0.3);

  return (
    <section
      id="program"
      ref={sectionRef}
      className="relative overflow-hidden bg-cover bg-center px-6 pb-16 pt-12 text-white md:px-8 md:pt-16 md:pb-20"
      style={{ scrollMarginTop }}
    >
      <Image
        src="/img/waterfall_2500.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1200px]">
        <FadeInSection className="space-y-6">
          <h2 ref={titleRef} className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            The Approval Exit Protocol
          </h2>
          <p className="max-w-3xl text-xl leading-relaxed text-white/80">
            Coaching for men who are tired of managing everyone else&apos;s emotional weather while pretending they are fine.
          </p>
          <ul className="list-none border-t border-white/25 p-0">
            {valueProps.map((item, index) => {
              const itemNumber = String(index + 1).padStart(2, '0');
              return (
                <li
                  key={index}
                  ref={setDetailRef(index)}
                  className={`grid grid-cols-[auto_1fr] gap-x-6 border-b border-white/20 py-7 md:py-8 transition-all duration-700 ease-out ${detailVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
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
          <figure className="border-l-2 border-cta-amber/60 pl-6 py-2">
            <blockquote className="text-lg leading-relaxed text-white/80 italic">
              &ldquo;You have made a substantial impact on my life, not by telling me what I need to do, but by guiding me to find the answers myself.&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-sm font-semibold text-white/50">
              &mdash; Earl M.
            </figcaption>
          </figure>
        </FadeInSection>
      </div>
    </section>
  );
}
