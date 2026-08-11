import { expect, test } from '@playwright/test';
import { seedAnalyticsConsent } from './helpers/consent';
import { mockInvisibleRecaptcha } from './helpers/recaptcha';

test.describe('contact form invisible reCAPTCHA', () => {
  test.beforeEach(async ({ page }) => {
    await seedAnalyticsConsent(page);
  });

  test('renders invisible v2 disclosure and submits callback token', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.route('**/api/contact', async (route) => {
      const request = route.request();
      expect(request.method()).toBe('POST');
      expect(await request.postDataJSON()).toEqual({
        firstName: '',
        lastName: '',
        email: 'person@example.com',
        message: 'I want to book a session.',
        workbookOptIn: true,
        captchaToken: 'test-captcha-token',
      });
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/contact');

    await expect(page.getByText(/this site is protected by recaptcha/i)).toBeVisible();
    await expect(page.getByTestId('contact-recaptcha-widget')).toHaveAttribute('data-mock-size', 'invisible');
    await expect(page.getByTestId('contact-recaptcha-widget')).toHaveAttribute('data-mock-badge', 'inline');
    await expect(page.getByRole('button', { name: /i'm not a robot/i })).toHaveCount(0);

    await page.getByRole('textbox', { name: /email/i }).fill('person@example.com');
    await page.getByRole('textbox', { name: /message/i }).fill('I want to book a session.');
    await page.getByRole('button', { name: /get my free workbook/i }).click();

    await expect(page.getByText(/message sent/i)).toBeVisible();
    await expect.poll(() => page.evaluate(() => (
      window as unknown as { __recaptchaV2ExecuteCount: number; }
    ).__recaptchaV2ExecuteCount)).toBe(1);
  });
});
