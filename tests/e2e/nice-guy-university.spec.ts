import { expect, test } from '@playwright/test';
import { mockInvisibleRecaptcha } from './helpers/recaptcha';

test.describe('Nice Guy University landing page', () => {
  test('desktop Apps menu links to Nice Guy University directly after Questionnaire', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.addInitScript(() => window.sessionStorage.setItem('nguPromoSeen', 'true'));
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Apps' }).hover();

    const menu = page.getByRole('menu', { name: 'Apps' });
    await expect(menu).toHaveClass(/opacity-100/);

    const menuItems = await menu.locator('[role="menuitem"]').evaluateAll((items) => (
      items.map((item) => item.textContent?.replace(/\s+/g, ' ').trim() ?? '')
    ));
    expect(menuItems.indexOf('Nice Guy University')).toBe(menuItems.indexOf('Questionnaire') + 1);

    await menu.getByRole('menuitem', { name: 'Nice Guy University' }).click();
    await page.waitForURL('**/nice-guy-university');
    await expect(page.getByRole('heading', { name: 'Nice Guy University', level: 1 })).toBeVisible();
  });

  test('mobile nav links to Nice Guy University and closes after navigation', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.addInitScript(() => window.sessionStorage.setItem('nguPromoSeen', 'true'));
    await page.setViewportSize({ width: 345, height: 800 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Toggle menu' }).click();
    const mobileNav = page.locator('#mobile-nav');
    await expect(mobileNav).toHaveAttribute('aria-hidden', 'false');

    await mobileNav.getByRole('link', { name: 'Nice Guy University' }).click();
    await page.waitForURL('**/nice-guy-university');
    await expect(page.getByRole('heading', { name: 'Nice Guy University', level: 1 })).toBeVisible();
    await expect(mobileNav).toHaveAttribute('aria-hidden', 'true');
  });

  test('landing page renders CTAs, coupon signup, and mobile layout without horizontal overflow', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.addInitScript(() => window.sessionStorage.setItem('nguPromoSeen', 'true'));
    await page.route('**/api/ngu-coupon', async (route) => {
      const request = route.request();
      expect(request.method()).toBe('POST');
      expect(await request.postDataJSON()).toEqual({
        email: 'student@example.com',
        captchaToken: 'test-captcha-token',
      });
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.setViewportSize({ width: 345, height: 800 });
    await page.goto('/nice-guy-university');

    await expect(page.getByRole('heading', { name: 'Nice Guy University', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Browse NGU Courses' })).toHaveAttribute('href', 'https://www.niceguyuniversity.com');
    await expect(page.getByText(/A self-paced course platform for men ready/i)).toBeVisible();
    await expect(page.getByText('Online Nice Guy Recovery Courses')).toBeVisible();

    const layout = await page.evaluate(() => {
      const eyebrow = document.querySelector('[data-testid="ngu-landing-page"] section p');
      const header = document.querySelector('header');
      if (!eyebrow || !header) {
        throw new Error('Expected eyebrow and header');
      }

      return {
        eyebrowTop: Math.round(eyebrow.getBoundingClientRect().top),
        headerBottom: Math.round(header.getBoundingClientRect().bottom),
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(layout.eyebrowTop).toBeGreaterThanOrEqual(layout.headerBottom + 32);
    expect(layout.overflowX).toBe(0);

    const coupon = page.getByRole('region', { name: 'Nice Guy University email coupon' });
    await page.getByRole('link', { name: 'Get the 10% Coupon' }).click();
    await expect(page).toHaveURL(/#ngu-coupon-card$/);
    const couponTarget = await page.evaluate(() => {
      const couponSection = document.querySelector<HTMLElement>('#ngu-coupon');
      const couponCard = document.querySelector<HTMLElement>('#ngu-coupon-card');
      if (!couponSection || !couponCard) {
        throw new Error('Expected coupon section and card');
      }

      return {
        isFirstChild: couponSection.firstElementChild === couponCard,
        isHashTarget: document.getElementById(window.location.hash.slice(1)) === couponCard,
      };
    });
    expect(couponTarget).toEqual({ isFirstChild: true, isHashTarget: true });

    await expect.poll(async () => page.evaluate(() => {
      const couponCard = document.querySelector<HTMLElement>('#ngu-coupon-card');
      if (!couponCard) {
        throw new Error('Expected coupon card');
      }

      const scrollMarginTop = Number.parseFloat(getComputedStyle(couponCard).scrollMarginTop);
      return Math.abs(couponCard.getBoundingClientRect().top - scrollMarginTop);
    })).toBeLessThanOrEqual(2);

    const scrollLayout = await page.evaluate(() => {
      const couponSection = document.querySelector<HTMLElement>('#ngu-coupon');
      const couponCard = document.querySelector<HTMLElement>('#ngu-coupon-card');
      const header = document.querySelector<HTMLElement>('header');
      const couponHeading = couponSection?.querySelector<HTMLElement>('h2');
      const emailInput = couponSection?.querySelector<HTMLInputElement>('input[type="email"]');
      if (!couponSection || !couponCard || !header || !couponHeading || !emailInput) {
        throw new Error('Expected coupon section, card, header, heading, and email input');
      }

      const cardRect = couponCard.getBoundingClientRect();
      const headingRect = couponHeading.getBoundingClientRect();
      const inputRect = emailInput.getBoundingClientRect();

      return {
        cardTop: Math.round(cardRect.top),
        headerBottom: Math.round(header.getBoundingClientRect().bottom),
        headingBottom: Math.round(headingRect.bottom),
        inputTop: Math.round(inputRect.top),
        inputBottom: Math.round(inputRect.bottom),
        viewportHeight: window.innerHeight,
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(scrollLayout.cardTop).toBeGreaterThanOrEqual(scrollLayout.headerBottom + 8);
    expect(scrollLayout.headingBottom).toBeLessThan(scrollLayout.viewportHeight);
    expect(scrollLayout.inputTop).toBeGreaterThan(scrollLayout.headerBottom);
    expect(scrollLayout.inputBottom).toBeGreaterThan(scrollLayout.inputTop);
    expect(scrollLayout.overflowX).toBe(0);

    await expect(coupon.getByRole('heading', { name: /get 10% off your first ngu course/i })).toBeVisible();
    await expect(coupon.getByText(/will never be sold to a third party/i)).toBeVisible();
    await expect(coupon.getByTestId('ngu-recaptcha-widget')).toHaveAttribute('data-mock-size', 'invisible');

    await coupon.getByLabel(/email address/i).fill('student@example.com');
    await coupon.getByRole('button', { name: /email me the coupon/i }).click();

    await expect(coupon.getByText(/check your email/i)).toBeVisible();
    await expect(coupon.getByText(/your nice guy university coupon is on its way/i)).toBeVisible();
    await expect(page.getByText('NEW-NG-10')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (
      window as unknown as { __recaptchaV2ExecuteCount: number; }
    ).__recaptchaV2ExecuteCount)).toBe(1);
  });
});
