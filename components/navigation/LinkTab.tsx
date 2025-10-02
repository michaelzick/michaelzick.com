'use client';

import { useEffect, useState } from 'react';

interface LinkTabProps {
  href: string;
  label: string;
  variant: 'desktop' | 'mobile';
  isActive: boolean;
}

export function LinkTab({ href, label, variant, isActive }: LinkTabProps) {
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
    ? 'bg-dark-blue/70 text-white border-white/35 opacity-95'
    : 'bg-dark-blue/30 text-white border-white/20 opacity-80';

  const desktopWidthClass = isActive ? 'w-[8em]' : 'w-[7em]';
  const desktopBaseClasses =
    'text-center rounded-lg px-4 py-2 shadow-lg backdrop-blur-md font-semibold transition-all duration-300 border';
  const mobileBaseClasses =
    'flex-1 px-2 pb-[0.475rem] pt-[0.375rem] text-xs font-semibold text-center border transition-all duration-300 backdrop-blur-md first:rounded-l-lg last:rounded-r-lg';

  const variantClasses =
    variant === 'desktop'
      ? `${desktopWidthClass} ${desktopBaseClasses} ${desktopStateClasses}`
      : `${mobileBaseClasses} ${mobileStateClasses}`;

  return (
    <a href={href} className={`${baseClasses} ${variantClasses} ${visibilityClasses}`}>
      {label}
    </a>
  );
}
