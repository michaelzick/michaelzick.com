import { expect, type Page, test } from '@playwright/test';

async function mockRecaptcha(page: Page) {
  await page.route('https://www.google.com/recaptcha/api.js?**', async (route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `
        window.__nguRecaptchaExecuteCount = 0;
        window.__nguRecaptchaResetCount = 0;
        window.__nguRecaptchaRenderOptions = null;
        var nguRecaptchaOptionsById = {};
        window.grecaptcha = {
          render: function(container, options) {
            window.__nguRecaptchaRenderOptions = {
              sitekey: options.sitekey,
              size: options.size,
              badge: options.badge
            };
            container.setAttribute('data-mock-rendered', 'true');
            container.setAttribute('data-mock-size', options.size || '');
            container.setAttribute('data-mock-badge', options.badge || '');
            nguRecaptchaOptionsById[1] = options;
            return 1;
          },
          execute: function(widgetId) {
            window.__nguRecaptchaExecuteCount += 1;
            setTimeout(function() {
              if (nguRecaptchaOptionsById[widgetId] && nguRecaptchaOptionsById[widgetId].callback) {
                nguRecaptchaOptionsById[widgetId].callback('test-captcha-token');
              }
            }, 0);
          },
          reset: function() {
            window.__nguRecaptchaResetCount += 1;
          }
        };
        if (typeof window.__nguRecaptchaOnload === 'function') {
          window.__nguRecaptchaOnload();
        }
      `,
    });
  });
}

test.describe('NGU promo', () => {
  test('shows delayed modal once per browser session and persists close state', async ({ page }) => {
    await mockRecaptcha(page);
    await page.goto('/');

    await expect(page.getByText('Nice Guy University: get 10% off courses')).toBeVisible();
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
    await mockRecaptcha(page);
    await page.addInitScript(() => window.sessionStorage.setItem('nguPromoSeen', 'true'));
    await page.goto('/');

    const banner = page.getByLabel('Nice Guy University promotion');
    await expect(banner).toBeVisible();

    const bannerBox = await banner.boundingBox();
    const headerBox = await page.locator('header').boundingBox();
    const ctaBox = await page.getByRole('button', { name: /send me the coupon/i }).boundingBox();

    if (!bannerBox || !headerBox || !ctaBox) {
      throw new Error('Expected NGU banner, CTA, and header to be measurable');
    }

    expect(Math.round(bannerBox.y)).toBe(0);
    expect(headerBox.y).toBeGreaterThanOrEqual(bannerBox.height - 1);

    await page.getByRole('button', { name: /send me the coupon/i }).click();
    await expect(page.getByRole('dialog', { name: /get 10% off your first course/i })).toBeVisible();
  });

  test('successful signup persists session state without showing the coupon code', async ({ page }) => {
    await mockRecaptcha(page);
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
      window as unknown as { __nguRecaptchaExecuteCount: number; }
    ).__nguRecaptchaExecuteCount)).toBe(1);

    const seen = await page.evaluate(() => window.sessionStorage.getItem('nguPromoSeen'));
    expect(seen).toBe('true');
  });
});
