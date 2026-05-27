import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { RECAPTCHA_SITE_VERIFY_URL } from '../../../lib/recaptcha';
import { syncHubSpotSubscriberSafely } from '../../../lib/server/hubspot-subscriber';
import { consumeRateLimit, getClientIp } from '../../../lib/server/rate-limit';
import {
  buildNguCouponNotificationEmail,
  buildNguCouponVisitorEmail,
  getNguCouponConfig,
  isValidNguRecaptchaResponse,
  NGU_COUPON_RATE_LIMIT_MAX_REQUESTS,
  NGU_COUPON_RATE_LIMIT_WINDOW,
  normalizeNguCouponSubmission,
  validateNguCouponSubmission,
} from '../../../lib/server/ngu-coupon';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rateLimitMap = new Map<string, { count: number; lastReset: number; }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const submission = normalizeNguCouponSubmission(body);

    const rateLimit = consumeRateLimit({
      key: getClientIp(req.headers),
      store: rateLimitMap,
      windowMs: NGU_COUPON_RATE_LIMIT_WINDOW,
      maxRequests: NGU_COUPON_RATE_LIMIT_MAX_REQUESTS,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in an hour.' },
        { status: 429 },
      );
    }

    const validationError = validateNguCouponSubmission(submission);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }

    const config = getNguCouponConfig();
    if (!config) {
      console.error('NGU coupon service configuration is incomplete');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 },
      );
    }

    const captchaResponse = await fetch(RECAPTCHA_SITE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: config.recaptchaSecretKey,
        response: submission.captchaToken!,
      }),
    });

    if (!captchaResponse.ok) {
      console.error('NGU reCAPTCHA siteverify request failed', captchaResponse.status);
      return NextResponse.json(
        { success: false, error: `Captcha verification request failed (${captchaResponse.status})` },
        { status: 400 },
      );
    }

    const verification = await captchaResponse.json();
    const captchaValidation = isValidNguRecaptchaResponse(verification);

    if (!captchaValidation.valid) {
      console.error('NGU reCAPTCHA token invalid', {
        errorCodes: captchaValidation.errorCodes,
      });
      return NextResponse.json(
        { success: false, error: `Captcha verification failed: ${captchaValidation.errorCodes?.join(', ') || 'invalid token'}` },
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

    const visitorEmail = buildNguCouponVisitorEmail(submission.email!);
    const notificationEmail = buildNguCouponNotificationEmail(submission.email!);

    await transporter.sendMail({
      from: config.fromAddress,
      to: submission.email,
      subject: visitorEmail.subject,
      text: visitorEmail.text,
    });

    await transporter.sendMail({
      from: config.fromAddress,
      to: config.toAddress,
      replyTo: submission.email,
      subject: notificationEmail.subject,
      text: notificationEmail.text,
    });

    await syncHubSpotSubscriberSafely({ email: submission.email });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to send NGU coupon email', err);
    return NextResponse.json(
      { success: false, error: 'Failed to send coupon email' },
      { status: 500 },
    );
  }
}
