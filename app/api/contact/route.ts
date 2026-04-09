import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Ensure the route runs in a Node.js environment so Node APIs like
// nodemailer are available.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Simple in-memory rate limiting (per instance)
const rateLimitMap = new Map<string, { count: number; lastReset: number; }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, subject, message, captchaToken, workbookOptIn } = body;
    const workbookConsent = typeof workbookOptIn === 'boolean' ? workbookOptIn : false;

    // 1. Rate limiting by IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'anonymous';
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
      userLimit.count = 0;
      userLimit.lastReset = now;
    }

    if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again in an hour.' }, { status: 429 });
    }

    userLimit.count++;
    rateLimitMap.set(ip, userLimit);

    // 2. Input Validation
    if (!email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields (Email and Message)' }, { status: 400 });
    }

    if (
      (firstName && firstName.length > 50) ||
      (lastName && lastName.length > 50) ||
      email.length > 100 ||
      (subject && subject.length > 200) ||
      message.length > 5000
    ) {
      return NextResponse.json({ success: false, error: 'Input exceeds character limits' }, { status: 400 });
    }

    console.log('Contact form submission', {
      firstName: firstName || '(not provided)',
      lastName: lastName || '(not provided)',
      email,
      subject: subject || '(no subject)',
      messageLength: message?.length,
      workbookOptIn: workbookConsent,
    });

    if (!captchaToken) {
      return NextResponse.json(
        { success: false, error: 'Captcha token missing' },
        { status: 400 },
      );
    }

    // Lookup the SMTP password at runtime so builds without the
    // environment variable don't bake in an empty value.
    const password = process.env['BREVO_SMTP_PASSWORD'];
    const userName = process.env['BREVO_USER'];
    const toAddress = process.env['BREVO_TO'];
    const fromAddress = process.env['BREVO_FROM'];
    const recaptchaProjectId = process.env['RECAPTCHA_PROJECT_ID'];
    const recaptchaApiKey = process.env['GOOGLE_API_KEY'];
    const recaptchaSiteKey = process.env['NEXT_PUBLIC_RECAPTCHA_SITE_KEY'];

    if (!password) {
      console.error('BREVO_SMTP_PASSWORD is not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 },
      );
    }

    if (!userName || !toAddress || !fromAddress) {
      console.error('Brevo SMTP configuration is incomplete', {
        userName: Boolean(userName),
        toAddress: Boolean(toAddress),
        fromAddress: Boolean(fromAddress),
      });
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 },
      );
    }

    if (!recaptchaProjectId || !recaptchaApiKey || !recaptchaSiteKey) {
      console.error('reCAPTCHA Enterprise configuration is incomplete', {
        projectId: Boolean(recaptchaProjectId),
        apiKey: Boolean(recaptchaApiKey),
        siteKey: Boolean(recaptchaSiteKey),
      });
      return NextResponse.json(
        { success: false, error: 'Captcha service not configured' },
        { status: 500 },
      );
    }

    const assessmentUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${recaptchaProjectId}/assessments?key=${recaptchaApiKey}`;

    const captchaResponse = await fetch(assessmentUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: {
          token: captchaToken,
          siteKey: recaptchaSiteKey,
          expectedAction: 'contact_form',
        },
      }),
    });

    if (!captchaResponse.ok) {
      console.error('reCAPTCHA Enterprise assessment request failed', captchaResponse.status);
      return NextResponse.json(
        { success: false, error: 'Captcha verification failed' },
        { status: 400 },
      );
    }

    const assessment = await captchaResponse.json();

    if (!assessment.tokenProperties?.valid) {
      console.error('reCAPTCHA token invalid', {
        invalidReason: assessment.tokenProperties?.invalidReason,
      });
      return NextResponse.json(
        { success: false, error: 'Captcha verification failed' },
        { status: 400 },
      );
    }

    if (assessment.tokenProperties?.action !== 'contact_form') {
      console.error('reCAPTCHA action mismatch', {
        expected: 'contact_form',
        actual: assessment.tokenProperties?.action,
      });
      return NextResponse.json(
        { success: false, error: 'Captcha verification failed' },
        { status: 400 },
      );
    }

    const score = assessment.riskAnalysis?.score ?? 0;
    if (score < 0.5) {
      console.warn('reCAPTCHA score below threshold', { score });
      return NextResponse.json(
        { success: false, error: 'Captcha verification failed' },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: userName,
        pass: password,
      },
    });

    const emailSubject = subject || '(No Subject)';
    const prefixedSubject = `[michaelzick.com] ${emailSubject}`;

    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Anonymous User';

    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: prefixedSubject,
      text: [
        `From: ${fullName}`,
        `Email: ${email}`,
        `Subject: ${emailSubject}`,
        `Workbook + Email List Consent: ${workbookConsent ? 'Yes' : 'No'}`,
        '',
        message,
      ].join('\n'),
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
