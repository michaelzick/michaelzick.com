'use client';

import type { ReactNode } from 'react';
import { openCookiePreferences } from '../lib/cookie-consent';

export default function OpenCookiePreferencesButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={openCookiePreferences}>
      {children}
    </button>
  );
}
