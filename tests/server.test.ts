import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildContactEmailText,
  getContactConfig,
  isValidRecaptchaResponse,
  validateContactSubmission,
} from '../lib/server/contact';
import {
  buildNguCouponNotificationEmail,
  buildNguCouponVisitorEmail,
  getNguCouponConfig,
  isValidNguRecaptchaResponse,
  NGU_COUPON_CODE,
  NGU_SIGNUP_SOURCE,
  normalizeNguCouponSubmission,
  validateNguCouponSubmission,
} from '../lib/server/ngu-coupon';
import { getServerOpenAIClient } from '../lib/server/openai';
import { consumeRateLimit } from '../lib/server/rate-limit';

test('consumeRateLimit blocks after the configured maximum and resets after the window', () => {
  const store = new Map<string, { count: number; lastReset: number; }>();
  const options = {
    key: '127.0.0.1',
    store,
    windowMs: 60_000,
    maxRequests: 2,
  };

  assert.equal(consumeRateLimit({ ...options, now: 0 }).allowed, true);
  assert.equal(consumeRateLimit({ ...options, now: 1 }).allowed, true);
  assert.equal(consumeRateLimit({ ...options, now: 2 }).allowed, false);
  assert.equal(consumeRateLimit({ ...options, now: 60_001 }).allowed, true);
});

test('validateContactSubmission enforces required fields and limits', () => {
  assert.equal(
    validateContactSubmission({ email: '', message: 'Hello', captchaToken: 'token' }),
    'Missing required fields (Email and Message)',
  );
  assert.equal(
    validateContactSubmission({
      email: 'person@example.com',
      message: 'Hello',
      captchaToken: '',
    }),
    'Captcha token missing',
  );
  assert.equal(
    validateContactSubmission({
      email: 'person@example.com',
      message: 'Hello',
      captchaToken: 'token',
      subject: 'x'.repeat(201),
    }),
    'Input exceeds character limits',
  );
});

test('contact helpers build email content and validate recaptcha state', () => {
  const email = buildContactEmailText({
    firstName: 'Michael',
    lastName: 'Zick',
    email: 'person@example.com',
    subject: 'Coaching',
    message: 'I am ready to talk.',
    workbookOptIn: true,
  });

  assert.match(email.subject, /^\[michaelzick\.com\] Coaching$/);
  assert.match(email.text, /Workbook \+ Email List Consent: Yes/);

  assert.equal(
    isValidRecaptchaResponse({
      success: true,
    }).valid,
    true,
  );

  assert.equal(
    isValidRecaptchaResponse({
      success: false,
      'error-codes': ['invalid-input-response'],
    }).valid,
    false,
  );

  assert.deepEqual(
    getContactConfig({
      BREVO_SMTP_PASSWORD: 'password',
      BREVO_USER: 'user',
      BREVO_TO: 'to@example.com',
      BREVO_FROM: 'from@example.com',
      RECAPTCHA_SECRET_KEY_V2: 'secret',
    } as unknown as NodeJS.ProcessEnv),
    {
      password: 'password',
      userName: 'user',
      toAddress: 'to@example.com',
      fromAddress: 'from@example.com',
      recaptchaSecretKey: 'secret',
    },
  );
});

test('NGU coupon helpers normalize and validate modal signups', () => {
  assert.deepEqual(
    normalizeNguCouponSubmission({
      email: ' person@example.com ',
      captchaToken: ' token ',
    }),
    {
      email: 'person@example.com',
      captchaToken: 'token',
    },
  );

  assert.equal(
    validateNguCouponSubmission({ email: '', captchaToken: 'token' }),
    'Email is required',
  );
  assert.equal(
    validateNguCouponSubmission({ email: 'not-an-email', captchaToken: 'token' }),
    'Enter a valid email address',
  );
  assert.equal(
    validateNguCouponSubmission({
      email: `${'x'.repeat(101)}@example.com`,
      captchaToken: 'token',
    }),
    'Enter a valid email address',
  );
  assert.equal(
    validateNguCouponSubmission({ email: 'person@example.com', captchaToken: '' }),
    'Captcha token missing',
  );
  assert.equal(
    validateNguCouponSubmission({ email: 'person@example.com', captchaToken: 'token' }),
    null,
  );
});

test('NGU coupon emails identify the signup modal source and coupon handling', () => {
  const visitorEmail = buildNguCouponVisitorEmail('person@example.com');
  const notificationEmail = buildNguCouponNotificationEmail('person@example.com');

  assert.match(visitorEmail.subject, /Nice Guy University 10% off coupon/);
  assert.match(visitorEmail.text, new RegExp(NGU_COUPON_CODE));
  assert.match(visitorEmail.text, new RegExp(NGU_SIGNUP_SOURCE));
  assert.match(visitorEmail.text, /will never be sold to a third party/);

  assert.match(notificationEmail.subject, /NGU signup modal coupon request/);
  assert.match(notificationEmail.text, /person@example\.com/);
  assert.match(notificationEmail.text, new RegExp(NGU_SIGNUP_SOURCE));
  assert.match(notificationEmail.text, new RegExp(NGU_COUPON_CODE));
  assert.match(notificationEmail.text, /agreed to join the email list/);
  assert.doesNotMatch(notificationEmail.text, /will never be sold to a third party/);
});

test('NGU coupon config and recaptcha helpers validate expected state', () => {
  assert.equal(getNguCouponConfig({} as NodeJS.ProcessEnv), null);

  assert.deepEqual(
    getNguCouponConfig({
      BREVO_SMTP_PASSWORD: 'password',
      BREVO_USER: 'user',
      BREVO_TO: 'to@example.com',
      BREVO_FROM: 'from@example.com',
      RECAPTCHA_SECRET_KEY_V2: 'secret',
    } as unknown as NodeJS.ProcessEnv),
    {
      password: 'password',
      userName: 'user',
      toAddress: 'to@example.com',
      fromAddress: 'from@example.com',
      recaptchaSecretKey: 'secret',
    },
  );

  assert.equal(isValidNguRecaptchaResponse({ success: true }).valid, true);
  assert.equal(
    isValidNguRecaptchaResponse({ success: false, 'error-codes': ['invalid-input-response'] }).valid,
    false,
  );
});

test('getServerOpenAIClient only initializes when OPENAI_API_KEY is present', () => {
  assert.equal(getServerOpenAIClient({ OPENAI_API_KEY: '' } as unknown as NodeJS.ProcessEnv), null);

  const client = getServerOpenAIClient({
    OPENAI_API_KEY: 'test-key',
  } as unknown as NodeJS.ProcessEnv);

  assert.ok(client);
});
