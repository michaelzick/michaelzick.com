'use client';

import { useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

const hCaptchaSiteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setCaptchaError('Please complete the CAPTCHA challenge.');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      setCaptchaError(null);
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    } catch (err) {
      console.error(err);
      setStatus('error');
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    }
  };

  if (!hCaptchaSiteKey) {
    return (
      <p className="text-red-600">
        Contact form is temporarily unavailable. Please try again later.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-default-grey/70 ml-1">
            First Name
          </label>
          <input
            className="border border-gray-300 rounded-lg p-4 w-full text-black focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all outline-none"
            name="firstName"
            placeholder="Jane"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-default-grey/70 ml-1">
            Last Name
          </label>
          <input
            className="border border-gray-300 rounded-lg p-4 w-full text-black focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all outline-none"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-default-grey/70 ml-1">
          Email <span className="text-red-500 font-bold">*</span>
        </label>
        <input
          className="border border-gray-300 rounded-lg p-4 w-full text-black focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all outline-none"
          type="email"
          name="email"
          placeholder="jane.doe@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-default-grey/70 ml-1">
          Subject
        </label>
        <input
          className="border border-gray-300 rounded-lg p-4 w-full text-black focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all outline-none"
          name="subject"
          placeholder="How can I help you?"
          value={formData.subject}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-default-grey/70 ml-1">
          Message <span className="text-red-500 font-bold">*</span>
        </label>
        <textarea
          className="border border-gray-300 rounded-lg p-4 w-full min-h-[200px] text-black focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all outline-none resize-none"
          name="message"
          placeholder="Tell me more about what's on your mind..."
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-4">
        <HCaptcha
          sitekey={hCaptchaSiteKey}
          onVerify={(token) => {
            setCaptchaToken(token);
            setCaptchaError(null);
          }}
          onExpire={() => {
            setCaptchaToken(null);
            setCaptchaError('The CAPTCHA verification expired. Please try again.');
          }}
          onError={(err) => {
            console.error('hCaptcha error', err);
            setCaptchaToken(null);
            setCaptchaError('Captcha failed to load. Please refresh the page and try again.');
          }}
          ref={captchaRef}
        />
        {captchaError && <p className="text-sm text-red-600 font-medium">{captchaError}</p>}
      </div>
      {status === 'success' && (
        <p className="text-green-600 font-medium">Your message has been sent. I will get back to you within 48 hours.</p>
      )}
      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 font-medium">
          There was an error sending your message. Please try again.
        </div>
      )}
      <div className="pt-4">
        <button
          type="submit"
          className="btn !w-full md:!w-auto !text-xl !px-16 !py-8 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={status === 'submitting' || !captchaToken}
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
