'use client';

// Cloudflare Turnstile "are you human" widget for the public forms.
//
// Usage in a form component:
//   const human = useTurnstile();
//   ...
//   if (!human.ready) { show human.missingMessage; return; }
//   await someAction({ ...data, turnstileToken: human.token });
//   human.reset();               // tokens are single-use: get a new one
//   ...
//   {human.widget}               // render just above the submit button
//
// The server action verifies the token (lib/turnstile.ts). Without
// NEXT_PUBLIC_TURNSTILE_SITE_KEY the widget renders nothing and `ready` is true,
// so forms keep working until the keys are configured.

import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null; // allow a retry on the next mount
        reject(new Error('Could not load the Cloudflare Turnstile script'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

type TurnstileProps = {
  onToken: (token: string) => void;
  theme?: 'light' | 'dark' | 'auto';
  /** Change this number to throw away the current token and show a fresh check. */
  resetKey?: number;
  className?: string;
};

export function Turnstile({ onToken, theme = 'light', resetKey = 0, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) return;
    let widgetId: string | undefined;
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        setLoadError(false);
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme,
          size: 'flexible',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current(''),
        });
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
      onTokenRef.current('');
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [theme, resetKey]);

  if (!SITE_KEY) return null;

  return (
    <div className={className}>
      <div ref={containerRef} className="min-h-[65px]" />
      {loadError && (
        <p className="text-sm text-red-600 mt-2">
          The security check could not load. Please disable any content blocker for this site and refresh the page.
        </p>
      )}
    </div>
  );
}

export function useTurnstile(options: { theme?: 'light' | 'dark' | 'auto'; className?: string } = {}): {
  token: string;
  ready: boolean;
  reset: () => void;
  widget: ReactElement;
  missingMessage: string;
} {
  const [token, setToken] = useState('');
  const [resetKey, setResetKey] = useState(0);

  const reset = useCallback(() => {
    setToken('');
    setResetKey((k) => k + 1);
  }, []);

  return {
    token,
    ready: !SITE_KEY || token.length > 0,
    reset,
    widget: <Turnstile onToken={setToken} resetKey={resetKey} theme={options.theme} className={options.className} />,
    missingMessage: 'Please complete the security check above the submit button.',
  };
}
