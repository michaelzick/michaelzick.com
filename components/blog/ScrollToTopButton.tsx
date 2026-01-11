'use client';

import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../../lib/analytics';

type ScrollToTopButtonProps = {
  targetId: string;
};

export default function ScrollToTopButton({ targetId }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerOffsetRef = useRef<number | null>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const updateTrigger = () => {
      const rect = target.getBoundingClientRect();
      triggerOffsetRef.current = rect.top + window.scrollY;
    };

    const updateVisibility = () => {
      if (triggerOffsetRef.current === null) return;
      const shouldShow = window.scrollY >= triggerOffsetRef.current;
      setIsVisible(shouldShow);
    };

    updateTrigger();
    updateVisibility();

    const observer = new ResizeObserver(updateTrigger);
    observer.observe(target);
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateTrigger);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateTrigger);
    };
  }, [targetId]);

  const handleClick = () => {
    trackEvent('scroll_to_top', {
      location: 'blog_post',
      target_id: targetId,
      page_path: window.location.pathname,
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0 });
      return;
    }

    const start = window.scrollY;
    const duration = Math.min(700, Math.max(350, start / 2));
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      window.scrollTo({ top: Math.round(start * (1 - eased)) });
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={handleClick}
      tabIndex={isVisible ? 0 : -1}
      className={`fixed bottom-12 left-8 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-dark-blue/30 text-white shadow-md ring-1 ring-white/20 backdrop-blur-md transition-all duration-300 hover:bg-dark-blue/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 max-[1024px]:left-[35px] max-[929px]:left-[30px] min-[1440px]:left-[70px] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
