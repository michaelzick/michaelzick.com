// The consent bootstrap script in components/SiteAnalyticsScripts.tsx
// duplicates CONSENT_KEY, CONSENT_VERSION, and the EU timezone heuristic so
// it can gate Mixpanel and GA4 before any bundle loads. Keep the literals
// there in sync with these constants.
export const CONSENT_KEY = 'cookie-consent';
export const CONSENT_VERSION = 1;

export type ConsentState = {
  version: number;
  timestamp: string;
  analytics: boolean;
};

type WindowWithConsent = Window & {
  __loadMixpanel?: () => void;
  mixpanel?: {
    opt_out_tracking?: () => void;
  };
  // Defined by the consent bootstrap script, not by gtag.js, so it is
  // available even when the Google tag is blocked or still loading.
  gtag?: (...args: unknown[]) => void;
};

export const OPEN_COOKIE_PREFERENCES_EVENT = 'open-cookie-preferences';

export function parseStoredConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState> | null;
    if (
      parsed &&
      parsed.version === CONSENT_VERSION &&
      typeof parsed.analytics === 'boolean' &&
      typeof parsed.timestamp === 'string'
    ) {
      return parsed as ConsentState;
    }
    return null;
  } catch {
    return null;
  }
}

const EU_ATLANTIC_ZONES = [
  'Atlantic/Canary',
  'Atlantic/Madeira',
  'Atlantic/Azores',
  'Atlantic/Reykjavik',
  'Atlantic/Faroe',
];

// Free timezone heuristic for GDPR territories (EU/EEA/UK/CH) — no network
// request or IP lookup, so it can run before any consent decision. It is
// deliberately over-inclusive: every Europe/* zone counts, plus the Atlantic
// islands used by Spain, Portugal, Iceland, and Denmark.
export function isGdprTimeZone(timeZone: string | null | undefined): boolean {
  if (!timeZone) return false;
  return timeZone.startsWith('Europe/') || EU_ATLANTIC_ZONES.includes(timeZone);
}

export function isEuVisitor(): boolean {
  try {
    return isGdprTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  } catch {
    return false;
  }
}

function readCookie(key: string): string | null {
  try {
    const match = document.cookie.match('(?:^|; )' + key + '=([^;]*)');
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

// Raw stored value for useSyncExternalStore snapshots: string equality keeps
// the snapshot stable across renders, unlike a freshly parsed object.
export function getConsentSnapshot(): string | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CONSENT_KEY);
  } catch {
    raw = null;
  }
  // Fall back to the cookie copy when localStorage is blocked.
  return raw ?? readCookie(CONSENT_KEY);
}

export function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  return parseStoredConsent(getConsentSnapshot());
}

type ConsentChangeListener = () => void;

const consentChangeListeners = new Set<ConsentChangeListener>();

export function subscribeToConsentChange(listener: ConsentChangeListener): () => void {
  consentChangeListeners.add(listener);
  return () => {
    consentChangeListeners.delete(listener);
  };
}

// Opt-out model outside GDPR territories: analytics runs by default until the
// visitor opts out. EU/EEA/UK visitors (timezone heuristic) get an opt-in
// model instead — nothing runs until they accept.
export function hasAnalyticsConsent(): boolean {
  const stored = getStoredConsent();
  if (stored) {
    return stored.analytics;
  }
  return !isEuVisitor();
}

// Mixpanel can rewrite its cookies and mp_* localStorage state between
// revocation and the page unload, so the banner also re-sweeps on load
// whenever consent is denied. _ga/_gid/_gat cover the Google tag, which keeps
// its cookies after a consent update to denied. AMP_/amp_ stay in the sweep
// for migration hygiene: visitors from the Amplitude era still carry those
// cookies.
const TRACKER_PREFIX = /^(AMP_|amp_|mp_|_ga|_gid|_gat)/;

// A cookie can only be deleted with the domain it was set on, and the Google
// tag defaults to the registrable domain (.michaelzick.com) rather than the
// current host (www.michaelzick.com). Walk every parent domain so both are
// covered; a domain the browser rejects is simply ignored.
export function analyticsCookieDomains(hostname: string): string[] {
  if (!hostname || /^[\d.]+$/.test(hostname)) return [];

  const labels = hostname.split('.').filter(Boolean);
  const domains: string[] = [];
  for (let i = 0; i <= Math.max(0, labels.length - 2); i += 1) {
    const domain = labels.slice(i).join('.');
    domains.push(domain, `.${domain}`);
  }
  return domains;
}

export function expireAnalyticsCookies() {
  try {
    const names = document.cookie
      .split(';')
      .map((part) => part.split('=')[0].trim())
      .filter((name) => TRACKER_PREFIX.test(name));

    const attributes = [
      '',
      ...analyticsCookieDomains(window.location.hostname).map(
        (domain) => `; domain=${domain}`,
      ),
    ];
    for (const name of names) {
      for (const attribute of attributes) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${attribute}`;
      }
    }

    // Mixpanel persists to localStorage (mp_<token>_mixpanel), not cookies.
    // Neither `cookie-consent` nor Mixpanel's __mp_opt_in_out_* flag matches
    // the prefix, so the consent record and opt-out state survive the sweep.
    for (const key of Object.keys(window.localStorage)) {
      if (TRACKER_PREFIX.test(key)) {
        window.localStorage.removeItem(key);
      }
    }
  } catch {
    // ignore
  }
}

export function setConsent(analytics: boolean): ConsentState {
  // With the opt-out default, Mixpanel may already be running even when
  // nothing is stored yet, so the previous effective state matters more
  // than the previous stored state.
  const wasAllowed = hasAnalyticsConsent();
  const state: ConsentState = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    analytics,
  };
  const serialized = JSON.stringify(state);
  try {
    window.localStorage.setItem(CONSENT_KEY, serialized);
  } catch {
    // ignore
  }
  try {
    document.cookie = `${CONSENT_KEY}=${encodeURIComponent(serialized)}; max-age=31536000; path=/; SameSite=Lax`;
  } catch {
    // ignore
  }
  consentChangeListeners.forEach((listener) => listener());

  const w = window as WindowWithConsent;
  // GA4 stays loaded either way; Consent Mode decides whether it may store
  // identifiers. The update applies to the current page without a reload.
  w.gtag?.('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
  });

  if (analytics) {
    w.__loadMixpanel?.();
  } else if (wasAllowed) {
    w.mixpanel?.opt_out_tracking?.();
    expireAnalyticsCookies();
    // Reload so the already-initialized tracker is fully unloaded.
    window.location.reload();
  }
  return state;
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_COOKIE_PREFERENCES_EVENT));
}
