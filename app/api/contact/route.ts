import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Ensure the route runs in a Node.js environment so Node APIs like
// nodemailer are available.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, subject, message } = await req.json();
    console.log('Contact form submission', {
      firstName,
      lastName,
      email,
      subject,
      messageLength: message?.length,
    });

    // Lookup the SMTP password at runtime so builds without the
    // environment variable don't bake in an empty value.
    const password = process.env['BREVO_SMTP_PASSWORD'];
    if (!password) {
      console.error('BREVO_SMTP_PASSWORD is not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: '96ae20001@smtp-brevo.com',
        pass: password,
      },
    });

    await transporter.sendMail({
      from: '96ae20001@smtp-brevo.com',
      to: '96ae20001@smtp-brevo.com',
      replyTo: email,
      subject,
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
