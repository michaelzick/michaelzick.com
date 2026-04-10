'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  immediate?: boolean;
}

export function FadeInSection({ children, className = '', threshold = 0.35, immediate = false }: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => immediate);
  const shouldRenderVisible = immediate || visible;

  useEffect(() => {
    if (immediate) {
      return;
    }

    const node = ref.current;
    if (!node) return;

    const isOverlappingViewport = () => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

      if (rect.width === 0 || rect.height === 0) {
        return false;
      }

      return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < viewportHeight &&
        rect.left < viewportWidth
      );
    };

    let animationFrameId = 0;
    let observer: IntersectionObserver | null = null;

    const reveal = () => {
      setVisible(true);
    };

    if (isOverlappingViewport()) {
      animationFrameId = window.requestAnimationFrame(reveal);
      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }

    const startObserving = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible(true);
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold },
      );

      observer.observe(node);
    };

    animationFrameId = window.requestAnimationFrame(() => {
      if (isOverlappingViewport()) {
        reveal();
        return;
      }

      startObserving();
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      observer?.disconnect();
    };
  }, [threshold, immediate]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        shouldRenderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </div>
  );
}
