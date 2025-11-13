import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Ensure the route runs in a Node.js environment so Node APIs like
// nodemailer are available.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, subject, message, captchaToken } = await req.json();
    console.log('Contact form submission', {
      firstName,
      lastName,
      email,
      subject,
      messageLength: message?.length,
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
    const captchaSecret = process.env['HCAPTCHA_SECRET_KEY'];

    if (!password) {
      console.error('BREVO_SMTP_PASSWORD is not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 },
      );
    }

    if (!captchaSecret) {
      console.error('HCAPTCHA_SECRET_KEY is not configured');
      return NextResponse.json(
        { success: false, error: 'Captcha service not configured' },
        { status: 500 },
      );
    }

    const captchaPayload = new URLSearchParams({
      secret: captchaSecret,
      response: captchaToken,
    });

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.ip ?? undefined;
    if (clientIp) {
      captchaPayload.append('remoteip', clientIp);
    }

    const captchaResponse = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: captchaPayload.toString(),
    });

    if (!captchaResponse.ok) {
      console.error('hCaptcha verification failed to respond', captchaResponse.status);
      return NextResponse.json(
        { success: false, error: 'Captcha verification failed' },
        { status: 400 },
      );
    }

    const captchaResult = await captchaResponse.json();
    if (!captchaResult.success) {
      console.error('hCaptcha verification rejected request', captchaResult['error-codes']);
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

    const prefixedSubject = `[michaelzick.com] ${subject}`;

    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: prefixedSubject,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\n${message}`,
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
