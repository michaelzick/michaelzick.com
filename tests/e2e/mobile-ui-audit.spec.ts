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
  '/nice-guy-university',
  '/blog',
  '/blog/why-your-emotions-control-what-you-see-and-how-to-change-your-reality',
];

const sectionIdsByLabel: Record<string, string> = {
  Process: 'process',
  Framework: 'specialties',
  Protocol: 'program',
  Reviews: 'testimonials',
};

test.describe('mobile UI audit', () => {
  for (const viewport of mobileViewports) {
    test(`home fixed chrome and section tabs do not overlap at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const banner = page.getByLabel('Nice Guy University promotion');
      const header = page.locator('header');
      const mobileTabsShell = page.locator('[data-home-mobile-tabs-shell]');
      const mobileTabs = page.locator('[data-home-mobile-tabs]');

      await expect(banner).toBeVisible();
      await expect(header).toBeVisible();

      const initialLayout = await page.evaluate(() => {
        const banner = document.querySelector('[aria-label="Nice Guy University promotion"]');
        const header = document.querySelector('header');
        const tabsShell = document.querySelector('[data-home-mobile-tabs-shell]');
        const tabs = document.querySelector('[data-home-mobile-tabs]');
        if (!banner || !header || !tabsShell || !tabs) {
          throw new Error('Expected banner, header, and mobile tabs');
        }

        const bannerRect = banner.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        const tabsShellStyles = window.getComputedStyle(tabsShell);
        const tabsStyles = window.getComputedStyle(tabs);

        return {
          bannerTop: Math.round(bannerRect.top),
          bannerBottom: Math.round(bannerRect.bottom),
          headerTop: Math.round(headerRect.top),
          tabsOpacity: Number(tabsShellStyles.opacity),
          tabsPointerEvents: tabsStyles.pointerEvents,
        };
      });

      expect(initialLayout.bannerTop).toBe(0);
      expect(initialLayout.headerTop).toBeGreaterThanOrEqual(initialLayout.bannerBottom - 1);
      expect(initialLayout.tabsOpacity).toBeLessThanOrEqual(0.05);
      expect(initialLayout.tabsPointerEvents).toBe('none');

      await page.evaluate(() => {
        window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'auto' });
      });
      await expect(mobileTabsShell).toHaveCSS('opacity', '1');

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
        const buttonRects = Array.from(tabs.querySelectorAll('button')).map((button) =>
          Math.round(button.getBoundingClientRect().width),
        );
        const tabsStyles = window.getComputedStyle(tabs);

        return {
          headerBottom: Math.round(headerRect.bottom),
          tabsTop: Math.round(tabsRect.top),
          tabsBottom: Math.round(tabsRect.bottom),
          processTop: Math.round(processRect.top),
          tabsBorderRadius: tabsStyles.borderTopLeftRadius,
          tabWidthSpread: Math.max(...buttonRects) - Math.min(...buttonRects),
          overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      expect(visibleLayout.tabsTop).toBeGreaterThanOrEqual(visibleLayout.headerBottom + 7);
      expect(visibleLayout.tabsBottom).toBeLessThan(visibleLayout.processTop);
      expect(visibleLayout.tabsBorderRadius).toBe('8px');
      expect(visibleLayout.tabWidthSpread).toBeLessThanOrEqual(2);
      expect(visibleLayout.overflowX).toBe(0);

      const tabsScope = page.locator('[data-home-mobile-tabs]');
      for (const [label, targetId] of Object.entries(sectionIdsByLabel)) {
        await tabsScope.getByRole('button', { name: label }).click();
        await page.waitForFunction(({ expectedLabel, expectedTargetId }) => {
          const tabs = document.querySelector('[data-home-mobile-tabs]');
          const activeTab = tabs?.querySelector('[aria-current="location"]');
          const target = document.getElementById(expectedTargetId);
          const header = document.querySelector('header');
          if (!target || !header || !tabs || !activeTab) return false;

          const fixedBottom = Math.max(
            header.getBoundingClientRect().bottom,
            tabs.getBoundingClientRect().bottom,
          );
          const targetTop = target.getBoundingClientRect().top;

          return (
            activeTab.textContent?.trim() === expectedLabel &&
            targetTop >= fixedBottom + 6 &&
            targetTop <= fixedBottom + 24
          );
        }, { expectedLabel: label, expectedTargetId: targetId });
      }

      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      });
      await expect(mobileTabsShell).toHaveCSS('opacity', '0');
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
