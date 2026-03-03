'use client';

import { useCallback, useEffect, useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});
  const [serverError, setServerError] = useState('');

  // Exit-intent: mouse leaves viewport top
  useEffect(() => {
    if (sessionStorage.getItem('exitModalShown')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true);
        sessionStorage.setItem('exitModalShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  // Mobile fallback: 45-second timer
  useEffect(() => {
    if (sessionStorage.getItem('exitModalShown')) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('exitModalShown', 'true');
    }, 45000);

    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Auto-close after success
  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => setIsOpen(false), 3000);
    return () => clearTimeout(timer);
  }, [status]);

  const close = useCallback(() => setIsOpen(false), []);

  const validate = () => {
    const next: { firstName?: string; email?: string } = {};
    if (!firstName.trim()) next.firstName = 'First name is required.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(email)) next.email = 'Enter a valid email address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setServerError('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          source: 'exit-modal',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Subscription failed');
      }

      setStatus('success');
    } catch (err) {
      console.error(err);
      setServerError(
        'Something went wrong. Try again or email me directly at michael@michaelzick.com.',
      );
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="relative w-full max-w-[520px] rounded-lg border p-8 sm:p-10"
        style={{
          backgroundColor: '#111',
          borderColor: '#2a2a2a',
          animation: 'exitModalIn 220ms ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute right-4 top-4 text-2xl leading-none transition-opacity hover:opacity-100"
          style={{ color: '#666' }}
          aria-label="Close"
        >
          &times;
        </button>

        {status === 'success' ? (
          <p className="text-center font-headline text-xl font-semibold text-white md:text-2xl">
            Done. Check your inbox&nbsp;&mdash; it&apos;s on its way.
          </p>
        ) : (
          <>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#888' }}
            >
              Free Download
            </p>

            <h2 className="mt-3 font-headline text-2xl font-bold leading-tight text-white md:text-3xl">
              Before you go&nbsp;&mdash; get the workbook that started everything.
            </h2>

            <p className="mt-3 text-base leading-relaxed text-white/60">
              The Belief Reprogramming Workbook is the first step most men take before working with
              me. It&apos;s free, it&apos;s direct, and it&apos;ll show you exactly where your
              patterns are rooted.
            </p>

            <form onSubmit={handleSubmit} className="mt-6">
              <div className="flex flex-col gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors((p) => ({ ...p, firstName: undefined }));
                    }}
                    className="w-full rounded-lg border p-[14px_16px] text-base outline-none transition-colors focus:border-primary-blue"
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderColor: errors.firstName ? '#ff6b6b' : '#333',
                      color: '#e8e4de',
                    }}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm" style={{ color: '#ff6b6b' }}>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    className="w-full rounded-lg border p-[14px_16px] text-base outline-none transition-colors focus:border-primary-blue"
                    style={{
                      backgroundColor: '#1a1a1a',
                      borderColor: errors.email ? '#ff6b6b' : '#333',
                      color: '#e8e4de',
                    }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm" style={{ color: '#ff6b6b' }}>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn mt-5 w-full !py-4 !text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Sending\u2026' : 'Yes, send me the workbook \u2192'}
              </button>

              {serverError && (
                <p className="mt-3 text-sm" style={{ color: '#ff6b6b' }}>
                  {serverError}
                </p>
              )}
            </form>

            <p className="mt-4 text-sm text-white/40">
              Free. No strings. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>

    </div>
  );
}
