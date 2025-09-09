import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { firstName, lastName, email, subject, message } = await req.json();
  console.log('Contact form submission', {
    firstName,
    lastName,
    email,
    subject,
    messageLength: message?.length,
  });

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: '96ae20001@smtp-brevo.com',
      pass: process.env.BREVO_SMTP_PASSWORD,
    },
  });

  try {
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
