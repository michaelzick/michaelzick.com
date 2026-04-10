import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  buildContactEmailText,
  buildRecaptchaAssessmentUrl,
  CONTACT_RATE_LIMIT_MAX_REQUESTS,
  CONTACT_RATE_LIMIT_WINDOW,
  getContactConfig,
  isValidRecaptchaAssessment,
  normalizeContactSubmission,
  validateContactSubmission,
} from '../../../lib/server/contact';
import { consumeRateLimit, getClientIp } from '../../../lib/server/rate-limit';

// Ensure the route runs in a Node.js environment so Node APIs like
// nodemailer are available.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Simple in-memory rate limiting (per instance)
const rateLimitMap = new Map<string, { count: number; lastReset: number; }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const submission = normalizeContactSubmission(body);

    const rateLimit = consumeRateLimit({
      key: getClientIp(req.headers),
      store: rateLimitMap,
      windowMs: CONTACT_RATE_LIMIT_WINDOW,
      maxRequests: CONTACT_RATE_LIMIT_MAX_REQUESTS,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in an hour.' },
        { status: 429 },
      );
    }

    const validationError = validateContactSubmission(submission);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }

    console.log('Contact form submission', {
      firstName: submission.firstName || '(not provided)',
      lastName: submission.lastName || '(not provided)',
      email: submission.email,
      subject: submission.subject || '(no subject)',
      messageLength: submission.message?.length,
      workbookOptIn: submission.workbookOptIn,
    });

    const config = getContactConfig();
    if (!config) {
      console.error('Contact service configuration is incomplete');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 },
      );
    }

    const captchaResponse = await fetch(buildRecaptchaAssessmentUrl(config), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: {
          token: submission.captchaToken,
          siteKey: config.recaptchaSiteKey,
          expectedAction: 'contact_form',
        },
      }),
    });

    if (!captchaResponse.ok) {
      const captchaBody = await captchaResponse.text().catch(() => '');
      console.error('reCAPTCHA Enterprise assessment request failed', captchaResponse.status, captchaBody);
      return NextResponse.json(
        { success: false, error: `Captcha assessment request failed (${captchaResponse.status})` },
        { status: 400 },
      );
    }

    const assessment = await captchaResponse.json();
    const captchaValidation = isValidRecaptchaAssessment(assessment);

    if (!captchaValidation.valid) {
      console.error('reCAPTCHA token invalid', {
        invalidReason: captchaValidation.invalidReason,
        action: captchaValidation.action,
        score: captchaValidation.score,
      });
      return NextResponse.json(
        { success: false, error: `Captcha token invalid: ${captchaValidation.invalidReason || 'low score'} (score: ${captchaValidation.score})` },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: config.userName,
        pass: config.password,
      },
    });

    const email = buildContactEmailText(submission);

    await transporter.sendMail({
      from: config.fromAddress,
      to: config.toAddress,
      replyTo: submission.email,
      subject: email.subject,
      text: email.text,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to send contact email', err);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 },
    );
  }
}
