'use client';

import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WorkbookCapture() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});
  const [serverError, setServerError] = useState('');

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
        body: JSON.stringify({ firstName: firstName.trim(), email: email.trim(), source: 'inline' }),
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

  return (
    <section
      className="border-t bg-default-grey px-6 py-[60px] md:py-[80px]"
      style={{ borderColor: '#2a2a2a' }}
    >
      <div className="mx-auto max-w-[680px]">
        {status === 'success' ? (
          <p className="text-center font-headline text-2xl font-semibold text-white md:text-3xl">
            You&apos;re in. Check your inbox&nbsp;&mdash; the workbook is on its way.
          </p>
        ) : (
          <>
            <h2 className="font-headline text-3xl font-bold leading-tight text-white md:text-4xl">
              Still running covert contracts you can&apos;t name?
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-white/60 md:text-xl">
              The Belief Reprogramming Workbook helps you surface the hidden
              &ldquo;if/then&rdquo; deals driving your relationships&nbsp;&mdash; and start
              dismantling them. It&apos;s free.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
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

                <div className="flex-1">
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
                className="btn mt-6 w-full sm:w-auto !px-8 !py-4 !text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Sending\u2026' : 'Send me the workbook \u2192'}
              </button>

              {serverError && (
                <p className="mt-3 text-sm" style={{ color: '#ff6b6b' }}>
                  {serverError}
                </p>
              )}
            </form>

            <p className="mt-4 text-sm text-white/40">
              No spam. Unsubscribe anytime. Your info stays private.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
