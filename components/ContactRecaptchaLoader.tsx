'use client';

import { useEffect } from 'react';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const RECAPTCHA_SCRIPT_ID = 'contact-recaptcha-enterprise-script';

function removeRecaptchaArtifacts() {
  document.getElementById(RECAPTCHA_SCRIPT_ID)?.remove();
  document.querySelectorAll('.grecaptcha-badge, iframe[src*="recaptcha"]').forEach((node) => {
    node.remove();
  });
}

export default function ContactRecaptchaLoader() {
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      return;
    }

    const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID);
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = RECAPTCHA_SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      removeRecaptchaArtifacts();
    };
  }, []);

  return null;
}
