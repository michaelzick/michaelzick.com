'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, trackLinkClick } from '../lib/analytics';
import NavBrand from './navigation/NavBrand';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';
import BurgerButton from './navigation/BurgerButton';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const pathname = usePathname();
  const [activePath, setActivePath] = useState('');
  const appsMenuRef = useRef<HTMLDivElement | null>(null);
  const isBlogActive = activePath === '/blog' || activePath.startsWith('/blog/');
  const isLightNav = activePath.startsWith('/blog') || activePath === '/about';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      setAppsOpen(false);
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const trackHeaderLink = (label: string, href: string, section: string, variant?: 'desktop' | 'mobile') => {
    trackLinkClick({ location: 'header', label, href, section, variant });

    if (label === 'Book a Free Session') {
      trackEvent('book_free_session_click', {
        location: 'header',
        label,
        href,
        ...(variant ? { variant } : {}),
        page_path: window.location.pathname,
      });
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full px-8 min-[1440px]:px-[70px] max-[1024px]:px-[35px] max-[929px]:px-[30px] transition-all duration-500 ${isLightNav ? 'header-light' : ''
        } ${scrolled ? (isLightNav ? 'bg-white/80 backdrop-blur-md' : 'bg-dark-blue/50 backdrop-blur-md') : 'bg-transparent backdrop-blur-0'
        }`}
    >
      <nav
        className={`relative z-50 flex w-full items-center justify-between transition-all duration-500 ${isLightNav ? 'text-default-grey' : 'text-white'
          } ${scrolled ? 'py-4' : 'py-6'} max-[929px]:py-4 ${menuOpen ? 'pointer-events-none' : ''}`}
      >
        <NavBrand
          scrolled={scrolled}
          isLightNav={isLightNav}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          trackHeaderLink={trackHeaderLink}
        />
        <DesktopNav
          activePath={activePath}
          isBlogActive={isBlogActive}
          isLightNav={isLightNav}
          appsOpen={appsOpen}
          setAppsOpen={setAppsOpen}
          appsMenuRef={appsMenuRef}
          trackHeaderLink={trackHeaderLink}
        />
        <BurgerButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </nav>
      <MobileNav
        menuOpen={menuOpen}
        activePath={activePath}
        isBlogActive={isBlogActive}
        setMenuOpen={setMenuOpen}
        trackHeaderLink={trackHeaderLink}
      />
    </header>
  );
}
