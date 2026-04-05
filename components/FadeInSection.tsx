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
        shouldRenderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </div>
  );
}
