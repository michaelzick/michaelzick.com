export const HUBSPOT_FIRST_ENTRY_NOTE = 'First entry: michaelzick.com';
export const HUBSPOT_EXISTING_ENTRY_NOTE = 'Existing entry: michaelzick.com';

export type HubSpotSubscriberInput = {
  email?: string;
  firstName?: string;
  lastName?: string;
};

export type HubSpotSubscriberConfig = {
  accessToken: string;
  ownerId: string;
};

export type HubSpotSubscriberNoteBody =
  | typeof HUBSPOT_FIRST_ENTRY_NOTE
  | typeof HUBSPOT_EXISTING_ENTRY_NOTE;

export type HubSpotSubscriberSyncResult = {
  contactId: string;
  wasExistingContact: boolean;
  noteBody: HubSpotSubscriberNoteBody;
  noteCreated: boolean;
};

export type HubSpotSubscriberSyncStatus =
  | ({ status: 'synced' } & HubSpotSubscriberSyncResult)
  | { status: 'error'; error: string };

type ValidatedHubSpotSubscriberInput = {
  email: string;
  firstName?: string;
  lastName?: string;
};

type HubSpotSubscriberSyncOptions = {
  env?: NodeJS.ProcessEnv;
  fetch?: typeof fetch;
  now?: () => Date;
};

type SafeHubSpotSubscriberSyncOptions = HubSpotSubscriberSyncOptions & {
  logError?: (message: string, error: unknown) => void;
};

type HubSpotSearchResponse = {
  results?: Array<{ id?: string | number }>;
};

type HubSpotObjectResponse = {
  id?: string | number;
};

type HubSpotAssociationsResponse = {
  results?: Array<{ toObjectId?: string | number }>;
  paging?: {
    next?: {
      after?: string | number;
    };
  };
};

type HubSpotNotesBatchReadResponse = {
  results?: Array<{
    id?: string | number;
    properties?: {
      hs_note_body?: string | null;
    } | null;
  }>;
};

type HubSpotContactProperties = {
  email: string;
  firstname?: string;
  lastname?: string;
  gender: 'Male';
  lifecyclestage: 'subscriber';
  hubspot_owner_id: string;
};

const HUBSPOT_API_BASE_URL = 'https://api.hubapi.com';
const HUBSPOT_SYNC_ERROR_MESSAGE = 'Unable to sync HubSpot subscriber.';
const HUBSPOT_ASSOCIATIONS_PAGE_LIMIT = 100;
const HUBSPOT_BATCH_READ_LIMIT = 100;
const NOTE_TO_CONTACT_ASSOCIATION_TYPE_ID = 202;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MICHAELZICK_ENTRY_NOTE_BODIES = new Set<HubSpotSubscriberNoteBody>([
  HUBSPOT_FIRST_ENTRY_NOTE,
  HUBSPOT_EXISTING_ENTRY_NOTE,
]);

export class HubSpotSubscriberSyncError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HubSpotSubscriberSyncError';
    this.status = status;
  }
}

class HubSpotApiError extends Error {
  apiStatus: number;

  constructor(apiStatus: number) {
    super(HUBSPOT_SYNC_ERROR_MESSAGE);
    this.name = 'HubSpotApiError';
    this.apiStatus = apiStatus;
  }
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeOptionalName(value: string | undefined) {
  const normalized = value?.trim();
  return normalized || undefined;
}

function isMichaelZickEntryNoteBody(value: unknown): value is HubSpotSubscriberNoteBody {
  return typeof value === 'string'
    && MICHAELZICK_ENTRY_NOTE_BODIES.has(value as HubSpotSubscriberNoteBody);
}

function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}

function chunkValues<T>(values: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function getHubSpotAccessToken(env: NodeJS.ProcessEnv) {
  return env['HUBSPOT_SERVICE_KEY']?.trim()
    || env['HUBSPOT_ACCESS_TOKEN']?.trim()
    || env['HUBSPOT_PRIVATE_APP_TOKEN']?.trim();
}

function getHubSpotErrorMessage(error: unknown) {
  if (error instanceof HubSpotSubscriberSyncError) return error.message;
  return HUBSPOT_SYNC_ERROR_MESSAGE;
}

export function normalizeHubSpotSubscriberInput(
  input: HubSpotSubscriberInput,
): HubSpotSubscriberInput {
  return {
    email: typeof input.email === 'string' ? normalizeEmail(input.email) : undefined,
    firstName: normalizeOptionalName(input.firstName),
    lastName: normalizeOptionalName(input.lastName),
  };
}

export function validateHubSpotSubscriberInput(input: HubSpotSubscriberInput) {
  if (!input.email) {
    return 'Subscriber email is required.';
  }

  if (input.email.length > 100 || !isValidEmail(input.email)) {
    return 'Subscriber email must be valid.';
  }

  if (
    (input.firstName && input.firstName.length > 50)
    || (input.lastName && input.lastName.length > 50)
  ) {
    return 'Subscriber name fields exceed character limits.';
  }

  return null;
}

export function getHubSpotSubscriberConfig(
  env: NodeJS.ProcessEnv = process.env,
): HubSpotSubscriberConfig | null {
  const accessToken = getHubSpotAccessToken(env);
  const ownerId = env['HUBSPOT_CONTACT_OWNER_ID']?.trim();

  if (!accessToken || !ownerId) {
    return null;
  }

  return { accessToken, ownerId };
}

async function parseHubSpotResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new HubSpotApiError(response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  return text ? JSON.parse(text) as T : {} as T;
}

async function hubSpotRequest<T>(
  fetchFn: typeof fetch,
  token: string,
  path: string,
  init: RequestInit,
) {
  const response = await fetchFn(`${HUBSPOT_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return await parseHubSpotResponse<T>(response);
}

async function findContactIdByEmail(
  fetchFn: typeof fetch,
  token: string,
  email: string,
) {
  const response = await hubSpotRequest<HubSpotSearchResponse>(
    fetchFn,
    token,
    '/crm/v3/objects/contacts/search',
    {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              },
            ],
          },
        ],
        properties: ['email'],
        limit: 1,
      }),
    },
  );

  const id = response.results?.[0]?.id;
  return id === undefined ? null : String(id);
}

async function updateContact(
  fetchFn: typeof fetch,
  token: string,
  contactId: string,
  properties: HubSpotContactProperties,
) {
  await hubSpotRequest<HubSpotObjectResponse>(
    fetchFn,
    token,
    `/crm/v3/objects/contacts/${encodeURIComponent(contactId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    },
  );
}

async function createContact(
  fetchFn: typeof fetch,
  token: string,
  properties: HubSpotContactProperties,
) {
  const response = await hubSpotRequest<HubSpotObjectResponse>(
    fetchFn,
    token,
    '/crm/v3/objects/contacts',
    {
      method: 'POST',
      body: JSON.stringify({ properties }),
    },
  );

  if (response.id === undefined) {
    throw new HubSpotApiError(502);
  }

  return String(response.id);
}

async function upsertContact(
  fetchFn: typeof fetch,
  token: string,
  properties: HubSpotContactProperties,
) {
  const existingContactId = await findContactIdByEmail(fetchFn, token, properties.email);
  if (existingContactId) {
    await updateContact(fetchFn, token, existingContactId, properties);
    return { contactId: existingContactId, wasExistingContact: true };
  }

  try {
    const contactId = await createContact(fetchFn, token, properties);
    return { contactId, wasExistingContact: false };
  } catch (error) {
    if (!(error instanceof HubSpotApiError) || error.apiStatus !== 409) {
      throw error;
    }

    const retriedContactId = await findContactIdByEmail(fetchFn, token, properties.email);
    if (!retriedContactId) {
      throw error;
    }

    await updateContact(fetchFn, token, retriedContactId, properties);
    return { contactId: retriedContactId, wasExistingContact: true };
  }
}

async function getAssociatedNoteIds(
  fetchFn: typeof fetch,
  token: string,
  contactId: string,
) {
  const noteIds: string[] = [];
  let after: string | null = null;

  do {
    const searchParams = new URLSearchParams({
      limit: String(HUBSPOT_ASSOCIATIONS_PAGE_LIMIT),
    });
    if (after) {
      searchParams.set('after', after);
    }

    const response = await hubSpotRequest<HubSpotAssociationsResponse>(
      fetchFn,
      token,
      `/crm/v4/objects/contact/${encodeURIComponent(contactId)}/associations/notes?${searchParams.toString()}`,
      { method: 'GET' },
    );

    for (const result of response.results ?? []) {
      if (result.toObjectId !== undefined) {
        noteIds.push(String(result.toObjectId));
      }
    }

    after = response.paging?.next?.after === undefined
      ? null
      : String(response.paging.next.after);
  } while (after);

  return noteIds;
}

async function readNotesById(
  fetchFn: typeof fetch,
  token: string,
  noteIds: string[],
) {
  const response = await hubSpotRequest<HubSpotNotesBatchReadResponse>(
    fetchFn,
    token,
    '/crm/v3/objects/notes/batch/read',
    {
      method: 'POST',
      body: JSON.stringify({
        inputs: noteIds.map((id) => ({ id })),
        properties: ['hs_note_body'],
      }),
    },
  );

  return response.results ?? [];
}

async function hasMichaelZickEntryNote(
  fetchFn: typeof fetch,
  token: string,
  contactId: string,
) {
  const noteIds = await getAssociatedNoteIds(fetchFn, token, contactId);
  if (noteIds.length === 0) return false;

  for (const noteIdChunk of chunkValues(noteIds, HUBSPOT_BATCH_READ_LIMIT)) {
    const notes = await readNotesById(fetchFn, token, noteIdChunk);
    const matchingNote = notes.find((note) => (
      isMichaelZickEntryNoteBody(note.properties?.hs_note_body)
    ));
    if (matchingNote) return true;
  }

  return false;
}

async function createContactNote(
  fetchFn: typeof fetch,
  token: string,
  ownerId: string,
  contactId: string,
  noteBody: HubSpotSubscriberNoteBody,
  now: () => Date,
) {
  const note = await hubSpotRequest<HubSpotObjectResponse>(
    fetchFn,
    token,
    '/crm/v3/objects/notes',
    {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          hs_note_body: noteBody,
          hs_timestamp: now().toISOString(),
          hubspot_owner_id: ownerId,
        },
      }),
    },
  );

  if (note.id === undefined) {
    throw new HubSpotApiError(502);
  }

  await hubSpotRequest<Record<string, unknown>>(
    fetchFn,
    token,
    `/crm/v3/objects/notes/${encodeURIComponent(String(note.id))}/associations/contact/${encodeURIComponent(contactId)}/${NOTE_TO_CONTACT_ASSOCIATION_TYPE_ID}`,
    { method: 'PUT' },
  );
}

export async function syncHubSpotSubscriber(
  input: HubSpotSubscriberInput,
  options: HubSpotSubscriberSyncOptions = {},
): Promise<HubSpotSubscriberSyncResult> {
  const normalized = normalizeHubSpotSubscriberInput(input);
  const validationError = validateHubSpotSubscriberInput(normalized);
  if (validationError) {
    throw new HubSpotSubscriberSyncError(400, validationError);
  }

  const env = options.env ?? process.env;
  const config = getHubSpotSubscriberConfig(env);
  if (!config) {
    throw new HubSpotSubscriberSyncError(500, 'HubSpot subscriber sync is not configured.');
  }

  const validatedInput = normalized as ValidatedHubSpotSubscriberInput;
  const fetchFn = options.fetch ?? fetch;
  const now = options.now ?? (() => new Date());
  const properties: HubSpotContactProperties = {
    email: validatedInput.email,
    gender: 'Male',
    lifecyclestage: 'subscriber',
    hubspot_owner_id: config.ownerId,
  };

  if (validatedInput.firstName) {
    properties.firstname = validatedInput.firstName;
  }
  if (validatedInput.lastName) {
    properties.lastname = validatedInput.lastName;
  }

  try {
    const { contactId, wasExistingContact } = await upsertContact(
      fetchFn,
      config.accessToken,
      properties,
    );
    const noteBody = wasExistingContact
      ? HUBSPOT_EXISTING_ENTRY_NOTE
      : HUBSPOT_FIRST_ENTRY_NOTE;
    const alreadyHasEntryNote = await hasMichaelZickEntryNote(
      fetchFn,
      config.accessToken,
      contactId,
    );
    let noteCreated = false;

    if (!alreadyHasEntryNote) {
      await createContactNote(fetchFn, config.accessToken, config.ownerId, contactId, noteBody, now);
      noteCreated = true;
    }

    return {
      contactId,
      wasExistingContact,
      noteBody,
      noteCreated,
    };
  } catch (error) {
    if (error instanceof HubSpotSubscriberSyncError) {
      throw error;
    }

    throw new HubSpotSubscriberSyncError(502, HUBSPOT_SYNC_ERROR_MESSAGE);
  }
}

export async function syncHubSpotSubscriberSafely(
  input: HubSpotSubscriberInput,
  options: SafeHubSpotSubscriberSyncOptions = {},
): Promise<HubSpotSubscriberSyncStatus> {
  try {
    const result = await syncHubSpotSubscriber(input, options);
    return { status: 'synced', ...result };
  } catch (error) {
    const logError = options.logError ?? console.error;
    logError('[michaelzick.com] failed to sync HubSpot subscriber', error);
    return { status: 'error', error: getHubSpotErrorMessage(error) };
  }
}
