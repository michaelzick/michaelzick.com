import { type Page } from '@playwright/test';

export async function mockInvisibleRecaptcha(page: Page, token = 'test-captcha-token') {
  await page.route('https://www.google.com/recaptcha/api.js?**', async (route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `
        window.__recaptchaV2ExecuteCount = 0;
        window.__recaptchaV2ResetCount = 0;
        window.__recaptchaV2RenderOptions = null;
        var recaptchaOptionsById = {};
        var nextWidgetId = 1;
        window.grecaptcha = {
          render: function(container, options) {
            var widgetId = nextWidgetId++;
            window.__recaptchaV2RenderOptions = {
              sitekey: options.sitekey,
              size: options.size,
              badge: options.badge
            };
            container.setAttribute('data-mock-rendered', 'true');
            container.setAttribute('data-mock-size', options.size || '');
            container.setAttribute('data-mock-badge', options.badge || '');
            recaptchaOptionsById[widgetId] = options;
            return widgetId;
          },
          execute: function(widgetId) {
            window.__recaptchaV2ExecuteCount += 1;
            setTimeout(function() {
              if (recaptchaOptionsById[widgetId] && recaptchaOptionsById[widgetId].callback) {
                recaptchaOptionsById[widgetId].callback('${token}');
              }
            }, 0);
          },
          reset: function() {
            window.__recaptchaV2ResetCount += 1;
          }
        };
        if (typeof window.__recaptchaV2Onload === 'function') {
          window.__recaptchaV2Onload();
        }
      `,
    });
  });
}
