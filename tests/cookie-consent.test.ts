import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONSENT_VERSION,
  analyticsCookieDomains,
  isGdprTimeZone,
  parseStoredConsent,
} from '../lib/cookie-consent';

const validConsent = JSON.stringify({
  version: CONSENT_VERSION,
  timestamp: '2026-08-11T00:00:00.000Z',
  analytics: true,
});

test('parseStoredConsent accepts a valid stored record', () => {
  assert.deepEqual(parseStoredConsent(validConsent), {
    version: CONSENT_VERSION,
    timestamp: '2026-08-11T00:00:00.000Z',
    analytics: true,
  });
});

test('parseStoredConsent rejects missing, malformed, and stale records', () => {
  assert.equal(parseStoredConsent(null), null);
  assert.equal(parseStoredConsent(''), null);
  assert.equal(parseStoredConsent('not json'), null);
  assert.equal(parseStoredConsent('{}'), null);
  assert.equal(
    parseStoredConsent(
      JSON.stringify({ version: CONSENT_VERSION + 1, timestamp: 't', analytics: true }),
    ),
    null,
  );
  assert.equal(
    parseStoredConsent(
      JSON.stringify({ version: CONSENT_VERSION, timestamp: 't', analytics: 'yes' }),
    ),
    null,
  );
});

test('isGdprTimeZone flags EU/EEA/UK zones and their Atlantic islands', () => {
  assert.equal(isGdprTimeZone('Europe/Berlin'), true);
  assert.equal(isGdprTimeZone('Europe/London'), true);
  assert.equal(isGdprTimeZone('Atlantic/Canary'), true);
  assert.equal(isGdprTimeZone('Atlantic/Reykjavik'), true);
});

test('analyticsCookieDomains covers the host and its parent domains', () => {
  // The Google tag sets _ga on the registrable domain, not the www host.
  assert.deepEqual(analyticsCookieDomains('www.michaelzick.com'), [
    'www.michaelzick.com',
    '.www.michaelzick.com',
    'michaelzick.com',
    '.michaelzick.com',
  ]);
  assert.deepEqual(analyticsCookieDomains('michaelzick.com'), [
    'michaelzick.com',
    '.michaelzick.com',
  ]);
});

test('analyticsCookieDomains handles localhost and skips IP hosts', () => {
  assert.deepEqual(analyticsCookieDomains('localhost'), ['localhost', '.localhost']);
  assert.deepEqual(analyticsCookieDomains('127.0.0.1'), []);
  assert.deepEqual(analyticsCookieDomains(''), []);
});

test('isGdprTimeZone passes non-GDPR zones through', () => {
  assert.equal(isGdprTimeZone('America/Los_Angeles'), false);
  assert.equal(isGdprTimeZone('Etc/UTC'), false);
  assert.equal(isGdprTimeZone('Australia/Sydney'), false);
  assert.equal(isGdprTimeZone(''), false);
  assert.equal(isGdprTimeZone(null), false);
  assert.equal(isGdprTimeZone(undefined), false);
});
