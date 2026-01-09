'use client';

import { useEffect, useRef, useState } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const pathname = usePathname();
  const [activePath, setActivePath] = useState('');
  const appsMenuRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <header
      className={`fixed top-0 z-50 w-full px-[70px] max-[1024px]:px-[35px] max-[929px]:px-[30px] transition-all duration-500 ${scrolled ? 'bg-dark-blue/50 backdrop-blur-md' : 'bg-transparent backdrop-blur-0'
        }`}
    >
      <nav
        className={`relative z-50 flex w-full items-center justify-between text-white transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'
          } max-[929px]:py-4 ${menuOpen ? 'pointer-events-none' : ''}`}
      >
        <Link
          href="/"
          className={`${menuOpen ? '!text-default-grey pointer-events-auto' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          <span
            className={`font-headline font-bold transition-all duration-500 ${scrolled ? 'text-[48px]' : 'text-[56px]'
              } max-[929px]:text-[40px]`}
          >
            Michael Zick
          </span>
        </Link>
        <div className="nav-links-container flex items-center space-x-6 max-[929px]:hidden">
          <Link
            href="/about"
            className={`nav-link text-2xl ${activePath === '/about' ? 'active' : ''
              }`}
          >
            About
          </Link>
          <Link
            href="/testimonials"
            className={`nav-link text-2xl ${activePath === '/testimonials' ? 'active' : ''
              }`}
          >
            Testimonials
          </Link>
          <Link
            href="/contact"
            className={`nav-link text-2xl ${activePath === '/contact' ? 'active' : ''
              }`}
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
              className="nav-link text-2xl flex items-center gap-2"
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
              className={`absolute left-0 top-full mt-3 w-64 rounded-lg bg-white text-default-grey shadow-xl ring-1 ring-black/5 transition-all duration-200 ${appsOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
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
                className="flex w-full items-center gap-2 px-4 py-3 text-base font-medium hover:bg-black/5 transition-colors"
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
                className="flex w-full items-center gap-2 px-4 py-3 text-base font-medium hover:bg-black/5 transition-colors"
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
            className="nav-button gap-2"
          >
            Book a Free Session
            <OpenInNewWindowIcon className="h-4 w-4" aria-hidden="true" />
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
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/testimonials"
            className={`nav-link text-2xl text-default-grey ${activePath === '/testimonials' ? 'active' : ''
              }`}
            onClick={() => setMenuOpen(false)}
          >
            Testimonials
          </Link>
          <Link
            href="/contact"
            className={`nav-link text-2xl text-default-grey ${activePath === '/contact' ? 'active' : ''
              }`}
            onClick={() => setMenuOpen(false)}
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
            onClick={() => setMenuOpen(false)}
          >
            Find Your Flow State
            <OpenInNewWindowIcon className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
          <a
            href="https://whosincharge.michaelzick.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link text-2xl text-default-grey"
            onClick={() => setMenuOpen(false)}
          >
            Who&apos;s In Charge?
            <OpenInNewWindowIcon className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
        <a
          href="https://calendly.com/michaelzick/45min"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-button gap-2"
          onClick={() => setMenuOpen(false)}
        >
          Book a Free Session
          <OpenInNewWindowIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
