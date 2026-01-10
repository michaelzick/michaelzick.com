'use client';

import { useEffect, useRef, useState } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackEvent, trackLinkClick } from '../lib/analytics';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const pathname = usePathname();
  const [activePath, setActivePath] = useState('');
  const appsMenuRef = useRef<HTMLDivElement | null>(null);
  const isBlogActive = activePath === '/blog' || activePath.startsWith('/blog/');
  const isLightNav = activePath.startsWith('/blog');

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
        <div className="nav-links-container flex items-center space-x-6 max-[929px]:hidden">
          <Link
            href="/about"
            className={`nav-link text-2xl max-[1174px]:text-xl ${isLightNav ? 'text-default-grey' : ''} ${activePath === '/about' ? 'active' : ''
              }`}
            onClick={() => trackHeaderLink('About', '/about', 'primary')}
          >
            About
          </Link>
          <Link
            href="/testimonials"
            className={`nav-link text-2xl max-[1174px]:text-xl ${isLightNav ? 'text-default-grey' : ''} ${activePath === '/testimonials' ? 'active' : ''
              }`}
            onClick={() => trackHeaderLink('Testimonials', '/testimonials', 'primary')}
          >
            Testimonials
          </Link>
          <Link
            href="/blog"
            className={`nav-link text-2xl max-[1174px]:text-xl ${isLightNav ? 'text-default-grey' : ''} ${isBlogActive ? 'active' : ''}`}
            onClick={() => trackHeaderLink('Blog', '/blog', 'primary')}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className={`nav-link text-2xl max-[1174px]:text-xl ${isLightNav ? 'text-default-grey' : ''} ${activePath === '/contact' ? 'active' : ''
              }`}
            onClick={() => trackHeaderLink('Contact', '/contact', 'primary')}
          >
            Contact
          </Link>
          <div
            ref={appsMenuRef}
            className="relative after:absolute after:left-0 after:top-full after:h-3 after:w-full after:content-[''] after:bg-transparent"
            onMouseEnter={() => setAppsOpen(true)}
            onMouseLeave={() => setAppsOpen(false)}
            onFocus={() => setAppsOpen(true)}
            onBlur={(event) => {
              const nextFocus = event.relatedTarget as Node | null;
              if (!nextFocus || !appsMenuRef.current?.contains(nextFocus)) {
                setAppsOpen(false);
              }
            }}
          >
            <button
              type="button"
              className={`nav-link text-2xl max-[1174px]:text-xl flex items-center gap-2 ${isLightNav ? 'text-default-grey' : ''}`}
              aria-haspopup="menu"
              aria-expanded={appsOpen}
            >
              Apps
              <svg
                aria-hidden="true"
                className={`h-4 w-4 transition-transform ${appsOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              className={`absolute left-0 top-full mt-3 w-max rounded-lg bg-white text-default-grey shadow-xl ring-1 ring-black/5 transition-all duration-200 flex flex-col ${appsOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              role="menu"
              aria-label="Apps"
            >
              <a
                href="https://findyourflowstate.michaelzick.com/"
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                tabIndex={appsOpen ? 0 : -1}
                className="flex items-center gap-2 px-4 py-3 text-base font-medium whitespace-nowrap hover:bg-black/5 transition-colors"
                onClick={() => {
                  trackHeaderLink('Find Your Flow State', 'https://findyourflowstate.michaelzick.com/', 'apps');
                  setAppsOpen(false);
                }}
              >
                Find Your Flow State
                <OpenInNewWindowIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
              <a
                href="https://whosincharge.michaelzick.com/"
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                tabIndex={appsOpen ? 0 : -1}
                className="flex items-center gap-2 px-4 py-3 text-base font-medium whitespace-nowrap hover:bg-black/5 transition-colors"
                onClick={() => {
                  trackHeaderLink('Who\'s In Charge?', 'https://whosincharge.michaelzick.com/', 'apps');
                  setAppsOpen(false);
                }}
              >
                Who&apos;s In Charge?
                <OpenInNewWindowIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
          <a
            href="https://calendly.com/michaelzick/45min"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-button"
            onClick={() => trackHeaderLink('Book a Free Session', 'https://calendly.com/michaelzick/45min', 'cta')}
          >
            Book a Free Session
          </a>
        </div>
        <div
          className="header-burger menu-overlay-has-visible-non-navigation-items"
          data-animation-role="header-element"
        >
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="header-burger-btn burger hidden max-[929px]:block pointer-events-auto"
            data-test="header-burger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="burger-box">
              <div
                className={`burger-inner header-menu-icon-doubleLineHamburger ${menuOpen ? 'open' : ''
                  }`}
              >
                <div className="top-bun"></div>
                <div className="bottom-bun"></div>
              </div>
            </div>
          </button>
        </div>
      </nav>
      <div
        className={`fixed inset-0 h-screen bg-white text-default-grey z-40 hidden max-[929px]:flex flex-col items-end justify-start pt-32 space-y-6 p-8 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
          }`}
      >
        <div className="flex flex-col items-end space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-default-grey/70">
            Links
          </span>
          <Link
            href="/about"
            className={`nav-link text-2xl text-default-grey ${activePath === '/about' ? 'active' : ''
              }`}
            onClick={() => {
              trackHeaderLink('About', '/about', 'primary', 'mobile');
              setMenuOpen(false);
            }}
          >
            About
          </Link>
          <Link
            href="/testimonials"
            className={`nav-link text-2xl text-default-grey ${activePath === '/testimonials' ? 'active' : ''
              }`}
            onClick={() => {
              trackHeaderLink('Testimonials', '/testimonials', 'primary', 'mobile');
              setMenuOpen(false);
            }}
          >
            Testimonials
          </Link>
          <Link
            href="/blog"
            className={`nav-link text-2xl text-default-grey ${isBlogActive ? 'active' : ''}`}
            onClick={() => {
              trackHeaderLink('Blog', '/blog', 'primary', 'mobile');
              setMenuOpen(false);
            }}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className={`nav-link text-2xl text-default-grey ${activePath === '/contact' ? 'active' : ''
              }`}
            onClick={() => {
              trackHeaderLink('Contact', '/contact', 'primary', 'mobile');
              setMenuOpen(false);
            }}
          >
            Contact
          </Link>
        </div>
        <div className="pt-2 flex flex-col items-end space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] text-default-grey/70">
            Apps
          </span>
          <a
            href="https://findyourflowstate.michaelzick.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link text-2xl text-default-grey"
            onClick={() => {
              trackHeaderLink('Find Your Flow State', 'https://findyourflowstate.michaelzick.com/', 'apps', 'mobile');
              setMenuOpen(false);
            }}
          >
            Find Your Flow State
            <OpenInNewWindowIcon className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
          <a
            href="https://whosincharge.michaelzick.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link text-2xl text-default-grey"
            onClick={() => {
              trackHeaderLink('Who\'s In Charge?', 'https://whosincharge.michaelzick.com/', 'apps', 'mobile');
              setMenuOpen(false);
            }}
          >
            Who&apos;s In Charge?
            <OpenInNewWindowIcon className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
        <a
          href="https://calendly.com/michaelzick/45min"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-button"
          onClick={() => {
            trackHeaderLink('Book a Free Session', 'https://calendly.com/michaelzick/45min', 'cta', 'mobile');
            setMenuOpen(false);
          }}
        >
          Book a Free Session
        </a>
      </div>
    </header>
  );
}
