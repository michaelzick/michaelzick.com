type WindowWithAnalytics = Window & {
  gtag?: (...args: unknown[]) => void;
  mixpanel?: {
    track?: (name: string, props?: object) => void;
  };
};

export type LinkClickPayload = {
  location: string;
  label: string;
  href: string;
  section?: string;
  variant?: 'desktop' | 'mobile';
  pagePath?: string;
};

export type AnalyticsEventPayload = Record<string, unknown>;

export function trackLinkClick({ location, label, href, section, variant, pagePath }: LinkClickPayload) {
  if (typeof window === 'undefined') return;

  const isExternal = /^[a-z][a-z0-9+.-]*:/i.test(href);
  const payload = {
    link_location: location,
    link_text: label,
    link_url: href,
    link_external: isExternal,
    ...(section ? { link_section: section } : {}),
    ...(variant ? { link_variant: variant } : {}),
    ...(pagePath ? { page_path: pagePath } : { page_path: window.location.pathname }),
  };

  const w = window as WindowWithAnalytics;
  if (typeof w.gtag === 'function') {
    w.gtag('event', 'link_click', { ...payload, transport_type: 'beacon' });
  }
  if (w.mixpanel?.track) {
    w.mixpanel.track('link_click', payload);
  }
}

export function trackEvent(name: string, payload: AnalyticsEventPayload = {}) {
  if (typeof window === 'undefined') return;

  const w = window as WindowWithAnalytics;
  if (typeof w.gtag === 'function') {
    w.gtag('event', name, { ...payload, transport_type: 'beacon' });
  }
  if (w.mixpanel?.track) {
    w.mixpanel.track(name, payload);
  }
}
