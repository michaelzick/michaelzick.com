import { expect, test, type Page } from '@playwright/test';

const banner = (page: Page) => page.getByRole('dialog', { name: 'Cookie consent' });

const mixpanelState = (page: Page) =>
  page.evaluate(() => {
    const win = window as typeof window & { mixpanel?: { track?: unknown } };
    return {
      exists: typeof win.mixpanel !== 'undefined',
      hasTrack: typeof win.mixpanel?.track === 'function',
    };
  });

const storedConsent = (page: Page) =>
  page.evaluate(() => {
    const raw = window.localStorage.getItem('cookie-consent');
    return raw ? (JSON.parse(raw) as { version: number; analytics: boolean }) : null;
  });

test.describe('cookie consent (outside the EU)', () => {
  test.use({ timezoneId: 'America/Los_Angeles' });

  test('first visit runs Mixpanel opt-out by default; accept persists and footer reopens the banner', async ({ page }) => {
    await page.goto('/');

    await expect(banner(page)).toBeVisible();
    expect(await mixpanelState(page)).toEqual({ exists: true, hasTrack: true });

    await banner(page).getByRole('button', { name: 'Accept' }).click();
    await expect(banner(page)).toBeHidden();
    expect(await storedConsent(page)).toMatchObject({ version: 1, analytics: true });

    await page.reload();
    await expect(banner(page)).toBeHidden();
    expect(await mixpanelState(page)).toEqual({ exists: true, hasTrack: true });

    await page.getByRole('button', { name: 'Cookie Preferences' }).click();
    await expect(banner(page)).toBeVisible();
  });

  test('decline reloads the page and keeps Mixpanel unloaded afterwards', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      (window as typeof window & { __preReloadMarker?: boolean }).__preReloadMarker = true;
    });
    await banner(page).getByRole('button', { name: 'Decline' }).click();

    // Revoking an active opt-out default triggers a reload to unload
    // Mixpanel; the marker vanishing proves the fresh document arrived.
    await page.waitForFunction(() => !(
      window as typeof window & { __preReloadMarker?: boolean }
    ).__preReloadMarker);
    await page.waitForLoadState('load');
    await expect(banner(page)).toBeHidden();
    expect(await storedConsent(page)).toMatchObject({ version: 1, analytics: false });
    expect((await mixpanelState(page)).exists).toBe(false);
  });

});

test.describe('cookie consent (EU visitor)', () => {
  test.use({ timezoneId: 'Europe/Berlin' });

  test('keeps Mixpanel off until the visitor opts in', async ({ page }) => {
    await page.goto('/');

    await expect(banner(page)).toBeVisible();
    expect((await mixpanelState(page)).exists).toBe(false);

    await banner(page).getByRole('button', { name: 'Accept' }).click();
    await expect(banner(page)).toBeHidden();
    expect(await mixpanelState(page)).toEqual({ exists: true, hasTrack: true });
  });
});
