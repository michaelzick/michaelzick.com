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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border border-gray-300 rounded p-2 text-black"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          className="border border-gray-300 rounded p-2 text-black"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <input
        className="border border-gray-300 rounded p-2 w-full text-black"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        className="border border-gray-300 rounded p-2 w-full text-black"
        name="subject"
        placeholder="Subject"
        value={formData.subject}
        onChange={handleChange}
        required
      />
      <textarea
        className="border border-gray-300 rounded p-2 w-full min-h-[120px] text-black"
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
        required
      />
      <div className="space-y-2">
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
        {captchaError && <p className="text-sm text-red-600">{captchaError}</p>}
      </div>
      {status === 'success' && (
        <p className="text-green-600">Your message has been sent.</p>
      )}
      {status === 'error' && (
        <p className="text-red-600">There was an error sending your message.</p>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={status === 'submitting' || !captchaToken}
      >
        {status === 'submitting' ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
