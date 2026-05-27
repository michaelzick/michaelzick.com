import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildContactEmailText,
  getContactConfig,
  isValidRecaptchaResponse,
  validateContactSubmission,
} from '../lib/server/contact';
import {
  getHubSpotSubscriberConfig,
  HUBSPOT_EXISTING_ENTRY_NOTE,
  HUBSPOT_FIRST_ENTRY_NOTE,
  HubSpotSubscriberSyncError,
  normalizeHubSpotSubscriberInput,
  syncHubSpotSubscriber,
  syncHubSpotSubscriberSafely,
  validateHubSpotSubscriberInput,
} from '../lib/server/hubspot-subscriber';
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

type HubSpotFetchStubResponse = {
  status?: number;
  body?: unknown;
};

type HubSpotFetchRequest = {
  url: string;
  method?: string;
  authorization?: string;
  body: unknown;
};

function createHubSpotEnv(overrides: Record<string, string | undefined> = {}) {
  return {
    NODE_ENV: 'test',
    HUBSPOT_SERVICE_KEY: 'service-token',
    HUBSPOT_CONTACT_OWNER_ID: '51639144',
    ...overrides,
  } as unknown as NodeJS.ProcessEnv;
}

function createHubSpotFetchStub(responses: HubSpotFetchStubResponse[]) {
  const queuedResponses = [...responses];
  const requests: HubSpotFetchRequest[] = [];
  const fetchFn = (async (
    input: Parameters<typeof fetch>[0],
    init?: Parameters<typeof fetch>[1],
  ) => {
    const headers = init?.headers as Record<string, string> | undefined;
    const rawBody = init?.body;
    const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    requests.push({
      url: String(input),
      method: init?.method,
      authorization: headers?.Authorization,
      body,
    });

    const response = queuedResponses.shift();
    if (!response) {
      throw new Error(`Unexpected HubSpot request: ${String(input)}`);
    }

    return new Response(response.body === undefined ? '' : JSON.stringify(response.body), {
      status: response.status ?? 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  return { fetchFn, requests };
}

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

test('HubSpot subscriber config uses token fallback order and required owner', () => {
  assert.deepEqual(
    getHubSpotSubscriberConfig(createHubSpotEnv({
      HUBSPOT_SERVICE_KEY: ' service ',
      HUBSPOT_ACCESS_TOKEN: 'access',
      HUBSPOT_PRIVATE_APP_TOKEN: 'private',
    })),
    {
      accessToken: 'service',
      ownerId: '51639144',
    },
  );

  assert.deepEqual(
    getHubSpotSubscriberConfig({
      HUBSPOT_ACCESS_TOKEN: ' access ',
      HUBSPOT_PRIVATE_APP_TOKEN: 'private',
      HUBSPOT_CONTACT_OWNER_ID: ' owner ',
    } as unknown as NodeJS.ProcessEnv),
    {
      accessToken: 'access',
      ownerId: 'owner',
    },
  );

  assert.deepEqual(
    getHubSpotSubscriberConfig({
      HUBSPOT_PRIVATE_APP_TOKEN: ' private ',
      HUBSPOT_CONTACT_OWNER_ID: ' owner ',
    } as unknown as NodeJS.ProcessEnv),
    {
      accessToken: 'private',
      ownerId: 'owner',
    },
  );

  assert.equal(
    getHubSpotSubscriberConfig({
      HUBSPOT_SERVICE_KEY: 'service',
    } as unknown as NodeJS.ProcessEnv),
    null,
  );
});

test('HubSpot subscriber helpers normalize and validate input', () => {
  assert.deepEqual(
    normalizeHubSpotSubscriberInput({
      email: ' Person@Example.COM ',
      firstName: ' Michael ',
      lastName: ' ',
    }),
    {
      email: 'person@example.com',
      firstName: 'Michael',
      lastName: undefined,
    },
  );

  assert.equal(
    validateHubSpotSubscriberInput({ email: '' }),
    'Subscriber email is required.',
  );
  assert.equal(
    validateHubSpotSubscriberInput({ email: 'not-an-email' }),
    'Subscriber email must be valid.',
  );
  assert.equal(
    validateHubSpotSubscriberInput({ email: 'person@example.com', firstName: 'x'.repeat(51) }),
    'Subscriber name fields exceed character limits.',
  );
  assert.equal(
    validateHubSpotSubscriberInput({ email: 'person@example.com' }),
    null,
  );
});

test('HubSpot subscriber safe sync reports missing configuration without throwing', async () => {
  let logCount = 0;
  const result = await syncHubSpotSubscriberSafely(
    { email: 'person@example.com' },
    {
      env: {} as NodeJS.ProcessEnv,
      logError: () => {
        logCount += 1;
      },
    },
  );

  assert.deepEqual(result, {
    status: 'error',
    error: 'HubSpot subscriber sync is not configured.',
  });
  assert.equal(logCount, 1);
});

test('HubSpot subscriber sync creates email-only coupon contacts without placeholder names', async () => {
  const fetchStub = createHubSpotFetchStub([
    { body: { results: [] } },
    { body: { id: '202' } },
    { body: { results: [] } },
    { body: { id: '902' } },
    { body: {} },
  ]);

  const result = await syncHubSpotSubscriber(
    { email: ' Coupon.Student@Example.COM ' },
    {
      env: createHubSpotEnv(),
      fetch: fetchStub.fetchFn,
      now: () => new Date('2026-05-26T12:00:00.000Z'),
    },
  );

  assert.deepEqual(result, {
    contactId: '202',
    wasExistingContact: false,
    noteBody: HUBSPOT_FIRST_ENTRY_NOTE,
    noteCreated: true,
  });

  const [searchRequest, createRequest, notesAssociationRequest, noteRequest, associationRequest] =
    fetchStub.requests;

  assert.equal(searchRequest.method, 'POST');
  assert.equal(searchRequest.authorization, 'Bearer service-token');
  const searchBody = searchRequest.body as {
    filterGroups: Array<{ filters: Array<{ value: string }> }>;
  };
  assert.equal(searchBody.filterGroups[0].filters[0].value, 'coupon.student@example.com');

  assert.equal(createRequest.method, 'POST');
  assert.ok(createRequest.url.endsWith('/crm/v3/objects/contacts'));
  const createBody = createRequest.body as { properties: Record<string, string> };
  assert.equal(createBody.properties.email, 'coupon.student@example.com');
  assert.equal(createBody.properties.gender, 'Male');
  assert.equal(createBody.properties.lifecyclestage, 'subscriber');
  assert.equal(createBody.properties.hubspot_owner_id, '51639144');
  assert.equal('firstname' in createBody.properties, false);
  assert.equal('lastname' in createBody.properties, false);

  assert.equal(notesAssociationRequest.method, 'GET');
  assert.ok(
    notesAssociationRequest.url.endsWith('/crm/v4/objects/contact/202/associations/notes?limit=100'),
  );

  assert.equal(noteRequest.method, 'POST');
  const noteBody = noteRequest.body as { properties: Record<string, string> };
  assert.equal(noteBody.properties.hs_note_body, HUBSPOT_FIRST_ENTRY_NOTE);
  assert.equal(noteBody.properties.hs_timestamp, '2026-05-26T12:00:00.000Z');

  assert.equal(associationRequest.method, 'PUT');
  assert.ok(
    associationRequest.url.endsWith('/crm/v3/objects/notes/902/associations/contact/202/202'),
  );
});

test('HubSpot subscriber sync updates contact opt-ins with supplied names', async () => {
  const fetchStub = createHubSpotFetchStub([
    { body: { results: [{ id: '101' }] } },
    { body: { id: '101' } },
    { body: { results: [] } },
    { body: { id: '901' } },
    { body: {} },
  ]);

  const result = await syncHubSpotSubscriber(
    {
      email: 'person@example.com',
      firstName: 'Michael',
      lastName: 'Zick',
    },
    {
      env: createHubSpotEnv(),
      fetch: fetchStub.fetchFn,
      now: () => new Date('2026-05-26T12:00:00.000Z'),
    },
  );

  assert.deepEqual(result, {
    contactId: '101',
    wasExistingContact: true,
    noteBody: HUBSPOT_EXISTING_ENTRY_NOTE,
    noteCreated: true,
  });

  const updateRequest = fetchStub.requests[1];
  assert.equal(updateRequest.method, 'PATCH');
  assert.ok(updateRequest.url.endsWith('/crm/v3/objects/contacts/101'));
  const updateBody = updateRequest.body as { properties: Record<string, string> };
  assert.equal(updateBody.properties.firstname, 'Michael');
  assert.equal(updateBody.properties.lastname, 'Zick');
  assert.equal(updateBody.properties.gender, 'Male');
  assert.equal(updateBody.properties.lifecyclestage, 'subscriber');

  const noteRequest = fetchStub.requests[3];
  const noteBody = noteRequest.body as { properties: Record<string, string> };
  assert.equal(noteBody.properties.hs_note_body, HUBSPOT_EXISTING_ENTRY_NOTE);
});

test('HubSpot subscriber sync retries create conflicts as existing contacts', async () => {
  const fetchStub = createHubSpotFetchStub([
    { body: { results: [] } },
    { status: 409, body: { message: 'Contact already exists' } },
    { body: { results: [{ id: '303' }] } },
    { body: { id: '303' } },
    { body: { results: [] } },
    { body: { id: '903' } },
    { body: {} },
  ]);

  const result = await syncHubSpotSubscriber(
    { email: 'person@example.com' },
    {
      env: createHubSpotEnv(),
      fetch: fetchStub.fetchFn,
      now: () => new Date('2026-05-26T12:00:00.000Z'),
    },
  );

  assert.deepEqual(result, {
    contactId: '303',
    wasExistingContact: true,
    noteBody: HUBSPOT_EXISTING_ENTRY_NOTE,
    noteCreated: true,
  });
  assert.equal(fetchStub.requests[3].method, 'PATCH');
  assert.ok(fetchStub.requests[3].url.endsWith('/crm/v3/objects/contacts/303'));
});

test('HubSpot subscriber sync skips duplicate michaelzick.com entry notes', async () => {
  const fetchStub = createHubSpotFetchStub([
    { body: { results: [{ id: '404' }] } },
    { body: { id: '404' } },
    { body: { results: [{ toObjectId: '904' }] } },
    {
      body: {
        results: [
          {
            id: '904',
            properties: {
              hs_note_body: HUBSPOT_FIRST_ENTRY_NOTE,
            },
          },
        ],
      },
    },
  ]);

  const result = await syncHubSpotSubscriber(
    { email: 'person@example.com' },
    {
      env: createHubSpotEnv(),
      fetch: fetchStub.fetchFn,
      now: () => new Date('2026-05-26T12:00:00.000Z'),
    },
  );

  assert.deepEqual(result, {
    contactId: '404',
    wasExistingContact: true,
    noteBody: HUBSPOT_EXISTING_ENTRY_NOTE,
    noteCreated: false,
  });
  assert.equal(fetchStub.requests.length, 4);
  assert.equal(fetchStub.requests[3].method, 'POST');
  assert.ok(fetchStub.requests[3].url.endsWith('/crm/v3/objects/notes/batch/read'));
});

test('HubSpot subscriber sync returns sanitized dependency errors', async () => {
  const fetchStub = createHubSpotFetchStub([
    { status: 500, body: { message: 'token service-token exploded' } },
  ]);

  await assert.rejects(
    syncHubSpotSubscriber(
      { email: 'person@example.com' },
      {
        env: createHubSpotEnv(),
        fetch: fetchStub.fetchFn,
        now: () => new Date('2026-05-26T12:00:00.000Z'),
      },
    ),
    (error) => {
      assert.ok(error instanceof HubSpotSubscriberSyncError);
      assert.equal(error.status, 502);
      assert.equal(error.message, 'Unable to sync HubSpot subscriber.');
      assert.equal(error.message.includes('service-token'), false);
      return true;
    },
  );
});

test('getServerOpenAIClient only initializes when OPENAI_API_KEY is present', () => {
  assert.equal(getServerOpenAIClient({ OPENAI_API_KEY: '' } as unknown as NodeJS.ProcessEnv), null);

  const client = getServerOpenAIClient({
    OPENAI_API_KEY: 'test-key',
  } as unknown as NodeJS.ProcessEnv);

  assert.ok(client);
});
