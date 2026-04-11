import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  buildContactEmailText,
  CONTACT_RATE_LIMIT_MAX_REQUESTS,
  CONTACT_RATE_LIMIT_WINDOW,
  getContactConfig,
  isValidRecaptchaResponse,
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

    const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: config.recaptchaSecretKey,
        response: submission.captchaToken!,
      }),
    });

    if (!captchaResponse.ok) {
      console.error('reCAPTCHA siteverify request failed', captchaResponse.status);
      return NextResponse.json(
        { success: false, error: `Captcha verification request failed (${captchaResponse.status})` },
        { status: 400 },
      );
    }

    const verification = await captchaResponse.json();
    const captchaValidation = isValidRecaptchaResponse(verification);

    if (!captchaValidation.valid) {
      console.error('reCAPTCHA token invalid', {
        errorCodes: captchaValidation.errorCodes,
        action: captchaValidation.action,
        score: captchaValidation.score,
      });
      return NextResponse.json(
        { success: false, error: `Captcha verification failed: ${captchaValidation.errorCodes?.join(', ') || 'low score'} (score: ${captchaValidation.score})` },
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
