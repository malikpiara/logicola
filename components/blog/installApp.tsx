'use client';

import { useCallback, useEffect, useState } from 'react';
import { captureAnalyticsEvent } from '@/lib/analytics';
import { installTarget, type InstallTarget } from '@/lib/installTarget';
import { FOCUS_GAP, FOCUS_W } from '@/lib/pixel';

/**
 * The install island (Malik, 2026-09-05): the release post's
 * "[Click here to install]" made real. One button, "Install LogiCola",
 * that prompts where the browser allows it and shows the two steps
 * where it does not — see lib/installTarget.ts for the four cases.
 * It hides itself when the page is already the installed app.
 *
 * A click is the measurement, on every platform: it fires
 * `app_install_clicked` with the target, so intent counts even where
 * the browser cannot install from a button. Chromium's own sheet then
 * answers with `app_install_prompt_answered`, and the browser's
 * `appinstalled` event with `app_installed`. Property names snake_case,
 * as everywhere.
 *
 *   <div data-island="install">…feed fallback…</div>
 *
 * The prompt event is stashed by the head script in app/layout.tsx
 * (it fires before hydration); this component reads the stash and
 * listens for the announcement. Colours and clips arrive as props from
 * the server page, the newsletter form's pattern — the marketing theme
 * is server-only.
 */
export interface InstallAppTheme {
  buttonBg: string;
  buttonFg: string;
  ink: string;
  spriteClip: string;
  ringClip: string;
}

type Phase = 'idle' | 'steps' | 'prompting' | 'accepted';

/** The focus band stands FOCUS_GAP off the pill and is FOCUS_W wide. */
const RING_INSET = `${-(FOCUS_GAP + FOCUS_W)}px`;

const STEPS: Record<Exclude<InstallTarget, 'installed' | 'prompt'>, string> = {
  ios: 'In Safari, tap Share, then Add to Home Screen.',
  safari_mac: 'In Safari, choose File, then Add to Dock.',
  menu: 'Open your browser’s menu and choose Install LogiCola, or Add to Home screen. Firefox cannot install web apps.',
};

function readSignals() {
  return {
    ua: navigator.userAgent,
    standalone:
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
    hasPrompt: Boolean(window.__lcInstallPrompt),
    maxTouchPoints: navigator.maxTouchPoints,
  };
}

export function InstallApp({ theme }: { theme: InstallAppTheme }) {
  // `null` until mounted: the server cannot know the browser, and a
  // guessed first paint would be a hydration mismatch.
  const [target, setTarget] = useState<InstallTarget | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const refresh = () => setTarget(installTarget(readSignals()));
    refresh();

    const onInstalled = () => {
      void captureAnalyticsEvent('app_installed', { install_source: 'blog' });
      setTarget('installed');
    };

    window.addEventListener('lc:installprompt', refresh);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('lc:installprompt', refresh);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const onClick = useCallback(async () => {
    if (!target || target === 'installed') return;
    void captureAnalyticsEvent('app_install_clicked', {
      install_source: 'blog',
      install_target: target,
    });

    const evt = window.__lcInstallPrompt;
    if (target !== 'prompt' || !evt) {
      setPhase('steps');
      return;
    }

    setPhase('prompting');
    try {
      await evt.prompt();
      const { outcome } = await evt.userChoice;
      void captureAnalyticsEvent('app_install_prompt_answered', {
        install_source: 'blog',
        install_outcome: outcome,
      });
      // The event is single-use either way.
      window.__lcInstallPrompt = null;
      if (outcome === 'accepted') {
        setPhase('accepted');
      } else {
        setPhase('idle');
        setTarget(installTarget(readSignals()));
      }
    } catch {
      // Chromium refuses a second prompt() and a prompt without a
      // gesture; fall back to the menu steps rather than a dead button.
      window.__lcInstallPrompt = null;
      setTarget('menu');
      setPhase('steps');
    }
  }, [target]);

  if (target === 'installed') {
    return (
      <div className='not-prose ia-wrap' style={{ color: theme.ink }}>
        <p className='ia-steps' role='status'>
          You&apos;re using the installed app.
        </p>
      </div>
    );
  }

  const steps = target && target !== 'prompt' ? STEPS[target] : null;

  return (
    <div className='not-prose ia-wrap' style={{ color: theme.ink }}>
      <span
        className='ia-ring'
        style={
          {
            '--ia-ring-clip': theme.ringClip,
            '--ia-ring-inset': RING_INSET,
          } as React.CSSProperties
        }
      >
        <button
          type='button'
          className='motion-button ia-btn'
          style={{
            background: theme.buttonBg,
            color: theme.buttonFg,
            clipPath: theme.spriteClip,
          }}
          onClick={onClick}
          disabled={target === null || phase === 'prompting'}
          aria-expanded={steps ? phase === 'steps' : undefined}
        >
          Install LogiCola
        </button>
      </span>
      <p className='ia-steps' role='status' aria-live='polite'>
        {phase === 'accepted' &&
          'Installing. It will appear on your home screen or in your dock.'}
        {phase === 'steps' && steps}
      </p>
    </div>
  );
}
