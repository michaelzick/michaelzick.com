'use client';

import Link from 'next/link';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

interface DesktopNavProps {
  activePath: string;
  isBlogActive: boolean;
  isLightNav: boolean;
  appsOpen: boolean;
  setAppsOpen: (open: boolean) => void;
  appsMenuRef: React.RefObject<HTMLDivElement | null>;
  trackHeaderLink: (label: string, href: string, section: string, variant?: 'desktop' | 'mobile') => void;
}

export default function DesktopNav({
  activePath,
  isBlogActive,
  isLightNav,
  appsOpen,
  setAppsOpen,
  appsMenuRef,
  trackHeaderLink,
}: DesktopNavProps) {
  return (
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
          <Link
            href="/questionnaire"
            role="menuitem"
            tabIndex={appsOpen ? 0 : -1}
            className="flex items-center gap-2 px-4 py-3 text-base font-medium whitespace-nowrap hover:bg-black/5 transition-colors"
            onClick={() => {
              trackHeaderLink('Questionnaire', '/questionnaire', 'apps');
              setAppsOpen(false);
            }}
          >
            Questionnaire
          </Link>
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
  );
}
