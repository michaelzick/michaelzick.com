import type { Page } from '@playwright/test';

// Pre-seeds an analytics consent decision so the cookie consent banner never
// renders and the Mixpanel bootstrap behaves deterministically. Keep the
// key/shape in sync with lib/cookie-consent.ts.
export async function seedAnalyticsConsent(page: Page, analytics = true) {
  const record = JSON.stringify({
    version: 1,
    timestamp: new Date().toISOString(),
    analytics,
  });
  await page.addInitScript((value: string) => {
    window.localStorage.setItem('cookie-consent', value);
  }, record);
}
