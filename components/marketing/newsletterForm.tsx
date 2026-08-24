'use client';

import { FormEvent, useState } from 'react';
import { captureAnalyticsEvent } from '@/lib/analytics';

type Status = 'idle' | 'pending' | 'success' | 'error';

/**
 * The subscribe control in the decided "answer pill" treatment (lab,
 * 2026-08-14): one wide sprite-clipped pill with the button embedded on
 * the right, ringed the way the app rings clipped shapes — an evenodd
 * band on the wrapper's ::before (never a border; docs/pixel-ui.md).
 *
 * Pure client component: theme colours and clip paths arrive as props
 * from a server parent (lib/marketingTheme.ts is server-only).
 * `source` feeds PostHog so placements can be compared.
 */
export interface NewsletterFormTheme {
  ink: string;
  buttonBg: string;
  buttonFg: string;
  spriteClip: string;
  ringClip: string;
}

export function NewsletterForm({
  source,
  theme,
  className = '',
}: {
  source: string;
  theme: NewsletterFormTheme;
  className?: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'pending') return;
    setStatus('pending');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      if (response.ok) {
        setStatus('success');
        void captureAnalyticsEvent('newsletter_subscribed', {
          subscribe_source: source,
        });
      } else {
        setStatus('error');
        void captureAnalyticsEvent('newsletter_subscribe_failed', {
          subscribe_source: source,
          status_code: response.status,
        });
      }
    } catch {
      setStatus('error');
      void captureAnalyticsEvent('newsletter_subscribe_failed', {
        subscribe_source: source,
        status_code: 0,
      });
    }
  };

  // BOTH states render the same <form> → ring → pill skeleton
  // (2026-08-24, motion pass): the old success branch returned a bare
  // paragraph, so the sprite pill vanished and unrelated text faded up
  // from nowhere. With the wrappers identical, React keeps the box's
  // DOM across the swap — the pill reads as one object whose contents
  // change, only the inside crossfades.
  return (
    <form onSubmit={handleSubmit} className={`mt-5 ${className}`}>
      <div
        className='mk-ring w-full max-w-[520px]'
        style={
          {
            color: theme.ink,
            '--mk-ring-clip': theme.ringClip,
          } as React.CSSProperties
        }
      >
        <div
          className='flex items-center gap-3 bg-white p-1.5 pl-[18px]'
          style={{ clipPath: theme.spriteClip }}
        >
          {status === 'success' ? (
            <p
              className='motion-enter my-0 py-[11px] pr-4 text-sm font-semibold text-gray-900'
              role='status'
            >
              You&apos;re on the list — we&apos;ll email you when something
              worth knowing ships.
            </p>
          ) : (
            <>
              <label htmlFor={`newsletter-email-${source}`} className='sr-only'>
                Email address
              </label>
              <input
                id={`newsletter-email-${source}`}
                type='email'
                required
                autoComplete='email'
                placeholder='you@university.edu'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className='w-full min-w-0 flex-1 border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500'
              />
              <button
                type='submit'
                disabled={status === 'pending'}
                className='motion-button grid shrink-0 cursor-pointer place-items-center border-none px-6 py-[11px] text-sm font-bold disabled:opacity-60'
                style={{
                  background: theme.buttonBg,
                  color: theme.buttonFg,
                  clipPath: theme.spriteClip,
                }}
              >
                {/* The longer label reserves the width invisibly, so
                    Subscribe → Subscribing… never resizes the input
                    mid-submit. */}
                <span aria-hidden='true' className='invisible [grid-area:1/1]'>
                  Subscribing…
                </span>
                <span className='[grid-area:1/1]'>
                  {status === 'pending' ? 'Subscribing…' : 'Subscribe'}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
      <p
        className='mt-3 text-sm'
        aria-live='polite'
        style={{ color: 'var(--mk-type)', opacity: 0.65 }}
      >
        {status === 'error'
          ? 'That didn’t work — please try again in a moment.'
          : status === 'success'
            ? ''
            : 'No spam, and we never share your address.'}
      </p>
    </form>
  );
}
