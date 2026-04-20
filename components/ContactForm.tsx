'use client';

import { useState } from 'react';
import { CONTACT_RECAPTCHA_ACTION } from '../lib/recaptcha';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  workbookOptIn: boolean;
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
  workbookOptIn: true,
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedWorkbook, setSubmittedWorkbook] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    if (!Object.prototype.hasOwnProperty.call(initialFormData, name)) {
      return;
    }
    const key = name as keyof FormData;
    const value =
      e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);
    setCaptchaError(null);

    let captchaToken: string;
    try {
      const recaptcha = window.grecaptcha;
      if (!recaptcha || typeof recaptcha.ready !== 'function' || typeof recaptcha.execute !== 'function') {
        throw new Error('reCAPTCHA is not ready');
      }

      await new Promise<void>((resolve) => {
        recaptcha.ready(resolve);
      });
      captchaToken = await recaptcha.execute(
        RECAPTCHA_SITE_KEY!,
        { action: CONTACT_RECAPTCHA_ACTION },
      );
    } catch {
      setCaptchaError('CAPTCHA verification failed. Please refresh the page and try again.');
      setStatus('idle');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Request failed');
      }
      setSubmittedEmail(formData.email);
      setSubmittedWorkbook(formData.workbookOptIn);
      setStatus('success');
      setFormData(initialFormData);
      setCaptchaError(null);
    } catch (err) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Request failed');
      setStatus('error');
    }
  };

  if (!RECAPTCHA_SITE_KEY) {
    return (
      <p className="text-red-600">
        Contact form is temporarily unavailable. Please try again later.
      </p>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-8 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold text-default-grey">Message Sent!</h3>
        <p className="text-lg text-default-grey/80">
          I&apos;ll get back to you within 48 hours.
        </p>
        {submittedWorkbook && (
          <p className="text-base text-default-grey/60">
            Your free workbook is on its way to <strong>{submittedEmail}</strong>.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label htmlFor="firstName" className="block text-sm font-semibold text-default-grey/70 ml-1">
            First Name
          </label>
          <input
            id="firstName"
            className="border border-gray-300 rounded-lg p-4 w-full bg-white text-black focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all outline-none"
            name="firstName"
            placeholder="Jane"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="lastName" className="block text-sm font-semibold text-default-grey/70 ml-1">
            Last Name
          </label>
          <input
            id="lastName"
            className="border border-gray-300 rounded-lg p-4 w-full bg-white text-black focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all outline-none"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="space-y-3">
        <label htmlFor="email" className="block text-sm font-semibold text-default-grey/70 ml-1">
          Email <span className="text-red-500 font-bold">*</span>
        </label>
        <input
          id="email"
          className="border border-gray-300 rounded-lg p-4 w-full bg-white text-black focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all outline-none"
          type="email"
          name="email"
          placeholder="jane.doe@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-3">
        <label htmlFor="message" className="block text-sm font-semibold text-default-grey/70 ml-1">
          Message <span className="text-red-500 font-bold">*</span>
        </label>
        <textarea
          id="message"
          className="border border-gray-300 rounded-lg p-4 w-full h-40 bg-white text-black focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all outline-none resize-none"
          name="message"
          placeholder="Tell me more about what's on your mind..."
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <input
          id="workbookOptIn"
          name="workbookOptIn"
          type="checkbox"
          className="h-5 w-5 rounded border-gray-300 text-primary-blue focus:ring-primary-blue/30"
          checked={formData.workbookOptIn}
          onChange={handleChange}
        />
        <label
          htmlFor="workbookOptIn"
          className="text-sm font-medium text-default-grey/80 leading-relaxed"
        >
          Send me a free Belief Reprogramming Workbook and add me to your email newsletter. Unsubscribe anytime.
        </label>
      </div>
      {captchaError && <p className="text-sm text-red-600 font-medium">{captchaError}</p>}
      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          <p className="font-medium">{errorMessage || 'There was an error sending your message.'}</p>
          <p className="text-sm mt-1">Please try again later.</p>
        </div>
      )}
      <div className="!mt-4">
        <button
          type="submit"
          className={`btn !w-full md:!w-auto !text-xl !px-6 md:!px-16 !py-4 md:!py-8 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${status === 'submitting' ? 'btn-loading' : ''}`}
          disabled={status === 'submitting'}
        >
          {status === 'submitting'
            ? 'Sending...'
            : formData.workbookOptIn
              ? 'Get My Free Workbook'
              : 'Send My Message'}
        </button>
      </div>
    </form>
  );
}
