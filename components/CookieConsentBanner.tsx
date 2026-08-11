'use client';

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  OPEN_COOKIE_PREFERENCES_EVENT,
  expireAnalyticsCookies,
  getConsentSnapshot,
  hasAnalyticsConsent,
  parseStoredConsent,
  setConsent,
  subscribeToConsentChange,
} from '../lib/cookie-consent';

// Server snapshot sentinel: keeps the banner out of the SSR HTML so visitors
// with a stored choice never see it flash before hydration.
const SERVER_SNAPSHOT = '__server__';

export default function CookieConsentBanner() {
  const storedRaw = useSyncExternalStore(
    subscribeToConsentChange,
    getConsentSnapshot,
    () => SERVER_SNAPSHOT,
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    // Mixpanel can rewrite its cookies during the revocation reload's unload
    // phase; sweep them again whenever analytics is off.
    if (!hasAnalyticsConsent()) {
      expireAnalyticsCookies();
    }

    const handleOpen = () => setPreferencesOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, handleOpen);
  }, []);

  const visible =
    storedRaw !== SERVER_SNAPSHOT &&
    (preferencesOpen || parseStoredConsent(storedRaw) === null);

  if (!visible) {
    return null;
  }

  const handleChoice = (analytics: boolean) => () => {
    setConsent(analytics);
    setPreferencesOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[80] bg-dark-blue text-white shadow-[0_-4px_16px_rgba(0,0,0,0.35)]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6">
        <p className="text-sm leading-snug text-white/90">
          This site uses analytics cookies, including session replay, to understand
          how it&apos;s used and make coaching content better. Your information is
          never sold, and you can change your choice anytime from the footer. See our{' '}
          <Link
            href="/privacy-policy"
            className="underline decoration-white/70 underline-offset-4 transition hover:text-cta-amber hover:decoration-cta-amber"
          >
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/40 px-4 py-1.5 text-sm font-semibold leading-none text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dark-blue min-[930px]:min-h-9"
            onClick={handleChoice(false)}
          >
            Decline
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[rgb(76_95_120)] px-4 py-1.5 text-sm font-bold leading-none text-white shadow-sm transition hover:bg-[rgb(88_110_139)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dark-blue min-[930px]:min-h-9"
            onClick={handleChoice(true)}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
