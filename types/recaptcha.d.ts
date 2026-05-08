interface ReCaptchaV3 {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
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
}

declare global {
  interface Window {
    grecaptcha: ReCaptchaV3;
  }
}

export {};
