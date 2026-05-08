'use client';

import { useEffect, useState } from 'react';

interface LinkTabProps {
  targetId: string;
  label: string;
  variant: 'desktop' | 'mobile';
  isActive: boolean;
}

export function LinkTab({ targetId, label, variant, isActive }: LinkTabProps) {
  const [isVisible, setIsVisible] = useState(false);
  const baseClasses =
    'pointer-events-auto block transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dark-blue';

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visibilityClasses =
    variant === 'desktop'
      ? isVisible
        ? 'translate-x-0 opacity-100'
        : 'translate-x-4 opacity-0'
      : isVisible
        ? 'opacity-100'
        : 'opacity-0';

  const desktopStateClasses = isActive
    ? 'bg-dark-blue/70 text-white border-white/40 opacity-95 hover:bg-dark-blue/80'
    : 'bg-dark-blue/30 text-white border-white/25 opacity-80 hover:bg-dark-blue/50';

  const mobileStateClasses = isActive
    ? 'border-white bg-white text-dark-blue shadow-sm opacity-100'
    : 'border-white/10 bg-white/10 text-white opacity-90 hover:bg-white/20 hover:opacity-100';

  const desktopWidthClass = isActive ? 'w-[9em]' : 'w-[8em]';
  const desktopBaseClasses =
    'text-center rounded-lg px-4 py-2 shadow-lg backdrop-blur-md font-semibold transition-all duration-300 border';
  const mobileBaseClasses =
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold text-center transition-all duration-300 backdrop-blur-md';

  const variantClasses =
    variant === 'desktop'
      ? `${desktopWidthClass} ${desktopBaseClasses} ${desktopStateClasses}`
      : `${mobileBaseClasses} ${mobileStateClasses}`;

  const handleNavigate = () => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const header = document.querySelector('header');
    const headerBottom = header ? header.getBoundingClientRect().bottom : 0;

    const mobileTabs = document.querySelector('[data-home-mobile-tabs]') as HTMLElement | null;
    const mobileTabsRect = mobileTabs?.getBoundingClientRect() ?? null;
    const mobileTabsBottom = mobileTabsRect && mobileTabsRect.height > 0 ? mobileTabsRect.bottom : 0;

    const offset = Math.max(headerBottom, mobileTabsBottom) + 8;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({ top: Math.max(targetTop - offset, 0), behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className={`${baseClasses} ${variantClasses} ${visibilityClasses}`}
    >
      {label}
    </button>
  );
}
