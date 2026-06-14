'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { trackEvent } from '../lib/analytics';
import { loadRecaptchaV2, resetRecaptchaV2Widget } from '../lib/client/recaptcha-v2';
import TrackedCtaLink from './TrackedCtaLink';

const NGU_RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2;

type Status = 'idle' | 'submitting' | 'success' | 'error';

type NguCouponSignupFormProps = {
  intro?: ReactNode;
  formClassName?: string;
  inputClassName?: string;
  submitClassName?: string;
  successClassName?: string;
  successCtaClassName?: string;
  successCtaLocation: string;
  onSuccess?: () => void;
};

function getNguCouponFailureReason(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes('too many requests')) return 'rate_limited';
  if (lower.includes('captcha')) return 'captcha_failed';
  if (lower.includes('not configured')) return 'service_configuration_error';
  if (lower.includes('failed to send coupon email')) return 'email_delivery_failed';
  if (lower.includes('request failed')) return 'request_failed';
  return 'unknown';
}

export default function NguCouponSignupForm({
  intro,
  formClassName = 'space-y-5',
  inputClassName = 'w-full rounded-lg border border-gray-300 bg-white p-4 text-black outline-none transition focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20',
  submitClassName = 'btn !w-full !px-6 !py-4',
  successClassName = 'flex flex-col items-center text-center',
  successCtaClassName = 'btn !mt-5 !px-6 !py-3',
  successCtaLocation,
  onSuccess,
}: NguCouponSignupFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaReady, setCaptchaReady] = useState(false);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetIdRef = useRef<number | null>(null);
  const captchaResolveRef = useRef<((token: string) => void) | null>(null);
  const captchaRejectRef = useRef<((error: Error) => void) | null>(null);
  const emailInputId = useId();

  const clearPendingCaptcha = useCallback(() => {
    captchaResolveRef.current = null;
    captchaRejectRef.current = null;
  }, []);

  const resetCaptcha = useCallback(() => {
    captchaRejectRef.current?.(new Error('CAPTCHA was reset.'));
    clearPendingCaptcha();
    resetRecaptchaV2Widget(captchaWidgetIdRef.current);
  }, [clearPendingCaptcha]);

  const discardCaptchaWidget = useCallback(() => {
    resetCaptcha();
    captchaWidgetIdRef.current = null;
    setCaptchaReady(false);
  }, [resetCaptcha]);

  useEffect(() => {
    if (!NGU_RECAPTCHA_SITE_KEY) {
      return undefined;
    }

    let cancelled = false;

    setCaptchaReady(false);
    void loadRecaptchaV2()
      .then(() => {
        if (
          cancelled
          || !window.grecaptcha
          || !captchaContainerRef.current
          || captchaWidgetIdRef.current !== null
        ) {
          return;
        }

        captchaWidgetIdRef.current = window.grecaptcha.render(captchaContainerRef.current, {
          sitekey: NGU_RECAPTCHA_SITE_KEY,
          size: 'invisible',
          badge: 'inline',
          callback: (token: string) => {
            const resolveCaptcha = captchaResolveRef.current;
            clearPendingCaptcha();
            resolveCaptcha?.(token);
            setErrorMessage(null);
          },
          'expired-callback': () => {
            const rejectCaptcha = captchaRejectRef.current;
            clearPendingCaptcha();
            rejectCaptcha?.(new Error('CAPTCHA expired. Please try again.'));
          },
          'error-callback': () => {
            const rejectCaptcha = captchaRejectRef.current;
            clearPendingCaptcha();
            rejectCaptcha?.(new Error('CAPTCHA failed. Please try again.'));
            setErrorMessage('CAPTCHA verification failed. Please try again.');
          },
        });
        setCaptchaReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage('CAPTCHA failed to load. Please refresh the page and try again.');
        }
      });

    return () => {
      cancelled = true;
      resetCaptcha();
      captchaWidgetIdRef.current = null;
    };
  }, [clearPendingCaptcha, resetCaptcha]);

  const executeCaptcha = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      if (!window.grecaptcha || captchaWidgetIdRef.current === null || !captchaReady) {
        reject(new Error('CAPTCHA is still loading. Please try again.'));
        return;
      }

      captchaResolveRef.current = resolve;
      captchaRejectRef.current = reject;

      try {
        window.grecaptcha.execute(captchaWidgetIdRef.current);
      } catch {
        clearPendingCaptcha();
        reject(new Error('CAPTCHA failed. Please try again.'));
      }
    });
  }, [captchaReady, clearPendingCaptcha]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackEvent('ngu_coupon_submit_click', {
      location: successCtaLocation,
      label: 'Email me the coupon',
      page_path: window.location.pathname,
    });
    setStatus('submitting');
    setErrorMessage(null);

    if (!NGU_RECAPTCHA_SITE_KEY) {
      trackEvent('ngu_coupon_signup_failed', {
        location: successCtaLocation,
        failure_reason: 'captcha_configuration_missing',
        page_path: window.location.pathname,
      });
      setStatus('error');
      setErrorMessage('Signup is temporarily unavailable. Please try again later.');
      return;
    }

    try {
      const captchaToken = await executeCaptcha();
      const response = await fetch('/api/ngu-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, captchaToken }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Request failed');
      }

      onSuccess?.();
      trackEvent('ngu_coupon_signup_succeeded', {
        location: successCtaLocation,
        page_path: window.location.pathname,
      });
      setStatus('success');
      setEmail('');
      setErrorMessage(null);
      discardCaptchaWidget();
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Request failed';
      trackEvent('ngu_coupon_signup_failed', {
        location: successCtaLocation,
        failure_reason: getNguCouponFailureReason(message),
        error_message: message,
        page_path: window.location.pathname,
      });
      setStatus('error');
      setErrorMessage(message);
      resetCaptcha();
    }
  };

  if (status === 'success') {
    return (
      <div className={successClassName}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
          ✓
        </div>
        <h3 className="mt-4 text-2xl font-semibold">Check your email.</h3>
        <p className="mt-2 text-default-grey/75">
          Your Nice Guy University coupon is on its way.
        </p>
        <TrackedCtaLink
          href="https://www.niceguyuniversity.com"
          location={successCtaLocation}
          label="Visit Nice Guy University"
          eventName="ngu_visit_click"
          className={successCtaClassName}
        >
          <span>Visit Nice Guy University</span>
          <OpenInNewWindowIcon className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />
        </TrackedCtaLink>
      </div>
    );
  }

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      {intro ?? (
        <p className="text-base leading-relaxed text-default-grey/75">
          Courses for breaking approval addiction, covert contracts, and weak boundaries.
          Enter your email and I&apos;ll send the coupon directly to your inbox.
        </p>
      )}

      <div className="space-y-2">
        <label htmlFor={emailInputId} className="block text-sm font-semibold text-default-grey/75">
          Email address
        </label>
        <input
          id={emailInputId}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className={inputClassName}
          maxLength={100}
        />
      </div>

      <div
        ref={captchaContainerRef}
        className="h-0 overflow-hidden"
        data-testid="ngu-recaptcha-widget"
        aria-hidden="true"
      />

      <p className="text-sm leading-relaxed text-default-grey/60">
        By giving me your email, you agree to be added to my email list. You can opt out any time,
        and your email will never be sold to a third party.
      </p>
      <p className="text-xs leading-relaxed text-default-grey/50">
        This site is protected by reCAPTCHA and the Google{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-default-grey/30 underline-offset-2 transition hover:text-default-grey"
        >
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-default-grey/30 underline-offset-2 transition hover:text-default-grey"
        >
          Terms of Service
        </a>{' '}
        apply.
      </p>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        className={`${submitClassName} ${status === 'submitting' ? 'btn-loading' : ''}`}
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending...' : 'Email me the coupon'}
      </button>
    </form>
  );
}
