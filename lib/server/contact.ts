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
  recaptchaProjectId: string;
  recaptchaApiKey: string;
  recaptchaSiteKey: string;
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
  const recaptchaProjectId = env['RECAPTCHA_PROJECT_ID'];
  const recaptchaApiKey = env['GOOGLE_API_KEY'];
  const recaptchaSiteKey = env['NEXT_PUBLIC_RECAPTCHA_SITE_KEY'];

  if (
    !password ||
    !userName ||
    !toAddress ||
    !fromAddress ||
    !recaptchaProjectId ||
    !recaptchaApiKey ||
    !recaptchaSiteKey
  ) {
    return null;
  }

  return {
    password,
    userName,
    toAddress,
    fromAddress,
    recaptchaProjectId,
    recaptchaApiKey,
    recaptchaSiteKey,
  };
}

export function buildRecaptchaAssessmentUrl(config: ContactConfig) {
  return `https://recaptchaenterprise.googleapis.com/v1/projects/${config.recaptchaProjectId}/assessments?key=${config.recaptchaApiKey}`;
}

export function isValidRecaptchaAssessment(
  assessment: {
    tokenProperties?: { valid?: boolean; action?: string; invalidReason?: string; };
    riskAnalysis?: { score?: number; };
  },
  minimumScore = 0.5,
) {
  const isTokenValid = assessment.tokenProperties?.valid;
  const matchesAction = assessment.tokenProperties?.action === 'contact_form';
  const score = assessment.riskAnalysis?.score ?? 0;

  return {
    valid: Boolean(isTokenValid && matchesAction && score >= minimumScore),
    score,
    invalidReason: assessment.tokenProperties?.invalidReason,
    action: assessment.tokenProperties?.action,
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
