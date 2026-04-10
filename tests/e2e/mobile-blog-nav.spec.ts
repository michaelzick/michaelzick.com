import { expect, test } from '@playwright/test';

const sourceRoutes = ['/', '/about', '/testimonials', '/contact', '/questionnaire'];

test.describe('mobile blog navigation', () => {
  test.use({
    viewport: { width: 345, height: 800 },
    isMobile: true,
    deviceScaleFactor: 2,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  for (const sourceRoute of sourceRoutes) {
    test(`lands at the top of /blog from ${sourceRoute}`, async ({ page }) => {
      await page.goto(sourceRoute);
      await expect(page.locator('[data-test="header-burger"]')).toBeVisible();

      await page.evaluate(() => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'auto' });
      });
      await page.waitForFunction(() => window.scrollY > 0);

      await page.getByRole('button', { name: 'Toggle menu' }).click();
      await page.locator('#mobile-nav').getByRole('link', { name: 'Blog' }).click();

      await page.waitForURL('**/blog');

      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThanOrEqual(2);

      const heading = page.getByRole('heading', { name: 'Blog', level: 1 });
      await expect(heading).toBeVisible();

      const firstCard = page.locator('main article').first();
      await expect(firstCard).toBeVisible();
    });
  }
});
