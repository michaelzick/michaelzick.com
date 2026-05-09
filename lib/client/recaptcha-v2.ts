'use client';

const RECAPTCHA_V2_SCRIPT_ID = 'recaptcha-v2-script';
const RECAPTCHA_V2_ONLOAD_CALLBACK = '__recaptchaV2Onload';

type RecaptchaV2Window = Window & typeof globalThis & {
  grecaptcha?: {
    execute(widgetId: number): void;
    render(
      container: HTMLElement,
      options: {
        sitekey: string;
        size?: 'normal' | 'compact' | 'invisible';
        badge?: 'bottomright' | 'bottomleft' | 'inline';
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
      },
    ): number;
    reset(widgetId?: number): void;
  };
  __recaptchaV2Onload?: () => void;
  __recaptchaV2Ready?: boolean;
};

let recaptchaV2ScriptPromise: Promise<void> | null = null;

function getRecaptchaWindow() {
  return window as RecaptchaV2Window;
}

export function isRecaptchaV2Ready() {
  return Boolean(
    typeof window !== 'undefined'
    && getRecaptchaWindow().__recaptchaV2Ready
    && getRecaptchaWindow().grecaptcha
    && typeof getRecaptchaWindow().grecaptcha?.render === 'function'
    && typeof getRecaptchaWindow().grecaptcha?.execute === 'function'
    && typeof getRecaptchaWindow().grecaptcha?.reset === 'function',
  );
}

export function loadRecaptchaV2() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (isRecaptchaV2Ready()) {
    return Promise.resolve();
  }

  if (recaptchaV2ScriptPromise) {
    return recaptchaV2ScriptPromise;
  }

  recaptchaV2ScriptPromise = new Promise<void>((resolve, reject) => {
    const recaptchaWindow = getRecaptchaWindow();
    const script = document.createElement('script');

    recaptchaWindow.__recaptchaV2Onload = () => {
      recaptchaWindow.__recaptchaV2Ready = true;
      resolve();
    };

    script.id = RECAPTCHA_V2_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?onload=${RECAPTCHA_V2_ONLOAD_CALLBACK}&render=explicit`;
    script.async = true;
    script.defer = true;
    script.addEventListener('error', () => {
      recaptchaV2ScriptPromise = null;
      delete recaptchaWindow.__recaptchaV2Onload;
      reject(new Error('Unable to load CAPTCHA'));
    }, { once: true });
    document.head.appendChild(script);
  });

  return recaptchaV2ScriptPromise;
}

export function resetRecaptchaV2Widget(widgetId: number | null) {
  const recaptcha = getRecaptchaWindow().grecaptcha;
  if (!recaptcha || widgetId === null) {
    return;
  }

  try {
    recaptcha.reset(widgetId);
  } catch {
    // Ignore reset errors; callers can render a fresh widget on the next mount/open.
  }
}
