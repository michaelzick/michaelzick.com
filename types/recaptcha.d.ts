interface ReCaptchaEnterprise {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
}

declare global {
  interface Window {
    grecaptcha: {
      enterprise: ReCaptchaEnterprise;
    };
  }
}

export {};
