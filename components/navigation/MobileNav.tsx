'use client';

import Link from 'next/link';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

interface MobileNavProps {
  menuOpen: boolean;
  activePath: string;
  isBlogActive: boolean;
  setMenuOpen: (open: boolean) => void;
  trackHeaderLink: (label: string, href: string, section: string, variant?: 'desktop' | 'mobile') => void;
}

export default function MobileNav({
  menuOpen,
  activePath,
  isBlogActive,
  setMenuOpen,
  trackHeaderLink,
}: MobileNavProps) {
  return (
    <div
      id="mobile-nav"
      aria-hidden={!menuOpen}
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
        <Link
          href="/questionnaire"
          className={`nav-link text-2xl text-default-grey ${activePath === '/questionnaire' ? 'active' : ''}`}
          onClick={() => {
            trackHeaderLink('Questionnaire', '/questionnaire', 'apps', 'mobile');
            setMenuOpen(false);
          }}
        >
          Questionnaire
        </Link>
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
  );
}
