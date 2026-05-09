import { expect, test, type Page } from '@playwright/test';
import { mockInvisibleRecaptcha } from './helpers/recaptcha';

async function installAnalyticsSpy(page: Page) {
  const events: Array<Record<string, unknown>> = [];

  await page.exposeFunction('__recordAnalyticsEvent', (event: Record<string, unknown>) => {
    events.push(event);
  });

  await page.evaluate(() => {
    const win = window as typeof window & {
      __recordAnalyticsEvent: (event: Record<string, unknown>) => void;
      gtag: (...args: unknown[]) => void;
      amplitude?: Record<string, unknown>;
    };

    win.gtag = (...args: unknown[]) => {
      win.__recordAnalyticsEvent({ provider: 'ga4', args });
    };

    const track = (name: string, props?: object) => {
      win.__recordAnalyticsEvent({ provider: 'amplitude', name, props });
    };
    let amplitudeValue: Record<string, unknown> = {
      ...(win.amplitude ?? {}),
      track,
      logEvent: track,
    };

    Object.defineProperty(win, 'amplitude', {
      configurable: true,
      get() {
        return amplitudeValue;
      },
      set(nextValue: Record<string, unknown> | undefined) {
        amplitudeValue = {
          ...(nextValue ?? {}),
          track: (name: string, props?: object) => {
            if (typeof nextValue?.track === 'function') {
              (nextValue.track as (name: string, props?: object) => void)(name, props);
            }
            win.__recordAnalyticsEvent({ provider: 'amplitude', name, props });
          },
          logEvent: (name: string, props?: object) => {
            if (typeof nextValue?.logEvent === 'function') {
              (nextValue.logEvent as (name: string, props?: object) => void)(name, props);
            }
            win.__recordAnalyticsEvent({ provider: 'amplitude', name, props });
          },
        };
      },
    });

    win.amplitude = {
      track: (name: string, props?: object) => {
        win.__recordAnalyticsEvent({ provider: 'amplitude', name, props });
      },
    };
  });

  return events;
}

test.describe('Nice Guy University landing page', () => {
  test('desktop Apps menu and footer no longer include Nice Guy University', async ({ page }) => {
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
    expect(menuItems).not.toContain('Nice Guy University');
    await expect(menu.getByRole('menuitem', { name: 'Nice Guy University' })).toHaveCount(0);

    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: 'Nice Guy University' })).toHaveCount(0);
    await expect(footer.getByRole('link', { name: 'Book a Strategy Call' })).toHaveCount(1);
  });

  test('mobile nav keeps the Nice Guy University CTA and closes after navigation', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.addInitScript(() => window.sessionStorage.setItem('nguPromoSeen', 'true'));
    await page.setViewportSize({ width: 345, height: 800 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Toggle menu' }).click();
    const mobileNav = page.locator('#mobile-nav');
    await expect(mobileNav).toHaveAttribute('aria-hidden', 'false');

    await expect(mobileNav.getByRole('link', { name: 'Nice Guy University' })).toHaveCount(1);
    await mobileNav.getByRole('link', { name: 'Nice Guy University' }).click();
    await page.waitForURL('**/nice-guy-university');
    await expect(page.getByRole('heading', { name: 'Nice Guy University', level: 1 })).toBeVisible();
    await expect(mobileNav).toHaveAttribute('aria-hidden', 'true');
  });

  test('header CTA links to Nice Guy University and tracks GA4 and Amplitude events', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.addInitScript(() => window.sessionStorage.setItem('nguPromoSeen', 'true'));
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto('/');
    const events = await installAnalyticsSpy(page);

    const headerCta = page.locator('header').getByRole('link', { name: 'Nice Guy University' });
    await expect(headerCta).toHaveAttribute('href', '/nice-guy-university');

    await headerCta.click();
    await page.waitForURL('**/nice-guy-university');
    await expect(page.getByRole('heading', { name: 'Nice Guy University', level: 1 })).toBeVisible();

    expect(events).toContainEqual(expect.objectContaining({
      provider: 'ga4',
      args: expect.arrayContaining(['event', 'link_click']),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'amplitude',
      name: 'link_click',
      props: expect.objectContaining({
        link_location: 'header',
        link_text: 'Nice Guy University',
        link_url: '/nice-guy-university',
        link_section: 'cta',
      }),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'ga4',
      args: expect.arrayContaining(['event', 'ngu_header_cta_click']),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'amplitude',
      name: 'ngu_header_cta_click',
      props: expect.objectContaining({
        location: 'header',
        label: 'Nice Guy University',
        href: '/nice-guy-university',
      }),
    }));
  });

  test('mobile header CTA links to Nice Guy University and closes after navigation', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.addInitScript(() => window.sessionStorage.setItem('nguPromoSeen', 'true'));
    await page.setViewportSize({ width: 345, height: 800 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Toggle menu' }).click();
    const mobileNav = page.locator('#mobile-nav');
    await expect(mobileNav).toHaveAttribute('aria-hidden', 'false');

    const mobileCta = mobileNav.getByRole('link', { name: 'Nice Guy University' }).last();
    await expect(mobileCta).toHaveAttribute('href', '/nice-guy-university');

    await mobileCta.click();
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
    const nguExternalCtas = page.getByRole('link', { name: 'Visit Nice Guy University' });
    await expect(nguExternalCtas.first()).toHaveAttribute('href', 'https://www.niceguyuniversity.com');
    await expect(nguExternalCtas.first().locator('svg')).toBeVisible();
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
    await expect(coupon.getByRole('link', { name: 'Visit Nice Guy University' }).locator('svg')).toBeVisible();
    await expect(page.getByText('NEW-NG-10')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => (
      window as unknown as { __recaptchaV2ExecuteCount: number; }
    ).__recaptchaV2ExecuteCount)).toBe(1);
  });

  test('NGU page CTAs track GA4 and Amplitude events', async ({ page }) => {
    await mockInvisibleRecaptcha(page);
    await page.addInitScript(() => window.sessionStorage.setItem('nguPromoSeen', 'true'));
    await page.route('**/api/ngu-coupon', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/nice-guy-university');
    const events = await installAnalyticsSpy(page);

    await page.getByRole('link', { name: 'Get the 10% Coupon' }).click();
    await expect(page).toHaveURL(/#ngu-coupon-card$/);

    await page.getByLabel(/email address/i).fill('student@example.com');
    await page.getByRole('button', { name: /email me the coupon/i }).click();
    await expect(page.getByText(/check your email/i)).toBeVisible();

    const heroCta = page.getByRole('link', { name: 'Visit Nice Guy University' }).first();
    await expect(heroCta).toHaveAttribute('href', 'https://www.niceguyuniversity.com');
    const popupPromise = page.waitForEvent('popup');
    await heroCta.click();
    const popup = await popupPromise;
    await popup.close();

    expect(events).toContainEqual(expect.objectContaining({
      provider: 'ga4',
      args: expect.arrayContaining(['event', 'ngu_coupon_anchor_click']),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'amplitude',
      name: 'ngu_coupon_anchor_click',
      props: expect.objectContaining({
        location: 'ngu-hero',
        label: 'Get the 10% Coupon',
        href: '#ngu-coupon-card',
      }),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'ga4',
      args: expect.arrayContaining(['event', 'ngu_coupon_submit_click']),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'amplitude',
      name: 'ngu_coupon_submit_click',
      props: expect.objectContaining({
        location: 'ngu-landing-coupon',
        label: 'Email me the coupon',
      }),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'ga4',
      args: expect.arrayContaining(['event', 'link_click']),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'amplitude',
      name: 'link_click',
      props: expect.objectContaining({
        link_location: 'ngu-hero',
        link_text: 'Visit Nice Guy University',
        link_url: 'https://www.niceguyuniversity.com',
        link_section: 'cta',
      }),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'ga4',
      args: expect.arrayContaining(['event', 'ngu_visit_click']),
    }));
    expect(events).toContainEqual(expect.objectContaining({
      provider: 'amplitude',
      name: 'ngu_visit_click',
      props: expect.objectContaining({
        location: 'ngu-hero',
        label: 'Visit Nice Guy University',
        href: 'https://www.niceguyuniversity.com',
      }),
    }));
  });
});
