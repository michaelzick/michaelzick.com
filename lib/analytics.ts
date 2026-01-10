export type LinkClickPayload = {
  location: 'header' | 'footer';
  label: string;
  href: string;
  section?: string;
  variant?: 'desktop' | 'mobile';
};

export type AnalyticsEventPayload = Record<string, unknown>;

export function trackLinkClick({ location, label, href, section, variant }: LinkClickPayload) {
  if (typeof window === 'undefined') return;

  const isExternal = /^https?:/i.test(href);
  const payload = {
    link_location: location,
    link_text: label,
    link_url: href,
    link_external: isExternal,
    ...(section ? { link_section: section } : {}),
    ...(variant ? { link_variant: variant } : {}),
  };

  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', 'link_click', {
      ...payload,
      transport_type: 'beacon',
    });
  }

  const amplitude = (window as { amplitude?: { track?: (name: string, props?: object) => void; logEvent?: (name: string, props?: object) => void } }).amplitude;
  if (amplitude?.track) {
    amplitude.track('link_click', payload);
  } else if (amplitude?.logEvent) {
    amplitude.logEvent('link_click', payload);
  }
}

export function trackEvent(name: string, payload: AnalyticsEventPayload = {}) {
  if (typeof window === 'undefined') return;

  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', name, {
      ...payload,
      transport_type: 'beacon',
    });
  }

  const amplitude = (window as { amplitude?: { track?: (name: string, props?: object) => void; logEvent?: (name: string, props?: object) => void } }).amplitude;
  if (amplitude?.track) {
    amplitude.track(name, payload);
  } else if (amplitude?.logEvent) {
    amplitude.logEvent(name, payload);
  }
}
