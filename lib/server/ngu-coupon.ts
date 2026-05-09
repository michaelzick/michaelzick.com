export const NGU_COUPON_CODE = 'NEW-NG-10';
export const NGU_SIGNUP_SOURCE = 'Nice Guy University signup modal';
export const NGU_COUPON_RATE_LIMIT_WINDOW = 60 * 60 * 1000;
export const NGU_COUPON_RATE_LIMIT_MAX_REQUESTS = 5;

export type NguCouponSubmission = {
  email?: string;
  captchaToken?: string;
};

export type NguCouponConfig = {
  password: string;
  userName: string;
  toAddress: string;
  fromAddress: string;
  recaptchaSecretKey: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeNguCouponSubmission(body: Record<string, unknown>): NguCouponSubmission {
  return {
    email: typeof body.email === 'string' ? body.email.trim() : undefined,
    captchaToken: typeof body.captchaToken === 'string' ? body.captchaToken.trim() : undefined,
  };
}

export function validateNguCouponSubmission(submission: NguCouponSubmission) {
  if (!submission.email) {
    return 'Email is required';
  }

  if (submission.email.length > 100 || !EMAIL_PATTERN.test(submission.email)) {
    return 'Enter a valid email address';
  }

  if (!submission.captchaToken) {
    return 'Captcha token missing';
  }

  return null;
}

export function getNguCouponConfig(env = process.env): NguCouponConfig | null {
  const password = env['BREVO_SMTP_PASSWORD'];
  const userName = env['BREVO_USER'];
  const toAddress = env['BREVO_TO'];
  const fromAddress = env['BREVO_FROM'];
  const recaptchaSecretKey = env['RECAPTCHA_SECRET_KEY_V2'];

  const missing = Object.entries({
    BREVO_SMTP_PASSWORD: password,
    BREVO_USER: userName,
    BREVO_TO: toAddress,
    BREVO_FROM: fromAddress,
    RECAPTCHA_SECRET_KEY_V2: recaptchaSecretKey,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    console.error('NGU coupon config missing env vars:', missing.join(', '));
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

export function isValidNguRecaptchaResponse(response: {
  success?: boolean;
  'error-codes'?: string[];
}) {
  return {
    valid: response.success === true,
    errorCodes: response['error-codes'],
  };
}

export function buildNguCouponVisitorEmail(email: string) {
  return {
    subject: 'Your Nice Guy University 10% off coupon',
    text: [
      'Thanks for signing up for Nice Guy University updates.',
      '',
      `This email was sent because ${email} requested the offer through the ${NGU_SIGNUP_SOURCE}.`,
      '',
      `Use coupon code ${NGU_COUPON_CODE} for 10% off your Nice Guy University course purchase.`,
      '',
      'You were added to Michael Zick’s email list. You can opt out any time, and your email will never be sold to a third party.',
      '',
      'Start here: https://www.niceguyuniversity.com',
    ].join('\n'),
  };
}

export function buildNguCouponNotificationEmail(email: string) {
  return {
    subject: '[michaelzick.com] New NGU signup modal coupon request',
    text: [
      `Email: ${email}`,
      `Source: ${NGU_SIGNUP_SOURCE}`,
      `Coupon sent: ${NGU_COUPON_CODE}`,
      '',
      'Consent: Visitor submitted their email through the Nice Guy University signup modal and agreed to join the email list.',
    ].join('\n'),
  };
}
