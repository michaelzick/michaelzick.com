import { CONTACT_RECAPTCHA_ACTION, RECAPTCHA_MINIMUM_SCORE } from '../recaptcha';

export type ContactSubmission = {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
  captchaToken?: string;
  workbookOptIn?: boolean;
};

export type ContactConfig = {
  password: string;
  userName: string;
  toAddress: string;
  fromAddress: string;
  recaptchaSecretKey: string;
};

export const CONTACT_RATE_LIMIT_WINDOW = 60 * 60 * 1000;
export const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5;

export function normalizeContactSubmission(body: Record<string, unknown>): ContactSubmission {
  return {
    firstName: typeof body.firstName === 'string' ? body.firstName.trim() : undefined,
    lastName: typeof body.lastName === 'string' ? body.lastName.trim() : undefined,
    email: typeof body.email === 'string' ? body.email.trim() : undefined,
    subject: typeof body.subject === 'string' ? body.subject.trim() : undefined,
    message: typeof body.message === 'string' ? body.message.trim() : undefined,
    captchaToken: typeof body.captchaToken === 'string' ? body.captchaToken.trim() : undefined,
    workbookOptIn: body.workbookOptIn === true,
  };
}

export function validateContactSubmission(submission: ContactSubmission) {
  if (!submission.email || !submission.message) {
    return 'Missing required fields (Email and Message)';
  }

  if (
    (submission.firstName && submission.firstName.length > 50) ||
    (submission.lastName && submission.lastName.length > 50) ||
    submission.email.length > 100 ||
    (submission.subject && submission.subject.length > 200) ||
    submission.message.length > 5000
  ) {
    return 'Input exceeds character limits';
  }

  if (!submission.captchaToken) {
    return 'Captcha token missing';
  }

  return null;
}

export function getContactConfig(env = process.env): ContactConfig | null {
  const password = env['BREVO_SMTP_PASSWORD'];
  const userName = env['BREVO_USER'];
  const toAddress = env['BREVO_TO'];
  const fromAddress = env['BREVO_FROM'];
  const recaptchaSecretKey = env['RECAPTCHA_SECRET_KEY'];

  const missing = Object.entries({
    BREVO_SMTP_PASSWORD: password,
    BREVO_USER: userName,
    BREVO_TO: toAddress,
    BREVO_FROM: fromAddress,
    RECAPTCHA_SECRET_KEY: recaptchaSecretKey,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    console.error('Contact config missing env vars:', missing.join(', '));
    return null;
  }

  return {
    password,
    userName,
    toAddress,
    fromAddress,
    recaptchaSecretKey,
  };
}

export function isValidRecaptchaResponse(
  response: {
    success?: boolean;
    score?: number;
    action?: string;
    'error-codes'?: string[];
  },
  minimumScore = RECAPTCHA_MINIMUM_SCORE,
) {
  const score = response.score ?? 0;

  return {
    valid: Boolean(
      response.success
        && response.action === CONTACT_RECAPTCHA_ACTION
        && score >= minimumScore,
    ),
    score,
    action: response.action,
    errorCodes: response['error-codes'],
  };
}

export function buildContactEmailText(submission: ContactSubmission) {
  const fullName =
    [submission.firstName, submission.lastName].filter(Boolean).join(' ') || 'Anonymous User';
  const emailSubject = submission.subject || '(No Subject)';

  return {
    subject: `[michaelzick.com] ${emailSubject}`,
    text: [
      `From: ${fullName}`,
      `Email: ${submission.email}`,
      `Subject: ${emailSubject}`,
      `Workbook + Email List Consent: ${submission.workbookOptIn ? 'Yes' : 'No'}`,
      '',
      submission.message || '',
    ].join('\n'),
  };
}
