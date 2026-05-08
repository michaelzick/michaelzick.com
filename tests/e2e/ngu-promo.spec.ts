import { expect, test, type Page } from '@playwright/test';
import { mockInvisibleRecaptcha } from './helpers/recaptcha';

async function installAnalyticsSpy(page: Page) {
  await page.evaluate(() => {
    const win = window as typeof window & {
      __analyticsEvents: Array<Record<string, unknown>>;
      gtag: (...args: unknown[]) => void;
      amplitude: { track: (name: string, props?: object) => void };
    };

    win.__analyticsEvents = [];
    win.gtag = (...args: unknown[]) => {
      win.__analyticsEvents.push({ provider: 'ga4', args });
    };
    win.amplitude = {
      track: (name: string, props?: object) => {
        win.__analyticsEvents.push({ provider: 'amplitude', name, props });
      },
    };
  });
}

test.describe('NGU promo', () => {
  test('shows delayed modal once per browser session and persists close state', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.goto('/');

    await expect(page.getByText('Get 10% off courses at the new Nice Guy University!')).toBeVisible();
    await expect(page.getByRole('dialog', { name: /get 10% off your first course/i })).toBeHidden();

    await page.waitForTimeout(8500);
    await expect(page.getByRole('dialog', { name: /get 10% off your first course/i })).toBeVisible();
    await expect(page.getByText(/this site is protected by recaptcha/i)).toBeVisible();
    await expect(page.getByTestId('ngu-recaptcha-widget')).toHaveAttribute('data-mock-size', 'invisible');
    await expect(page.getByTestId('ngu-recaptcha-widget')).toHaveAttribute('data-mock-badge', 'inline');
    await expect(page.getByRole('button', { name: /i'm not a robot/i })).toHaveCount(0);

    await page.getByRole('button', { name: /close nice guy university signup/i }).click();
    await expect(page.getByRole('dialog', { name: /get 10% off your first course/i })).toBeHidden();

    await page.reload();
    await page.waitForTimeout(8500);
    await expect(page.getByRole('dialog', { name: /get 10% off your first course/i })).toBeHidden();
  });

  test('banner is fixed at the top and opens modal after session flag is set', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.addInitScript(() => window.sessionStorage.setItem('nguPromoSeen', 'true'));
    await page.goto('/');

    const banner = page.getByLabel('Nice Guy University promotion');
    await expect(banner).toBeVisible();

    const bannerBox = await banner.boundingBox();
    const headerBox = await page.locator('header').boundingBox();
    const ctaText = page.getByText('Send me the coupon');
    const ctaBox = await ctaText.boundingBox();

    if (!bannerBox || !headerBox || !ctaBox) {
      throw new Error('Expected NGU banner, CTA, and header to be measurable');
    }

    expect(Math.round(bannerBox.y)).toBe(0);
    expect(headerBox.y).toBeGreaterThanOrEqual(bannerBox.height - 1);
    await expect(banner).toHaveCSS('background-color', 'rgb(56, 70, 89)');
    await expect(page.getByText('Get 10% off courses at the new Nice Guy University!')).toHaveCSS('font-size', '16px');
    await expect(banner.getByRole('link', { name: 'Nice Guy University' })).toHaveAttribute('href', '/nice-guy-university');
    await expect(page.getByRole('button', { name: /send me the coupon/i })).toHaveCSS('background-color', 'rgb(76, 95, 120)');

    await ctaText.click();
    await expect(page.getByRole('dialog', { name: /get 10% off your first course/i })).toBeVisible();
  });

  test('banner Nice Guy University link tracks GA4 and Amplitude events', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.addInitScript(() => window.sessionStorage.setItem('nguPromoSeen', 'true'));
    await page.goto('/');
    await installAnalyticsSpy(page);

    const bannerLink = page
      .getByLabel('Nice Guy University promotion')
      .getByRole('link', { name: 'Nice Guy University' });

    await expect(bannerLink).toHaveAttribute('href', '/nice-guy-university');
    await bannerLink.click();
    await page.waitForURL('**/nice-guy-university');

    const events = await page.evaluate(() => (
      window as typeof window & { __analyticsEvents: Array<Record<string, unknown>> }
    ).__analyticsEvents);

    expect(events).toContainEqual(expect.objectContaining({
      provider: 'ga4',
      args: expect.arrayContaining(['event', 'link_click']),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'amplitude',
      name: 'link_click',
      props: expect.objectContaining({
        link_location: 'ngu_promo_banner',
        link_text: 'Nice Guy University',
        link_url: '/nice-guy-university',
        link_section: 'promo_banner',
      }),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'ga4',
      args: expect.arrayContaining(['event', 'ngu_banner_link_click']),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'amplitude',
      name: 'ngu_banner_link_click',
      props: expect.objectContaining({
        location: 'ngu_promo_banner',
        label: 'Nice Guy University',
        href: '/nice-guy-university',
      }),
    }));
  });

  test('successful signup persists session state without showing the coupon code', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.route('**/api/ngu-coupon', async (route) => {
      const request = route.request();
      expect(request.method()).toBe('POST');
      expect(await request.postDataJSON()).toEqual({
        email: 'person@example.com',
        captchaToken: 'test-captcha-token',
      });
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/');
    await page.getByRole('button', { name: /send me the coupon/i }).click();
    await expect(page.getByTestId('ngu-recaptcha-widget')).toHaveAttribute('data-mock-size', 'invisible');
    await page.getByLabel(/email address/i).fill('person@example.com');
    await page.getByRole('button', { name: /email me the coupon/i }).click();

    await expect(page.getByText(/check your email/i)).toBeVisible();
    await expect(page.getByText(/your nice guy university coupon is on its way/i)).toBeVisible();
    await expect(page.getByText('NEW-NG-10')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (
      window as unknown as { __recaptchaV2ExecuteCount: number; }
    ).__recaptchaV2ExecuteCount)).toBe(1);

    const seen = await page.evaluate(() => window.sessionStorage.getItem('nguPromoSeen'));
    expect(seen).toBe('true');
  });
});
