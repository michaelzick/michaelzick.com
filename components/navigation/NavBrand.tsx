'use client';

import Link from 'next/link';

interface NavBrandProps {
  scrolled: boolean;
  isLightNav: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  trackHeaderLink: (label: string, href: string, section: string, variant?: 'desktop' | 'mobile') => void;
}

export default function NavBrand({
  scrolled,
  isLightNav,
  menuOpen,
  setMenuOpen,
  trackHeaderLink,
}: NavBrandProps) {
  return (
    <Link
      href="/"
      className={`${menuOpen ? '!text-default-grey pointer-events-auto' : ''} ${isLightNav ? 'text-default-grey' : 'text-white'}`}
      onClick={() => {
        trackHeaderLink('Michael Zick', '/', 'brand');
        setMenuOpen(false);
      }}
    >
      <span
        className={`font-headline font-bold transition-all duration-500 ${scrolled ? 'text-[48px] max-[1174px]:text-[40px]' : 'text-[56px] max-[1174px]:text-[44px]'
          } max-[929px]:text-[40px]`}
      >
        <span className="inline max-[980px]:hidden max-[929px]:inline">
          Michael Zick
        </span>
        <span className="hidden max-[980px]:inline max-[929px]:hidden">
          MZ
        </span>
      </span>
    </Link>
  );
}
