'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useFadeInOnScroll(count: number, threshold = 0.4) {
  const elementRefs = useRef<(HTMLElement | null)[]>([]);
  const [visibleStates, setVisibleStates] = useState<boolean[]>(() => Array(count).fill(false));

  useEffect(() => {
    setVisibleStates((prev) => {
      if (prev.length === count) return prev;
      const next = Array(count).fill(false);
      return next.map((_, index) => prev[index] ?? false);
    });
  }, [count]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const indexAttr = entry.target.getAttribute('data-fade-index');
          if (indexAttr === null) return;
          const index = Number(indexAttr);
          if (Number.isNaN(index)) return;

          setVisibleStates((prev) => {
            if (prev[index]) return prev;
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold },
    );

    elementRefs.current.slice(0, count).forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [count, threshold]);

  const refCallbacks = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const callback = (element: HTMLElement | null) => {
          elementRefs.current[index] = element;
          if (element) {
            element.setAttribute('data-fade-index', index.toString());
          }
        };
        return callback;
      }),
    [count],
  );

  const setRef = useCallback(
    (index: number) => refCallbacks[index] ?? (() => {}),
    [refCallbacks],
  );

  return { setRef, visibleStates };
}
