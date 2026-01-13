'use client';

import Link from 'next/link';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { trackEvent, trackLinkClick } from '../lib/analytics';

export default function Footer() {
  const handleFooterClick = (label: string, href: string, section: string) => () => {
    trackLinkClick({ location: 'footer', label, href, section });

    if (label === 'Book a Free Session') {
      trackEvent('book_free_session_click', {
        location: 'footer',
        label,
        href,
        page_path: window.location.pathname,
      });
    }
  };

  return (
    <footer className="text-white py-8 text-lg bg-dark-blue">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 grid md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5">
          <p>Michael Zick | Reality Alignment Coach</p>
        </div>
        <div className="md:col-span-4 md:text-right space-y-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-white/70">
            Links
          </span>
          <Link href="/about" className="footer-link" onClick={handleFooterClick('About', '/about', 'links')}>
            About
          </Link>
          <br />
          <Link href="/testimonials" className="footer-link" onClick={handleFooterClick('Testimonials', '/testimonials', 'links')}>
            Testimonials
          </Link>
          <br />
          <Link href="/blog" className="footer-link" onClick={handleFooterClick('Blog', '/blog', 'links')}>
            Blog
          </Link>
          <br />
          <Link href="/contact" className="footer-link" onClick={handleFooterClick('Contact', '/contact', 'links')}>
            Contact
          </Link>
          <br />
          <a
            href="https://calendly.com/michaelzick/45min"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            onClick={handleFooterClick('Book a Free Session', 'https://calendly.com/michaelzick/45min', 'links')}
          >
            <strong>Book a Free Session</strong>
          </a>
        </div>
        <div className="md:col-span-3 md:text-right space-y-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-white/70">
            Apps
          </span>
          <a
            href="https://findyourflowstate.michaelzick.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            onClick={handleFooterClick('Find Your Flow State', 'https://findyourflowstate.michaelzick.com/', 'apps')}
          >
            Find Your Flow State
            <OpenInNewWindowIcon className="h-4 w-4" aria-hidden="true" />
          </a>
          <br />
          <a
            href="https://whosincharge.michaelzick.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            onClick={handleFooterClick('Who\'s In Charge?', 'https://whosincharge.michaelzick.com/', 'apps')}
          >
            Who&apos;s In Charge?
            <OpenInNewWindowIcon className="h-4 w-4" aria-hidden="true" />
          </a>
          <br />
          <Link href="/questionnaire" className="footer-link" onClick={handleFooterClick('Questionnaire', '/questionnaire', 'apps')}>
            Questionnaire
          </Link>
        </div>
      </div>
      <div className="mt-8 border-t border-white/20 pt-4 text-sm">
        <div className="px-6 md:px-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>
            Site designed and built by{' '}
            <a
              href="https://www.zickonezero.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              onClick={handleFooterClick('ZICKONEZERO Creative', 'https://www.zickonezero.com', 'credit')}
            >
              ZICKONEZERO Creative
            </a>
          </p>
          <p className="md:text-right">© 2025 Michael Zick Coaching</p>
        </div>
      </div>
    </footer>
  );
}
