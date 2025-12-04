'use client';

import { useEffect, useRef, useState } from 'react';

interface Testimonial {
  quote: string;
  author: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'He was able to really hear in between things I was saying and know what was important to bring up. I’ve seen some amazing changes in my world already, not just in the dating realm, but in other areas of my life, too.',
    author: 'Elizabeth D.',
  },
  {
    quote:
      'I completed a one-on-one coaching series and it was an overwhelmingly positive experience. He helped me uncover my challenges hiding under the surface—no cookie cutter solutions.',
    author: 'Ryan I.',
  },
  {
    quote:
      'This program is exceptional. If you want something different from your life and are committed to seeing change, this program will change your life! Every area of my life has improved.',
    author: 'Doug S.',
  },
  {
    quote:
      'As a life coach and mentor, Michael has been a true shepherd and guide. His ability to help me cut through the noise and realize I already have the answers and direction I need is a true gift.',
    author: 'Greg C.',
  },
  {
    quote:
      'You have made a substantial impact on my life, not by telling me what I need to do, but by guiding me to find the answers myself. I highly recommend you and the service you provide.',
    author: 'Earl M.',
  },
  {
    quote:
      'Michael has that unique ability to help me see the unseen. The clarity of purpose and direction we created together was exactly what I was seeking.',
    author: 'Howard B.',
  },
];

export function TestimonialsCarouselSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const updatePositions = () => {
      const { scrollLeft, scrollWidth, clientWidth } = node;
      const maxScroll = scrollWidth - clientWidth;
      setIsAtStart(scrollLeft <= 1);
      setIsAtEnd(scrollLeft >= maxScroll - 1);
    };

    updatePositions();
    node.addEventListener('scroll', updatePositions, { passive: true });
    window.addEventListener('resize', updatePositions);

    return () => {
      node.removeEventListener('scroll', updatePositions);
      window.removeEventListener('resize', updatePositions);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const node = scrollRef.current;
    if (!node) return;
    const scrollAmount = Math.max(node.clientWidth * 0.8, 320);
    node.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="bg-[rgb(var(--light-grey))] px-6 pt-12 pb-16 text-default-grey md:px-8 md:pt-16 md:pb-24">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-[45px] font-semibold">Client Results</h2>
            <p className="max-w-2xl text-[20px] leading-relaxed">
              Real words from clients who partnered with me to break patterns, build momentum, and see lasting change.
            </p>
          </div>
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <button
              type="button"
              aria-label="Previous testimonial"
              disabled={isAtStart}
              onClick={() => handleScroll('left')}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-dark-blue/30 text-white shadow-md ring-1 ring-white/20 backdrop-blur-md transition hover:bg-dark-blue/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-sm"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              disabled={isAtEnd}
              onClick={() => handleScroll('right')}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-dark-blue/30 text-white shadow-md ring-1 ring-white/20 backdrop-blur-md transition hover:bg-dark-blue/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-sm"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
            role="region"
            aria-label="Client testimonials carousel"
          >
            {testimonials.map((testimonial, index) => (
              <figure
                key={index}
                className="snap-start shrink-0 basis-full rounded-lg bg-dark-blue/95 p-6 shadow-md ring-1 ring-white/15 backdrop-blur-md md:basis-[60%] lg:basis-[45%] xl:basis-[32%]"
              >
                <blockquote className="text-[22px] leading-relaxed text-white">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-4 text-[18px] font-semibold text-white/80">
                  — {testimonial.author}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-3 md:hidden">
            <button
              type="button"
              aria-label="Previous testimonial"
              disabled={isAtStart}
              onClick={() => handleScroll('left')}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-dark-blue/30 text-white shadow-md ring-1 ring-white/20 backdrop-blur-md transition hover:bg-dark-blue/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-sm"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              disabled={isAtEnd}
              onClick={() => handleScroll('right')}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-dark-blue/30 text-white shadow-md ring-1 ring-white/20 backdrop-blur-md transition hover:bg-dark-blue/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-sm"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
