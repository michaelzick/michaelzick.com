import { expect, test } from '@playwright/test';

const mobileViewports = [
  { width: 345, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
];

const topLevelRoutes = [
  '/about',
  '/testimonials',
  '/contact',
  '/questionnaire',
  '/blog',
  '/blog/why-your-emotions-control-what-you-see-and-how-to-change-your-reality',
];

test.describe('mobile UI audit', () => {
  for (const viewport of mobileViewports) {
    test(`home fixed chrome and section tabs do not overlap at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const banner = page.getByLabel('Nice Guy University promotion');
      const header = page.locator('header');
      const mobileTabs = page.locator('[data-home-mobile-tabs]');

      await expect(banner).toBeVisible();
      await expect(header).toBeVisible();
      await expect(mobileTabs).toBeHidden();

      const initialLayout = await page.evaluate(() => {
        const banner = document.querySelector('[aria-label="Nice Guy University promotion"]');
        const header = document.querySelector('header');
        if (!banner || !header) {
          throw new Error('Expected banner and header');
        }

        const bannerRect = banner.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();

        return {
          bannerTop: Math.round(bannerRect.top),
          bannerBottom: Math.round(bannerRect.bottom),
          headerTop: Math.round(headerRect.top),
        };
      });

      expect(initialLayout.bannerTop).toBe(0);
      expect(initialLayout.headerTop).toBeGreaterThanOrEqual(initialLayout.bannerBottom - 1);

      await page.evaluate(() => {
        window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'auto' });
      });
      await expect(mobileTabs).toBeVisible();

      const visibleLayout = await page.evaluate(() => {
        const header = document.querySelector('header');
        const tabs = document.querySelector('[data-home-mobile-tabs]');
        const process = document.querySelector('#process h2');
        if (!header || !tabs || !process) {
          throw new Error('Expected header, mobile tabs, and process heading');
        }

        const headerRect = header.getBoundingClientRect();
        const tabsRect = tabs.getBoundingClientRect();
        const processRect = process.getBoundingClientRect();

        return {
          headerBottom: Math.round(headerRect.bottom),
          tabsTop: Math.round(tabsRect.top),
          tabsBottom: Math.round(tabsRect.bottom),
          processTop: Math.round(processRect.top),
          overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      expect(visibleLayout.tabsTop).toBeGreaterThanOrEqual(visibleLayout.headerBottom + 7);
      expect(visibleLayout.tabsBottom).toBeLessThan(visibleLayout.processTop);
      expect(visibleLayout.overflowX).toBe(0);

      for (const label of ['Process', 'Framework', 'Protocol', 'Reviews']) {
        await page.getByRole('button', { name: label }).click();
        await page.waitForFunction((targetLabel) => {
          const targetIdByLabel: Record<string, string> = {
            Process: 'process',
            Framework: 'specialties',
            Protocol: 'program',
            Reviews: 'testimonials',
          };
          const target = document.getElementById(targetIdByLabel[targetLabel as string]);
          const header = document.querySelector('header');
          const tabs = document.querySelector('[data-home-mobile-tabs]');
          if (!target || !header || !tabs) return false;

          const fixedBottom = Math.max(
            header.getBoundingClientRect().bottom,
            tabs.getBoundingClientRect().bottom,
          );

          return target.getBoundingClientRect().top >= fixedBottom - 2;
        }, label);
      }
    });
  }

  test('primary routes start below fixed chrome and do not overflow on narrow mobile', async ({ page }) => {
    await page.setViewportSize({ width: 345, height: 800 });

    for (const route of topLevelRoutes) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();

      const layout = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const header = document.querySelector('header');
        if (!h1 || !header) {
          throw new Error('Expected heading and header');
        }

        return {
          headingTop: Math.round(h1.getBoundingClientRect().top),
          headerBottom: Math.round(header.getBoundingClientRect().bottom),
          overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      expect(layout.headingTop).toBeGreaterThanOrEqual(layout.headerBottom + 8);
      expect(layout.overflowX).toBe(0);
    }
  });
});
