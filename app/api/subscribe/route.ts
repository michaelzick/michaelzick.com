import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, email, source } = body;

    // Rate limiting by IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'anonymous';
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
      userLimit.count = 0;
      userLimit.lastReset = now;
    }

    if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in an hour.' },
        { status: 429 },
      );
    }

    userLimit.count++;
    rateLimitMap.set(ip, userLimit);

    // Input validation
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 },
      );
    }

    const trimmedName = (firstName || '').trim();
    if (!trimmedName) {
      return NextResponse.json(
        { success: false, error: 'First name is required.' },
        { status: 400 },
      );
    }

    if (trimmedName.length > 50 || email.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Input exceeds character limits.' },
        { status: 400 },
      );
    }

    const password = process.env['BREVO_SMTP_PASSWORD'];
    const userName = process.env['BREVO_USER'];
    const toAddress = process.env['BREVO_TO'];
    const fromAddress = process.env['BREVO_FROM'];

    if (!password || !userName || !toAddress || !fromAddress) {
      console.error('Brevo SMTP configuration is incomplete');
      return NextResponse.json(
        { success: false, error: 'Email service not configured.' },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: { user: userName, pass: password },
    });

    const sourceLabel = source === 'exit-modal' ? 'Exit-Intent Modal' : 'Inline Workbook Section';

    await transporter.sendMail({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: `[michaelzick.com] Workbook Request — ${trimmedName}`,
      text: [
        `New Workbook Download Request`,
        ``,
        `Name: ${trimmedName}`,
        `Email: ${email}`,
        `Source: ${sourceLabel}`,
        ``,
        `This person wants the Belief Reprogramming Workbook.`,
      ].join('\n'),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to process workbook subscription', err);
    return NextResponse.json(
      { success: false, error: 'Failed to send. Please try again.' },
      { status: 500 },
    );
  }
}
