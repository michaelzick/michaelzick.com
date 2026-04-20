import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTACT_RECAPTCHA_ACTION,
  RECAPTCHA_MINIMUM_SCORE,
} from '../lib/recaptcha';
import {
  buildContactEmailText,
  isValidRecaptchaResponse,
  validateContactSubmission,
} from '../lib/server/contact';
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
      success: true, action: CONTACT_RECAPTCHA_ACTION, score: 0.9,
    }).valid,
    true,
  );

  assert.equal(
    isValidRecaptchaResponse({
      success: true, action: 'wrong_action', score: 0.9,
    }).valid,
    false,
  );

  assert.equal(
    isValidRecaptchaResponse({
      success: true,
      action: CONTACT_RECAPTCHA_ACTION,
      score: RECAPTCHA_MINIMUM_SCORE - 0.01,
    }).valid,
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
