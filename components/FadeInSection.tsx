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
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    // If immediate is true, fade in right away
    if (immediate) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    // Check if element is already in viewport on mount (for first sections)
    const rect = node.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // If the element is in the top portion of the viewport, fade in immediately
    if (rect.top < viewportHeight * 0.8) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, immediate]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </div>
  );
}
