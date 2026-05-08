'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { loadRecaptchaV2, resetRecaptchaV2Widget } from '../lib/client/recaptcha-v2';

const NGU_PROMO_SEEN_KEY = 'nguPromoSeen';
const NGU_PROMO_DELAY_MS = 8000;
const NGU_RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2;

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function NguPromo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaReady, setCaptchaReady] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetIdRef = useRef<number | null>(null);
  const captchaResolveRef = useRef<((token: string) => void) | null>(null);
  const captchaRejectRef = useRef<((error: Error) => void) | null>(null);
  const emailInputId = useId();

  const markSeen = useCallback(() => {
    try {
      window.sessionStorage.setItem(NGU_PROMO_SEEN_KEY, 'true');
    } catch {
      // Ignore unavailable storage; the modal should still function.
    }
  }, []);

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

  const openModal = useCallback(() => {
    setModalOpen(true);
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  const closeModal = useCallback(() => {
    markSeen();
    setModalOpen(false);
    setStatus('idle');
    setErrorMessage(null);
    discardCaptchaWidget();
  }, [discardCaptchaWidget, markSeen]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      if (window.sessionStorage.getItem(NGU_PROMO_SEEN_KEY) === 'true') {
        return undefined;
      }
    } catch {
      // If storage is unavailable, fall back to showing the promo once this mount.
    }

    timeoutId = setTimeout(() => {
      openModal();
    }, NGU_PROMO_DELAY_MS);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [openModal]);

  useEffect(() => {
    if (!modalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal, modalOpen]);

  useEffect(() => {
    if (!modalOpen || status === 'success' || !NGU_RECAPTCHA_SITE_KEY) {
      return;
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
    };
  }, [clearPendingCaptcha, modalOpen, status]);

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
    setStatus('submitting');
    setErrorMessage(null);

    if (!NGU_RECAPTCHA_SITE_KEY) {
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

      markSeen();
      setStatus('success');
      setEmail('');
      setErrorMessage(null);
      discardCaptchaWidget();
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Request failed');
      resetCaptcha();
    }
  };

  return (
    <>
      <aside
        aria-label="Nice Guy University promotion"
        className="fixed left-0 top-0 z-[60] flex h-16 w-full items-center bg-dark-blue px-3 text-white shadow-md min-[930px]:h-11 min-[930px]:px-6"
      >
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center gap-2 text-sm font-semibold min-[930px]:gap-3 min-[930px]:text-base">
          <span className="min-w-0 leading-snug">
            Get 10% off courses at the new Nice Guy University!
          </span>
          <button
            type="button"
            className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-md bg-[rgb(76_95_120)] px-3 py-1.5 text-xs font-bold leading-none text-white shadow-sm transition hover:bg-[rgb(88_110_139)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dark-blue min-[930px]:min-h-7 min-[930px]:px-4 min-[930px]:text-sm"
            onClick={openModal}
          >
            Send me the coupon
          </button>
        </div>
      </aside>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ngu-promo-title"
            className="max-h-[calc(100vh-4rem)] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 text-default-grey shadow-2xl ring-1 ring-black/10 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cta-amber">
                  Nice Guy University
                </p>
                <h2 id="ngu-promo-title" className="text-3xl font-semibold leading-tight text-default-grey">
                  Get 10% off your first course.
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close Nice Guy University signup"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-default-grey transition hover:bg-default-grey/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta-amber/60"
                onClick={closeModal}
              >
                <Cross2Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {status === 'success' ? (
              <div className="mt-6 flex flex-col items-center text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
                  ✓
                </div>
                <h3 className="mt-4 text-2xl font-semibold">Check your email.</h3>
                <p className="mt-2 text-default-grey/75">
                  Your Nice Guy University coupon is on its way.
                </p>
                <a
                  href="https://www.niceguyuniversity.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn !mt-5 !px-6 !py-3"
                >
                  Visit Nice Guy University
                </a>
              </div>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <p className="text-base leading-relaxed text-default-grey/75">
                  Courses for breaking approval addiction, covert contracts, and weak boundaries.
                  Enter your email and I&apos;ll send the coupon directly to your inbox.
                </p>

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
                    className="w-full rounded-lg border border-gray-300 bg-white p-4 text-black outline-none transition focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
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
                  className={`btn !w-full !px-6 !py-4 ${status === 'submitting' ? 'btn-loading' : ''}`}
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Sending...' : 'Email me the coupon'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
